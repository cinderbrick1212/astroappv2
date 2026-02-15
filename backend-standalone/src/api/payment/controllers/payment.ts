import Razorpay from 'razorpay';
import crypto from 'crypto';

export default ({ strapi }) => ({
  async createOrder(ctx) {
    try {
      const { amount, plan_type } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      if (!amount || !plan_type) {
        return ctx.badRequest('Amount and plan_type are required');
      }

      // Initialize Razorpay
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || '',
        key_secret: process.env.RAZORPAY_KEY_SECRET || '',
      });

      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // amount in smallest currency unit (paise)
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      };

      const razorpayOrder = await razorpay.orders.create(options);

      // Create payment record in Strapi
      const payment = await strapi.db.query('api::payment.payment').create({
        data: {
          user: user.id,
          razorpay_order_id: razorpayOrder.id,
          amount: amount,
          currency: razorpayOrder.currency,
          status: 'created',
          plan_type: plan_type,
        },
      });

      ctx.body = {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        paymentId: payment.id,
      };
    } catch (error) {
      console.error('Error creating order:', error);
      ctx.throw(500, 'Failed to create payment order');
    }
  },

  async verifyPayment(ctx) {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      } = ctx.request.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return ctx.badRequest('Missing payment verification data');
      }

      // Verify signature
      const keySecret = process.env.RAZORPAY_KEY_SECRET || '';
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest('hex');

      if (generatedSignature !== razorpay_signature) {
        return ctx.badRequest('Invalid payment signature');
      }

      // Find payment record
      const payment = await strapi.db.query('api::payment.payment').findOne({
        where: { razorpay_order_id },
        populate: ['user'],
      });

      if (!payment) {
        return ctx.notFound('Payment not found');
      }

      // Update payment status
      await strapi.db.query('api::payment.payment').update({
        where: { id: payment.id },
        data: {
          razorpay_payment_id,
          razorpay_signature,
          status: 'captured',
        },
      });

      // Update user premium status if applicable
      if (['monthly', 'yearly'].includes(payment.plan_type)) {
        const expiryDate = new Date();
        if (payment.plan_type === 'monthly') {
          expiryDate.setMonth(expiryDate.getMonth() + 1);
        } else {
          expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        }

        await strapi.db.query('api::user.user').update({
          where: { id: payment.user.id },
          data: {
            premium_status: true,
            premium_expires_at: expiryDate,
          },
        });
      }

      // TODO: Send notification emails/WhatsApp to user and astrologers

      ctx.body = {
        success: true,
        message: 'Payment verified successfully',
      };
    } catch (error) {
      console.error('Error verifying payment:', error);
      ctx.throw(500, 'Failed to verify payment');
    }
  },

  async webhookHandler(ctx) {
    try {
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';
      const signature = ctx.request.headers['x-razorpay-signature'];
      const body = JSON.stringify(ctx.request.body);

      // Verify webhook signature
      const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex');

      if (signature !== expectedSignature) {
        return ctx.unauthorized('Invalid webhook signature');
      }

      const event = ctx.request.body;

      if (event.event === 'payment.captured') {
        const paymentEntity = event.payload.payment.entity;
        
        // Find and update payment
        const payment = await strapi.db.query('api::payment.payment').findOne({
          where: { razorpay_order_id: paymentEntity.order_id },
          populate: ['user'],
        });

        if (payment) {
          await strapi.db.query('api::payment.payment').update({
            where: { id: payment.id },
            data: {
              razorpay_payment_id: paymentEntity.id,
              status: 'captured',
            },
          });

          // Update premium status if needed
          if (['monthly', 'yearly'].includes(payment.plan_type)) {
            const expiryDate = new Date();
            if (payment.plan_type === 'monthly') {
              expiryDate.setMonth(expiryDate.getMonth() + 1);
            } else {
              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            }

            await strapi.db.query('api::user.user').update({
              where: { id: payment.user.id },
              data: {
                premium_status: true,
                premium_expires_at: expiryDate,
              },
            });
          }
        }
      }

      ctx.body = { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      ctx.throw(500, 'Webhook processing failed');
    }
  },
});
