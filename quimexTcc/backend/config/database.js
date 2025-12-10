import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Sen@i123',
    database: 'quimex',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function getConnection() {
    return pool.getConnection();
}

async function readAll(table, where = null) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }

        const [rows] = await connection.execute(sql);
        return rows;
    } finally {
        connection.release();
    }
}

// Função para ler um registro específico
async function read(table, where) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }

        const [rows] = await connection.execute(sql);
        return rows[0] || null;
    } finally {
        connection.release();
    }
}

// Função para ler registros especificados
async function read_some(table, where) {
    const connection = await getConnection();
    try {
        let sql = `SELECT * FROM ${table}`;
        if (where) {
            sql += ` WHERE ${where}`;
        }

        const [rows] = await connection.execute(sql);
        return rows || null;
    } finally {
        connection.release();
    }
}

// Função para inserir um novo registro
// Função assíncrona para inserir dados em uma tabela do banco de dados
async function create(table, data) {
    // Obtém uma conexão com o banco de dados
    const connection = await getConnection();
    try {
        // Obtém as chaves do objeto 'data' e as junta em uma string separada por vírgulas
        const columns = Object.keys(data).join(', ');

        // Cria um array de placeholders "?" com o mesmo número de colunas e o transforma em uma string
        const placeholders = Array(Object.keys(data).length).fill('?').join(', ');

        // Monta a query SQL para inserção dos dados na tabela especificada
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;

        // Obtém os valores do objeto 'data' para serem usados na query
        const values = Object.values(data);

        // Executa a query SQL com os valores fornecidos e armazena o resultado
        const [result] = await connection.execute(sql, values);

        // Retorna o ID do registro inserido
        return result.insertId;
    } finally {
        // Libera a conexão com o banco de dados
        connection.release();
    }
}

// Função para atualizar um registro
async function update(table, data, where) {
    const connection = await getConnection();
    try {
        const set = Object.keys(data)
            .map(column => `${column} = ?`)
            .join(', ');

        const sql = `UPDATE ${table} SET ${set} WHERE ${where}`;
        const values = Object.values(data);

        const [result] = await connection.execute(sql, [...values]);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

// Função para excluir um registro
async function deleteRecord(table, where) {
    const connection = await getConnection();
    try {
        const sql = `DELETE FROM ${table} WHERE ${where}`;
        const [result] = await connection.execute(sql);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

async function compare(senha, hash) {
    try {
        // Compare a senha com o hash usando bcrypt
        return await bcrypt.compare(senha, hash);
    } catch (error) {
        console.error('Erro ao comparar a senha com o hash:', error);
        return false; // Em caso de erro, retorne falso para indicar que a senha não corresponde
    }
}

async function lucas(lucas) {
    return lucas
}

async function arthur(arthur) {
    return arthur
}

async function describe(table) {
    const connection = await getConnection();
    try {
        const sql = `DESCRIBE produtos`;
        const [result] = await connection.execute(sql);
        return result.affectedRows;
    } finally {
        connection.release();
    }
}

export { create, readAll, read, update, deleteRecord, compare, lucas, arthur, describe };