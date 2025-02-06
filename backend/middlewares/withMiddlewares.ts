// Needs type safety
export const withMiddlewares = (handler, middlewares: any[]) => (event, context, callback) => {
  const chainMiddlewares = (middlewares: any[]) => {
    if (middlewares.length) {
      return (e, c) => {
        try {
          return middlewares[0](e, c, chainMiddlewares(middlewares.slice(1)));
        } catch (error) {
          return Promise.reject(error);
        }
      };
    }

    return handler;
  };

  chainMiddlewares(middlewares)(event, context)
    .then((result) => callback(null, result))
    .catch((err) => {
      callback(err, null);
    });
};
