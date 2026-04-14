const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const authController = {
    
    // 1. LOGIN DO ADMIN (Já estava pronto, só separamos o nome)
    adminLogin(req, res) {
        const { username, password } = req.body;
        if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
            const token = jwt.sign({ user: 'admin', role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '8h' });
            return res.json({ token });
        }
        return res.status(401).json({ error: 'Credenciais de Admin inválidas.' });
    },

    // 2. CADASTRO DE NOVO CLIENTE (Register)
    async registerClient(req, res) {
        const { name, email, password } = req.body;
        if (!name || !email || !password) return res.status(400).json({ error: 'Preencha todos os campos!' });

        try {
            // Verifica se o email já existe
            const userExists = await UserModel.findByEmail(email);
            if (userExists) return res.status(400).json({ error: 'Este e-mail já está na nossa rede.' });

            const userId = await UserModel.create({ name, email, password });
            
            // Já gera o crachá do cliente na hora que ele cadastra
            const token = jwt.sign({ id: userId, role: 'client' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.status(201).json({ message: 'Bem-vindo a Night City!', token });
        } catch (err) {
            res.status(500).json({ error: 'Erro no servidor ao criar conta.' });
        }
    },

    // 3. LOGIN DO CLIENTE
    async clientLogin(req, res) {
        const { email, password } = req.body;
        
        try {
            const user = await UserModel.findByEmail(email);
            // Verifica se achou o usuário e se a senha bate
            if (!user || user.password !== password) {
                return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            // Gera o crachá do cliente
            const token = jwt.sign({ id: user.id, role: 'client' }, process.env.JWT_SECRET, { expiresIn: '7d' });
            res.json({ token });
        } catch (err) {
            res.status(500).json({ error: 'Erro ao validar login.' });
        }
    }
};

module.exports = authController;