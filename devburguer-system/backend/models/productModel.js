const { getConnection } = require('../config/database');

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

module.exports = ProductModel;