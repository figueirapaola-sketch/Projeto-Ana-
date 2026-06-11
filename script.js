/* =====================================================
   FEIRA EXPRESS - PORTAL WEB INTERATIVO E REATIVO
   ===================================================== */

// Base de Dados Compartilhada em tempo real (Cliente <-> Feirante)
let produtosSimulados = [
    { id: 1, nome: "Tomate", preco: 2.49, unidade: "1kg", img: "🍅", desconto: "-40%", categoria: "Verduras" },
    { id: 2, nome: "Banana Prata", preco: 2.99, unidade: "1kg", img: "🍌", desconto: "-50%", categoria: "Frutas" },
    { id: 3, nome: "Alface", preco: 1.49, unidade: "1 unidade", img: "🥬", desconto: "-40%", categoria: "Verduras" },
    { id: 4, nome: "Frutas diversas", preco: 3.49, unidade: "1kg", img: "🧺", desconto: "-70%", categoria: "Frutas" },
    { id: 5, nome: "Cenoura Orgânica", preco: 2.80, unidade: "1kg", img: "🥕", desconto: "", categoria: "Legumes" }
];

// Comandas ativas que aparecem na tela do feirante
let pedidosDoFeirante = [
    { id: 101, cliente: "Carlos Silva", desc: "2x Tomate, 1x Alface", total: 6.47, status: "Pendente" }
];

// Estados do Cliente
let carrinho = JSON.parse(localStorage.getItem('carrinho_feira')) || [];
let categoriaAtiva = "Todas";
let filtroTexto = "";
let tamanhoFonteAtual = 16; // Inicial do documento em px

// Elementos capturados do DOM
const listaOfertasHome = document.getElementById('lista-ofertas-home');
const listaProdutosBusca = document.getElementById('lista-produtos-busca');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const subtotalVal = document.getElementById('subtotal-val');
const taxaVal = document.getElementById('taxa-val');
const totalVal = document.getElementById('total-val');
const checkoutBtn = document.querySelector('.action-checkout-button');
const badgesContador = document.querySelectorAll('.badge-total-contador');

/* -----------------------------------------------------
   MELHORIA DE ACESSIBILIDADE JS (CRITÉRIO NOTA MÁXIMA)
----------------------------------------------------- */
function alterarFonte(direcao) {
    tamanhoFonteAtual += direcao;
    // Limites de segurança para não quebrar o layout
    if (tamanhoFonteAtual < 13) tamanhoFonteAtual = 13;
    if (tamanhoFonteAtual > 22) tamanhoFonteAtual = 22;
    document.documentElement.style.fontSize = tamanhoFonteAtual + 'px';
}

/* -----------------------------------------------------
   RENDERIZAÇÃO: RELATÓRIOS DO CLIENTE
----------------------------------------------------- */
function renderizarHome() {
    if (!listaOfertasHome) return;
    listaOfertasHome.innerHTML = '';

    const ofertas = produtosSimulados.filter(p => p.desconto !== "");
    
    if(ofertas.length === 0) {
        listaOfertasHome.innerHTML = '<p class="empty-state-notice">Não há ofertas cadastradas pelos feirantes no momento.</p>';
        return;
    }

    ofertas.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'compact-product-card';
        card.innerHTML = `
            <span class="discount-tag">${produto.desconto}</span>
            <div class="compact-img">${produto.img}</div>
            <h4 class="compact-title">${produto.nome}</h4>
            <p class="compact-metrics">${produto.unidade}</p>
            <div class="compact-footer-row">
                <span class="compact-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                <button class="add-to-cart-circle-btn" onclick="alterarQuantidade(${produto.id}, 1)">+</button>
            </div>
        `;
        listaOfertasHome.appendChild(card);
    });
}

