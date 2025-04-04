// Função para gerar um ID único (incremental) para cada novo cliente
function generateId() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    let maxId = 0;
    clients.forEach(client => {
        if (client.id && client.id > maxId) {
            maxId = client.id;
        }
    });
    return maxId + 1;
}

// Usuários existentes (usuário padrão e administrador)
const users = [
    { username: 'Diego', password: '1234' },
    { username: 'admin', password: 'admin' }
];

// Função de login
document.getElementById('loginBtn')?.addEventListener('click', () => {
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;

    if (inputUsername === '' || inputPassword === '') {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Verificar se o usuário e senha estão corretos
    const user = users.find(u => u.username === inputUsername && u.password === inputPassword);

    if (user) {
        alert('Login bem-sucedido!');
        document.getElementById('loginDiv').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        localStorage.setItem('isLoggedIn', 'true'); // Salva o login no localStorage
        loadClients();
    } else {
        alert('Usuário ou senha inválidos!');
    }
});

// Verifica se o usuário está logado ao carregar a página
if (localStorage.getItem('isLoggedIn') === 'true') {
    document.getElementById('loginDiv') && (document.getElementById('loginDiv').style.display = 'none');
    document.getElementById('dashboard') && (document.getElementById('dashboard').style.display = 'block');
    loadClients();
}

// Alterna a exibição das seções com base no menu clicado
const menuItems = document.querySelectorAll('nav ul li');
const sections = document.querySelectorAll('.section');

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    // Esconde todas as seções
    sections.forEach(sec => sec.classList.remove('active'));
    // Mostra a seção correspondente
    const sectionId = item.getAttribute('data-section');
    document.getElementById(sectionId).classList.add('active');
  });
});

