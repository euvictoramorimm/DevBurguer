/*const { getConnection } = require('../config/database');

const ProductModel = {
    async getAll() {
        let connection;
        try {
            connection = await getConnection();
            const result = await connection.execute(`SELECT id, name, description, price, image_url FROM products`);
            // Limpa o formato para o Controller não ter problemas
            return result.rows.map(row => ({ ...row }));
        } finally {
            if (connection) await connection.close();
        }
    },

    async create(product) {
        let connection;
        try {
            connection = await getConnection();
            const sql = `INSERT INTO products (name, description, price, image_url) VALUES (:name, :description, :price, :imageUrl)`;
            await connection.execute(sql, product, { autoCommit: true });
            return true;
        } finally {
            if (connection) await connection.close();
        }
    },

    async update(id, product) {
        let connection;
        try {
            connection = await getConnection();
            const sql = `UPDATE products SET name = :name, description = :description, price = :price, image_url = :imageUrl WHERE id = :id`;
            await connection.execute(sql, { ...product, id }, { autoCommit: true });
            return true;
        } finally {
            if (connection) await connection.close();
        }
    },

    async delete(id) {
        let connection;
        try {
            connection = await getConnection();
            await connection.execute(`DELETE FROM products WHERE id = :id`, { id }, { autoCommit: true });
            return true;
        } finally {
            if (connection) await connection.close();
        }
    },
    async getById(id) {
        let connection;
        try {
            connection = await getConnection();
            const result = await connection.execute(
                `SELECT id, name, description, price, image_url FROM products WHERE id = :id`,
                { id }
            );
            // Retorna o primeiro item encontrado ou null se não existir
            return result.rows.length > 0 ? { ...result.rows[0] } : null;
        } finally {
            if (connection) await connection.close();
        }
    }
};

module.exports = ProductModel;*/

        const { getConnection } = require('../config/database');

// Função que roda assim que o servidor liga para garantir que a tabela existe
async function initDB() {
    const db = await getConnection();
    await db.exec(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            price REAL NOT NULL,
            image_url TEXT
        )
    `);
}
initDB();

const ProductModel = {
    async getAll() {
        const db = await getConnection();
        // Usamos AS para manter as letras maiúsculas que seu front-end (store.js/admin.js) já espera
        return db.all(`SELECT id AS ID, name AS NAME, description AS DESCRIPTION, price AS PRICE, image_url AS IMAGE_URL FROM products`);
    },

    async getById(id) {
        const db = await getConnection();
        return db.get(`SELECT id AS ID, name AS NAME, description AS DESCRIPTION, price AS PRICE, image_url AS IMAGE_URL FROM products WHERE id = ?`, [id]);
    },

    async create(product) {
        const db = await getConnection();
        await db.run(
            `INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)`,
            [product.name, product.description, product.price, product.imageUrl]
        );
        return true;
    },

    async update(id, product) {
        const db = await getConnection();
        await db.run(
            `UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?`,
            [product.name, product.description, product.price, product.imageUrl, id]
        );
        return true;
    },

    async delete(id) {
        const db = await getConnection();
        await db.run(`DELETE FROM products WHERE id = ?`, [id]);
        return true;
    }
};

module.exports = ProductModel;