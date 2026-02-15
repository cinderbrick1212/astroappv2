export default ({ strapi }) => ({
  async create(ctx) {
    try {
      const { service_type, user_notes, payment_id } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      if (!service_type) {
        return ctx.badRequest('service_type is required');
      }

      if (!['question', 'call', 'report'].includes(service_type)) {
        return ctx.badRequest('Invalid service_type');
      }

      // Create service request
      const serviceRequest = await strapi.db.query('api::service-request.service-request').create({
        data: {
          user: user.id,
          service_type,
          user_notes: user_notes || '',
          status: 'pending',
          payment: payment_id || null,
        },
      });

      // TODO: Send notification to astrologers via email and WhatsApp

      ctx.body = {
        data: serviceRequest,
        message: 'Service request created successfully',
      };
    } catch (error) {
      console.error('Error creating service request:', error);
      ctx.throw(500, 'Failed to create service request');
    }
  },

  async findUserRequests(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      const requests = await strapi.db.query('api::service-request.service-request').findMany({
        where: { user: user.id },
        populate: ['payment'],
        orderBy: { createdAt: 'desc' },
      });

      ctx.body = {
        data: requests,
      };
    } catch (error) {
      console.error('Error fetching service requests:', error);
      ctx.throw(500, 'Failed to fetch service requests');
    }
  },

  async updateStatus(ctx) {
    try {
      const { id } = ctx.params;
      const { status, response_text } = ctx.request.body;

      if (!status) {
        return ctx.badRequest('status is required');
      }

      if (!['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
        return ctx.badRequest('Invalid status');
      }

      const serviceRequest = await strapi.db.query('api::service-request.service-request').findOne({
        where: { id },
      });

      if (!serviceRequest) {
        return ctx.notFound('Service request not found');
      }

      // Update service request
      const updated = await strapi.db.query('api::service-request.service-request').update({
        where: { id },
        data: {
          status,
          response_text: response_text || serviceRequest.response_text,
        },
      });

      // TODO: Send notification to user if status changed to completed

      ctx.body = {
        data: updated,
        message: 'Service request updated successfully',
      };
    } catch (error) {
      console.error('Error updating service request:', error);
      ctx.throw(500, 'Failed to update service request');
    }
  },
});
