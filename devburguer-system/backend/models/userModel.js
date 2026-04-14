const { getConnection } = require('../config/database');

// Cria a tabela de clientes automaticamente
async function initUserDB() {
    try {
        const db = await getConnection();
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        `);
        console.log('👥 Tabela de Clientes (Users) pronta!');
    } catch (error) {
        console.error('Erro ao criar tabela de usuários:', error);
    }
}
initUserDB();

const UserModel = {
    async create(user) {
        const db = await getConnection();
        // Nota Sênior: Num sistema real de produção, a gente criptografaria a senha aqui (usando bcrypt). 
        // Para o nosso MVP rodar rápido agora, vamos salvar direto.
        const result = await db.run(
            `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`,
            [user.name, user.email, user.password]
        );
        return result.lastID;
    },

    async findByEmail(email) {
        const db = await getConnection();
        return db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    }
};

module.exports = UserModel;