export default {
  routes: [
    {
      method: 'POST',
      path: '/payments/create-order',
      handler: 'payment.createOrder',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payments/verify',
      handler: 'payment.verifyPayment',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/payments/webhook',
      handler: 'payment.webhookHandler',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Webhook doesn't use Firebase auth
      },
    },
  ],
};
