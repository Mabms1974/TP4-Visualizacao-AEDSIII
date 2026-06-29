/**
 * render.js – Renderização visual do vetor de bytes.
 * Exibe cada byte com cores diferenciadas por campo (ID, Nome, Preço, Quantidade)
 * e inclui legenda explicativa.
 */

/**
 * Renderiza a visualização no container especificado.
 * @param {string} containerId - ID do elemento HTML alvo.
 */
function renderizarBytes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const byteArray = carregarDados();
    if (byteArray.length === 0) {
        container.innerHTML = `<div class="empty-state">📭 Nenhum dado cadastrado.</div>`;
        return;
    }

    container.innerHTML = '';

    // Legenda
    const legenda = document.createElement('div');
    legenda.className = 'legenda-container';
    legenda.innerHTML = `
        <span class="legenda-item"><span class="cor-box legenda-id"></span> ID</span>
        <span class="legenda-item"><span class="cor-box legenda-nome"></span> Nome</span>
        <span class="legenda-item"><span class="cor-box legenda-preco"></span> Preço</span>
        <span class="legenda-item"><span class="cor-box legenda-qtd"></span> Quantidade</span>
        <span class="legenda-item"><span class="cor-box legenda-excluido"></span> Excluído</span>
    `;
    container.appendChild(legenda);

    // Itera sobre cada registro
    for (let i = 0; i < byteArray.length; i += TAMANHO_REGISTRO) {
        const excluido = isRegistroExcluido(byteArray, i);
        const registroDiv = document.createElement('div');
        registroDiv.className = 'registro-row' + (excluido ? ' registro-excluido' : '');

        // Cabeçalho do registro
        const header = document.createElement('div');
        header.className = 'registro-header';
        const num = (i / TAMANHO_REGISTRO) + 1;
        if (excluido) {
            header.innerHTML = `<span><strong>Registro #${num}</strong> (Excluído)</span> <span>Offset: ${i}</span>`;
        } else {
            const prod = bytesParaProduto(byteArray, i);
            header.innerHTML = `<span><strong>Registro #${num}</strong> - ID: ${prod.id} (${prod.nome})</span> <span>Offset: ${i}</span>`;
        }
        registroDiv.appendChild(header);

        // Grade de bytes
        const grid = document.createElement('div');
        grid.className = 'bytes-grid';

        for (let j = 0; j < TAMANHO_REGISTRO; j++) {
            const byteVal = byteArray[i + j];
            const hex = (byteVal & 0xFF).toString(16).toUpperCase().padStart(2, '0');

            const box = document.createElement('span');
            box.className = 'byte-box';
            box.textContent = hex;

            // Aplica a classe de cor conforme o campo
            if (excluido) {
                box.classList.add('byte-excluido');
            } else if (j >= OFFSET_QUANTIDADE) {
                box.classList.add('byte-qtd');
            } else if (j >= OFFSET_PRECO) {
                box.classList.add('byte-preco');
            } else if (j >= OFFSET_NOME) {
                box.classList.add('byte-nome');
            } else {
                box.classList.add('byte-id');
            }

            box.title = `Offset ${i+j} | Hex 0x${hex} | Dec ${byteVal}`;
            grid.appendChild(box);
        }

        registroDiv.appendChild(grid);
        container.appendChild(registroDiv);
    }
}

window.renderizarBytes = renderizarBytes;