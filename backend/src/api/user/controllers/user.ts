export default ({ strapi }) => ({
  async getMe(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
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
});
