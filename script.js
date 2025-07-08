// Utilidades para mostrar/ocultar modais
function showModal(id) {
    document.querySelector('.login-bg').style.display = 'none';
    document.getElementById('cadastro-modal').style.display = 'none';
    document.getElementById('recupera-modal').style.display = 'none';
    if (document.getElementById(id)) document.getElementById(id).style.display = 'flex';
}
function showLogin() {
    document.querySelector('.login-bg').style.display = 'flex';
    document.getElementById('cadastro-modal').style.display = 'none';
    document.getElementById('recupera-modal').style.display = 'none';
}

// Selecionar botões do formulário de login principal
const loginCard = document.querySelector('.login-bg .login-card');
if (loginCard) {
    const btns = loginCard.querySelectorAll('.btn-outline-login');
    if (btns[0]) btns[0].onclick = () => showModal('cadastro-modal'); // Inscrever-se
    if (btns[1]) btns[1].onclick = () => showModal('recupera-modal'); // Esqueci a senha
}

// Voltar para login
const btnVoltarLogin = document.getElementById('voltar-login');
const btnVoltarLogin2 = document.getElementById('voltar-login2');
if (btnVoltarLogin) btnVoltarLogin.onclick = showLogin;
if (btnVoltarLogin2) btnVoltarLogin2.onclick = showLogin;

// Cadastro de usuário
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
    formCadastro.onsubmit = function(e) {
        e.preventDefault();
        const usuario = document.getElementById('cadastro-usuario').value.trim();
        const senha = document.getElementById('cadastro-senha').value;
        let users = JSON.parse(localStorage.getItem('usuarios') || '{}');
        if (users[usuario]) {
            document.getElementById('cadastro-msg').innerText = 'Usuário já existe!';
            return;
        }
        users[usuario] = senha;
        localStorage.setItem('usuarios', JSON.stringify(users));
        document.getElementById('cadastro-msg').innerText = 'Usuário cadastrado com sucesso!';
        showLogin();
        document.getElementById('cadastro-msg').innerText = '';
    };
}

// Login
const loginForm = document.querySelector('.login-bg .login-form');
if (loginForm) {
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const usuario = inputs[0].value.trim();
        const senha = inputs[1].value;
        let users = JSON.parse(localStorage.getItem('usuarios') || '{}');
        if (users[usuario] && users[usuario] === senha) {
            // Esconde todas as áreas de login
            document.querySelector('.login-bg').style.display = 'none';
            document.getElementById('cadastro-modal').style.display = 'none';
            document.getElementById('recupera-modal').style.display = 'none';
            // Mostra o conteúdo do site
            if(document.getElementById('site-content')) document.getElementById('site-content').style.display = 'block';
            // Mostra o botão de WhatsApp
            if(document.getElementById('whatsapp-suporte')) document.getElementById('whatsapp-suporte').style.display = 'block';
        } else {
            alert('Usuário ou senha inválidos!');
        }
    };
}

// Recuperação de senha
const formRecupera = document.getElementById('form-recupera');
if (formRecupera) {
    formRecupera.onsubmit = function(e) {
        e.preventDefault();
        const usuario = document.getElementById('recupera-usuario').value.trim();
        let users = JSON.parse(localStorage.getItem('usuarios') || '{}');
        if (users[usuario]) {
            document.getElementById('recupera-msg').innerText = 'Sua senha é: ' + users[usuario];
        } else {
            document.getElementById('recupera-msg').innerText = 'Usuário não encontrado!';
        }
    };
}

// Exibir serviços GSM cadastrados no site público como cards
function exibirServicosPublico() {
    const div = document.getElementById('cards-servicos-publico');
    if (!div) return;
    let servicos = JSON.parse(localStorage.getItem('servicosGSM') || '[]');
    div.innerHTML = '';
    if (servicos.length === 0) {
        div.innerHTML = '<div style="color:#888;text-align:center;width:100%;font-size:1.1rem;padding:40px;">Nenhum serviço cadastrado.</div>';
        return;
    }
    servicos.forEach((s, index) => {
        let card = document.createElement('div');
        card.className = 'card-servico-publico';
        card.innerHTML = `
            <div style="position:absolute;top:16px;right:16px;font-size:1.5rem;color:rgba(30,144,255,0.3);">⚡</div>
            <div class='servico-topo'>
                <span class='servico-nome'>${s.nome}</span>
                <span class='servico-valor'>R$ ${parseFloat(s.valor).toFixed(2)}</span>
            </div>
            <div class='servico-desc'>${s.desc}</div>
            <button class='servico-btn'>Fazer pedido</button>
        `;
        div.appendChild(card);
    });
    adicionarAcaoPedidoBotoes();
}

// Exibir remotos cadastrados no site público como cards
function exibirRemotosPublico() {
    const div = document.getElementById('cards-remotos-publico');
    if (!div) return;
    let remotos = JSON.parse(localStorage.getItem('remotos') || '[]');
    div.innerHTML = '';
    if (remotos.length === 0) {
        div.innerHTML = '<div style="color:#888;text-align:center;width:100%;font-size:1.1rem;padding:40px;">Nenhum remoto cadastrado.</div>';
        return;
    }
    remotos.forEach((r, index) => {
        let card = document.createElement('div');
        card.className = 'card-servico-publico';
        card.innerHTML = `
            <div style="position:absolute;top:16px;right:16px;font-size:1.5rem;color:rgba(30,144,255,0.3);">🔧</div>
            <div class='servico-topo'>
                <span class='servico-nome'>${r.nome}</span>
                <span class='servico-valor'>R$ ${parseFloat(r.valor).toFixed(2)}</span>
            </div>
            <div class='servico-desc'>${r.desc}</div>
            ${r.modelos ? `<div class='servico-desc' style='color:#888;font-size:0.98em;margin-top:8px;background:rgba(30,144,255,0.05);border:1px solid rgba(30,144,255,0.1);'>📱 Modelos Samsung: ${r.modelos}</div>` : ''}
            <button class='servico-btn'>Fazer pedido</button>
        `;
        div.appendChild(card);
    });
    adicionarAcaoPedidoBotoes();
}

// Exibir avisos no site público
function exibirAvisosPublico() {
    const div = document.getElementById('avisos-publico');
    if (!div) return;
    let avisos = JSON.parse(localStorage.getItem('avisos') || '[]');
    div.innerHTML = '';
    if (avisos.length === 0) {
        div.style.display = 'none';
        return;
    }
    div.style.display = 'flex';
    avisos.forEach(a => {
        let aviso = document.createElement('div');
        aviso.className = 'aviso-item';
        aviso.innerHTML = `<span class='aviso-icon'>⚠️</span> <span>${a.texto}</span>`;
        div.appendChild(aviso);
    });
}



