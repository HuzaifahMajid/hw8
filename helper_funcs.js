// Function to create a MySQL connection
const mysql = require('mysql2/promise');

// Function to establish a database connection
async function createConnection() {
    try {
        console.log('Establishing database connection...');
        // Replace the connection details with your own
        const connection = await mysql.createConnection({
            host: '127.0.0.1',
            port: 3333,
            user: 'root',
            password: 'root',
            database: 'zazi_clinic'
        });
        console.log('Database connection established successfully.');
        return connection;
    } catch (error) {
        console.error('Error establishing database connection:', error);
        throw error; // Re-throw the error for handling in the caller function
    }
}
connection = createConnection();

// Function to reserve a date
async function reserveDate(query, method, connection) {
    // Your reserveDate implementation...
}

// Function to look up upcoming reservations for a patient


async function lookup(query, method, connection) {
    try {
        console.log('Starting lookup function...');
        console.log('Method:', method);

        if (method !== 'GET') {
            console.error('Method is not allowed:', method);
            throw new Error('Method not allowed');
        }

        const { startDate, N } = query;
        console.log('Received query parameters:', startDate, N);

        const sql = `
            SELECT * 
            FROM Appointments 
            WHERE AppointmentDate >= ? 
            ORDER BY AppointmentDate ASC 
            LIMIT ?`;
        console.log('Executing SQL query:', sql);

        const [rows, fields] =  connection.query(sql, [startDate, N]);
        console.log('Received query results:', rows);

        const appointments = rows.map(row => ({
            appointmentID: row.AppointmentID,
            appointmentDate: row.AppointmentDate,
            // Add other appointment details as needed
        }));
        console.log('Mapped appointments:', appointments);

        return { code: 200, body: JSON.stringify({ appointments }), headers: {} };
    } catch (error) {
        console.error('Error looking up upcoming reservations:', error);
        return { code: 405, body: JSON.stringify({ error: 'Method Not Allowed' }), headers: {} };
    }
}

// Function to cancel a reservation
async function cancelReservation(query, method, connection) {
    // Your cancelReservation implementation...
}

// Helper function to generate confirmation code
function generateConfirmationCode() {
    // Generate a random confirmation code (can be implemented based on requirements)
    return Math.random().toString(36).substr(2, 10);
}

// Default response for invalid requests
function defaultResponse() {
    return { code: 404, body: 'PAGE Not Found', headers: { 'Content-Type': 'text/plain' } };
}

module.exports = { reserveDate, lookup, cancelReservation, defaultResponse, createConnection };
