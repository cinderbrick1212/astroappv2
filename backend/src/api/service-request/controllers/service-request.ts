import crypto from 'crypto';

export default ({ strapi }) => ({
  async create(ctx) {
    try {
      const { service_type, user_notes } = ctx.request.body;
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

      const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${crypto
        .randomBytes(3)
        .toString('hex')
        .toUpperCase()}`;

      // Create service request
      const serviceRequest = await strapi.db.query('api::service-request.service-request').create({
        data: {
          user: user.id,
          service_type,
          order_number: orderNumber,
          user_notes: user_notes || '',
          status: 'pending',
        },
      });

      // Notify astrologers about the new request
      try {
        await (strapi.service('global::notifications') as any).notifyAstrologersNewRequest(
          user,
          serviceRequest
        );
      } catch (notifyError) {
        console.error('Notification error (non-fatal):', notifyError);
      }

      ctx.body = {
        data: serviceRequest,
        message: 'Service request created successfully',
      };
    } catch (error) {
      console.error('Error creating service request:', error);
      ctx.throw(500, 'Failed to create service request');
    }
  },

  async findOne(ctx) {
    try {
      const { id } = ctx.params;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      const serviceRequest = await strapi.db.query('api::service-request.service-request').findOne({
        where: { id, user: user.id },
      });

      if (!serviceRequest) {
        return ctx.notFound('Service request not found');
      }

      ctx.body = { data: serviceRequest };
    } catch (error) {
      console.error('Error fetching service request:', error);
      ctx.throw(500, 'Failed to fetch service request');
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
        populate: ['user'],
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

      // Notify user when their request is completed
      if (status === 'completed' && serviceRequest.user) {
        try {
          await (strapi.service('global::notifications') as any).notifyUserRequestCompleted(
            serviceRequest.user,
            serviceRequest
          );
        } catch (notifyError) {
          console.error('Notification error (non-fatal):', notifyError);
        }
      }

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
