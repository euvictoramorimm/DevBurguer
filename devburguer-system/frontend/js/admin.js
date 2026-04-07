const form = document.getElementById('product-form');
const statusMessage = document.getElementById('status-message');
const listContainer = document.getElementById('admin-product-list');

// 🛡️ A SOLUÇÃO DA BAGACEIRA: Guardar a lista na memória do navegador
let adminProducts = []; 

// 1. CARREGAR PRODUTOS
async function loadAdminProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        adminProducts = await response.json(); // Salva os dados brutos aqui
        
        listContainer.innerHTML = ''; 
        
        adminProducts.forEach(p => {
            // Agora o botão só envia o ID numérico. Zero chance de quebrar com aspas!
            listContainer.innerHTML += `
                <div class="admin-item">
                    <div>
                        <strong style="color: var(--cyber-yellow)">${p.NAME}</strong><br>
                        E$ ${Number(p.PRICE).toFixed(2)}
                    </div>
                    <div class="admin-actions">
                        <button onclick="prepareEdit(${p.ID})" style="cursor:pointer;">EDITAR</button>
                        <button class="delete-btn" onclick="deleteProduct(${p.ID})" style="cursor:pointer;">DEL</button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        listContainer.innerHTML = '<p style="color:red">❌ Erro ao acessar a rede Oracle.</p>';
    }
}

// 2. SALVAR OU EDITAR
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const id = document.getElementById('productId').value;
    const product = {
        name: document.getElementById('name').value,
        description: document.getElementById('description').value,
        price: parseFloat(document.getElementById('price').value),
        imageUrl: document.getElementById('imageUrl').value
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_BASE_URL}/products/${id}` : `${API_BASE_URL}/products`;

    try {
        statusMessage.textContent = 'Enviando pacotes de dados...';
        statusMessage.style.color = 'var(--cyber-blue)';

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            statusMessage.textContent = '✅ Sucesso no UPLOAD!';
            statusMessage.style.color = 'var(--primary)';
            resetForm();
            loadAdminProducts(); 
        } else {
            statusMessage.textContent = '❌ Ocorreu um erro na gravação.';
            statusMessage.style.color = 'red';
        }
    } catch (error) {
        statusMessage.textContent = '❌ Falha de conexão com a API.';
        statusMessage.style.color = 'red';
    }
});

// 3. PREPARAR PARA EDIÇÃO (A Mágica)
window.prepareEdit = function(id) {
    // Busca o lanche completo dentro da memória, pelo ID
    const p = adminProducts.find(item => item.ID === id);
    if (!p) return;

    // Preenche os campos do formulário de forma segura
    document.getElementById('productId').value = p.ID;
    document.getElementById('name').value = p.NAME;
    document.getElementById('description').value = p.DESCRIPTION ? p.DESCRIPTION : '';
    document.getElementById('price').value = p.PRICE;
    document.getElementById('imageUrl').value = p.IMAGE_URL ? p.IMAGE_URL : '';
    
    document.getElementById('submit-btn').textContent = "ATUALIZAR DADOS";
    document.getElementById('cancel-btn').style.display = "inline-block";
    
    // Rola a tela suavemente para cima (útil se a lista for gigante)
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
};

// 4. DELETAR
window.deleteProduct = async function(id) {
    if(confirm("ATENÇÃO: Deseja apagar este arquivo permanentemente da rede?")) {
        await fetch(`${API_BASE_URL}/products/${id}`, { method: 'DELETE' });
        loadAdminProducts(); 
    }
};

// 5. CANCELAR EDIÇÃO
window.resetForm = function() {
    form.reset();
    document.getElementById('productId').value = '';
    document.getElementById('submit-btn').textContent = "UPLOAD TO GRID";
    document.getElementById('cancel-btn').style.display = "none";
    statusMessage.textContent = '';
};

// Start automático
document.addEventListener('DOMContentLoaded', loadAdminProducts);