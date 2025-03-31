const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5454,
  database: 'postgres',
  user: 'postgres',
  password: '123456',
  ssl: false,
});

const queryDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to PostgreSQL database!");

    const res = await client.query('SELECT * FROM customers WHERE "country" = $1', ["France"]);
    console.log(res.rows);

  } catch (err) {
    console.error("Error executing query:", err);
  } finally {
    await client.end();
    console.log("Disconnected from database.");
  }
};

queryDatabase();

/* const { Client } = require('pg')
const client = new Client({
    host: 'pgadmin.jvh.kfs.es',
    port: 5433,
    database: 'postgres',
    user: 'lector',
    password: 'lector',
})
client.connect()
.then(() => {
    client.query('SELECT $1::text as message'
        ,
        ['Hello world11!']).then(res => {
            console.log(res.rows[0].message) // Hello world!
            client.end()
        })
})
.catch((err) => {
    console.log(err);
}) */
