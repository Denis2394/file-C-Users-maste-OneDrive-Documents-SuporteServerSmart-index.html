# 🤖 Bot WhatsApp - Server Smart

## 📋 Visão Geral

Este é um robô de WhatsApp inteligente que atende automaticamente os clientes do Server Smart, coleta dados através de formulários e envia as informações para o painel admin.

## ✨ Funcionalidades

### 🤖 **Atendimento Automático**
- Menu interativo com opções numeradas
- Respostas automáticas baseadas em palavras-chave
- Atendimento 24/7

### 📋 **Formulários Inteligentes**
- **Formulário de Suporte**: Para dúvidas e problemas técnicos
- **Formulário de Pedido**: Para solicitar serviços GSM, remotos e ferramentas
- **Reportar Problema**: Para bugs, erros e reclamações

### 📊 **Integração com Admin**
- Envio automático de dados para o painel admin
- Notificações em tempo real
- Histórico completo de atendimentos
- Status de pedidos (Novo, Atendido, Cancelado)

## 🚀 Como Implementar

### 1. **Configuração Inicial**

```bash
# Instalar dependências (se necessário)
npm install whatsapp-web.js
```

### 2. **Configurar API do WhatsApp Business**

Você precisará de uma conta WhatsApp Business API. Opções:

- **WhatsApp Business API** (oficial)
- **Baileys** (biblioteca Node.js)
- **WhatsApp Web JS** (para testes)

### 3. **Configurar Webhook**

```javascript
// Exemplo de webhook para receber mensagens
app.post('/webhook', (req, res) => {
    const { message, from } = req.body;
    
    // Processar mensagem com o bot
    whatsappBot.processarMensagem(from, message.text);
    
    res.status(200).send('OK');
});
```

### 4. **Integrar com Painel Admin**

```javascript
// Adicionar ao seu painel admin
import { WhatsAppAdminIntegration } from './admin-whatsapp-integration.js';

const whatsappAdmin = new WhatsAppAdminIntegration();
```

## 📁 Estrutura de Arquivos

```
📦 WhatsApp Bot
├── 🤖 whatsapp-bot.js          # Bot principal
├── 🧪 whatsapp-bot-test.html   # Página de teste
├── ⚙️ bot-config.json          # Configurações
├── 🔗 admin-whatsapp-integration.js  # Integração admin
└── 📖 README-WHATSAPP-BOT.md   # Esta documentação
```

## 🎯 Fluxo de Atendimento

### **1. Cliente envia mensagem**
```
Cliente: "oi"
Bot: Menu principal com 4 opções
```

### **2. Cliente escolhe opção**
```
Cliente: "1" (Formulário de Suporte)
Bot: Inicia coleta de dados
```

### **3. Coleta de dados**
```
Bot: "Qual é o seu nome completo?"
Cliente: "João Silva"
Bot: "Qual é o seu WhatsApp?"
Cliente: "41996378029"
Bot: "Qual é o seu Anydesk?"
Cliente: "123456789"
Bot: "Qual é o modelo do dispositivo?"
Cliente: "Samsung Galaxy S21"
Bot: "Descreva o problema ou dúvida:"
Cliente: "Preciso de ajuda com FRP"
```

### **4. Finalização e envio**
```
Bot: "✅ FORMULÁRIO CONCLUÍDO!
     Dados coletados:
     👤 Nome: João Silva
     📱 WhatsApp: 41996378029
     💻 Anydesk: 123456789
     📱 Modelo: Samsung Galaxy S21
     📝 Descrição: Preciso de ajuda com FRP
     
     Seu formulário foi enviado para nossa equipe!
     Em breve entraremos em contato."
```

### **5. Notificação para Admin**
```
🔔 NOVO PEDIDO VIA WHATSAPP
Cliente: João Silva
Tipo: formulario_suporte
Status: Novo
```

## ⚙️ Configurações

### **Número do WhatsApp**
```json
{
  "bot": {
    "numero": "5541996378029"
  }
}
```

### **Formulários Personalizáveis**
```json
{
  "formularios": {
    "suporte": {
      "campos": [
        {"nome": "nome", "label": "Nome completo"},
        {"nome": "whatsapp", "label": "WhatsApp"},
        {"nome": "anydesk", "label": "Anydesk"},
        {"nome": "modelo", "label": "Modelo do dispositivo"},
        {"nome": "descricao", "label": "Descreva o problema"}
      ]
    }
  }
}
```

## 🎨 Personalização

### **Cores e Estilo**
```css
.bot-message {
    background: #25D366;  /* Verde WhatsApp */
    color: white;
}

.user-message {
    background: #1e90ff;  /* Azul */
    color: white;
}
```

### **Mensagens Personalizadas**
```json
{
  "respostas": {
    "menu_principal": "🤖 *SUPORTE SERVER SMART*\n\nOlá! Como posso ajudá-lo hoje?",
    "atendimento_humano": "👨‍💼 *ATENDIMENTO HUMANO*\n\nVocê será direcionado para um atendente humano em breve."
  }
}
```

## 📊 Painel Admin

### **Funcionalidades do Admin**
- ✅ Visualizar todos os pedidos
- ✅ Marcar como atendido
- ✅ Ver detalhes completos
- ✅ Excluir pedidos
- ✅ Notificações em tempo real
- ✅ Estatísticas de atendimento

### **Integração com Sistema Existente**
```javascript
// Adicionar ao seu script.js existente
import { WhatsAppAdminIntegration } from './admin-whatsapp-integration.js';

// Inicializar quando o admin estiver logado
if (localStorage.getItem('logado') === 'true') {
    const whatsappAdmin = new WhatsAppAdminIntegration();
}
```

## 🔧 Implementação Técnica

### **1. API do WhatsApp**
```javascript
// Exemplo com Baileys
const { default: makeWASocket, DisconnectReason, useMultiFileAuthState } = require('@adiwajshing/baileys');

const startBot = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
    });
    
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        if (!msg.key.fromMe && msg.message) {
            const from = msg.key.remoteJid;
            const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
            
            // Processar com nosso bot
            await whatsappBot.processarMensagem(from, text);
        }
    });
};
```

### **2. Webhook para Admin**
```javascript
// Enviar dados para admin
async function enviarParaAdmin(pedido) {
    try {
        const response = await fetch('/api/pedidos-whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pedido)
        });
        
        if (response.ok) {
            console.log('✅ Pedido enviado para admin');
        }
    } catch (error) {
        console.error('❌ Erro ao enviar para admin:', error);
    }
}
```

## 🚀 Deploy

### **Opções de Hosting**
1. **Vercel** (recomendado para testes)
2. **Heroku** (para produção)
3. **DigitalOcean** (para controle total)
4. **AWS** (para escala)

### **Variáveis de Ambiente**
```env
WHATSAPP_API_KEY=sua_chave_api
ADMIN_WEBHOOK_URL=https://seu-painel.com/api/webhook
BOT_NUMBER=5541996378029
```

## 📞 Suporte

Para dúvidas sobre implementação:
- 📧 Email: suporte@serversmart.com
- 📱 WhatsApp: 41 99637-8029
- 🌐 Site: https://serversmart.com

## 🔄 Atualizações

### **Versão 1.0**
- ✅ Bot básico funcionando
- ✅ Formulários implementados
- ✅ Integração com admin
- ✅ Notificações em tempo real

### **Próximas Versões**
- 🔄 IA para respostas mais inteligentes
- 🔄 Integração com banco de dados
- 🔄 Analytics de atendimento
- 🔄 Multi-idioma

---

**Desenvolvido para Server Smart** 🚀
*Sistema de atendimento inteligente e automatizado* 