// Exibir servidores cadastrados no site público em tabela
function exibirServidoresPublico() {
    const div = document.getElementById('tabela-servidores-publico');
    if (!div) return;
    let servidores = JSON.parse(localStorage.getItem('servidores') || '[]');
    if (servidores.length === 0) {
        div.innerHTML = '<div style="color:#888;text-align:center;">Nenhum serviço de servidor cadastrado.</div>';
        return;
    }
    let html = `<table style='width:100%;border-collapse:collapse;background:#f3f6fa;border-radius:12px;overflow:hidden;'>
        <thead><tr style='background:#eaf4ff;'>
            <th style='padding:10px;'>ID</th>
            <th style='padding:10px;'>Serviço</th>
        </tr></thead><tbody>`;
    servidores.forEach((s) => {
        html += `<tr>
            <td style='padding:10px;'>${s.id}</td>
            <td style='padding:10px;'>${s.servico}</td>
        </tr>`;
    });
    html += '</tbody></table>';
    div.innerHTML = html;
}
// Exibir serviço em destaque no site público
function exibirServidorDestaquePublico() {
    const div = document.getElementById('servidor-destaque-publico');
    if (!div) return;
    let servidores = JSON.parse(localStorage.getItem('servidores') || '[]');
    let idx = parseInt(localStorage.getItem('servidorDestaque'));
    if (isNaN(idx) || !servidores[idx]) {
        div.innerHTML = '';
        return;
    }
    let s = servidores[idx];
    div.innerHTML = `<div class='servidor-destaque-card'>
        <div class='servidor-destaque-nome'>${s.nomeServico || s.servico}</div>
        <div class='servidor-destaque-valor'>R$ ${s.valor ? parseFloat(s.valor).toFixed(2) : ''}</div>
        ${s.msgTelegram ? `<div class='servidor-destaque-msg'>${s.msgTelegram}</div>` : ''}
    </div>`;
}
// Atualizar mostrarSiteContent para exibir servidor em destaque também
function mostrarSiteContent() {
    document.querySelector('.login-bg').style.display = 'none';
    document.getElementById('cadastro-modal').style.display = 'none';
    document.getElementById('recupera-modal').style.display = 'none';
    if(document.getElementById('site-content')) {
        document.getElementById('site-content').style.display = 'block';
        exibirAvisosPublico();
        exibirServidorDestaquePublico();
        exibirRemotosPublico();
        exibirServicosPublico();
    }
    // Mostra o botão de WhatsApp
    if(document.getElementById('whatsapp-suporte')) document.getElementById('whatsapp-suporte').style.display = 'block';
}

// Ajustar login para chamar mostrarSiteContent e salvar login
if (loginForm) {
    loginForm.onsubmit = function(e) {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const usuario = inputs[0].value.trim();
        const senha = inputs[1].value;
        let users = JSON.parse(localStorage.getItem('usuarios') || '{}');
        if (users[usuario] && users[usuario] === senha) {
            localStorage.setItem('logado', 'true');
            mostrarSiteContent();
        } else {
            alert('Usuário ou senha inválidos!');
        }
    };
}

// Função para logout
function logout() {
    localStorage.removeItem('logado');
    if(document.getElementById('site-content')) document.getElementById('site-content').style.display = 'none';
    // Esconde o botão de WhatsApp
    if(document.getElementById('whatsapp-suporte')) document.getElementById('whatsapp-suporte').style.display = 'none';
    showLogin();
}

// Adicionar evento ao botão Sair do menu (se existir)
document.addEventListener('DOMContentLoaded', function() {
    const sairBtn = Array.from(document.querySelectorAll('.menu-preto a')).find(a => a.textContent.trim().toLowerCase() === 'sair');
    if (sairBtn) sairBtn.onclick = function(e) { e.preventDefault(); logout(); };
});

// Mostrar conteúdo se já estiver logado ao carregar
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('logado') === 'true') {
        mostrarSiteContent();
    }
});

// Ajuste para mostrar login ao carregar e esconder conteúdo do site
window.onload = function() {
    if (localStorage.getItem('logado') === 'true') {
        mostrarSiteContent();
    } else {
        showLogin();
        if(document.getElementById('site-content')) document.getElementById('site-content').style.display = 'none';
    }
};

// Atualizar lista de remotos ao carregar site (caso já esteja logado)
window.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('site-content') && document.getElementById('site-content').style.display !== 'none') {
        exibirRemotosPublico();
    }
});

// Atualizar lista de serviços ao carregar site (caso já esteja logado)
window.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('site-content') && document.getElementById('site-content').style.display !== 'none') {
        exibirRemotosPublico();
        exibirServicosPublico();
    }
});

// Atualizar lista de avisos ao carregar site
window.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('site-content') && document.getElementById('site-content').style.display !== 'none') {
        exibirAvisosPublico();
        exibirRemotosPublico();
        exibirServicosPublico();
    }
});

// Atualizar lista de servidores ao carregar site
window.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('site-content') && document.getElementById('site-content').style.display !== 'none') {
        exibirAvisosPublico();
        exibirRemotosPublico();
        exibirServicosPublico();
        exibirServidoresPublico();
    }
});

// Atualizar lista de servidores em destaque ao carregar site
window.addEventListener('DOMContentLoaded', function() {
    if(document.getElementById('site-content') && document.getElementById('site-content').style.display !== 'none') {
        exibirAvisosPublico();
        exibirServidorDestaquePublico();
        exibirRemotosPublico();
        exibirServicosPublico();
    }
});

// Função para exibir pedidos do WhatsApp Bot no painel admin
function exibirPedidosWhatsAppBot() {
    const container = document.getElementById('pedidos-whatsapp-container');
    if (!container) return;
    
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const pedidosWhatsApp = pedidos.filter(p => p.origem === 'WhatsApp Bot');
    
    if (pedidosWhatsApp.length === 0) {
        container.innerHTML = '<div style="color:#888;text-align:center;padding:20px;">Nenhum pedido via WhatsApp Bot ainda.</div>';
        return;
    }
    
    let html = `
        <div style="background:#f8f9fa;border-radius:8px;padding:15px;margin-bottom:20px;">
            <h3 style="color:#25D366;margin:0 0 15px 0;">🤖 Pedidos via WhatsApp Bot</h3>
            <div style="display:grid;gap:15px;">
    `;
    
    pedidosWhatsApp.forEach((pedido, index) => {
        const statusColor = pedido.status === 'novo' ? '#25D366' : '#666';
        const statusText = pedido.status === 'novo' ? '🆕 Novo' : '✅ Atendido';
        
        html += `
            <div style="
                background:white;
                border:1px solid #ddd;
                border-radius:8px;
                padding:15px;
                position:relative;
            ">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <span style="font-weight:bold;color:#333;">${pedido.tipo}</span>
                    <span style="color:${statusColor};font-size:12px;">${statusText}</span>
                </div>
                <div style="font-size:14px;color:#666;line-height:1.4;">
                    <p><strong>Cliente:</strong> ${pedido.nomeCliente}</p>
                    <p><strong>WhatsApp:</strong> ${pedido.whatsapp}</p>
                    <p><strong>Anydesk:</strong> ${pedido.anydesk}</p>
                    <p><strong>Modelo:</strong> ${pedido.modelo}</p>
                    <p><strong>Descrição:</strong> ${pedido.descricao}</p>
                    <p><strong>Data:</strong> ${pedido.dataHora}</p>
                </div>
                <div style="margin-top:15px;display:flex;gap:10px;">
                    <button onclick="atenderPedidoWhatsApp(${index})" style="
                        padding:8px 16px;
                        background:#25D366;
                        color:white;
                        border:none;
                        border-radius:5px;
                        cursor:pointer;
                        font-size:12px;
                    ">Atender</button>
                    <button onclick="verDetalhesPedidoWhatsApp(${index})" style="
                        padding:8px 16px;
                        background:#1e90ff;
                        color:white;
                        border:none;
                        border-radius:5px;
                        cursor:pointer;
                        font-size:12px;
                    ">Ver Detalhes</button>
                    <button onclick="excluirPedidoWhatsApp(${index})" style="
                        padding:8px 16px;
                        background:#dc3545;
                        color:white;
                        border:none;
                        border-radius:5px;
                        cursor:pointer;
                        font-size:12px;
                    ">Excluir</button>
                </div>
            </div>
        `;
    });
    
    html += '</div></div>';
    container.innerHTML = html;
}

