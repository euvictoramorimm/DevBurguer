const { getConnection } = require('../config/database');

// 1. INICIALIZAÇÃO: Cria a tabela de pedidos vinculada ao usuário
async function initOrderDB() {
    try {
        const db = await getConnection();
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS orders (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                items TEXT NOT NULL,
                total REAL NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id)
            )
        `);
        
        console.log('📦 Sistema de Protocolos (Orders) pronto para a rede!');
    } catch (error) {
        console.error('❌ Erro crítico ao iniciar tabela de pedidos:', error.message);
    }
}

// Ativa a criação da tabela assim que o modelo é carregado
initOrderDB();

const OrderModel = {
    // 2. CRIAR PEDIDO: Salva os itens e quem comprou
    async create(order) {
        const db = await getConnection();
        // Transformamos a lista de lanches em TEXTO para o SQLite aceitar
        const itemsString = JSON.stringify(order.items);
        
        const result = await db.run(
            `INSERT INTO orders (user_id, items, total) VALUES (?, ?, ?)`,
            [order.userId, itemsString, order.total]
        );
        return result.lastID; // Retorna o número do pedido gerado
    },

    // 3. BUSCAR POR USUÁRIO: A base para a aba "Meus Pedidos"
    async findByUserId(userId) {
        const db = await getConnection();
        // Busca apenas os pedidos onde o user_id bate com o id do cliente logado
        return db.all(
            `SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC`, 
            [userId]
        );
    }
};

module.exports = OrderModel;