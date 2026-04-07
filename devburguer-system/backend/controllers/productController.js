const { getConnection } = require('../config/database');

const productController = {
    // GET - Listar Produtos
    async getAllProducts(req, res) {
        let connection;
        try {
            connection = await getConnection();
            
            // Buscamos os produtos
            const result = await connection.execute(`SELECT id, name, description, price, image_url FROM products`);
            
            // Transformamos as linhas em um formato JSON "limpo" (POJO)
            const cleanRows = result.rows.map(row => ({ ...row }));

            console.log('--- Cardápio Carregado ---');
            res.status(200).json(cleanRows);
        } catch (err) {
            console.error('❌ ERRO NO GET PRODUCTS:', err.message);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (e) {
                    console.error('Erro ao fechar conexão:', e);
                }
            }
        }
    },

    // POST - Criar Produto
    async createProduct(req, res) {
        const { name, description, price, imageUrl } = req.body;
        let connection;

        try {
            connection = await getConnection();
            
            const sql = `
                INSERT INTO products (name, description, price, image_url) 
                VALUES (:name, :description, :price, :imageUrl)
            `;
            
            const binds = { name, description, price, imageUrl };
            
            await connection.execute(sql, binds, { autoCommit: true });
            
            res.status(201).json({ message: 'Hambúrguer cadastrado com sucesso!' });
        } catch (err) {
            console.error('❌ ERRO NO POST PRODUCT:', err.message);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (e) {
                    console.error('Erro ao fechar conexão:', e);
                }
            }
        }
    }, // <-- A vírgula que faltava aqui!

    // U (UPDATE) - Editar um hambúrguer existente
    async updateProduct(req, res) {
        const { id } = req.params;
        const { name, description, price, imageUrl } = req.body;
        let connection;
        try {
            connection = await getConnection();
            const sql = `
                UPDATE products 
                SET name = :name, description = :description, price = :price, image_url = :imageUrl
                WHERE id = :id
            `;
            await connection.execute(sql, { name, description, price, imageUrl, id }, { autoCommit: true });
            res.json({ message: 'Burger atualizado no sistema!' });
        } catch (err) {
            console.error('❌ ERRO NO UPDATE PRODUCT:', err.message);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (e) {
                    console.error('Erro ao fechar conexão:', e);
                }
            }
        }
    },

    // D (DELETE) - Remover um lanche do cardápio
    async deleteProduct(req, res) {
        const { id } = req.params;
        let connection;
        try {
            connection = await getConnection();
            await connection.execute(`DELETE FROM products WHERE id = :id`, { id }, { autoCommit: true });
            res.json({ message: 'Burger deletado com sucesso!' });
        } catch (err) {
            console.error('❌ ERRO NO DELETE PRODUCT:', err.message);
            res.status(500).json({ error: err.message });
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (e) {
                    console.error('Erro ao fechar conexão:', e);
                }
            }
        }
    }
};

module.exports = productController;