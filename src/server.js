const http = require('http');
const url = require('url');
const query = require('querystring');
const responseHandler = require('./responseHandler.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getClientPage,
  '/style.css': responseHandler.getStylesheet,
  '/success': responseHandler.getSuccess,
  '/badRequest': responseHandler.getBadRequest,
  '/unauthorized': responseHandler.getUnauthorized,
  '/forbidden': responseHandler.getForbidden,
  '/internal': responseHandler.getInternal,
  '/notImplemented': responseHandler.getNotImplemented,
  default: responseHandler.getNonExistant,
};

const onRequest = (request, response) => {
  // Parse URL and query string
  const parsedUrl = url.parse(request.url);
  const acceptedTypes = request.headers.accept.split(',');
  const params = query.parse(parsedUrl.query);

  // Execute proper response function
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes, params);
  } else {
    urlStruct.default(request, response, acceptedTypes);
  }
};

http.createServer(onRequest).listen(port);
