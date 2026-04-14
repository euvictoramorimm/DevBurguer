const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita que a página recarregue
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        loginError.textContent = 'Validando credenciais...';
        
        const response = await fetch(`${API_BASE_URL}/auth/admin-login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            // SUCESSO! Guarda o token no cofre do navegador
            localStorage.setItem('devburger_token', data.token);
            // Redireciona para o painel de controle
            window.location.href = 'products.html';
        } else {
            // ERRO (Senha errada)
            loginError.textContent = '❌ ' + data.error;
            loginError.style.color = 'var(--cyber-pink)';
        }
    } catch (error) {
        loginError.textContent = '❌ Erro de conexão com a rede.';
    }
});