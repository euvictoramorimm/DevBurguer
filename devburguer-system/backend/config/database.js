const oracledb = require('oracledb');
require('dotenv').config();

// Ativando o modo Thin (não exige instalação de binários do Oracle Client)
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.fetchAsString = [ oracledb.CLOB ];

async function getConnection() {
    try {
        const connection = await oracledb.getConnection({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: `${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
        });
        return connection;
    } catch (err) {
        console.error('Erro ao conectar no Oracle DB:', err);
        throw err;
    }
}

module.exports = { getConnection };