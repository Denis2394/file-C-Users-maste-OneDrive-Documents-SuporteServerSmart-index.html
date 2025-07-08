// Robô de WhatsApp para Suporte Server Smart
class WhatsAppBot {
    constructor() {
        this.clientes = new Map();
        this.formularios = new Map();
        this.adminPanel = 'https://seu-painel-admin.com/api/pedidos';
    }

    // Inicializar o bot
    async init() {
        console.log('🤖 Bot de WhatsApp iniciado');
        this.setupWebhook();
        this.criarFormularios();
    }

    // Configurar webhook para receber mensagens
    setupWebhook() {
        // Aqui você conectaria com a API do WhatsApp Business
        // Por enquanto, simularemos as respostas
        this.respostasAutomaticas = {
            'oi': this.menuPrincipal.bind(this),
            'olá': this.menuPrincipal.bind(this),
            'oi!': this.menuPrincipal.bind(this),
            'olá!': this.menuPrincipal.bind(this),
            'menu': this.menuPrincipal.bind(this),
            'ajuda': this.menuPrincipal.bind(this),
            'suporte': this.menuPrincipal.bind(this),
            '1': this.formularioSuporte.bind(this),
            '2': this.formularioPedido.bind(this),
            '3': this.formularioProblema.bind(this),
            '4': this.falarHumano.bind(this),
            'voltar': this.menuPrincipal.bind(this),
            'cancelar': this.menuPrincipal.bind(this)
        };
    }

    // Menu principal do bot
    menuPrincipal(numero) {
        const menu = `🤖 *SUPORTE SERVER SMART*

Olá! Sou o assistente virtual do Server Smart. Como posso ajudá-lo hoje?

*Escolha uma opção:*

1️⃣ *Formulário de Suporte*
   - Solicitar suporte técnico
   - Reportar problemas
   - Dúvidas sobre serviços

2️⃣ *Fazer Pedido*
   - Solicitar serviços GSM
   - Pedir remotos
   - Alugar ferramentas

3️⃣ *Reportar Problema*
   - Problemas com serviços
   - Bugs ou erros
   - Reclamações

4️⃣ *Falar com Humano*
   - Atendimento personalizado
   - Emergências

*Digite o número da opção desejada*`;

        this.enviarMensagem(numero, menu);
        this.clientes.set(numero, { estado: 'menu_principal' });
    }

    // Formulário de Suporte
    formularioSuporte(numero) {
        const formulario = `📋 *FORMULÁRIO DE SUPORTE*

Vou te ajudar a preencher o formulário de suporte. Responda cada pergunta:

*1. Qual é o seu nome completo?*`;

        this.enviarMensagem(numero, formulario);
        this.clientes.set(numero, { 
            estado: 'formulario_suporte',
            dados: {},
            etapa: 'nome'
        });
    }

    // Formulário de Pedido
    formularioPedido(numero) {
        const formulario = `🛒 *FORMULÁRIO DE PEDIDO*

Vou te ajudar a fazer seu pedido. Responda cada pergunta:

*1. Qual é o seu nome completo?*`;

        this.enviarMensagem(numero, formulario);
        this.clientes.set(numero, { 
            estado: 'formulario_pedido',
            dados: {},
            etapa: 'nome'
        });
    }

    // Formulário de Problema
    formularioProblema(numero) {
        const formulario = `⚠️ *REPORTAR PROBLEMA*

Vou te ajudar a reportar o problema. Responda cada pergunta:

*1. Qual é o seu nome completo?*`;

        this.enviarMensagem(numero, formulario);
        this.clientes.set(numero, { 
            estado: 'formulario_problema',
            dados: {},
            etapa: 'nome'
        });
    }

    // Falar com humano
    falarHumano(numero) {
        const mensagem = `👨‍💼 *ATENDIMENTO HUMANO*

Você será direcionado para um atendente humano em breve.

*Enquanto isso, você pode:*
- Descrever brevemente seu problema
- Informar se é urgente
- Deixar seu horário preferido

*Um atendente entrará em contato em até 10 minutos.*`;

        this.enviarMensagem(numero, mensagem);
        this.notificarAdmin(numero, 'SOLICITAÇÃO_ATENDIMENTO_HUMANO', {
            numero: numero,
            tipo: 'atendimento_humano',
            timestamp: new Date().toISOString()
        });
    }

    // Processar mensagem recebida
    async processarMensagem(numero, mensagem) {
        const cliente = this.clientes.get(numero) || { estado: 'menu_principal' };
        
        // Se é uma resposta de formulário
        if (cliente.estado.includes('formulario')) {
            return this.processarFormulario(numero, mensagem, cliente);
        }

        // Se é uma opção do menu
        const resposta = this.respostasAutomaticas[mensagem.toLowerCase()];
        if (resposta) {
            resposta(numero);
            return;
        }

        // Resposta padrão
        this.menuPrincipal(numero);
    }