// Função para atender pedido do WhatsApp Bot
function atenderPedidoWhatsApp(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const pedidosWhatsApp = pedidos.filter(p => p.origem === 'WhatsApp Bot');
    
    if (pedidosWhatsApp[index]) {
        const pedido = pedidosWhatsApp[index];
        const pedidoIndex = pedidos.findIndex(p => p === pedido);
        
        if (pedidoIndex !== -1) {
            pedidos[pedidoIndex].status = 'atendido';
            localStorage.setItem('pedidos', JSON.stringify(pedidos));
            
            // Abrir WhatsApp para contato
            const mensagem = `Olá ${pedido.nomeCliente}! Vim atender seu pedido de ${pedido.tipo}.`;
            const url = `https://wa.me/${pedido.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
            window.open(url, '_blank');
            
            // Atualizar interface
            exibirPedidosWhatsAppBot();
            
            alert('Pedido marcado como atendido! WhatsApp aberto para contato.');
        }
    }
}

// Função para ver detalhes do pedido do WhatsApp Bot
function verDetalhesPedidoWhatsApp(index) {
    const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    const pedidosWhatsApp = pedidos.filter(p => p.origem === 'WhatsApp Bot');
    
    if (pedidosWhatsApp[index]) {
        const pedido = pedidosWhatsApp[index];
        
        const detalhes = `
            <strong>Detalhes do Pedido WhatsApp Bot</strong>
            
            Tipo: ${pedido.tipo}
            Cliente: ${pedido.nomeCliente}
            WhatsApp: ${pedido.whatsapp}
            Anydesk: ${pedido.anydesk}
            Modelo: ${pedido.modelo}
            Descrição: ${pedido.descricao}
            Data: ${pedido.dataHora}
            Status: ${pedido.status}
            Origem: ${pedido.origem}
        `;
        
        alert(detalhes);
    }
}

// Função para excluir pedido do WhatsApp Bot
function excluirPedidoWhatsApp(index) {
    if (confirm('Tem certeza que deseja excluir este pedido?')) {
        const pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
        const pedidosWhatsApp = pedidos.filter(p => p.origem === 'WhatsApp Bot');
        
        if (pedidosWhatsApp[index]) {
            const pedido = pedidosWhatsApp[index];
            const pedidoIndex = pedidos.findIndex(p => p === pedido);
            
            if (pedidoIndex !== -1) {
                pedidos.splice(pedidoIndex, 1);
                localStorage.setItem('pedidos', JSON.stringify(pedidos));
                exibirPedidosWhatsAppBot();
                alert('Pedido excluído com sucesso!');
            }
        }
    }
}

// Modal de pedido
let pedidoAtual = null;
function abrirModalPedido(tipo, idx) {
    pedidoAtual = { tipo, idx };
    document.getElementById('modal-pedido').style.display = 'flex';
    document.getElementById('form-pedido').reset();
}
document.getElementById('cancelar-pedido').onclick = function() {
    document.getElementById('modal-pedido').style.display = 'none';
    pedidoAtual = null;
};
document.getElementById('form-pedido').onsubmit = function(e) {
    e.preventDefault();
    if (!pedidoAtual) return;
    let nomeCliente = document.getElementById('pedido-nome').value.trim();
    let whatsapp = document.getElementById('pedido-whatsapp').value.trim();
    let anydesk = document.getElementById('pedido-anydesk').value.trim();
    let modelo = document.getElementById('pedido-modelo').value.trim();
    let pedidos = JSON.parse(localStorage.getItem('pedidos') || '[]');
    let item = null;
    if (pedidoAtual.tipo === 'remoto') {
        let remotos = JSON.parse(localStorage.getItem('remotos') || '[]');
        item = remotos[pedidoAtual.idx];
    }
    if (!item) return;
    
    let tipoPedido = '';
    if (pedidoAtual.tipo === 'remoto') {
        tipoPedido = 'Remoto';
    }
    
    pedidos.push({
        tipo: tipoPedido,
        nome: item.nome,
        valor: item.valor,
        dataHora: new Date().toLocaleString(),
        nomeCliente,
        whatsapp,
        anydesk,
        modelo
    });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    document.getElementById('modal-pedido').style.display = 'none';
    pedidoAtual = null;
    alert('Pedido realizado com sucesso!');
};
// Atualizar ação dos botões de pedido
function adicionarAcaoPedidoBotoes() {
    // Remotos
    document.querySelectorAll('#cards-remotos-publico .servico-btn').forEach((btn, idx) => {
        btn.onclick = function() {
            abrirModalPedido('remoto', idx);
        };
    });
}

// Função para ativar o bot de WhatsApp
function ativarBotWhatsApp() {
    // Criar modal do bot de WhatsApp
    const modalBot = document.createElement('div');
    modalBot.id = 'modal-bot-whatsapp';
    modalBot.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0,0,0,0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Arial, sans-serif;
    `;
    
    modalBot.innerHTML = `
        <div style="
            background: white;
            border-radius: 20px;
            width: 90vw;
            max-width: 400px;
            max-height: 80vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        ">
            <div style="
                background: #25D366;
                color: white;
                padding: 20px;
                text-align: center;
                font-weight: bold;
                font-size: 18px;
            ">
                🤖 Bot WhatsApp - Server Smart
            </div>
            
            <div id="chat-bot-area" style="
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                max-height: 400px;
                background: #f5f5f5;
            ">
                <div class="bot-message" style="
                    background: #25D366;
                    color: white;
                    padding: 12px 16px;
                    border-radius: 15px;
                    margin-bottom: 10px;
                    max-width: 80%;
                    word-wrap: break-word;
                ">
                    🤖 Olá! Sou o assistente virtual do Server Smart. Como posso ajudá-lo hoje?
                </div>
            </div>
            
            <div style="
                padding: 20px;
                border-top: 1px solid #eee;
                background: white;
            ">
                <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                    <button onclick="botResponder('1')" style="
                        flex: 1;
                        padding: 10px;
                        background: #25D366;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">1️⃣ Suporte</button>
                    <button onclick="botResponder('2')" style="
                        flex: 1;
                        padding: 10px;
                        background: #25D366;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">2️⃣ Pedido</button>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button onclick="botResponder('3')" style="
                        flex: 1;
                        padding: 10px;
                        background: #25D366;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">3️⃣ Problema</button>
                    <button onclick="botResponder('4')" style="
                        flex: 1;
                        padding: 10px;
                        background: #25D366;
                        color: white;
                        border: none;
                        border-radius: 8px;
                        cursor: pointer;
                        font-size: 14px;
                    ">4️⃣ Humano</button>
                </div>
                <button onclick="fecharBotWhatsApp()" style="
                    width: 100%;
                    padding: 10px;
                    background: #666;
                    color: white;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    margin-top: 10px;
                ">❌ Fechar</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modalBot);
    
    // Inicializar estado do bot
    window.botState = {
        estado: 'menu_principal',
        dados: {},
        etapa: null
    };
}

// Função para o bot responder
function botResponder(opcao) {
    const chatArea = document.getElementById('chat-bot-area');
    
    // Adicionar mensagem do usuário
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.style.cssText = `
        background: #1e90ff;
        color: white;
        padding: 12px 16px;
        border-radius: 15px;
        margin-bottom: 10px;
        margin-left: auto;
        max-width: 80%;
        word-wrap: break-word;
        text-align: right;
    `;
    userMessage.textContent = opcao;
    chatArea.appendChild(userMessage);
    
    // Processar resposta do bot
    setTimeout(() => {
        const botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.style.cssText = `
            background: #25D366;
            color: white;
            padding: 12px 16px;
            border-radius: 15px;
            margin-bottom: 10px;
            max-width: 80%;
            word-wrap: break-word;
        `;
        
        if (opcao === '1') {
            botMessage.innerHTML = `📋 <strong>FORMULÁRIO DE SUPORTE</strong><br><br>
            Vou te ajudar a preencher o formulário de suporte. Responda cada pergunta:<br><br>
            <strong>1. Qual é o seu nome completo?</strong>`;
            window.botState = { estado: 'formulario_suporte', dados: {}, etapa: 'nome' };
        } else if (opcao === '2') {
            botMessage.innerHTML = `🛒 <strong>FORMULÁRIO DE PEDIDO</strong><br><br>
            Vou te ajudar a fazer seu pedido. Responda cada pergunta:<br><br>
            <strong>1. Qual é o seu nome completo?</strong>`;
            window.botState = { estado: 'formulario_pedido', dados: {}, etapa: 'nome' };
        } else if (opcao === '3') {
            botMessage.innerHTML = `⚠️ <strong>REPORTAR PROBLEMA</strong><br><br>
            Vou te ajudar a reportar o problema. Responda cada pergunta:<br><br>
            <strong>1. Qual é o seu nome completo?</strong>`;
            window.botState = { estado: 'formulario_problema', dados: {}, etapa: 'nome' };
        } else if (opcao === '4') {
            botMessage.innerHTML = `👨‍💼 <strong>ATENDIMENTO HUMANO</strong><br><br>
            Você será direcionado para um atendente humano em breve.<br><br>
            <strong>Enquanto isso, você pode:</strong><br>
            - Descrever brevemente seu problema<br>
            - Informar se é urgente<br>
            - Deixar seu horário preferido<br><br>
            <strong>Um atendente entrará em contato em até 10 minutos.</strong>`;
            
            // Enviar para WhatsApp real
            const mensagem = encodeURIComponent('Olá! Preciso de atendimento humano. Fui direcionado pelo bot do site.');
            window.open(`https://wa.me/5541996378029?text=${mensagem}`, '_blank');
        }
        
        chatArea.appendChild(botMessage);
        chatArea.scrollTop = chatArea.scrollHeight;
        
        // Se iniciou formulário, mostrar campo de texto
        if (['1', '2', '3'].includes(opcao)) {
            mostrarCampoTexto();
        }
    }, 500);
}

