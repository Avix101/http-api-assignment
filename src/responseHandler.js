const fs = require('fs');

const clientPage = fs.readFileSync(`${__dirname}/../client/client.html`);
const stylesheet = fs.readFileSync(`${__dirname}/../client/style.css`);

const respond = (request, response, status, dataType, data) => {
  response.writeHead(status, { 'Content-Type': dataType });
  response.write(data);
  response.end();
};

const getClientPage = (request, response) => {
  respond(request, response, 200, 'text/html', clientPage);
};

const getStylesheet = (request, response) => {
  respond(request, response, 200, 'text/css', stylesheet);
};

// General function for generating a JSON response (id can be included)
const generateJSONMessage = (message, id) => {
  const obj = {};

  if (id) {
    obj.id = id;
  }

  obj.message = message;

  return JSON.stringify(obj);
};

// General function for generating an XML response (id can be included)
const generateXMLMessage = (message, id) => {
  let response = '<response>';

  if (id) {
    response = `${response} <id>${id}</id>`;
  }

  response = `${response} <message>${message}</message>`;
  response = `${response} </response>`;

  return response;
};

// General function for generating a response (JSON / XML based on accept header)
const generateMessage = (acceptedTypes, message, id) => {
  if (acceptedTypes[0] === 'text/xml') {
    if (id) {
      return generateXMLMessage(message, id);
    }
    return generateXMLMessage(message);
  }
  if (id) {
    return generateJSONMessage(message, id);
  }
  return generateJSONMessage(message);
};

// Determine the requested content type
const determineContentType = (acceptedTypes) => {
  if (acceptedTypes[0] === 'text/xml') {
    return 'text/xml';
  }
  return 'application/json';
};

// Specific messages (both success and error)
const getSuccess = (request, response, acceptedTypes) => {
  const contentType = determineContentType(acceptedTypes);
  const message = generateMessage(acceptedTypes, 'This is a successful response');
  respond(request, response, 200, contentType, message);
};

const getBadRequest = (request, response, acceptedTypes, params) => {
  const contentType = determineContentType(acceptedTypes);

  if (params.valid === 'true') {
    const message = generateMessage(acceptedTypes, 'Valid query paramter set to true');
    respond(request, response, 200, contentType, message);
  } else {
    const message = generateMessage(acceptedTypes, 'Valid query paramter not set to true', 'badRequest');
    respond(request, response, 400, contentType, message);
  }
};

const getUnauthorized = (request, response, acceptedTypes, params) => {
  const contentType = determineContentType(acceptedTypes);

  if (params.loggedIn === 'yes') {
    const message = generateMessage(acceptedTypes, 'loggedIn query parameter set to yes');
    respond(request, response, 200, contentType, message);
  } else {
    const message = generateMessage(acceptedTypes, 'loggedIn query parameter not set to yes', 'unauthorized');
    respond(request, response, 401, contentType, message);
  }
};

const getForbidden = (request, response, acceptedTypes) => {
  const contentType = determineContentType(acceptedTypes);
  const message = generateMessage(acceptedTypes, 'This page is forbidden.', 'forbidden');
  respond(request, response, 403, contentType, message);
};

const getInternal = (request, response, acceptedTypes) => {
  const contentType = determineContentType(acceptedTypes);
  const message = generateMessage(acceptedTypes, 'An internal server error occurred', 'internal');
  respond(request, response, 500, contentType, message);
};

const getNotImplemented = (request, response, acceptedTypes) => {
  const contentType = determineContentType(acceptedTypes);
  const message = generateMessage(acceptedTypes, 'The requested page has not yet been implemented', 'notImplemented');
  respond(request, response, 501, contentType, message);
};

const getNonExistant = (request, response, acceptedTypes) => {
  const contentType = determineContentType(acceptedTypes);
  const message = generateMessage(acceptedTypes, 'The requested page does not exist', 'nonExistant');
  respond(request, response, 404, contentType, message);
};

// Export functions
module.exports = {
  getClientPage,
  getStylesheet,
  getSuccess,
  getBadRequest,
  getUnauthorized,
  getForbidden,
  getInternal,
  getNotImplemented,
  getNonExistant,
};
