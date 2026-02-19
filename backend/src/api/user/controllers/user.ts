export default ({ strapi }) => ({
  async getMe(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      // Update last_login_at at most once per hour to avoid unnecessary writes
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
      if (!user.last_login_at || user.last_login_at < oneHourAgo) {
        await strapi.db.query('api::user.user').update({
          where: { id: user.id },
          data: { last_login_at: new Date().toISOString() },
        });
      }

      // Fetch user with profile
      const fullUser = await strapi.db.query('api::user.user').findOne({
        where: { id: user.id },
        populate: ['user_profile'],
      });

      ctx.body = {
        data: fullUser,
      };
    } catch (error) {
      console.error('Error fetching user:', error);
      ctx.throw(500, 'Failed to fetch user data');
    }
  },

  async updateMe(ctx) {
    try {
      const user = ctx.state.user;
      const { name, phone } = ctx.request.body;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      const updated = await strapi.db.query('api::user.user').update({
        where: { id: user.id },
        data: {
          name: name || user.name,
          phone: phone || user.phone,
        },
      });

      ctx.body = {
        data: updated,
        message: 'User updated successfully',
      };
    } catch (error) {
      console.error('Error updating user:', error);
      ctx.throw(500, 'Failed to update user');
    }
  },

  async updatePushToken(ctx) {
    try {
      const user = ctx.state.user;
      const { push_token } = ctx.request.body;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      if (!push_token || typeof push_token !== 'string') {
        return ctx.badRequest('push_token is required');
      }

      await strapi.db.query('api::user.user').update({
        where: { id: user.id },
        data: { push_token },
      });

      ctx.body = { message: 'Push token updated successfully' };
    } catch (error) {
      console.error('Error updating push token:', error);
      ctx.throw(500, 'Failed to update push token');
    }
  },
});