// Função para mostrar campo de texto
function mostrarCampoTexto() {
    const chatArea = document.getElementById('chat-bot-area');
    
    // Remover campo anterior se existir
    const campoAnterior = document.getElementById('campo-texto-bot');
    if (campoAnterior) campoAnterior.remove();
    
    const campoTexto = document.createElement('div');
    campoTexto.id = 'campo-texto-bot';
    campoTexto.style.cssText = `
        margin-top: 10px;
        display: flex;
        gap: 10px;
    `;
    
    campoTexto.innerHTML = `
        <input type="text" id="input-bot" placeholder="Digite sua resposta..." onkeypress="if(event.key==='Enter') enviarRespostaBot()" style="
            flex: 1;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 14px;
        ">
        <button onclick="enviarRespostaBot()" style="
            padding: 10px 20px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
        ">Enviar</button>
    `;
    
    chatArea.appendChild(campoTexto);
    
    // Focar no input
    setTimeout(() => {
        document.getElementById('input-bot').focus();
    }, 100);
}

// Função para enviar resposta do bot
function enviarRespostaBot() {
    const input = document.getElementById('input-bot');
    const resposta = input.value.trim();
    
    if (!resposta) return;
    
    const chatArea = document.getElementById('chat-bot-area');
    
    // Adicionar mensagem do usuário
    const userMessage = document.createElement('div');
    userMessage.className = 'user-message';
    userMessage.style.cssText = `
        background: #1e90ff;
        color: white;
        padding: 12px 16px;
        border-radius: 15px;
        margin-bottom: 10px;
        margin-left: auto;
        max-width: 80%;
        word-wrap: break-word;
        text-align: right;
    `;
    userMessage.textContent = resposta;
    chatArea.appendChild(userMessage);
    
    // Processar resposta baseada no estado atual
    setTimeout(() => {
        processarRespostaFormulario(resposta);
    }, 500);
    
    input.value = '';
}

// Função para processar resposta do formulário
function processarRespostaFormulario(resposta) {
    const chatArea = document.getElementById('chat-bot-area');
    const { estado, dados, etapa } = window.botState;
    
    switch (etapa) {
        case 'nome':
            dados.nome = resposta;
            window.botState.etapa = 'whatsapp';
            adicionarMensagemBot('2. Qual é o seu WhatsApp?');
            break;
            
        case 'whatsapp':
            dados.whatsapp = resposta;
            window.botState.etapa = 'anydesk';
            adicionarMensagemBot('3. Qual é o seu Anydesk?');
            break;
            
        case 'anydesk':
            dados.anydesk = resposta;
            window.botState.etapa = 'modelo';
            adicionarMensagemBot('4. Qual é o modelo do dispositivo?');
            break;
            
        case 'modelo':
            dados.modelo = resposta;
            window.botState.etapa = 'descricao';
            
            let perguntaDescricao = '';
            if (estado === 'formulario_suporte') {
                perguntaDescricao = '5. Descreva o problema ou dúvida:';
            } else if (estado === 'formulario_pedido') {
                perguntaDescricao = '5. Qual serviço você deseja? (GSM, Remoto, Ferramenta)';
            } else if (estado === 'formulario_problema') {
                perguntaDescricao = '5. Descreva o problema detalhadamente:';
            }
            
            adicionarMensagemBot(perguntaDescricao);
            break;
            
        case 'descricao':
            dados.descricao = resposta;
            finalizarFormularioBot(dados, estado);
            break;
    }
}

