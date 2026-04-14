const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // O Token chega no formato: "Bearer eyJhbGciOiJIUzI1..."
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
        return res.status(403).json({ error: 'Alto lá! Crachá (Token) não fornecido.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Crachá falso ou expirado!' });
        
        req.user = decoded; // Salva os dados do usuário na requisição
        next(); // Abre a cancela, deixa passar!
    });
}

module.exports = verifyToken;