export default {
  routes: [
    {
      method: 'GET',
      path: '/users/me',
      handler: 'user.getMe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/users/me',
      handler: 'user.updateMe',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
