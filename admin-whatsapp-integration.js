// Integração do Bot WhatsApp com Painel Admin
class WhatsAppAdminIntegration {
    constructor() {
        this.pedidosWhatsApp = [];
        this.notificacoes = [];
        this.init();
    }

    init() {
        this.carregarPedidos();
        this.setupNotificacoes();
        this.criarInterfaceAdmin();
    }

    // Carregar pedidos do WhatsApp
    carregarPedidos() {
        this.pedidosWhatsApp = JSON.parse(localStorage.getItem('pedidosWhatsApp') || '[]');
        this.atualizarInterface();
    }

    // Configurar notificações
    setupNotificacoes() {
        // Verificar novos pedidos a cada 30 segundos
        setInterval(() => {
            this.verificarNovosPedidos();
        }, 30000);
    }

    // Verificar novos pedidos
    verificarNovosPedidos() {
        const pedidos = JSON.parse(localStorage.getItem('pedidosWhatsApp') || '[]');
        const novosPedidos = pedidos.filter(p => p.status === 'novo');
        
        if (novosPedidos.length > 0) {
            this.notificarNovosPedidos(novosPedidos);
        }
    }

    // Notificar novos pedidos
    notificarNovosPedidos(pedidos) {
        pedidos.forEach(pedido => {
            this.criarNotificacao(pedido);
        });
    }

    // Criar notificação
    criarNotificacao(pedido) {
        const notificacao = {
            id: Date.now(),
            tipo: 'whatsapp_pedido',
            titulo: `Novo pedido via WhatsApp`,
            mensagem: `Cliente: ${pedido.dados.nome}\nTipo: ${pedido.tipo_formulario}`,
            pedido: pedido,
            timestamp: new Date().toISOString(),
            lida: false
        };

        this.notificacoes.push(notificacao);
        this.salvarNotificacoes();
        this.mostrarNotificacao(notificacao);
    }

    // Mostrar notificação
    mostrarNotificacao(notificacao) {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(notificacao.titulo, {
                body: notificacao.mensagem,
                icon: '/favicon.ico'
            });
        }

