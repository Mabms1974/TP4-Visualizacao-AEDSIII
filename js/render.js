/**
 * ============================================
 * PARTE C – VISUALIZAÇÃO INTERATIVA DOS BYTES
 * Responsável: Integrante 3
 * 
 * Renderiza a representação visual do vetor de bytes na tela,
 * com cores para identificar registros e campos.
 * ============================================
 */

/**
 * Renderiza a visualização dos bytes no container especificado.
 * @param {string} containerId - ID do elemento HTML onde os bytes serão renderizados.
 */
function renderizarBytes(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Carrega o vetor de bytes atual
    const byteArray = carregarDados();
    
    // Se o banco de dados estiver vazio
    if (byteArray.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>📭 O arquivo "dados.bin" está vazio. Insira um produto acima para começar!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = ''; // Limpa a visualização anterior

    // Cria a legenda explicativa dos campos
    const legenda = document.createElement('div');
    legenda.className = 'legenda-container';
    legenda.innerHTML = `
        <span class="legenda-item"><span class="cor-box legenda-id"></span> ID (4 bytes)</span>
        <span class="legenda-item"><span class="cor-box legenda-nome"></span> Nome (50 bytes)</span>
        <span class="legenda-item"><span class="cor-box legenda-preco"></span> Preço (8 bytes)</span>
        <span class="legenda-item"><span class="cor-box legenda-qtd"></span> Quantidade (4 bytes)</span>
        <span class="legenda-item"><span class="cor-box legenda-excluido"></span> Excluído (Todos os bytes 0)</span>
    `;
    container.appendChild(legenda);

    // Itera sobre o array de bytes em blocos de registros
    for (let i = 0; i < byteArray.length; i += TAMANHO_REGISTRO) {
        const registroDiv = document.createElement('div');
        registroDiv.className = 'registro-row';
        
        // Verifica se o registro está excluído logicamente
        const excluido = isRegistroExcluido(byteArray, i);
        if (excluido) {
            registroDiv.classList.add('registro-excluido');
        }

        // Título do registro (linha)
        const registroHeader = document.createElement('div');
        registroHeader.className = 'registro-header';
        
        const numeroRegistro = (i / TAMANHO_REGISTRO) + 1;
        if (excluido) {
            registroHeader.innerHTML = `<span><strong>Registro #${numeroRegistro}</strong> (Excluído/Livre)</span> <span>Offset: ${i}</span>`;
        } else {
            // Reconstrói o produto apenas para exibir seu ID/Nome no cabeçalho de forma informativa
            const produto = bytesParaProduto(byteArray, i);
            registroHeader.innerHTML = `<span><strong>Registro #${numeroRegistro}</strong> - ID: ${produto.id} (${produto.nome})</span> <span>Offset: ${i}</span>`;
        }
        registroDiv.appendChild(registroHeader);

        // Grade de bytes
        const bytesGrid = document.createElement('div');
        bytesGrid.className = 'bytes-grid';

        for (let j = 0; j < TAMANHO_REGISTRO; j++) {
            const bytePos = i + j;
            const byteVal = byteArray[bytePos];
            
            const byteBox = document.createElement('span');
            byteBox.className = 'byte-box';

            // Formatação hexadecimal de 2 caracteres (ex: "0A", "FF")
            // Converte valor com sinal de volta para representação 0-255 sem sinal
            const unsignedVal = byteVal & 0xFF;
            const hexStr = unsignedVal.toString(16).toUpperCase().padStart(2, '0');
            byteBox.textContent = hexStr;

            // Determina a classe de cor de acordo com o campo
            let campoNome = '';
            if (excluido) {
                byteBox.classList.add('byte-excluido');
                campoNome = 'Excluído';
            } else if (j >= OFFSET_QUANTIDADE) {
                byteBox.classList.add('byte-qtd');
                campoNome = 'Quantidade';
            } else if (j >= OFFSET_PRECO) {
                byteBox.classList.add('byte-preco');
                campoNome = 'Preço';
            } else if (j >= OFFSET_NOME) {
                byteBox.classList.add('byte-nome');
                campoNome = 'Nome';
            } else {
                byteBox.classList.add('byte-id');
                campoNome = 'ID';
            }

            // Representação de caractere legível se possível
            let charRepr = '';
            if (unsignedVal >= 32 && unsignedVal <= 126) {
                charRepr = ` ('${String.fromCharCode(unsignedVal)}')`;
            }

            // Tooltip descritiva para facilitar auditoria
            byteBox.title = `Byte Offset: ${bytePos}\nPosição no Registro: ${j}\nCampo: ${campoNome}\nValor Decimal: ${byteVal}\nValor Hex: 0x${hexStr}${charRepr}`;

            bytesGrid.appendChild(byteBox);
        }

        registroDiv.appendChild(bytesGrid);
        container.appendChild(registroDiv);
    }
}

// Exporta globalmente
window.renderizarBytes = renderizarBytes;
