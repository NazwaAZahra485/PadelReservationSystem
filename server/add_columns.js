const mysql = require('mysql2/promise');
require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || '';
const DB_NAME = process.env.DB_NAME || 'padel_db';

async function addColumns() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: DB_HOST,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        });

        console.log('Connected to database.');

        // Add images to courts
        try {
            await connection.query("ALTER TABLE courts ADD COLUMN images TEXT");
            console.log("Added 'images' column to 'courts' table.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'images' column already exists in 'courts'.");
            } else {
                console.error("Error adding 'images' to 'courts':", err.message);
            }
        }

        // Add description to courts (jika belum ada)
        try {
            await connection.query("ALTER TABLE courts ADD COLUMN description TEXT");
            console.log("Added 'description' column to 'courts' table.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'description' column already exists in 'courts'.");
            } else {
                console.error("Error adding 'description' to 'courts':", err.message);
            }
        }

        // Add images to events
        try {
            await connection.query("ALTER TABLE events ADD COLUMN images TEXT");
            console.log("Added 'images' column to 'events' table.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'images' column already exists in 'events'.");
            } else {
                console.error("Error adding 'images' to 'events':", err.message);
            }
        }

        // Add location to events
        try {
            await connection.query("ALTER TABLE events ADD COLUMN location VARCHAR(255)");
            console.log("Added 'location' column to 'events' table.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'location' column already exists in 'events'.");
            } else {
                console.error("Error adding 'location' to 'events':", err.message);
            }
        }

    } catch (err) {
        console.error('Database connection failed:', err);
    } finally {
        if (connection) await connection.end();
    }
}

addColumns();
