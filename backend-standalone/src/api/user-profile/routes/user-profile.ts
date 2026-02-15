export default {
  routes: [
    {
      method: 'POST',
      path: '/user-profile',
      handler: 'user-profile.createOrUpdate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/user-profile',
      handler: 'user-profile.createOrUpdate',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/user-profile/me',
      handler: 'user-profile.getMyProfile',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