function renderizarBusca() {
    if (!listaProdutosBusca) return;
    listaProdutosBusca.innerHTML = '';

    const filtrados = produtosSimulados.filter(p => {
        const matchCategoria = (categoriaAtiva === "Todas" || p.categoria === categoriaAtiva);
        const matchTexto = p.nome.toLowerCase().includes(filtroTexto.toLowerCase());
        return matchCategoria && matchTexto;
    });

    if (filtrados.length === 0) {
        listaProdutosBusca.innerHTML = '<p class="empty-state-notice">Nenhum produto corresponde aos critérios selecionados.</p>';
        return;
    }

    filtrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'grid-product-card';
        card.innerHTML = `
            ${produto.desconto ? `<span class="tag-desconto">${produto.desconto}</span>` : ''}
            <div class="grid-img">${produto.img}</div>
            <h4 class="grid-title">${produto.nome}</h4>
            <p class="grid-metrics">${produto.unidade}</p>
            <div class="grid-card-footer">
                <span class="grid-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</span>
                <button class="add-to-cart-circle-btn" onclick="alterarQuantidade(${produto.id}, 1)">+</button>
            </div>
        `;
        listaProdutosBusca.appendChild(card);
    });
}

function renderizarCarrinho() {
    if (!listaItensCarrinho) return;
    listaItensCarrinho.innerHTML = '';

    if (carrinho.length === 0) {
        listaItensCarrinho.innerHTML = '<p class="empty-state-notice">Seu carrinho de compras está vazio. Visite a nossa vitrine!</p>';
        atualizarResumoFinanceiro(0);
        return;
    }

    let subtotal = 0;
    carrinho.forEach(item => {
        subtotal += item.preco * item.quantidade;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-visual">${item.img}</div>
            <div class="cart-item-desc">
                <h4>${item.nome}</h4>
                <span>${item.unidade}</span>
                <strong>R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</strong>
            </div>
            <div class="interactive-qty-picker">
                <button class="picker-btn" onclick="alterarQuantidade(${item.id}, -1)">-</button>
                <span>${item.quantidade}</span>
                <button class="picker-btn" onclick="alterarQuantidade(${item.id}, 1)">+</button>
            </div>
        `;
        listaItensCarrinho.appendChild(row);
    });

    atualizarResumoFinanceiro(subtotal);
}

/* -----------------------------------------------------
   GESTÃO DO FEIRANTE (PAINEL OPERACIONAL)
----------------------------------------------------- */
function renderizarPainelFeirante() {
    const divEstoque = document.getElementById('feirante-lista-estoque');
    if (divEstoque) {
        divEstoque.innerHTML = '';
        produtosSimulados.forEach(prod => {
            const row = document.createElement('div');
            row.className = 'stock-editable-row';
            row.innerHTML = `
                <div style="font-size:32px;">${prod.img}</div>
                <div class="stock-edit-info">
                    <h4>${prod.nome} — Unidade padrão: ${prod.unidade}</h4>
                    <div class="stock-edit-actions">
                        <span>Preço Unitário: R$</span>
                        <input type="number" step="0.01" value="${prod.preco.toFixed(2)}" onchange="alterarPrecoProdutoFeirante(${prod.id}, this.value)">
                        <button class="btn-toggle-sobra ${prod.desconto ? 'is-sobra' : ''}" onclick="alternarSobraFeirante(${prod.id})">
                            ${prod.desconto ? '🔥 Sobra Ativada (-50%)' : 'Marcar como Sobra'}
                        </button>
                    </div>
                </div>
            `;
            divEstoque.appendChild(row);
        });
    }

    const divPedidos = document.getElementById('feirante-lista-pedidos');
    const badgeCount = document.getElementById('count-pedidos-feirante');
    if (badgeCount) badgeCount.innerText = pedidosDoFeirante.filter(p => p.status === "Pendente").length;

    if (divPedidos) {
        divPedidos.innerHTML = '';
        if (pedidosDoFeirante.length === 0) {
            divPedidos.innerHTML = '<p class="empty-state-notice">Aguardando novos pedidos...</p>';
            return;
        }

        pedidosDoFeirante.forEach(ped => {
            const card = document.createElement('div');
            card.className = 'seller-order-card';
            card.innerHTML = `
                <div class="seller-order-top">
                    <span>Comanda Digital #${ped.id} — Cliente: ${ped.cliente}</span>
                    <span style="color: ${ped.status === 'Pronto' ? '#2E6A30' : '#E65100'}">${ped.status}</span>
                </div>
                <div class="seller-order-items">
                    <p>📦 <strong>Produtos:</strong> ${ped.desc}</p>
                    <p>💰 <strong>Total do Repasse:</strong> R$ ${ped.total.toFixed(2).replace('.', ',')}</p>
                </div>
                ${ped.status === 'Pendente' ? `<button class="btn-order-ready" onclick="concluirPedidoFeirante(${ped.id})">Concluir Separação ✓</button>` : ''}
                <div style="clear:both;"></div>
            `;
            divPedidos.appendChild(card);
        });
    }
}

function alterarPrecoProdutoFeirante(id, novoPreco) {
    const valor = parseFloat(novoPreco);
    if (!isNaN(valor) && valor > 0) {
        const produto = produtosSimulados.find(p => p.id === id);
        if (produto) {
            produto.preco = valor;
            salvarEAtualizar();
        }
    }
}

function alternarSobraFeirante(id) {
    const produto = produtosSimulados.find(p => p.id === id);
    if (produto) {
        if (produto.desconto) {
            produto.desconto = "";
            produto.preco = produto.preco * 2; 
        } else {
            produto.desconto = "-50%";
            produto.preco = produto.preco / 2; 
        }
        salvarEAtualizar();
        renderizarPainelFeirante();
    }
}

function cadastrarProdutoFeirante() {
    const nome = document.getElementById('form-nome').value.trim();
    const preco = parseFloat(document.getElementById('form-preco').value);
    const unidade = document.getElementById('form-unidade').value.trim();
    const categoria = document.getElementById('form-categoria').value;
    const img = document.getElementById('form-img').value;

    if (!nome || isNaN(preco) || !unidade) {
        alert("Preencha todos os parâmetros para registrar o alimento!");
        return;
    }

    const novoProd = {
        id: produtosSimulados.length + 1,
        nome: nome,
        preco: preco,
        unidade: unidade,
        img: img,
        desconto: "",
        categoria: categoria
    };

    produtosSimulados.push(novoProd);
    alert(`Sucesso! O produto "${nome}" foi incluído na vitrine.`);
    
    document.getElementById('form-nome').value = '';
    document.getElementById('form-preco').value = '';
    document.getElementById('form-unidade').value = '';

    salvarEAtualizar();
    alternarSubFeirante('estoque', document.querySelector('.seller-sidebar-tabs button'));
}

function concluirPedidoFeirante(id) {
    const pedido = pedidosDoFeirante.find(p => p.id === id);
    if (pedido) {
        pedido.status = "Pronto";
        alert(`Comanda #${id} despachada com sucesso!`);
        renderizarPainelFeirante();
    }
}

function alternarSubFeirante(subAba, btn) {
    document.querySelectorAll('.seller-sub-screen').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.seller-tab-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`sub-seller-${subAba}`).classList.add('active');
    btn.classList.add('active');
    renderPainelFeiranteSeAtivo();
}

