const ProductModel = require('../models/productModel'); 

const productController = {
    async getAllProducts(req, res) {
        try {
            const products = await ProductModel.getAll();
            res.status(200).json(products);
        } catch (err) {
            console.error('❌ Erro no GET:', err.message);
            res.status(500).json({ error: 'Erro ao buscar o cardápio.' });
        }
    },

    async createProduct(req, res) {
        // VALIDAÇÃO: O Controller é o segurança da balada
        const { name, price } = req.body;
        
        if (!name || name.trim() === '') {
            return res.status(400).json({ error: 'Operação negada: O nome do lanche é obrigatório.' });
        }
        if (price === undefined || price <= 0) {
            return res.status(400).json({ error: 'Operação negada: O preço deve ser maior que zero.' });
        }

        try {
            await ProductModel.create(req.body);
            res.status(201).json({ message: 'Lanche cadastrado com sucesso!' });
        } catch (err) {
            console.error('❌ Erro no POST:', err.message);
            res.status(500).json({ error: 'Erro interno ao salvar o produto.' });
        }
    },

    async updateProduct(req, res) {
        try {
            await ProductModel.update(req.params.id, req.body);
            res.json({ message: 'Lanche atualizado!' });
        } catch (err) {
            console.error('❌ Erro no PUT:', err.message);
            res.status(500).json({ error: 'Erro ao atualizar.' });
        }
    },

    async deleteProduct(req, res) {
        try {
            await ProductModel.delete(req.params.id);
            res.json({ message: 'Lanche deletado!' });
        } catch (err) {
            console.error('❌ Erro no DELETE:', err.message);
            res.status(500).json({ error: 'Erro ao deletar.' });
        }
    },
    async getProductById(req, res) {
        try {
            const product = await ProductModel.getById(req.params.id);
            if (!product) {
                return res.status(404).json({ error: 'Lanche não encontrado na rede.' });
            }
            res.status(200).json(product);
        } catch (err) {
            console.error('❌ Erro no GET BY ID:', err.message);
            res.status(500).json({ error: 'Erro ao buscar o produto.' });
        }
    }
};

module.exports = productController;