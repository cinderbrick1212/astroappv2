export default {
  routes: [
    {
      method: 'GET',
      path: '/feed-items',
      handler: 'feed-item.find',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/feed-items/:id',
      handler: 'feed-item.findOne',
      config: {
        auth: false,
        policies: [],
        middlewares: [],
      },
    },
  ],
};