function renderPainelFeiranteSeAtivo() {
    if (document.getElementById('tela-feirante').classList.contains('active')) {
        renderizarPainelFeirante();
    }
}

/* -----------------------------------------------------
   AÇÕES DO CLIENTE E GLOBAL
----------------------------------------------------- */
function alterarLocalizacao() {
    const local = prompt("Insira a nova região para entrega:", document.getElementById('texto-localizacao').innerText);
    if (local && local.trim() !== "") {
        document.getElementById('texto-localizacao').innerText = local.trim();
    }
}

function alterarQuantidade(id, mudanca) {
    const itemNoCarrinho = carrinho.find(item => item.id === id);
    if (itemNoCarrinho) {
        itemNoCarrinho.quantidade += mudanca;
        if (itemNoCarrinho.quantidade <= 0) {
            carrinho = carrinho.filter(item => item.id !== id);
        }
    } else if (mudanca > 0) {
        const prodOriginal = produtosSimulados.find(p => p.id === id);
        if (prodOriginal) {
            carrinho.push({ ...prodOriginal, quantidade: 1 });
        }
    }
    salvarEAtualizar();
}

function filtrarCategoria(cat, elemento) {
    categoriaAtiva = cat;
    document.querySelectorAll('.search-cat-pill').forEach(p => p.classList.remove('active'));
    elemento.classList.add('active');
    renderizarBusca();
}

