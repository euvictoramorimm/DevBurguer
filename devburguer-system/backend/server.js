const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { getConnection } = require('./config/database'); // Importando nossa conexão
const productRoutes = require('./routes/productRoutes'); 
const authRoutes = require('./routes/authRoutes');
const orderRoutes = require('./routes/orderRoutes');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); 

app.get('/api/status', (req, res) => {
    res.json({ message: 'API do DevBurger rodando com sucesso!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    
    // Teste de conexão com o banco de dados
    try {
        const connection = await getConnection();
        console.log('✅ Conexão com o Oracle DB estabelecida com sucesso!');
        await connection.close(); // Fechamos essa conexão inicial de teste
    } catch (err) {
        console.error('❌ Falha ao conectar no banco de dados:', err.message);
    }
});