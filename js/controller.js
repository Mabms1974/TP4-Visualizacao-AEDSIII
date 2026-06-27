/**
 * ============================================
 * PARTE D – CONTROLADOR DA INTERFACE
 * Responsável: [Nome do Integrante 4]
 * ============================================
 */

document.addEventListener('DOMContentLoaded', function () {
    // Renderiza a visualização inicial
    if (typeof renderizarBytes === 'function') {
        renderizarBytes('bytes-visualization');
    }
    
    configurarEventos();
});

function configurarEventos() {
    // ---- Inserir ----
    document.getElementById('btn-inserir').addEventListener('click', function () {
        const id = parseInt(document.getElementById('inserir-id').value);
        const nome = document.getElementById('inserir-nome').value.trim();
        const preco = parseFloat(document.getElementById('inserir-preco').value);
        const quantidade = parseInt(document.getElementById('inserir-qtd').value);
        
        if (!id || !nome || isNaN(preco) || isNaN(quantidade)) {
            mostrarMensagem('Preencha todos os campos corretamente.', 'error');
            return;
        }
        
        const busca = buscarProdutoPorId(id);
        if (busca.encontrado) {
            mostrarMensagem(`ID ${id} já existe. Use outro ID.`, 'error');
            return;
        }
        
        const produto = { id, nome, preco, quantidade };
        inserirProduto(produto);
        mostrarMensagem(`Produto "${nome}" inserido com sucesso!`, 'success');
        limparCampos('inserir');
        atualizarVisualizacao();
    });

    // ---- Buscar ----
    document.getElementById('btn-buscar').addEventListener('click', function () {
        const id = parseInt(document.getElementById('buscar-id').value);
        if (!id) {
            mostrarMensagem('Digite um ID para buscar.', 'error');
            return;
        }
        
        const resultado = buscarProdutoPorId(id);
        const div = document.getElementById('resultado-busca');
        if (resultado.encontrado) {
            const p = resultado.produto;
            div.innerHTML = `
                <div style="background: #1C2128; padding: 15px; border-radius: 6px; border-left: 4px solid #3FB950;">
                    <strong>Produto encontrado:</strong><br>
                    ID: ${p.id}<br>
                    Nome: ${p.nome}<br>
                    Preço: R$ ${p.preco.toFixed(2)}<br>
                    Quantidade: ${p.quantidade}
                </div>
            `;
            mostrarMensagem(`Produto ID ${id} encontrado.`, 'success');
        } else {
            div.innerHTML = `<div style="color: #F85149;">Produto com ID ${id} não encontrado.</div>`;
            mostrarMensagem(`Produto ID ${id} não encontrado.`, 'error');
        }
    });

    // ---- Alterar ----
    document.getElementById('btn-alterar').addEventListener('click', function () {
        const id = parseInt(document.getElementById('alterar-id').value);
        const campo = document.getElementById('alterar-campo').value;
        const valor = document.getElementById('alterar-valor').value.trim();
        
        if (!id || !valor) {
            mostrarMensagem('Preencha ID e o novo valor.', 'error');
            return;
        }
        
        const resultado = alterarProduto(id, campo, valor);
        if (resultado.sucesso) {
            mostrarMensagem(resultado.mensagem, 'success');
            limparCampos('alterar');
            atualizarVisualizacao();
        } else {
            mostrarMensagem(resultado.mensagem, 'error');
        }
    });

    // ---- Excluir ----
    document.getElementById('btn-excluir').addEventListener('click', function () {
        const id = parseInt(document.getElementById('excluir-id').value);
        if (!id) {
            mostrarMensagem('Digite um ID para excluir.', 'error');
            return;
        }
        
        if (!confirm(`Tem certeza que deseja excluir o produto ID ${id}?`)) return;
        
        const resultado = excluirProduto(id);
        if (resultado.sucesso) {
            mostrarMensagem(resultado.mensagem, 'success');
            limparCampos('excluir');
            atualizarVisualizacao();
        } else {
            mostrarMensagem(resultado.mensagem, 'error');
        }
    });
}

// ---- Funções auxiliares ----

function mostrarMensagem(texto, tipo) {
    const el = document.getElementById('mensagem');
    el.textContent = texto;
    el.className = 'mensagem ' + tipo;
    el.style.display = 'block';
    
    // Esconde após 4 segundos
    clearTimeout(window.msgTimeout);
    window.msgTimeout = setTimeout(() => {
        el.style.display = 'none';
    }, 4000);
}

function limparCampos(prefixo) {
    const inputs = document.querySelectorAll(`#${prefixo}-id, #${prefixo}-nome, #${prefixo}-preco, #${prefixo}-qtd, #${prefixo}-valor, #alterar-valor`);
    inputs.forEach(inp => inp.value = '');
    // Limpa também o resultado da busca
    if (prefixo === 'buscar') {
        document.getElementById('resultado-busca').innerHTML = '';
    }
}

function atualizarVisualizacao() {
    if (typeof renderizarBytes === 'function') {
        renderizarBytes('bytes-visualization');
    }
}