// Função para adicionar mensagem do bot
function adicionarMensagemBot(mensagem) {
    const chatArea = document.getElementById('chat-bot-area');
    
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.style.cssText = `
        background: #25D366;
        color: white;
        padding: 12px 16px;
        border-radius: 15px;
        margin-bottom: 10px;
        max-width: 80%;
        word-wrap: break-word;
    `;
    botMessage.innerHTML = `<strong>${mensagem}</strong>`;
    
    chatArea.appendChild(botMessage);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Mostrar campo de texto novamente
    setTimeout(() => {
        mostrarCampoTexto();
    }, 100);
}

// Função para finalizar formulário
function finalizarFormularioBot(dados, tipo) {
    const chatArea = document.getElementById('chat-bot-area');
    
    const botMessage = document.createElement('div');
    botMessage.className = 'bot-message';
    botMessage.style.cssText = `
        background: #25D366;
        color: white;
        padding: 12px 16px;
        border-radius: 15px;
        margin-bottom: 10px;
        max-width: 80%;
        word-wrap: break-word;
    `;
    
    botMessage.innerHTML = `✅ <strong>FORMULÁRIO CONCLUÍDO!</strong><br><br>
    <strong>Dados coletados:</strong><br>
    👤 Nome: ${dados.nome}<br>
    📱 WhatsApp: ${dados.whatsapp}<br>
    💻 Anydesk: ${dados.anydesk}<br>
    📱 Modelo: ${dados.modelo}<br>
    📝 Descrição: ${dados.descricao}<br><br>
    <strong>Seu formulário foi enviado para nossa equipe!</strong><br>
    Em breve entraremos em contato.<br><br>
    <strong>Obrigado por escolher Server Smart!</strong> 🚀`;
    
    chatArea.appendChild(botMessage);
    chatArea.scrollTop = chatArea.scrollHeight;
    
    // Salvar dados no localStorage
    const pedido = {
        numero_cliente: 'via_site',
        tipo_formulario: tipo,
        dados: dados,
        timestamp: new Date().toISOString(),
        status: 'novo'
    };
    
    const pedidos = JSON.parse(localStorage.getItem('pedidosWhatsApp') || '[]');
    pedidos.push(pedido);
    localStorage.setItem('pedidosWhatsApp', JSON.stringify(pedidos));
    
    // Enviar para painel admin
    enviarParaPainelAdmin(pedido);
    
    // Remover campo de texto
    const campoTexto = document.getElementById('campo-texto-bot');
    if (campoTexto) campoTexto.remove();
    
    // Adicionar botão para fechar
    setTimeout(() => {
        const botaoFechar = document.createElement('button');
        botaoFechar.textContent = 'Fechar Chat';
        botaoFechar.style.cssText = `
            width: 100%;
            padding: 10px;
            background: #25D366;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            margin-top: 10px;
        `;
        botaoFechar.onclick = fecharBotWhatsApp;
        chatArea.appendChild(botaoFechar);
    }, 2000);
}

// Função para enviar dados para o painel admin
function enviarParaPainelAdmin(pedido) {
    // Adicionar aos pedidos existentes do sistema
    const pedidosExistentes = JSON.parse(localStorage.getItem('pedidos') || '[]');
    
    // Determinar o tipo de pedido baseado no formulário
    let tipoPedido = '';
    let nomeItem = '';
    let valorItem = '';
    
    if (pedido.tipo_formulario === 'formulario_suporte') {
        tipoPedido = 'Suporte via WhatsApp Bot';
        nomeItem = 'Solicitação de Suporte';
        valorItem = '0.00';
    } else if (pedido.tipo_formulario === 'formulario_pedido') {
        tipoPedido = 'Pedido via WhatsApp Bot';
        nomeItem = pedido.dados.descricao || 'Serviço Solicitado';
        valorItem = '0.00';
    } else if (pedido.tipo_formulario === 'formulario_problema') {
        tipoPedido = 'Problema Reportado via WhatsApp Bot';
        nomeItem = 'Problema Reportado';
        valorItem = '0.00';
    }
    
    const novoPedido = {
        tipo: tipoPedido,
        nome: nomeItem,
        valor: valorItem,
        dataHora: new Date().toLocaleString(),
        nomeCliente: pedido.dados.nome,
        whatsapp: pedido.dados.whatsapp,
        anydesk: pedido.dados.anydesk,
        modelo: pedido.dados.modelo,
        descricao: pedido.dados.descricao,
        origem: 'WhatsApp Bot',
        status: 'novo'
    };
    
    pedidosExistentes.push(novoPedido);
    localStorage.setItem('pedidos', JSON.stringify(pedidosExistentes));
    
    // Criar notificação para o admin
    criarNotificacaoAdmin(novoPedido);
    
    console.log('✅ Pedido enviado para painel admin:', novoPedido);
}

// Função para criar notificação para o admin
function criarNotificacaoAdmin(pedido) {
    const notificacoes = JSON.parse(localStorage.getItem('notificacoes') || '[]');
    
    const notificacao = {
        id: Date.now(),
        tipo: 'novo_pedido_whatsapp',
        titulo: '🆕 Novo Pedido via WhatsApp Bot',
        mensagem: `Cliente: ${pedido.nomeCliente}\nTipo: ${pedido.tipo}\nWhatsApp: ${pedido.whatsapp}`,
        dados: pedido,
        timestamp: new Date().toISOString(),
        lida: false
    };
    
    notificacoes.push(notificacao);
    localStorage.setItem('notificacoes', JSON.stringify(notificacoes));
    
    // Mostrar notificação visual se o admin estiver logado
    if (localStorage.getItem('logado') === 'true') {
        mostrarNotificacaoVisual(notificacao);
    }
}

// Função para mostrar notificação visual
function mostrarNotificacaoVisual(notificacao) {
    // Criar notificação toast
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #25D366;
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        max-width: 300px;
        font-family: Arial, sans-serif;
        animation: slideIn 0.3s ease;
    `;
    
    toast.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 5px;">${notificacao.titulo}</div>
        <div style="font-size: 14px;">${notificacao.mensagem}</div>
    `;
    
    document.body.appendChild(toast);
    
    // Remover após 5 segundos
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 5000);
}

// Adicionar estilos CSS para animações
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Função para fechar o bot de WhatsApp
function fecharBotWhatsApp() {
    const modal = document.getElementById('modal-bot-whatsapp');
    if (modal) {
        modal.remove();
    }
}

// Função para abrir painel admin
function abrirPainelAdmin() {
    window.open('admin-painel.html', '_blank');
} 

// Função para cadastrar usuário (NÃO limpa localStorage)
function cadastrarUsuario(usuario) {
    let usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
    if (!usuarios.some(u => u.id === usuario.id)) {
        usuarios.push(usuario);
        localStorage.setItem('usuariosCadastrados', JSON.stringify(usuarios));
    }
}

// Função para registrar presença online (NÃO limpa localStorage)
function registrarAtividadeUsuario(idUsuario) {
    let usuariosOnline = JSON.parse(localStorage.getItem('usuariosOnline') || '[]');
    const idx = usuariosOnline.findIndex(u => u.id === idUsuario);
    if (idx >= 0) {
        usuariosOnline[idx].lastActive = Date.now();
    } else {
        usuariosOnline.push({ id: idUsuario, lastActive: Date.now() });
    }
    localStorage.setItem('usuariosOnline', JSON.stringify(usuariosOnline));
}

