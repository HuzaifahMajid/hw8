const http = require('http');
const url = require('url');

// Import your functions from your_code_file.js
const { findNextAvailableDates, reserveDate, lookupUpcomingReservations, cancelReservation } = require('./helper_funcs.js');

// Parse request URL
function parseRequestURL(request, response) {
  const urlParts = request.url.split('/').filter(part => part !== '');
  return { request, response, urlParts };
}

// Define dispatch table for API handlers
const dispatchTable = {
  'findNextAvailableDates': findNextAvailableDates,
  'reserveDate': reserveDate,
  'lookupUpcomingReservations': lookupUpcomingReservations,
  'cancelReservation': cancelReservation
};

// Find the corresponding resource handler
function findResourceHandler({ request, response, urlParts }) {
  const apiName = urlParts[0];
  const handler = dispatchTable[apiName] || notFoundHandler;
  return { handler, request, response, urlParts };
}

// Run the API handler
function runHandler({ handler, request, response, urlParts }) {
  return handler({ request, response, urlParts });
}

// Finalize the HTTP response
function finalizeResponse({ response, resMsg }) {
  if (!resMsg.headers || resMsg.headers === null) {
    resMsg.headers = {};
  }
  if (!resMsg.headers["Content-Type"]) {
    resMsg.headers["Content-Type"] = "application/json";
  }
  response.writeHead(resMsg.code, resMsg.headers);
  response.end(resMsg.body);
}

// Not found handler
function notFoundHandler({ request, response }) {
  const resMsg = {
    code: 404,
    headers: { 'Content-Type': 'text/plain' },
    body: 'Not Found'
  };
  return { response, resMsg };
}

// Define the functional pipeline
const applicationServerPipeline = [
  parseRequestURL,
  findResourceHandler,
  runHandler,
  finalizeResponse
];

// Create HTTP server
const server = http.createServer((request, response) => {
  // Apply the functional pipeline to process the request
  applicationServerPipeline.reduce((result, func) => func(result), { request, response });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