    // Processar respostas do formulário
    async processarFormulario(numero, mensagem, cliente) {
        const { estado, dados, etapa } = cliente;

        switch (etapa) {
            case 'nome':
                dados.nome = mensagem;
                cliente.etapa = 'whatsapp';
                this.enviarMensagem(numero, '*2. Qual é o seu WhatsApp?*');
                break;

            case 'whatsapp':
                dados.whatsapp = mensagem;
                cliente.etapa = 'anydesk';
                this.enviarMensagem(numero, '*3. Qual é o seu Anydesk?*');
                break;

            case 'anydesk':
                dados.anydesk = mensagem;
                cliente.etapa = 'modelo';
                this.enviarMensagem(numero, '*4. Qual é o modelo do dispositivo?*');
                break;

            case 'modelo':
                dados.modelo = mensagem;
                cliente.etapa = 'descricao';
                
                let perguntaDescricao = '';
                if (estado === 'formulario_suporte') {
                    perguntaDescricao = '*5. Descreva o problema ou dúvida:*';
                } else if (estado === 'formulario_pedido') {
                    perguntaDescricao = '*5. Qual serviço você deseja? (GSM, Remoto, Ferramenta)*';
                } else if (estado === 'formulario_problema') {
                    perguntaDescricao = '*5. Descreva o problema detalhadamente:*';
                }
                
                this.enviarMensagem(numero, perguntaDescricao);
                break;

            case 'descricao':
                dados.descricao = mensagem;
                cliente.etapa = 'finalizar';
                
                // Finalizar formulário
                await this.finalizarFormulario(numero, dados, estado);
                break;
        }

        this.clientes.set(numero, cliente);
    }

    // Finalizar formulário e enviar para admin
    async finalizarFormulario(numero, dados, tipo) {
        const confirmacao = `✅ *FORMULÁRIO CONCLUÍDO!*

*Dados coletados:*
👤 Nome: ${dados.nome}
📱 WhatsApp: ${dados.whatsapp}
💻 Anydesk: ${dados.anydesk}
📱 Modelo: ${dados.modelo}
📝 Descrição: ${dados.descricao}

*Seu formulário foi enviado para nossa equipe!*
Em breve entraremos em contato.

*Obrigado por escolher Server Smart!* 🚀`;

        this.enviarMensagem(numero, confirmacao);

        // Enviar dados para o painel admin
        await this.enviarParaAdmin(numero, dados, tipo);

        // Limpar dados do cliente
        this.clientes.delete(numero);
    }

    // Enviar dados para o painel admin
    async enviarParaAdmin(numero, dados, tipo) {
        const pedido = {
            numero_cliente: numero,
            tipo_formulario: tipo,
            dados: dados,
            timestamp: new Date().toISOString(),
            status: 'novo'
        };

        try {
            // Aqui você enviaria para seu painel admin
            console.log('📤 Enviando para admin:', pedido);
            
            // Simular envio para localStorage (para demonstração)
            const pedidos = JSON.parse(localStorage.getItem('pedidosWhatsApp') || '[]');
            pedidos.push(pedido);
            localStorage.setItem('pedidosWhatsApp', JSON.stringify(pedidos));
            
            // Notificar admin via webhook
            await this.notificarAdmin(numero, tipo, pedido);
            
        } catch (error) {
            console.error('❌ Erro ao enviar para admin:', error);
        }
    }

    // Notificar admin
    async notificarAdmin(numero, tipo, dados) {
        const notificacao = {
            numero: numero,
            tipo: tipo,
            dados: dados,
            timestamp: new Date().toISOString()
        };

        // Aqui você implementaria a notificação real para o admin
        console.log('🔔 Notificação para admin:', notificacao);
    }

    // Enviar mensagem (simulado)
    enviarMensagem(numero, mensagem) {
        console.log(`📱 Enviando para ${numero}:`, mensagem);
        // Aqui você implementaria o envio real via API do WhatsApp
    }

    // Criar formulários
    criarFormularios() {
        this.formularios.set('suporte', {
            titulo: 'Formulário de Suporte',
            campos: ['nome', 'whatsapp', 'anydesk', 'modelo', 'descricao']
        });

        this.formularios.set('pedido', {
            titulo: 'Formulário de Pedido',
            campos: ['nome', 'whatsapp', 'anydesk', 'modelo', 'servico']
        });

        this.formularios.set('problema', {
            titulo: 'Reportar Problema',
            campos: ['nome', 'whatsapp', 'anydesk', 'modelo', 'descricao']
        });
    }
}

// Inicializar o bot
const bot = new WhatsAppBot();
bot.init();

// Exportar para uso global
window.WhatsAppBot = bot; 