// Função para carregar os clientes e renderizar a tabela
function loadClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientTable = document.getElementById('clientTable');
    let tableContent = '<table><tr><th>ID</th><th>Nome Completo</th><th>Email</th><th>Telefone</th><th>Pontos</th><th>Ações</th></tr>';
    
    clients.forEach((client, index) => {
        tableContent += `
            <tr>
                <td>${client.id || '-'}</td>
                <td>${client.fullName}</td>
                <td>${client.email}</td>
                <td>${client.phone}</td>
                <td>${client.points}</td>
                <td style="white-space: nowrap;">
                    <div style="display: inline-flex; flex-wrap: nowrap; gap: 5px;">
                        <button onclick="editClient(${index})">Editar</button>
                        <button onclick="deleteClient(${index})">Excluir</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tableContent += '</table>';
    clientTable.innerHTML = tableContent;
}

// Função para adicionar um novo cliente
function addClient() {
    const clientFullName = document.getElementById('clientFullName').value;
    const clientPhone = document.getElementById('clientPhone').value;
    const clientEmail = document.getElementById('clientEmail').value;
    const clientPoints = parseInt(document.getElementById('clientPoints').value) || 0;

    if (!clientFullName || !clientPhone || !clientEmail) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    // Obtém a lista atual de clientes
    const clients = JSON.parse(localStorage.getItem('clients')) || [];

    // Verifica se já existe um cliente com o mesmo nome, telefone ou email
    const existingClient = clients.find(client =>
        client.fullName === clientFullName ||
        client.phone === clientPhone ||
        client.email === clientEmail
    );
   
    if (existingClient) {
       alert('Cliente já está na lista!');
       return;
    }

    // Cria o novo cliente com a estrutura desejada
    const newClient = {
        id: generateId(),
        fullName: clientFullName,
        phone: clientPhone,
        email: clientEmail,
        points: clientPoints,
        establishmentId: 2 // Define o ID do estabelecimento como 2
    };

    clients.push(newClient);
    localStorage.setItem('clients', JSON.stringify(clients));
    
    // Recarrega a página para atualizar a tabela
    location.reload();
}

// Atribuir a função de adicionar cliente ao botão
document.getElementById('saveClientBtn').onclick = addClient;

// Função para excluir um cliente
function deleteClient(index) {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    clients.splice(index, 1);
    localStorage.setItem('clients', JSON.stringify(clients));

    // Recarrega a página para atualizar a tabela
    location.reload();
}

// Função para editar um cliente
function editClient(index) {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const client = clients[index];
    document.getElementById('clientFullName').value = client.fullName;
    document.getElementById('clientPhone').value = client.phone;
    document.getElementById('clientEmail').value = client.email;
    document.getElementById('clientPoints').value = client.points;
    
    const saveButton = document.getElementById('saveClientBtn');
    saveButton.textContent = "Atualizar Cliente";
    saveButton.onclick = function() {
        client.fullName = document.getElementById('clientFullName').value;
        client.phone = document.getElementById('clientPhone').value;
        client.email = document.getElementById('clientEmail').value;
        client.points = parseInt(document.getElementById('clientPoints').value) || 0;
        clients[index] = client;
        localStorage.setItem('clients', JSON.stringify(clients));

        // Recarrega a página para atualizar a tabela
        location.reload();
    };
}

// Função para buscar clientes 
document.getElementById('searchBtn')?.addEventListener('click', () => {
    const searchTerm = document.getElementById('searchClient').value.toLowerCase();

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const filteredClients = clients.filter(client => client.fullName && client.fullName.toLowerCase().includes(searchTerm));

    const clientSelect = document.getElementById('clientSelect');
    clientSelect.innerHTML = '<option value="">Selecione um cliente</option>';

    filteredClients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.fullName;
        option.textContent = client.fullName;
        clientSelect.appendChild(option);
    });
});

// Adicionar pontos ao cliente selecionado
document.getElementById('addPointsBtn').addEventListener('click', () => {
    const selectedClientName = document.getElementById('clientSelect').value;
    const pointsToAdd = parseInt(document.getElementById('points').value);

    if (!selectedClientName || !pointsToAdd) {
        alert('Selecione um cliente e adicione pontos!');
        return;
    }

    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientIndex = clients.findIndex(client => client.fullName === selectedClientName);

    if (clientIndex !== -1) {
        clients[clientIndex].points += pointsToAdd;
        localStorage.setItem('clients', JSON.stringify(clients));
        alert(`Pontos adicionados com sucesso ao cliente ${selectedClientName}`);

        // Recarrega a página para atualizar a tabela
        location.reload();
    }
});

// Zerar clientes (limpar o localStorage)
document.getElementById('resetClientsBtn')?.addEventListener('click', () => {
    localStorage.removeItem('clients');
    alert('Todos os clientes foram removidos!');
    location.reload();
});

// Função para exportar clientes
document.getElementById('exportBtn')?.addEventListener('click', () => {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const blob = new Blob([JSON.stringify(clients, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clientes.json';
    a.click();
    URL.revokeObjectURL(url);
});

// Função para importar clientes
document.getElementById('importBtn')?.addEventListener('click', () => {
    document.getElementById('importFile').click();
});

document.getElementById('importFile')?.addEventListener('change', event => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedClients = JSON.parse(e.target.result);
                // Atualiza cada cliente para ter a estrutura completa
                const updatedClients = importedClients.map(client => {
                    return {
                        id: client.id || generateId(),
                        fullName: client.fullName,
                        phone: client.phone,
                        email: client.email,
                        points: client.points,
                        establishmentId: 2
                    };
                });
                localStorage.setItem('clients', JSON.stringify(updatedClients));
                alert('Clientes importados com sucesso!');
                location.reload();
            } catch (error) {
                alert('Erro ao importar o arquivo. Certifique-se de que o arquivo está no formato correto.');
            }
        };
        reader.readAsText(file);
    }
});

// Função para exibir os clientes e seus pontos (lista de clientes com 10 ou mais pontos)
function displayClients() {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientList = document.getElementById('clients');
    if (!clientList) return; // Se a lista não existir na página, sai da função
    clientList.innerHTML = '';  // Limpa a lista de clientes

    clients.forEach(client => {
        const listItem = document.createElement('li');
        listItem.textContent = `${client.fullName} - Pontos: ${client.points || 0}`;

        // Cria o botão de WhatsApp se o cliente tiver 10 pontos ou mais
        if (client.points >= 10) {
            const whatsappButton = document.createElement('button');
            whatsappButton.textContent = 'Enviar Voucher';
            whatsappButton.addEventListener('click', () => sendVoucher(client));
            listItem.appendChild(whatsappButton);
        }

        clientList.appendChild(listItem);
    });
}

// Função para atualizar os pontos do cliente (usada para integração com voucher, se necessário)
function updateClientPoints(clientId, points) {
    const clients = JSON.parse(localStorage.getItem('clients')) || [];
    const clientIndex = clients.findIndex(c => c.id === clientId);

    if (clientIndex > -1) {
        clients[clientIndex].points += points;  // Adiciona pontos
        localStorage.setItem('clients', JSON.stringify(clients));
        displayClients();  // Recarrega a lista de clientes
    }
}

// Chama a função para exibir os clientes ao carregar a página
displayClients();

// Exemplo de função para enviar voucher
function sendVoucher(client) {
    const voucherMessage = `Parabéns ${client.fullName}, você ganhou um voucher!`;
    const encodedMessage = encodeURIComponent(voucherMessage);
    const whatsappUrl = `https://wa.me/${client.phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}
