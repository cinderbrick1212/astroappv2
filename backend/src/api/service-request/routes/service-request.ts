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
      method: 'POST',
      path: '/orders',
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
      method: 'GET',
      path: '/orders/my-orders',
      handler: 'service-request.findUserRequests',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/service-requests/:id',
      handler: 'service-request.findOne',
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
    {
      method: 'PUT',
      path: '/orders/:id/status',
      handler: 'service-request.updateStatus',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
