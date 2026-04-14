const OrderModel = require('../models/orderModel');

const orderController = {
    // 1. RECEBE O PEDIDO DA LOJA E SALVA NO NOME DO CLIENTE
    async createOrder(req, res) {
    const { items, total } = req.body;
    const userId = req.user.id; 

    try {
        // 🚨 NOVA REGRA: Verifica se o usuário já tem algum pedido hoje
        const existingOrders = await OrderModel.findByUserId(userId);
        
        // Se ele já tiver um pedido, barramos o novo
        if (existingOrders && existingOrders.length > 0) {
            return res.status(403).json({ 
                error: 'Você já possui um pedido em andamento! Aguarde a finalização para fazer um novo.' 
            });
        }

        const orderId = await OrderModel.create({ userId, items, total });
        res.status(201).json({ message: 'Pedido enviado para a cozinha!', orderId });
    } catch (err) {
        res.status(500).json({ error: 'Falha ao processar o pedido.' });
    }
},

    // 2. BUSCA TODOS OS PEDIDOS DE QUEM ESTÁ LOGADO
    async getMyOrders(req, res) {
        const userId = req.user.id; 

        try {
            const orders = await OrderModel.findByUserId(userId);
            
            // O SQLite guarda a lista de lanches como Texto (JSON String). 
            // Precisamos converter de volta para Lista (Array) antes de mandar pro Front-end.
            const formattedOrders = orders.map(order => ({
                ...order,
                items: JSON.parse(order.items)
            }));
            
            res.json(formattedOrders);
        } catch (err) {
            console.error('❌ Erro ao buscar pedidos:', err.message);
            res.status(500).json({ error: 'Erro ao buscar seus protocolos.' });
        }
    }
};



module.exports = orderController;