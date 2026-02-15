export default {
  routes: [
    {
      method: 'POST',
      path: '/service-requests',
      handler: 'service-request.create',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/service-requests/my-requests',
      handler: 'service-request.findUserRequests',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'PUT',
      path: '/service-requests/:id/status',
      handler: 'service-request.updateStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
