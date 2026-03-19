export default ({ strapi }) => ({
  async createOrUpdate(ctx) {
    try {
      const user = ctx.state.user;
      const {
        birth_date,
        birth_time,
        birth_place,
        timezone,
        gender,
        latitude,
        longitude,
      } = ctx.request.body;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      // Check if profile exists
      const existingProfile = await strapi.db.query('api::user-profile.user-profile').findOne({
        where: { user: user.id },
      });

      let profile;

      if (existingProfile) {
        // Update existing profile
        profile = await strapi.db.query('api::user-profile.user-profile').update({
          where: { id: existingProfile.id },
          data: {
            birth_date: birth_date || existingProfile.birth_date,
            birth_time: birth_time || existingProfile.birth_time,
            birth_place: birth_place || existingProfile.birth_place,
            timezone: timezone || existingProfile.timezone,
            gender: gender || existingProfile.gender,
            latitude: latitude !== undefined ? latitude : existingProfile.latitude,
            longitude: longitude !== undefined ? longitude : existingProfile.longitude,
          },
        });
      } else {
        // Create new profile
        profile = await strapi.db.query('api::user-profile.user-profile').create({
          data: {
            user: user.id,
            birth_date,
            birth_time,
            birth_place,
            timezone,
            gender,
            latitude,
            longitude,
          },
        });
      }

      ctx.body = {
        data: profile,
        message: existingProfile ? 'Profile updated successfully' : 'Profile created successfully',
      };
    } catch (error) {
      strapi.log.error('Error creating/updating profile:', error);
      ctx.throw(500, 'Failed to save profile');
    }
  },

  async getMyProfile(ctx) {
    try {
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized('User not authenticated');
      }

      const profile = await strapi.db.query('api::user-profile.user-profile').findOne({
        where: { user: user.id },
      });

      if (!profile) {
        return ctx.notFound('Profile not found');
      }

      ctx.body = {
        data: profile,
      };
    } catch (error) {
      strapi.log.error('Error fetching profile:', error);
      ctx.throw(500, 'Failed to fetch profile');
    }
  },
});
