
import mysql from "mysql2/promise";

export async function db() {
  const connection = await mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'quimex',
  });

  return connection;
}
