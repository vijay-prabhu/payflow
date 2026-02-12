// Mock for @middy/core — Middy v5 is ESM-only and doesn't work with Jest CJS
// This mock simulates the middleware chain: runs before hooks, then the handler

type MiddlewareObj = {
  before?: (request: { event: unknown }) => void;
  after?: (request: unknown) => void;
  onError?: (request: unknown) => void;
};

const middy = (handler: Function) => {
  const middlewares: MiddlewareObj[] = [];

  const wrappedHandler = async (event: unknown, context: unknown) => {
    const request = { event };
    for (const mw of middlewares) {
      if (mw.before) mw.before(request);
    }
    return handler(request.event, context);
  };

  wrappedHandler.use = (middleware: MiddlewareObj | Function) => {
    if (typeof middleware === 'function') {
      middlewares.push(middleware());
    } else {
      middlewares.push(middleware);
    }
    return wrappedHandler;
  };

  wrappedHandler.before = () => wrappedHandler;
  wrappedHandler.after = () => wrappedHandler;
  wrappedHandler.onError = () => wrappedHandler;

  return wrappedHandler;
};

export default middy;
