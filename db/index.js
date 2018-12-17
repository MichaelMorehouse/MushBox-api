const { Pool, Client } = require('pg')
const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString })

module.exports = {
    query: async (text, params) => {
        const client = await pool.connect()
        try {
            await client.query('BEGIN')
            await client.query(text, params)
            await client.query('COMMIT')
        } catch (err) {
            try {
                client.query("ROLLBACK");
            } catch (err) {
                console.error("Error rolling back client", err.stack);
            }
            console.log("Error committing transaction", err.stack)
        } finally {
            client.release()
        }
    }
}