function filtrarProdutos(texto) {
    filtroTexto = texto;
    renderizarBusca();
}

function irParaBuscaComCategoria(cat) {
    alternarTela('tela-buscar');
    const pills = Array.from(document.querySelectorAll('.search-cat-pill'));
    const pillAlvo = pills.find(p => p.innerText.includes(cat));
    if (pillAlvo) filtrarCategoria(cat, pillAlvo);
}

// Vincula a comanda de compra de forma real com o painel do feirante
function finalizarCompra() {
    if (carrinho.length === 0) return;
    
    const stringItens = carrinho.map(i => `${i.quantidade}x ${i.nome}`).join(', ');
    const totalPedido = carrinho.reduce((acc, i) => acc + (i.preco * i.quantidade), 0) + 1.00;

    pedidosDoFeirante.push({
        id: Math.floor(Math.random() * 800) + 200,
        cliente: "Ana Rodrigues",
        desc: stringItens,
        total: totalPedido,
        status: "Pendente"
    });

    alert("Pedido enviado! A comanda digital foi inserida na fila do Feirante. 🌱");
    carrinho = [];
    salvarEAtualizar();
    alternarTela('tela-inicio');
}

function limparCarrinho() {
    if (carrinho.length > 0 && confirm("Deseja esvaziar seu carrinho?")) {
        carrinho = [];
        salvarEAtualizar();
    }
}

function salvarEAtualizar() {
    localStorage.setItem('carrinho_feira', JSON.stringify(carrinho));
    const totalItens = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    badgesContador.forEach(badge => {
        badge.innerText = totalItens;
        badge.style.display = totalItens > 0 ? 'inline-block' : 'none';
    });

    renderizarHome();
    renderizarBusca();
    renderizarCarrinho();
    renderPainelFeiranteSeAtivo();
}

function atualizarResumoFinanceiro(subtotal) {
    const taxa = subtotal > 0 ? 1.00 : 0.00;
    if (subtotalVal) subtotalVal.innerText = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (taxaVal) taxaVal.innerText = `R$ ${taxa.toFixed(2).replace('.', ',')}`;
    if (totalVal) totalVal.innerText = `R$ ${(subtotal + taxa).toFixed(2).replace('.', ',')}`;
    if (checkoutBtn) checkoutBtn.disabled = subtotal === 0;
}

function alternarTela(idTela) {
    document.querySelectorAll('.screen').forEach(t => t.classList.remove('active'));
    const alvo = document.getElementById(idTela);
    if (alvo) alvo.classList.add('active');

    document.querySelectorAll('.web-navbar .nav-action-tab').forEach(tab => tab.classList.remove('active'));
    
    if (idTela === 'tela-inicio') document.getElementById('tab-inicio').classList.add('active');
    if (idTela === 'tela-buscar') document.getElementById('tab-buscar').classList.add('active');
    if (idTela === 'tela-carrinho') document.getElementById('tab-carrinho').classList.add('active');
    if (idTela === 'tela-perfil') document.getElementById('tab-perfil').classList.add('active');

    if (idTela === 'tela-feirante') renderizarPainelFeirante();
}

document.addEventListener('DOMContentLoaded', () => {
    salvarEAtualizar();
});