// EXEMPLO DE USO (remova ou adapte para seu fluxo real):
// Simula cadastro de usuário ao carregar o site se não houver nenhum
window.addEventListener('DOMContentLoaded', function() {
    let usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
    if (usuarios.length === 0) {
        // Simula um usuário padrão
        cadastrarUsuario({ id: 1, nome: 'Usuário Teste', email: 'teste@exemplo.com' });
    }
    // Simula presença online do usuário 1
    registrarAtividadeUsuario(1);
}); 

// Lógica do formulário de cadastro/login
window.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('form-cadastro-login');
    const msg = document.getElementById('msg-usuario');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const id = parseInt(document.getElementById('id-usuario').value);
            const nome = document.getElementById('nome-usuario').value.trim();
            const email = document.getElementById('email-usuario').value.trim();
            if (!id || !nome || !email) return;
            // Cadastra usuário se não existir
            let usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
            if (!usuarios.some(u => u.id === id)) {
                cadastrarUsuario({ id, nome, email });
            }
            // Registra presença online
            registrarAtividadeUsuario(id);
            msg.textContent = `Bem-vindo(a), ${nome}! Você está online.`;
        });
    }
}); 

// Exibir avisos públicos no topo do site
window.addEventListener('DOMContentLoaded', function() {
    const avisosDiv = document.getElementById('avisos-publicos');
    if (avisosDiv) {
        const avisos = JSON.parse(localStorage.getItem('avisosPublicos') || '[]');
        if (avisos.length > 0) {
            avisosDiv.style.display = 'block';
            avisosDiv.innerHTML = avisos.map(a => `<div style='margin-bottom:6px;'>${a}</div>`).join('');
        } else {
            avisosDiv.style.display = 'none';
        }
    }
}); 

// Exibir Serviços Remotos cadastrados no site público
window.addEventListener('DOMContentLoaded', function() {
    const area = document.getElementById('area-servicos-remotos');
    if (area) {
        const servicos = JSON.parse(localStorage.getItem('servicosRemotos') || '[]');
        if (servicos.length > 0) {
            area.innerHTML = '<h2>Serviços Remotos Disponíveis</h2>' +
                '<div class="servicos-remotos-grid">' +
                servicos.map(s => `
                    <div class="card-servico-remoto">
                        <div class="nome">${s.nome}</div>
                        <div class="valor">Valor: R$ ${parseFloat(s.valor).toFixed(2)}</div>
                    </div>
                `).join('') + '</div>';
        } else {
            area.innerHTML = '<div style="color:#888;font-size:1.08em;text-align:center;">Nenhum serviço remoto cadastrado.</div>';
        }
    }
}); 

// Função para exibir serviços (remotos e GSM)
function exibirTodosServicos() {
    const area = document.getElementById('area-todos-servicos');
    if (area) {
        const servicosRemotos = JSON.parse(localStorage.getItem('servicosRemotos') || '[]');
        const servicosGSM = JSON.parse(localStorage.getItem('servicosGSM') || '[]');
        let html = '';
        if (servicosRemotos.length > 0) {
            html += '<h2>Serviços Remotos Disponíveis</h2>';
            html += '<div class="todos-servicos-grid">' +
                servicosRemotos.map(s => `
                    <div class="card-servico remoto">
                        <div class="card-servico-icone"><i class='fa fa-network-wired'></i></div>
                        <div class="tipo">Remoto</div>
                        <div class="nome">${s.nome}</div>
                        <div class="valor">Valor: R$ ${parseFloat(s.valor).toFixed(2)}</div>
                        ${s.descricao ? `<div class="descricao">${s.descricao}</div>` : ''}
                        <button class="btn-acao">Solicitar Serviço</button>
                    </div>
                `).join('') + '</div>';
        }
        if (servicosGSM.length > 0) {
            html += '<h2>Serviços GSM Disponíveis</h2>';
            html += '<div class="todos-servicos-grid">' +
                servicosGSM.map(s => `
                    <div class="card-servico gsm">
                        <div class="card-servico-icone"><i class='fa fa-mobile-alt'></i></div>
                        <div class="tipo">GSM</div>
                        <div class="nome">${s.nome}</div>
                        <div class="valor">Valor: R$ ${parseFloat(s.valor).toFixed(2)}</div>
                        ${s.descricao ? `<div class="descricao">${s.descricao}</div>` : ''}
                        <button class="btn-acao">Solicitar Serviço</button>
                    </div>
                `).join('') + '</div>';
        }
        if (!servicosRemotos.length && !servicosGSM.length) {
            html = '<div style="color:#888;font-size:1.08em;text-align:center;">Nenhum serviço cadastrado.</div>';
        }
        area.innerHTML = html;
    }
}
// Função para exibir avisos públicos
function exibirAvisosPublicos() {
    const avisosDiv = document.getElementById('avisos-publicos');
    if (avisosDiv) {
        const avisos = JSON.parse(localStorage.getItem('avisosPublicos') || '[]');
        if (avisos.length > 0) {
            avisosDiv.style.display = 'block';
            avisosDiv.innerHTML = avisos.map(a => `<div style='margin-bottom:6px;'>${a}</div>`).join('');
        } else {
            avisosDiv.style.display = 'none';
        }
    }
}
// Atualização global em tempo real
window.addEventListener('DOMContentLoaded', function() {
    exibirTodosServicos();
    exibirAvisosPublicos();
    setInterval(() => {
        exibirTodosServicos();
        exibirAvisosPublicos();
    }, 1000);
}); 

// Função para gerar código único de pedido
function gerarCodigoPedido() {
    return 'P' + Date.now().toString(36) + Math.floor(Math.random()*1000).toString(36);
}

// Modal de Solicitação de Serviço
window.addEventListener('DOMContentLoaded', function() {
    // Abrir modal ao clicar em qualquer botão 'Solicitar Serviço'
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-acao')) {
            const card = e.target.closest('.card-servico');
            const nomeServico = card ? card.querySelector('.nome').textContent : '';
            document.getElementById('servico-nome-modal').value = nomeServico;
            document.getElementById('servico-nome-exibir').textContent = nomeServico;
            document.getElementById('modal-solicitar-servico').style.display = 'flex';
            document.getElementById('msg-pedido-sucesso').style.display = 'none';
            document.getElementById('form-solicitar-servico').reset();
        }
        if (e.target.id === 'fechar-modal-servico') {
            document.getElementById('modal-solicitar-servico').style.display = 'none';
        }
    });
    // Fechar modal ao clicar fora do conteúdo
    document.getElementById('modal-solicitar-servico').addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });
    // Enviar pedido
    document.getElementById('form-solicitar-servico').addEventListener('submit', function(e) {
        e.preventDefault();
        const codigo = gerarCodigoPedido();
        const pedido = {
            codigo,
            servico: document.getElementById('servico-nome-modal').value,
            nome: document.getElementById('nome-solicitante').value.trim(),
            email: document.getElementById('email-solicitante').value.trim(),
            telefone: document.getElementById('tel-solicitante').value.trim(),
            obs: document.getElementById('obs-solicitante').value.trim(),
            data: new Date().toLocaleString('pt-BR'),
            status: 'Pendente',
            resposta: ''
        };
        let pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
        pedidos.push(pedido);
        localStorage.setItem('pedidosServicos', JSON.stringify(pedidos));
        document.getElementById('msg-pedido-sucesso').style.display = 'block';
        document.getElementById('msg-pedido-sucesso').innerHTML = `Pedido enviado com sucesso!<br>Seu código de acompanhamento: <b>${codigo}</b>`;
        setTimeout(() => {
            document.getElementById('modal-solicitar-servico').style.display = 'none';
        }, 3500);
    });
}); 

