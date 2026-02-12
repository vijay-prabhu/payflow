// Mock for @middy/http-json-body-parser
// Simulates what the real middleware does: parse event.body from string to object
const httpJsonBodyParser = () => ({
  before: (request: { event: { body: unknown } }) => {
    if (typeof request.event.body === 'string') {
      request.event.body = JSON.parse(request.event.body);
    }
  },
});

export default httpJsonBodyParser;
