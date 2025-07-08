// Navegação entre abas e submenus do painel admin
window.addEventListener('DOMContentLoaded', function() {
    // Seletores principais
    const menuItems = document.querySelectorAll('.menu-item');
    const submenuItems = document.querySelectorAll('.submenu-item');
    const sections = document.querySelectorAll('.section');

    // Função para remover classe 'active' de todos os itens
    function clearActiveMenu() {
        menuItems.forEach(item => item.classList.remove('active'));
        submenuItems.forEach(item => item.classList.remove('active'));
    }

    // Função para mostrar a seção correta
    function showSection(sectionId) {
        sections.forEach(sec => sec.classList.remove('active'));
        const section = document.getElementById(sectionId);
        if (section) section.classList.add('active');
    }

    // Clique em menu principal
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Se for submenu, alterna open
            if (item.classList.contains('has-submenu')) {
                item.classList.toggle('open');
                return;
            }
            clearActiveMenu();
            item.classList.add('active');
            showSection(item.getAttribute('data-section'));
        });
    });

    // Clique em submenu
    submenuItems.forEach(sub => {
        sub.addEventListener('click', function(e) {
            e.stopPropagation();
            clearActiveMenu();
            sub.classList.add('active');
            // Marca o menu principal como ativo
            let parentMenu = sub.closest('.menu-item');
            if (parentMenu) parentMenu.classList.add('active');
            showSection(sub.getAttribute('data-section'));
        });
    });

    // Exibe a seção inicial
    showSection('home');

    // Cadastro e listagem de servidores
    const formServidor = document.getElementById('form-servidor');
    const tabelaServidores = document.querySelector('#tabela-servidores tbody');

    function carregarServidores() {
        if (!tabelaServidores) return;
        tabelaServidores.innerHTML = '';
        const servidores = JSON.parse(localStorage.getItem('servidoresCadastrados') || '[]');
        servidores.forEach((srv, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${idx+1}</td><td>${srv.nome}</td><td>${srv.endereco}</td><td>${srv.obs || ''}</td>`;
            tabelaServidores.appendChild(tr);
        });
    }

    if (formServidor) {
        formServidor.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome-servidor').value.trim();
            const endereco = document.getElementById('endereco-servidor').value.trim();
            const obs = document.getElementById('obs-servidor').value.trim();
            if (!nome || !endereco) return;
            const servidores = JSON.parse(localStorage.getItem('servidoresCadastrados') || '[]');
            servidores.push({ nome, endereco, obs });
            localStorage.setItem('servidoresCadastrados', JSON.stringify(servidores));
            formServidor.reset();
            carregarServidores();
            alert('Servidor cadastrado com sucesso!');
        });
    }

    carregarServidores();

    // Cadastro e listagem de serviços em 'Cadastrar Remoto'
    const formServicoRemoto = document.getElementById('form-servico-remoto');
    const tabelaServicosRemoto = document.querySelector('#tabela-servicos-remoto tbody');

    // Função utilitária para criar botão
    function criarBotao(text, classe, idx) {
        const btn = document.createElement('button');
        btn.textContent = text;
        btn.className = classe;
        btn.setAttribute('data-idx', idx);
        return btn;
    }

    // --- Serviços Remotos ---
    function carregarServicosRemoto() {
        if (!tabelaServicosRemoto) return;
        tabelaServicosRemoto.innerHTML = '';
        const servicos = JSON.parse(localStorage.getItem('servicosRemotos') || '[]');
        servicos.forEach((srv, idx) => {
            const tr = document.createElement('tr');
            if (srv.editando) {
                tr.innerHTML = `<td>${idx+1}</td>` +
                    `<td><input type='text' value='${srv.nome}' class='input-edit-nome'></td>` +
                    `<td><input type='number' value='${srv.valor}' class='input-edit-valor' min='0' step='0.01'></td>` +
                    `<td></td>`;
                const tdAcoes = tr.querySelector('td:last-child');
                const btnSalvar = criarBotao('Salvar', 'btn-salvar', idx);
                const btnCancelar = criarBotao('Cancelar', 'btn-cancelar', idx);
                tdAcoes.appendChild(btnSalvar);
                tdAcoes.appendChild(btnCancelar);
            } else {
                tr.innerHTML = `<td>${idx+1}</td><td>${srv.nome}</td><td>R$ ${parseFloat(srv.valor).toFixed(2)}</td>` +
                    `<td>
                        <button class='btn-editar' data-idx='${idx}'>Editar</button>
                        <button class='btn-excluir' data-idx='${idx}'>Excluir</button>
                    </td>`;
            }
            tabelaServicosRemoto.appendChild(tr);
        });

        // Excluir
        tabelaServicosRemoto.querySelectorAll('.btn-excluir').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                servicos.splice(idx, 1);
                localStorage.setItem('servicosRemotos', JSON.stringify(servicos));
                carregarServicosRemoto();
            });
        });
        // Editar
        tabelaServicosRemoto.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', function() {
                servicos.forEach(s => delete s.editando);
                const idx = parseInt(this.getAttribute('data-idx'));
                servicos[idx].editando = true;
                localStorage.setItem('servicosRemotos', JSON.stringify(servicos));
                carregarServicosRemoto();
            });
        });
        // Salvar
        tabelaServicosRemoto.querySelectorAll('.btn-salvar').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const tr = btn.closest('tr');
                const novoNome = tr.querySelector('.input-edit-nome').value.trim();
                const novoValor = tr.querySelector('.input-edit-valor').value.trim();
                servicos[idx].nome = novoNome;
                servicos[idx].valor = novoValor;
                delete servicos[idx].editando;
                localStorage.setItem('servicosRemotos', JSON.stringify(servicos));
                carregarServicosRemoto();
            });
        });
        // Cancelar
        tabelaServicosRemoto.querySelectorAll('.btn-cancelar').forEach(btn => {
            btn.addEventListener('click', function() {
                servicos.forEach(s => delete s.editando);
                localStorage.setItem('servicosRemotos', JSON.stringify(servicos));
                carregarServicosRemoto();
            });
        });
    }

    if (formServicoRemoto) {
        formServicoRemoto.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome-servico-remoto').value.trim();
            const valor = document.getElementById('valor-servico-remoto').value.trim();
            if (!nome || !valor) return;
            const servicos = JSON.parse(localStorage.getItem('servicosRemotos') || '[]');
            servicos.push({ nome, valor });
            localStorage.setItem('servicosRemotos', JSON.stringify(servicos));
            formServicoRemoto.reset();
            carregarServicosRemoto();
            alert('Serviço cadastrado com sucesso!');
        });
    }

    carregarServicosRemoto();

    // Cadastro e listagem de Serviços GSM
    const formServicoGSM = document.getElementById('form-servico-gsm');
    const tabelaServicosGSM = document.querySelector('#tabela-servicos-gsm tbody');

    // --- Serviços GSM ---
    function carregarServicosGSM() {
        if (!tabelaServicosGSM) return;
        tabelaServicosGSM.innerHTML = '';
        const servicos = JSON.parse(localStorage.getItem('servicosGSM') || '[]');
        servicos.forEach((srv, idx) => {
            const tr = document.createElement('tr');
            if (srv.editando) {
                tr.innerHTML = `<td>${idx+1}</td>` +
                    `<td><input type='text' value='${srv.nome}' class='input-edit-nome'></td>` +
                    `<td><input type='number' value='${srv.valor}' class='input-edit-valor' min='0' step='0.01'></td>` +
                    `<td></td>`;
                const tdAcoes = tr.querySelector('td:last-child');
                const btnSalvar = criarBotao('Salvar', 'btn-salvar-gsm', idx);
                const btnCancelar = criarBotao('Cancelar', 'btn-cancelar-gsm', idx);
                tdAcoes.appendChild(btnSalvar);
                tdAcoes.appendChild(btnCancelar);
            } else {
                tr.innerHTML = `<td>${idx+1}</td><td>${srv.nome}</td><td>R$ ${parseFloat(srv.valor).toFixed(2)}</td>` +
                    `<td>
                        <button class='btn-editar-gsm' data-idx='${idx}'>Editar</button>
                        <button class='btn-excluir-gsm' data-idx='${idx}'>Excluir</button>
                    </td>`;
            }
            tabelaServicosGSM.appendChild(tr);
        });
        // Excluir
        tabelaServicosGSM.querySelectorAll('.btn-excluir-gsm').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                servicos.splice(idx, 1);
                localStorage.setItem('servicosGSM', JSON.stringify(servicos));
                carregarServicosGSM();
            });
        });
        // Editar
        tabelaServicosGSM.querySelectorAll('.btn-editar-gsm').forEach(btn => {
            btn.addEventListener('click', function() {
                servicos.forEach(s => delete s.editando);
                const idx = parseInt(this.getAttribute('data-idx'));
                servicos[idx].editando = true;
                localStorage.setItem('servicosGSM', JSON.stringify(servicos));
                carregarServicosGSM();
            });
        });
        // Salvar
        tabelaServicosGSM.querySelectorAll('.btn-salvar-gsm').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const tr = btn.closest('tr');
                const novoNome = tr.querySelector('.input-edit-nome').value.trim();
                const novoValor = tr.querySelector('.input-edit-valor').value.trim();
                servicos[idx].nome = novoNome;
                servicos[idx].valor = novoValor;
                delete servicos[idx].editando;
                localStorage.setItem('servicosGSM', JSON.stringify(servicos));
                carregarServicosGSM();
            });
        });
        // Cancelar
        tabelaServicosGSM.querySelectorAll('.btn-cancelar-gsm').forEach(btn => {
            btn.addEventListener('click', function() {
                servicos.forEach(s => delete s.editando);
                localStorage.setItem('servicosGSM', JSON.stringify(servicos));
                carregarServicosGSM();
            });
        });
    }

    if (formServicoGSM) {
        formServicoGSM.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome-servico-gsm').value.trim();
            const valor = document.getElementById('valor-servico-gsm').value.trim();
            if (!nome || !valor) return;
            const servicos = JSON.parse(localStorage.getItem('servicosGSM') || '[]');
            servicos.push({ nome, valor });
            localStorage.setItem('servicosGSM', JSON.stringify(servicos));
            formServicoGSM.reset();
            carregarServicosGSM();
            alert('Serviço GSM cadastrado com sucesso!');
        });
    }

    carregarServicosGSM();

    // Cadastro e listagem de Revendas
    const formRevenda = document.getElementById('form-revenda');
    const tabelaRevendas = document.querySelector('#tabela-revendas tbody');

    // --- Revendas ---
    function carregarRevendas() {
        if (!tabelaRevendas) return;
        tabelaRevendas.innerHTML = '';
        const revendas = JSON.parse(localStorage.getItem('revendasCadastradas') || '[]');
        revendas.forEach((rev, idx) => {
            const tr = document.createElement('tr');
            if (rev.editando) {
                tr.innerHTML = `<td>${idx+1}</td>` +
                    `<td><input type='text' value='${rev.nome}' class='input-edit-nome'></td>` +
                    `<td><input type='text' value='${rev.contato}' class='input-edit-contato'></td>` +
                    `<td><input type='text' value='${rev.obs || ''}' class='input-edit-obs'></td>` +
                    `<td></td>`;
                const tdAcoes = tr.querySelector('td:last-child');
                const btnSalvar = criarBotao('Salvar', 'btn-salvar-revenda', idx);
                const btnCancelar = criarBotao('Cancelar', 'btn-cancelar-revenda', idx);
                tdAcoes.appendChild(btnSalvar);
                tdAcoes.appendChild(btnCancelar);
            } else {
                tr.innerHTML = `<td>${idx+1}</td><td>${rev.nome}</td><td>${rev.contato}</td><td>${rev.obs || ''}</td>` +
                    `<td>
                        <button class='btn-editar-revenda' data-idx='${idx}'>Editar</button>
                        <button class='btn-excluir-revenda' data-idx='${idx}'>Excluir</button>
                    </td>`;
            }
            tabelaRevendas.appendChild(tr);
        });
        // Excluir
        tabelaRevendas.querySelectorAll('.btn-excluir-revenda').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                revendas.splice(idx, 1);
                localStorage.setItem('revendasCadastradas', JSON.stringify(revendas));
                carregarRevendas();
            });
        });
        // Editar
        tabelaRevendas.querySelectorAll('.btn-editar-revenda').forEach(btn => {
            btn.addEventListener('click', function() {
                revendas.forEach(r => delete r.editando);
                const idx = parseInt(this.getAttribute('data-idx'));
                revendas[idx].editando = true;
                localStorage.setItem('revendasCadastradas', JSON.stringify(revendas));
                carregarRevendas();
            });
        });
        // Salvar
        tabelaRevendas.querySelectorAll('.btn-salvar-revenda').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const tr = btn.closest('tr');
                const novoNome = tr.querySelector('.input-edit-nome').value.trim();
                const novoContato = tr.querySelector('.input-edit-contato').value.trim();
                const novaObs = tr.querySelector('.input-edit-obs').value.trim();
                revendas[idx].nome = novoNome;
                revendas[idx].contato = novoContato;
                revendas[idx].obs = novaObs;
                delete revendas[idx].editando;
                localStorage.setItem('revendasCadastradas', JSON.stringify(revendas));
                carregarRevendas();
            });
        });
        // Cancelar
        tabelaRevendas.querySelectorAll('.btn-cancelar-revenda').forEach(btn => {
            btn.addEventListener('click', function() {
                revendas.forEach(r => delete r.editando);
                localStorage.setItem('revendasCadastradas', JSON.stringify(revendas));
                carregarRevendas();
            });
        });
    }

    if (formRevenda) {
        formRevenda.addEventListener('submit', function(e) {
            e.preventDefault();
            const nome = document.getElementById('nome-revenda').value.trim();
            const contato = document.getElementById('contato-revenda').value.trim();
            const obs = document.getElementById('obs-revenda').value.trim();
            if (!nome || !contato) return;
            const revendas = JSON.parse(localStorage.getItem('revendasCadastradas') || '[]');
            revendas.push({ nome, contato, obs });
            localStorage.setItem('revendasCadastradas', JSON.stringify(revendas));
            formRevenda.reset();
            carregarRevendas();
            alert('Revenda cadastrada com sucesso!');
        });
    }

    carregarRevendas();

    // Gerenciamento de Avisos
    const formAviso = document.getElementById('form-aviso');
    const listaAvisos = document.getElementById('lista-avisos');

    function carregarAvisos() {
        if (!listaAvisos) return;
        listaAvisos.innerHTML = '';
        const avisos = JSON.parse(localStorage.getItem('avisosPublicos') || '[]');
        avisos.forEach((aviso, idx) => {
            const li = document.createElement('li');
            li.textContent = aviso;
            const btn = document.createElement('button');
            btn.textContent = 'Excluir';
            btn.className = 'btn-excluir-aviso';
            btn.style.marginLeft = '12px';
            btn.style.background = '#e53935';
            btn.style.color = '#fff';
            btn.style.border = 'none';
            btn.style.padding = '4px 12px';
            btn.style.borderRadius = '4px';
            btn.style.cursor = 'pointer';
            btn.addEventListener('click', function() {
                avisos.splice(idx, 1);
                localStorage.setItem('avisosPublicos', JSON.stringify(avisos));
                carregarAvisos();
            });
            li.appendChild(btn);
            listaAvisos.appendChild(li);
        });
    }

    if (formAviso) {
        formAviso.addEventListener('submit', function(e) {
            e.preventDefault();
            const texto = document.getElementById('texto-aviso').value.trim();
            if (!texto) return;
            const avisos = JSON.parse(localStorage.getItem('avisosPublicos') || '[]');
            avisos.push(texto);
            localStorage.setItem('avisosPublicos', JSON.stringify(avisos));
            formAviso.reset();
            carregarAvisos();
        });
    }

    carregarAvisos();

    // Listagem de Pedidos de Serviços
    const tabelaPedidos = document.querySelector('#tabela-pedidos-servicos tbody');
    // Busca/filtro de pedidos
    const buscaPedidos = document.getElementById('busca-pedidos');
    let filtroPedidos = '';
    if (buscaPedidos) {
        buscaPedidos.addEventListener('input', function() {
            filtroPedidos = this.value.toLowerCase();
            carregarPedidosServicos();
        });
    }

    function carregarPedidosServicos() {
        if (!tabelaPedidos) return;
        tabelaPedidos.innerHTML = '';
        let pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
        // Filtro
        if (filtroPedidos && filtroPedidos.length > 0) {
            pedidos = pedidos.filter(p =>
                (p.nome && p.nome.toLowerCase().includes(filtroPedidos)) ||
                (p.servico && p.servico.toLowerCase().includes(filtroPedidos)) ||
                (p.data && p.data.toLowerCase().includes(filtroPedidos))
            );
        }
        pedidos.forEach((p, idx) => {
            const status = p.status || 'Pendente';
            let statusColor = '#ffb300';
            if (status === 'Em andamento') statusColor = '#1976d2';
            if (status === 'Atendido') statusColor = '#43a047';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${p.codigo || '-'}</td>
                <td>${p.data || ''}</td>
                <td>${p.servico || ''}</td>
                <td>${p.nome || ''}</td>
                <td>${p.email || ''}</td>
                <td>${p.telefone || ''}</td>
                <td>${p.obs || ''}</td>
                <td><span style="font-weight:bold;color:${statusColor};">${status}</span></td>
                <td style="min-width:180px;">
                    <button class='btn-status-pedido' data-idx='${idx}' data-status='Em andamento' style='background:#1976d2;color:#fff;border:none;padding:4px 10px;border-radius:4px;margin-right:4px;cursor:pointer;'>Em andamento</button>
                    <button class='btn-status-pedido' data-idx='${idx}' data-status='Atendido' style='background:#43a047;color:#fff;border:none;padding:4px 10px;border-radius:4px;margin-right:4px;cursor:pointer;'>Atendido</button>
                    <button class='btn-excluir-pedido' data-idx='${idx}'>Excluir</button>
                    <form class='form-resposta-pedido' data-idx='${idx}' style='margin-top:8px;display:flex;gap:4px;'>
                        <input type='text' class='input-resposta' placeholder='Mensagem ao cliente...' value="${p.resposta || ''}" style='flex:1;padding:4px 8px;border-radius:4px;border:1px solid #b0bec5;font-size:0.97em;'>
                        <button type='submit' style='background:#1976d2;color:#fff;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;'>Enviar</button>
                    </form>
                </td>
            `;
            tabelaPedidos.appendChild(tr);
        });
        tabelaPedidos.querySelectorAll('.btn-status-pedido').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const novoStatus = this.getAttribute('data-status');
                const pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
                pedidos[idx].status = novoStatus;
                localStorage.setItem('pedidosServicos', JSON.stringify(pedidos));
                carregarPedidosServicos();
            });
        });
        tabelaPedidos.querySelectorAll('.btn-excluir-pedido').forEach(btn => {
            btn.addEventListener('click', function() {
                const idx = parseInt(this.getAttribute('data-idx'));
                const pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
                pedidos.splice(idx, 1);
                localStorage.setItem('pedidosServicos', JSON.stringify(pedidos));
                carregarPedidosServicos();
            });
        });
        // Responder ao cliente
        tabelaPedidos.querySelectorAll('.form-resposta-pedido').forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const idx = parseInt(this.getAttribute('data-idx'));
                const resposta = this.querySelector('.input-resposta').value.trim();
                const pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
                pedidos[idx].resposta = resposta;
                localStorage.setItem('pedidosServicos', JSON.stringify(pedidos));
                carregarPedidosServicos();
            });
        });
    }
    carregarPedidosServicos();

    // Notificação visual de novos pedidos
    let ultimoTotalNovos = 0;
    function atualizarBadgePedidos() {
        const badge = document.getElementById('badge-pedidos');
        let pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
        let visualizados = JSON.parse(localStorage.getItem('pedidosVisualizados') || '[]');
        // Considera como novo se não estiver no array de visualizados (usa data+nome+serviço como chave)
        const novos = pedidos.filter(p => !visualizados.includes(p.data + p.nome + p.servico));
        if (novos.length > 0) {
            badge.style.display = 'inline-block';
            badge.textContent = novos.length;
            // Emitir som apenas se aumentou o número de novos pedidos
            if (novos.length > ultimoTotalNovos) {
                const audio = document.getElementById('audio-notificacao');
                if (audio) { audio.currentTime = 0; audio.play(); }
            }
        } else {
            badge.style.display = 'none';
        }
        ultimoTotalNovos = novos.length;
    }
    atualizarBadgePedidos();

    // Marca todos como visualizados ao acessar a aba
    const menuPedidos = document.querySelector('.menu-item[data-section="pedidos-servicos"]');
    if (menuPedidos) {
        menuPedidos.addEventListener('click', function() {
            let pedidos = JSON.parse(localStorage.getItem('pedidosServicos') || '[]');
            let visualizados = pedidos.map(p => p.data + p.nome + p.servico);
            localStorage.setItem('pedidosVisualizados', JSON.stringify(visualizados));
            setTimeout(atualizarBadgePedidos, 300); // Atualiza badge após exibir a aba
        });
    }
    // Atualiza badge sempre que carregar pedidos
    const oldCarregarPedidos = carregarPedidosServicos;
    carregarPedidosServicos = function() {
        oldCarregarPedidos();
        atualizarBadgePedidos();
    }

    // Atualizar total de usuários cadastrados na dashboard
    function atualizarTotalUsuarios() {
        const el = document.getElementById('total-usuarios');
        if (!el) return;
        const usuarios = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
        el.textContent = usuarios.length;
    }
    atualizarTotalUsuarios();
    // Se houver cadastro de usuário em algum lugar, chame atualizarTotalUsuarios() após cadastrar.

    // Atualizar total de usuários online na dashboard
    function atualizarTotalOnline() {
        const el = document.getElementById('total-online');
        const lista = document.getElementById('lista-online');
        if (!el || !lista) return;
        const agora = Date.now();
        const usuariosOnline = JSON.parse(localStorage.getItem('usuariosOnline') || '[]');
        const usuariosCadastrados = JSON.parse(localStorage.getItem('usuariosCadastrados') || '[]');
        // Considera online quem teve atividade nos últimos 5 minutos
        const online = usuariosOnline.filter(u => agora - u.lastActive < 5 * 60 * 1000);
        el.textContent = online.length;
        // Monta lista de nomes
        lista.innerHTML = '';
        online.forEach(u => {
            const usuario = usuariosCadastrados.find(cad => cad.id == u.id);
            if (usuario) {
                const li = document.createElement('li');
                const data = new Date(u.lastActive);
                const hora = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                li.textContent = `${usuario.nome} (${usuario.email || 'sem email'}) - Última atividade: ${hora}`;
                lista.appendChild(li);
            }
        });
    }
    atualizarTotalOnline();
    // Para atualizar corretamente, chame atualizarTotalOnline() sempre que houver atividade de usuário.
}); 