// Lógica de acompanhamento de pedido
window.addEventListener('DOMContentLoaded', function() {
    const formAcompanhar = document.getElementById('form-acompanhar-pedido');
    const resultado = document.getElementById('resultado-pedido');
    let codigoAtual = '';
    let intervaloAtualizacao = null;
    function exibirPedido(codigo) {
        const pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
        const pedido = pedidos.find(p => p.codigo === codigo);
        if (!pedido) {
            resultado.innerHTML = '<span style="color:#e53935;font-weight:bold;">Pedido não encontrado. Verifique o código digitado.</span>';
            return;
        }
        let statusColor = '#ffb300';
        if (pedido.status === 'Em andamento') statusColor = '#1976d2';
        if (pedido.status === 'Atendido') statusColor = '#43a047';
        resultado.innerHTML = `
            <div style='margin-bottom:10px;'><b>Serviço:</b> ${pedido.servico}</div>
            <div style='margin-bottom:10px;'><b>Status:</b> <span style='color:${statusColor};font-weight:bold;'>${pedido.status || 'Pendente'}</span></div>
            <div style='margin-bottom:10px;'><b>Data do Pedido:</b> ${pedido.data}</div>
            <div style='margin-bottom:10px;'><b>Observação:</b> ${pedido.obs || '-'}</div>
            <div style='margin-bottom:10px;'><b>Resposta do Suporte:</b> <span style='color:#1976d2;'>${pedido.resposta ? pedido.resposta : 'Aguardando resposta...'}</span></div>
        `;
    }
    if (formAcompanhar) {
        formAcompanhar.addEventListener('submit', function(e) {
            e.preventDefault();
            codigoAtual = document.getElementById('codigo-pedido').value.trim();
            exibirPedido(codigoAtual);
            if (intervaloAtualizacao) clearInterval(intervaloAtualizacao);
            intervaloAtualizacao = setInterval(() => {
                if (codigoAtual) exibirPedido(codigoAtual);
            }, 1000);
        });
    }
}); 

// Cadastro e login de usuário (localStorage)
window.addEventListener('DOMContentLoaded', function() {
    const formCadastro = document.getElementById('form-cadastro');
    const formLogin = document.getElementById('form-login');
    const msg = document.getElementById('msg-cadastro-login');
    if (formCadastro) {
        formCadastro.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome-cad').value.trim();
            const email = document.getElementById('email-cad').value.trim();
            const senha = document.getElementById('senha-cad').value;
            let usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
            if (usuarios.some(u => u.email === email)) {
                msg.textContent = 'E-mail já cadastrado!';
                msg.style.color = '#e53935';
                return;
            }
            usuarios.push({ id: Date.now(), nome, email, senha });
            localStorage.setItem('usuariosCadastrados', JSON.stringify(usuarios));
            msg.textContent = 'Cadastro realizado com sucesso! Agora faça login.';
            msg.style.color = '#43a047';
            formCadastro.reset();
        });
    }
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email-login').value.trim();
            const senha = document.getElementById('senha-login').value;
            let usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
            const user = usuarios.find(u => u.email === email && u.senha === senha);
            if (user) {
                msg.textContent = 'Login realizado com sucesso!';
                msg.style.color = '#43a047';
                // Aqui você pode redirecionar ou mostrar área logada
            } else {
                msg.textContent = 'Usuário ou senha inválidos!';
                msg.style.color = '#e53935';
            }
        });
    }
}); 

// Exibir avisos públicos no topo do site
window.addEventListener('DOMContentLoaded', function() {
    const avisosDiv = document.getElementById('avisos-publicos');
    if (avisosDiv) {
        const avisos = JSON.parse(localStorage.getItem('avisosPublicos') || '[]');
        if (avisos.length > 0) {
            avisosDiv.style.display = 'block';
            avisosDiv.innerHTML = avisos.map(a => `<div style='margin-bottom:6px;'>${a}</div>`).join('');
        } else {
            avisosDiv.style.display = 'none';
        }
    }
}); 

// Exibir Serviços Remotos cadastrados no site público
window.addEventListener('DOMContentLoaded', function() {
    const area = document.getElementById('area-servicos-remotos');
    if (area) {
        const servicos = JSON.parse(localStorage.getItem('servicosRemotos') || '[]');
        if (servicos.length > 0) {
            area.innerHTML = '<h2>Serviços Remotos Disponíveis</h2>' +
                '<div class="servicos-remotos-grid">' +
                servicos.map(s => `
                    <div class="card-servico-remoto">
                        <div class="nome">${s.nome}</div>
                        <div class="valor">Valor: R$ ${parseFloat(s.valor).toFixed(2)}</div>
                    </div>
                `).join('') + '</div>';
        } else {
            area.innerHTML = '<div style="color:#888;font-size:1.08em;text-align:center;">Nenhum serviço remoto cadastrado.</div>';
        }
    }
}); 

// Função para exibir serviços (remotos e GSM)
function exibirTodosServicos() {
    const area = document.getElementById('area-todos-servicos');
    if (area) {
        const servicosRemotos = JSON.parse(localStorage.getItem('servicosRemotos') || '[]');
        const servicosGSM = JSON.parse(localStorage.getItem('servicosGSM') || '[]');
        let html = '';
        if (servicosRemotos.length > 0) {
            html += '<h2>Serviços Remotos Disponíveis</h2>';
            html += '<div class="todos-servicos-grid">' +
                servicosRemotos.map(s => `
                    <div class="card-servico remoto">
                        <div class="card-servico-icone"><i class='fa fa-network-wired'></i></div>
                        <div class="tipo">Remoto</div>
                        <div class="nome">${s.nome}</div>
                        <div class="valor">Valor: R$ ${parseFloat(s.valor).toFixed(2)}</div>
                        ${s.descricao ? `<div class="descricao">${s.descricao}</div>` : ''}
                        <button class="btn-acao">Solicitar Serviço</button>
                    </div>
                `).join('') + '</div>';
        }
        if (servicosGSM.length > 0) {
            html += '<h2>Serviços GSM Disponíveis</h2>';
            html += '<div class="todos-servicos-grid">' +
                servicosGSM.map(s => `
                    <div class="card-servico gsm">
                        <div class="card-servico-icone"><i class='fa fa-mobile-alt'></i></div>
                        <div class="tipo">GSM</div>
                        <div class="nome">${s.nome}</div>
                        <div class="valor">Valor: R$ ${parseFloat(s.valor).toFixed(2)}</div>
                        ${s.descricao ? `<div class="descricao">${s.descricao}</div>` : ''}
                        <button class="btn-acao">Solicitar Serviço</button>
                    </div>
                `).join('') + '</div>';
        }
        if (!servicosRemotos.length && !servicosGSM.length) {
            html = '<div style="color:#888;font-size:1.08em;text-align:center;">Nenhum serviço cadastrado.</div>';
        }
        area.innerHTML = html;
    }
}
// Função para exibir avisos públicos
function exibirAvisosPublicos() {
    const avisosDiv = document.getElementById('avisos-publicos');
    if (avisosDiv) {
        const avisos = JSON.parse(localStorage.getItem('avisosPublicos') || '[]');
        if (avisos.length > 0) {
            avisosDiv.style.display = 'block';
            avisosDiv.innerHTML = avisos.map(a => `<div style='margin-bottom:6px;'>${a}</div>`).join('');
        } else {
            avisosDiv.style.display = 'none';
        }
    }
}
// Atualização global em tempo real
window.addEventListener('DOMContentLoaded', function() {
    exibirTodosServicos();
    exibirAvisosPublicos();
    setInterval(() => {
        exibirTodosServicos();
        exibirAvisosPublicos();
    }, 1000);
}); 

