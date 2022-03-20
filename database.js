const pgp = require("pg-promise")();

const username = "postgres";
const password = "admin";
const host = "localhost";
const port = 5432;
const database = "userdatabase";

const connectionString = `postgres://${username}:${password}@${host}:${port}/${database}`;

module.exports.db = pgp(connectionString);
