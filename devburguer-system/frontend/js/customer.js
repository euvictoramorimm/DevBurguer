// ==========================================
// 1. ANIMAÇÃO: TROCAR LOGIN / CADASTRO
// ==========================================
function toggleAuthForms() {
    const loginSec = document.getElementById('login-section');
    const regSec = document.getElementById('register-section');
    const authMessage = document.getElementById('auth-message');
    
    authMessage.textContent = ''; // Limpa mensagens de erro

    if (loginSec.style.display === 'none') {
        loginSec.style.display = 'block';
        regSec.style.display = 'none';
    } else {
        loginSec.style.display = 'none';
        regSec.style.display = 'block';
    }
}

// ==========================================
// 2. REGISTRO DE NOVO CLIENTE
// ==========================================
const registerForm = document.getElementById('client-register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;
        const msgBox = document.getElementById('auth-message');

        try {
            msgBox.textContent = 'Processando implante de dados...';
            msgBox.style.color = 'var(--cyber-blue)';

            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('client_token', data.token); // Salva o crachá!
                window.location.href = '/index.html'; 
            } else {
                msgBox.textContent = `❌ ${data.error}`;
                msgBox.style.color = 'var(--cyber-pink)';
            }
        } catch (error) {
            msgBox.textContent = '❌ Sistema offline.';
        }
    });
}

// ==========================================
// 3. LOGIN DO CLIENTE (ATUALIZADO)
// ==========================================
const loginForm = document.getElementById('client-login-form');

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Impede a página de piscar/recarregar
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;
        const msgBox = document.getElementById('auth-message');

        try {
            console.log('Enviando dados de login para o servidor...');
            msgBox.textContent = 'Validando acesso...';
            msgBox.style.color = 'var(--cyber-yellow)';

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Resposta do servidor:', response.status, data);

            if (response.ok) {
                // SUCESSO!
                msgBox.textContent = '✅ Acesso liberado!';
                msgBox.style.color = 'var(--primary)';
                localStorage.setItem('client_token', data.token); 
                
                // 🚨 MUDANÇA AQUI: Joga o cliente direto pros pedidos dele!
                window.location.href = 'my-orders.html'; 
            } else {
                // ERRO (Senha ou e-mail errado)
                msgBox.textContent = `❌ ${data.error || 'Acesso negado.'}`;
                msgBox.style.color = 'var(--cyber-pink)';
            }
        } catch (error) {
            console.error('Erro na requisição de login:', error);
            msgBox.textContent = '❌ Sistema offline. Tente novamente.';
            msgBox.style.color = 'var(--cyber-pink)';
        }
    });
} else {
    console.warn('⚠️ Formulário de login não encontrado nesta página.');
}

// ==========================================
// 4. CARREGAR "MEUS PEDIDOS" (Usado na página my-orders.html)
// ==========================================
async function loadMyOrders() {
    const token = localStorage.getItem('client_token');
    if (!token) {
        window.location.href = 'customer-auth.html'; // Chuta pro login se não tiver crachá
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const orders = await response.json();
        const container = document.getElementById('orders-list');
        
        if (orders.length === 0) {
            container.innerHTML = '<p style="text-align:center; color: var(--cyber-yellow);">Você ainda não tem transferências registradas na rede.</p>';
            return;
        }

        // Dentro da função loadMyOrders, no momento do .map:
container.innerHTML = orders.map(order => {
    // Garantimos que pegamos os dados independente de estarem maiúsculos ou minúsculos
    const itensDoPedido = order.items || order.ITEMS;
    const totalDoPedido = order.total || order.TOTAL;
    const dataDoPedido = order.created_at || order.CREATED_AT;

    return `
        <div class="product-card" style="margin-bottom: 20px; max-width: 100%;">
            <h3 style="color: var(--cyber-pink);">Protocolo #${order.id || order.ID}</h3>
            <p style="color: #fff;">🗓️ Data: ${new Date(dataDoPedido).toLocaleString()}</p>
            <hr style="border-color: #333; margin: 10px 0;">
            <ul style="list-style: none; padding: 0; margin-bottom: 15px; color: #b3b3b3;">
                ${itensDoPedido.map(item => `<li>✔️ ${item.NAME || item.name} - R$ ${(item.PRICE || item.price).toFixed(2)}</li>`).join('')}
            </ul>
            <strong style="color: var(--cyber-yellow); font-size: 1.2rem;">TOTAL: R$ ${parseFloat(totalDoPedido).toFixed(2)}</strong>
        </div>
    `;
}).join('');
    } catch (error) {
        console.error('Erro ao buscar pedidos', error);
    }
}