// Função para gerar código único de pedido
function gerarCodigoPedido() {
    return 'P' + Date.now().toString(36) + Math.floor(Math.random()*1000).toString(36);
}

// Modal de Solicitação de Serviço
window.addEventListener('DOMContentLoaded', function() {
    // Abrir modal ao clicar em qualquer botão 'Solicitar Serviço'
    document.body.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-acao')) {
            const card = e.target.closest('.card-servico');
            const nomeServico = card ? card.querySelector('.nome').textContent : '';
            document.getElementById('servico-nome-modal').value = nomeServico;
            document.getElementById('servico-nome-exibir').textContent = nomeServico;
            document.getElementById('modal-solicitar-servico').style.display = 'flex';
            document.getElementById('msg-pedido-sucesso').style.display = 'none';
            document.getElementById('form-solicitar-servico').reset();
        }
        if (e.target.id === 'fechar-modal-servico') {
            document.getElementById('modal-solicitar-servico').style.display = 'none';
        }
    });
    // Fechar modal ao clicar fora do conteúdo
    document.getElementById('modal-solicitar-servico').addEventListener('click', function(e) {
        if (e.target === this) this.style.display = 'none';
    });
    // Enviar pedido
    document.getElementById('form-solicitar-servico').addEventListener('submit', function(e) {
        e.preventDefault();
        const codigo = gerarCodigoPedido();
        const pedido = {
            codigo,
            servico: document.getElementById('servico-nome-modal').value,
            nome: document.getElementById('nome-solicitante').value.trim(),
            email: document.getElementById('email-solicitante').value.trim(),
            telefone: document.getElementById('tel-solicitante').value.trim(),
            obs: document.getElementById('obs-solicitante').value.trim(),
            data: new Date().toLocaleString('pt-BR'),
            status: 'Pendente',
            resposta: ''
        };
        let pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
        pedidos.push(pedido);
        localStorage.setItem('pedidosServicos', JSON.stringify(pedidos));
        document.getElementById('msg-pedido-sucesso').style.display = 'block';
        document.getElementById('msg-pedido-sucesso').innerHTML = `Pedido enviado com sucesso!<br>Seu código de acompanhamento: <b>${codigo}</b>`;
        setTimeout(() => {
            document.getElementById('modal-solicitar-servico').style.display = 'none';
        }, 3500);
    });
}); 

// Lógica de acompanhamento de pedido
window.addEventListener('DOMContentLoaded', function() {
    const formAcompanhar = document.getElementById('form-acompanhar-pedido');
    const resultado = document.getElementById('resultado-pedido');
    let codigoAtual = '';
    let intervaloAtualizacao = null;
    function exibirPedido(codigo) {
        const pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
        const pedido = pedidos.find(p => p.codigo === codigo);
        if (!pedido) {
            resultado.innerHTML = '<span style="color:#e53935;font-weight:bold;">Pedido não encontrado. Verifique o código digitado.</span>';
            return;
        }
        let statusColor = '#ffb300';
        if (pedido.status === 'Em andamento') statusColor = '#1976d2';
        if (pedido.status === 'Atendido') statusColor = '#43a047';
        resultado.innerHTML = `
            <div style='margin-bottom:10px;'><b>Serviço:</b> ${pedido.servico}</div>
            <div style='margin-bottom:10px;'><b>Status:</b> <span style='color:${statusColor};font-weight:bold;'>${pedido.status || 'Pendente'}</span></div>
            <div style='margin-bottom:10px;'><b>Data do Pedido:</b> ${pedido.data}</div>
            <div style='margin-bottom:10px;'><b>Observação:</b> ${pedido.obs || '-'}</div>
            <div style='margin-bottom:10px;'><b>Resposta do Suporte:</b> <span style='color:#1976d2;'>${pedido.resposta ? pedido.resposta : 'Aguardando resposta...'}</span></div>
        `;
    }
    if (formAcompanhar) {
        formAcompanhar.addEventListener('submit', function(e) {
            e.preventDefault();
            codigoAtual = document.getElementById('codigo-pedido').value.trim();
            exibirPedido(codigoAtual);
            if (intervaloAtualizacao) clearInterval(intervaloAtualizacao);
            intervaloAtualizacao = setInterval(() => {
                if (codigoAtual) exibirPedido(codigoAtual);
            }, 1000);
        });
    }
}); 

// Área exclusiva do cliente após login
window.addEventListener('DOMContentLoaded', function() {
    const areaCliente = document.getElementById('area-cliente');
    const areaCadastroLogin = document.getElementById('area-cadastro-login');
    const boasVindas = document.getElementById('boas-vindas-cliente');
    const btnSair = document.getElementById('btn-sair');

    function mostrarAreaCliente(usuario) {
        if (areaCliente) areaCliente.style.display = 'block';
        if (areaCadastroLogin) areaCadastroLogin.style.display = 'none';
        if (boasVindas) boasVindas.innerHTML = `Bem-vindo(a), <b>${usuario.nome}</b>!`;
    }
    function esconderAreaCliente() {
        if (areaCliente) areaCliente.style.display = 'none';
        if (areaCadastroLogin) areaCadastroLogin.style.display = 'block';
    }
    // Verifica se já está logado
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado') || 'null');
    if (usuarioLogado) {
        mostrarAreaCliente(usuarioLogado);
    } else {
        esconderAreaCliente();
    }
    // Login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email-login').value.trim();
            const senha = document.getElementById('senha-login').value;
            let usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
            const user = usuarios.find(u => u.email === email && u.senha === senha);
            const msg = document.getElementById('msg-cadastro-login');
            if (user) {
                msg.textContent = 'Login realizado com sucesso!';
                msg.style.color = '#43a047';
                localStorage.setItem('usuarioLogado', JSON.stringify(user));
                mostrarAreaCliente(user);
            } else {
                msg.textContent = 'Usuário ou senha inválidos!';
                msg.style.color = '#e53935';
            }
        });
    }
    // Sair
    if (btnSair) {
        btnSair.addEventListener('click', function() {
            localStorage.removeItem('usuarioLogado');
            esconderAreaCliente();
        });
    }
}); 