        // Adicionar ao painel de notificações
        this.adicionarNotificacaoPainel(notificacao);
    }

    // Adicionar notificação ao painel
    adicionarNotificacaoPainel(notificacao) {
        const container = document.getElementById('notificacoes-container');
        if (!container) return;

        const notifDiv = document.createElement('div');
        notifDiv.className = 'notificacao-item';
        notifDiv.innerHTML = `
            <div class="notificacao-header">
                <span class="notificacao-titulo">${notificacao.titulo}</span>
                <span class="notificacao-tempo">${this.formatarTempo(notificacao.timestamp)}</span>
            </div>
            <div class="notificacao-mensagem">${notificacao.mensagem}</div>
            <div class="notificacao-acoes">
                <button onclick="whatsappAdmin.verPedido(${notificacao.id})">Ver Detalhes</button>
                <button onclick="whatsappAdmin.marcarComoLida(${notificacao.id})">Marcar como Lida</button>
            </div>
        `;

        container.insertBefore(notifDiv, container.firstChild);
    }

    // Criar interface admin
    criarInterfaceAdmin() {
        const adminSection = document.createElement('div');
        adminSection.id = 'whatsapp-admin-section';
        adminSection.innerHTML = `
            <div class="admin-card">
                <h3>🤖 Pedidos WhatsApp</h3>
                <div class="stats-container">
                    <div class="stat-item">
                        <span class="stat-number" id="total-pedidos">0</span>
                        <span class="stat-label">Total</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="novos-pedidos">0</span>
                        <span class="stat-label">Novos</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-number" id="atendidos">0</span>
                        <span class="stat-label">Atendidos</span>
                    </div>
                </div>
                <div id="pedidos-whatsapp-list"></div>
            </div>
            
            <div class="admin-card">
                <h3>🔔 Notificações</h3>
                <div id="notificacoes-container"></div>
            </div>
        `;

        // Adicionar ao painel admin se existir
        const adminContainer = document.querySelector('.admin-content') || document.body;
        adminContainer.appendChild(adminSection);
    }

    // Atualizar interface
    atualizarInterface() {
        this.atualizarEstatisticas();
        this.atualizarListaPedidos();
    }

    // Atualizar estatísticas
    atualizarEstatisticas() {
        const total = this.pedidosWhatsApp.length;
        const novos = this.pedidosWhatsApp.filter(p => p.status === 'novo').length;
        const atendidos = this.pedidosWhatsApp.filter(p => p.status === 'atendido').length;

        const totalEl = document.getElementById('total-pedidos');
        const novosEl = document.getElementById('novos-pedidos');
        const atendidosEl = document.getElementById('atendidos');

        if (totalEl) totalEl.textContent = total;
        if (novosEl) novosEl.textContent = novos;
        if (atendidosEl) atendidosEl.textContent = atendidos;
    }

    // Atualizar lista de pedidos
    atualizarListaPedidos() {
        const container = document.getElementById('pedidos-whatsapp-list');
        if (!container) return;

        container.innerHTML = '';

        this.pedidosWhatsApp.forEach((pedido, index) => {
            const pedidoDiv = document.createElement('div');
            pedidoDiv.className = `pedido-item ${pedido.status}`;
            pedidoDiv.innerHTML = `
                <div class="pedido-header">
                    <span class="pedido-cliente">${pedido.dados.nome}</span>
                    <span class="pedido-status">${this.getStatusLabel(pedido.status)}</span>
                </div>
                <div class="pedido-info">
                    <p><strong>Tipo:</strong> ${pedido.tipo_formulario}</p>
                    <p><strong>WhatsApp:</strong> ${pedido.dados.whatsapp}</p>
                    <p><strong>Anydesk:</strong> ${pedido.dados.anydesk}</p>
                    <p><strong>Modelo:</strong> ${pedido.dados.modelo}</p>
                    <p><strong>Descrição:</strong> ${pedido.dados.descricao}</p>
                    <p><strong>Data:</strong> ${this.formatarData(pedido.timestamp)}</p>
                </div>
                <div class="pedido-acoes">
                    <button onclick="whatsappAdmin.atenderPedido(${index})" class="btn-atender">Atender</button>
                    <button onclick="whatsappAdmin.verDetalhes(${index})" class="btn-detalhes">Ver Detalhes</button>
                    <button onclick="whatsappAdmin.excluirPedido(${index})" class="btn-excluir">Excluir</button>
                </div>
            `;
            container.appendChild(pedidoDiv);
        });
    }

    // Atender pedido
    atenderPedido(index) {
        this.pedidosWhatsApp[index].status = 'atendido';
        this.salvarPedidos();
        this.atualizarInterface();
        
        // Abrir WhatsApp para contato
        const pedido = this.pedidosWhatsApp[index];
        const mensagem = `Olá ${pedido.dados.nome}! Vim atender seu pedido de ${pedido.tipo_formulario}.`;
        const url = `https://wa.me/${pedido.numero_cliente}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }

    // Ver detalhes do pedido
    verDetalhes(index) {
        const pedido = this.pedidosWhatsApp[index];
        const detalhes = `
            <h3>Detalhes do Pedido</h3>
            <p><strong>Cliente:</strong> ${pedido.dados.nome}</p>
            <p><strong>WhatsApp:</strong> ${pedido.dados.whatsapp}</p>
            <p><strong>Anydesk:</strong> ${pedido.dados.anydesk}</p>
            <p><strong>Modelo:</strong> ${pedido.dados.modelo}</p>
            <p><strong>Descrição:</strong> ${pedido.dados.descricao}</p>
            <p><strong>Tipo:</strong> ${pedido.tipo_formulario}</p>
            <p><strong>Data:</strong> ${this.formatarData(pedido.timestamp)}</p>
            <p><strong>Status:</strong> ${this.getStatusLabel(pedido.status)}</p>
        `;
        
        alert(detalhes);
    }

    // Excluir pedido
    excluirPedido(index) {
        if (confirm('Tem certeza que deseja excluir este pedido?')) {
            this.pedidosWhatsApp.splice(index, 1);
            this.salvarPedidos();
            this.atualizarInterface();
        }
    }

    // Ver pedido (da notificação)
    verPedido(notificacaoId) {
        const notificacao = this.notificacoes.find(n => n.id === notificacaoId);
        if (notificacao) {
            this.verDetalhes(this.pedidosWhatsApp.findIndex(p => p.numero_cliente === notificacao.pedido.numero_cliente));
        }
    }

    // Marcar notificação como lida
    marcarComoLida(notificacaoId) {
        const notificacao = this.notificacoes.find(n => n.id === notificacaoId);
        if (notificacao) {
            notificacao.lida = true;
            this.salvarNotificacoes();
        }
    }

    // Utilitários
    getStatusLabel(status) {
        const labels = {
            'novo': '🆕 Novo',
            'atendido': '✅ Atendido',
            'cancelado': '❌ Cancelado'
        };
        return labels[status] || status;
    }

    formatarData(timestamp) {
        return new Date(timestamp).toLocaleString('pt-BR');
    }

    formatarTempo(timestamp) {
        const agora = new Date();
        const tempo = new Date(timestamp);
        const diff = agora - tempo;
        
        if (diff < 60000) return 'Agora mesmo';
        if (diff < 3600000) return `${Math.floor(diff/60000)}m atrás`;
        if (diff < 86400000) return `${Math.floor(diff/3600000)}h atrás`;
        return `${Math.floor(diff/86400000)}d atrás`;
    }

    salvarPedidos() {
        localStorage.setItem('pedidosWhatsApp', JSON.stringify(this.pedidosWhatsApp));
    }

    salvarNotificacoes() {
        localStorage.setItem('notificacoesWhatsApp', JSON.stringify(this.notificacoes));
    }
}

// Inicializar integração
const whatsappAdmin = new WhatsAppAdminIntegration();

// Solicitar permissão para notificações
if ('Notification' in window) {
    Notification.requestPermission();
} 