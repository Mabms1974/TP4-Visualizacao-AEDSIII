/**
 * controller.js – Gerencia a interação do usuário.
 * Conecta os botões dos formulários às funções do CRUD e atualiza a
 * visualização de bytes e mensagens de feedback.
 */

document.addEventListener('DOMContentLoaded', function () {
    if (typeof renderizarBytes === 'function') renderizarBytes('bytes-visualization');
    configurarEventos();
});

function configurarEventos() {
    // Inserir
    document.getElementById('btn-inserir').addEventListener('click', function () {
        const id = parseInt(document.getElementById('inserir-id').value);
        const nome = document.getElementById('inserir-nome').value.trim();
        const preco = parseFloat(document.getElementById('inserir-preco').value);
        const qtd = parseInt(document.getElementById('inserir-qtd').value);

        if (!id || !nome || isNaN(preco) || isNaN(qtd)) {
            mostrarMensagem('Preencha todos os campos.', 'error');
            return;
        }

        const busca = buscarProdutoPorId(id);
        if (busca.encontrado) {
            mostrarMensagem(`ID ${id} já existe.`, 'error');
            return;
        }

        inserirProduto({ id, nome, preco, quantidade: qtd });
        mostrarMensagem(`Produto "${nome}" inserido.`, 'success');
        limparCampos('inserir');
        if (typeof renderizarBytes === 'function') renderizarBytes('bytes-visualization');
    });

    // Buscar
    document.getElementById('btn-buscar').addEventListener('click', function () {
        const id = parseInt(document.getElementById('buscar-id').value);
        if (!id) { mostrarMensagem('Digite um ID.', 'error'); return; }

        const res = buscarProdutoPorId(id);
        const div = document.getElementById('resultado-busca');
        if (res.encontrado) {
            const p = res.produto;
            div.innerHTML = `<div style="background:#1C2128;padding:15px;border-radius:6px;border-left:4px solid #3FB950;">
                <strong>Produto encontrado:</strong><br>
                ID: ${p.id}<br>Nome: ${p.nome}<br>Preço: R$ ${p.preco.toFixed(2)}<br>Quantidade: ${p.quantidade}
            </div>`;
            mostrarMensagem(`ID ${id} encontrado.`, 'success');
        } else {
            div.innerHTML = `<div style="color:#F85149;">ID ${id} não encontrado.</div>`;
            mostrarMensagem(`ID ${id} não encontrado.`, 'error');
        }
    });

    // Alterar
    document.getElementById('btn-alterar').addEventListener('click', function () {
        const id = parseInt(document.getElementById('alterar-id').value);
        const campo = document.getElementById('alterar-campo').value;
        const valor = document.getElementById('alterar-valor').value.trim();

        if (!id || !valor) { mostrarMensagem('Preencha ID e novo valor.', 'error'); return; }

        const res = alterarProduto(id, campo, valor);
        if (res.sucesso) {
            mostrarMensagem(res.mensagem, 'success');
            limparCampos('alterar');
            if (typeof renderizarBytes === 'function') renderizarBytes('bytes-visualization');
        } else {
            mostrarMensagem(res.mensagem, 'error');
        }
    });

    // Excluir
    document.getElementById('btn-excluir').addEventListener('click', function () {
        const id = parseInt(document.getElementById('excluir-id').value);
        if (!id) { mostrarMensagem('Digite um ID.', 'error'); return; }
        if (!confirm(`Excluir produto ID ${id}?`)) return;

        const res = excluirProduto(id);
        if (res.sucesso) {
            mostrarMensagem(res.mensagem, 'success');
            limparCampos('excluir');
            if (typeof renderizarBytes === 'function') renderizarBytes('bytes-visualization');
        } else {
            mostrarMensagem(res.mensagem, 'error');
        }
    });
}

/**
 * Exibe uma mensagem temporária na interface (sucesso/erro).
 */
function mostrarMensagem(texto, tipo) {
    const el = document.getElementById('mensagem');
    el.textContent = texto;
    el.className = 'mensagem ' + tipo;
    el.style.display = 'block';
    clearTimeout(window.msgTimeout);
    window.msgTimeout = setTimeout(() => { el.style.display = 'none'; }, 4000);
}

/**
 * Limpa os campos de um formulário específico (pelo prefixo do ID).
 */
function limparCampos(prefixo) {
    const inputs = document.querySelectorAll(`#${prefixo}-id, #${prefixo}-nome, #${prefixo}-preco, #${prefixo}-qtd, #${prefixo}-valor`);
    inputs.forEach(inp => inp.value = '');
    if (prefixo === 'buscar') document.getElementById('resultado-busca').innerHTML = '';
}