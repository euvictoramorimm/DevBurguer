const productContainer = document.getElementById('product-container');
const cartCounter = document.getElementById('cart-counter');

// Nosso carrinho em memória (Array de objetos)
let cart = [];

async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) throw new Error('Erro na API');
        const products = await response.json();

        if (products.length === 0) {
            productContainer.innerHTML = '<p>Nenhum hambúrguer no radar.</p>';
            return;
        }

        productContainer.innerHTML = '';

        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            // Repare bem na linha do botão abaixo! Passamos ID, NOME e PREÇO corretamente.
            card.innerHTML = `
                <img src="${product.IMAGE_URL || 'https://via.placeholder.com/300x180'}" class="product-img">
                <h3>${product.NAME}</h3>
                <p>${product.DESCRIPTION || ''}</p>
                <strong>E$ ${Number(product.PRICE).toFixed(2)}</strong>
                <button onclick="addToCart(${product.ID}, '${product.NAME}', ${product.PRICE})">
                    + ADD CARRINHO
                </button>
            `;
            productContainer.appendChild(card);
        });
    } catch (error) {
        productContainer.innerHTML = '<p>Erro ao carregar cardápio.</p>';
    }
}

// Função para adicionar ao carrinho
function addToCart(name, price) {
    cart.push({ id, name, price: parseFloat(price) });
    updateCartUI();
    
    // Feedback visual simples
    console.log(`Adicionado: ${name}`);
}

function updateCartUI() {
    cartCounter.textContent = `🛒 Itens: ${cart.length}`;
    // Efeito de pulso no contador
    cartCounter.style.transform = 'scale(1.2)';
    setTimeout(() => cartCounter.style.transform = 'scale(1)', 200);
}

document.addEventListener('DOMContentLoaded', loadProducts);

// ... (seu código atual do store.js que busca os produtos) ...

const cartSidebar = document.getElementById('cart-sidebar');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotalElement = document.getElementById('cart-total');

// Abre e fecha o carrinho
window.toggleCart = function() {
    cartSidebar.classList.toggle('open');
};

// Modifica a função addToCart que você já tinha para isso:
window.addToCart = function(id, name, price) {
    cart.push({ id, name, price });
    updateCartUI();
    
    // Animação de pulso no contador
    cartCounter.style.transform = 'scale(1.3)';
    setTimeout(() => cartCounter.style.transform = 'scale(1)', 200);
    
    // Abre o carrinho automaticamente na primeira compra
    if(!cartSidebar.classList.contains('open')) {
        toggleCart();
    }
};

window.removeCartItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

window.updateCartUI = function() {
    cartCounter.textContent = `🛒 Itens: ${cart.length}`;
    
    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name}</span>
                <strong>E$ ${item.price.toFixed(2)}</strong>
                <button onclick="removeCartItem(${index})">X</button>
            </div>
        `;
    });

    cartTotalElement.textContent = total.toFixed(2);
};

window.checkout = async function() {
    // 1. Verifica se tem lanches no carrinho
    if (cart.length === 0) {
        alert('⚠️ Adicione implantes (lanches) ao carrinho primeiro!');
        return;
    }

    // 2. Verifica se o cliente está logado (Tem o crachá?)
    const token = localStorage.getItem('client_token');
    if (!token) {
        alert('🛑 Acesso Restrito: Você precisa logar na rede para finalizar a transferência!');
        window.location.href = 'customer-auth.html'; // Redireciona para o Login
        return;
    }

    const total = cart.reduce((sum, item) => {
    // Tenta pegar o preço não importa como ele esteja escrito no carrinho
    const precoDoLanche = item.PRICE || item.price || item.Price || 0;
    return sum + parseFloat(precoDoLanche);
}, 0);

    // Trava o total em 2 casas decimais para evitar números loucos (ex: 45.50)
    const totalFormatado = parseFloat(total.toFixed(2));

    try {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // 👈 O CRACHÁ ENTRA AQUI!
            },
            body: JSON.stringify({ items: cart, total: totalFormatado })
        });

        const data = await response.json();

        if (response.ok) {
            alert(`✅ ${data.message} Seu protocolo é: #${data.orderId}`);
            cart = [];
            updateCartUI();
            toggleCart(); 
            // Opcional: Manda ele direto pra tela de pedidos pra ver o lanche lá!
            window.location.href = 'my-orders.html';
        } else {
            alert(`❌ Erro: ${data.error}`);
            // Se o crachá estiver expirado, manda ele logar de novo
            if(response.status === 401 || response.status === 403) {
                localStorage.removeItem('client_token');
                window.location.href = 'customer-auth.html';
            }
        }
    } catch (error) {
        alert('❌ Sistema fora do ar. Tente novamente mais tarde.');
    }
};