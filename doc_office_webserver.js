const http = require('http');
const url = require('url');
const mysql = require('mysql2/promise'); // Importing the Promise version of mysql


// Import helper functions
const { reserveDate, lookup, cancelReservation, defaultResponse, createConnection } = require('./helper_funcs.js');


// MySQL connection setup


// Pure function to parse request URL
function parseRequestURL(request) {
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname.split('/')[1]; // Extracting endpoint from URL
    return {
        path: `/${path}`,
        query: parsedUrl.query
    
    };
}

// Dispatch table for API handlers
const dispatchTable = {
    '/reserveDate': reserveDate,
    '/lookup': lookup,
    '/cancelReservation': cancelReservation
};

// Function to find the corresponding resource handler
function findResourceHandler({ path }) {
    const handler = dispatchTable[path] || defaultResponse;
    return handler;
}

// Function to run the API on the resource
async function runHandler({ handler, request, response, query, method }) {
  const connection = createConnection(); // Create the connection

    const resMsg = await handler(query, method,connection); // Pass method to handler function
    finalizeResponse({ response, resMsg });
}

// Function to finalize the HTTP response for the client
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

// Function to handle HTTP requests
function handleRequest(request, response) {
    const { path, query } = parseRequestURL(request);

    const method = request.method; // Extract HTTP method
    console.log("Path:", path);
    console.log("Query:", query);
    console.log("Method:", method);

    const handler = findResourceHandler({ path });
    runHandler({ handler, request, response, query, method });
    //console.log(request, response, query, method);
}

// Create HTTP server
const server = http.createServer(handleRequest);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
