/**
 * crud.js – Manipulação direta do vetor de bytes (operações puras).
 * Fornece funções para buscar, inserir, alterar e excluir registros
 * atuando exclusivamente sobre o Int8Array.
 */

const _TAM_ID = 4, _TAM_NOME = 50, _TAM_PRECO = 8, _TAM_QUANTIDADE = 4;

const CAMPOS_META = {
    nome:       { offset: OFFSET_NOME,       tamanho: _TAM_NOME },
    preco:      { offset: OFFSET_PRECO,      tamanho: _TAM_PRECO },
    quantidade: { offset: OFFSET_QUANTIDADE, tamanho: _TAM_QUANTIDADE }
};

/**
 * Verifica se um registro está logicamente excluído (todos os bytes = 0).
 */
function isRegistroExcluido(byteArray, offset) {
    for (let j = 0; j < TAMANHO_REGISTRO; j++) {
        if (byteArray[offset + j] !== 0) return false;
    }
    return true;
}

/**
 * Busca um ID no vetor e retorna o offset do registro, ou -1 se não encontrado.
 */
function buscar(byteArray, id) {
    for (let i = 0; i < byteArray.length; i += TAMANHO_REGISTRO) {
        if (isRegistroExcluido(byteArray, i)) continue;
        const idBytes = byteArray.slice(i + OFFSET_ID, i + OFFSET_ID + _TAM_ID);
        const regId = bytesParaInt(idBytes);
        if (regId === id) return i;
    }
    return -1;
}

/**
 * Insere um novo registro no final do vetor e retorna o novo Int8Array.
 */
function inserir(byteArray, novoRegistroBytes) {
    if (novoRegistroBytes.length !== TAMANHO_REGISTRO) {
        throw new RangeError(`Tamanho inválido: esperado ${TAMANHO_REGISTRO}`);
    }
    const novo = new Int8Array(byteArray.length + TAMANHO_REGISTRO);
    novo.set(byteArray, 0);
    novo.set(novoRegistroBytes, byteArray.length);
    return novo;
}

/**
 * Altera um campo de um registro existente (modifica in-place).
 * Retorna o mesmo array ou null se ID não encontrado.
 */
function alterar(byteArray, id, campo, novosBytes) {
    const meta = CAMPOS_META[campo];
    if (!meta) throw new Error(`Campo "${campo}" inválido.`);
    if (novosBytes.length !== meta.tamanho) {
        throw new RangeError(`Campo "${campo}" espera ${meta.tamanho} bytes.`);
    }
    const pos = buscar(byteArray, id);
    if (pos === -1) return null;
    byteArray.set(novosBytes, pos + meta.offset);
    return byteArray;
}

/**
 * Exclui logicamente um registro zerando todos os seus bytes (in-place).
 * Retorna o mesmo array ou null se ID não encontrado.
 */
function excluir(byteArray, id) {
    const pos = buscar(byteArray, id);
    if (pos === -1) return null;
    for (let i = 0; i < TAMANHO_REGISTRO; i++) {
        byteArray[pos + i] = 0;
    }
    return byteArray;
}

// ---------- Wrappers para integração com a interface ----------
function buscarProdutoPorId(id) {
    const bytes = carregarDados();
    const pos = buscar(bytes, id);
    if (pos === -1) return { encontrado: false };
    return { encontrado: true, produto: bytesParaProduto(bytes, pos) };
}

function inserirProduto(produto) {
    const bytes = carregarDados();
    const novo = produtoParaBytes(produto);
    const atualizado = inserir(bytes, novo);
    salvarDados(atualizado);
}

function alterarProduto(id, campo, valor) {
    let novosBytes;
    try {
        if (campo === 'nome') {
            if (!valor || !valor.trim()) return { sucesso: false, mensagem: 'Nome vazio.' };
            novosBytes = stringParaBytes(valor.trim(), _TAM_NOME);
        } else if (campo === 'preco') {
            const p = parseFloat(valor);
            if (isNaN(p) || p < 0) return { sucesso: false, mensagem: 'Preço inválido.' };
            novosBytes = doubleParaBytes(p);
        } else if (campo === 'quantidade') {
            const q = parseInt(valor, 10);
            if (isNaN(q) || q < 0) return { sucesso: false, mensagem: 'Quantidade inválida.' };
            novosBytes = intParaBytes(q);
        } else {
            return { sucesso: false, mensagem: `Campo "${campo}" não reconhecido.` };
        }
    } catch (e) {
        return { sucesso: false, mensagem: e.message };
    }

    const bytes = carregarDados();
    const resultado = alterar(bytes, id, campo, novosBytes);
    if (resultado === null) {
        return { sucesso: false, mensagem: `ID ${id} não encontrado.` };
    }
    salvarDados(resultado);
    return { sucesso: true, mensagem: `Campo "${campo}" atualizado.` };
}

function excluirProduto(id) {
    const bytes = carregarDados();
    const resultado = excluir(bytes, id);
    if (resultado === null) {
        return { sucesso: false, mensagem: `ID ${id} não encontrado.` };
    }
    salvarDados(resultado);
    return { sucesso: true, mensagem: `Produto ${id} excluído.` };
}

// ---------- Exportação global ----------
window.isRegistroExcluido = isRegistroExcluido;
window.buscar = buscar;
window.inserir = inserir;
window.alterar = alterar;
window.excluir = excluir;
window.buscarProdutoPorId = buscarProdutoPorId;
window.inserirProduto = inserirProduto;
window.alterarProduto = alterarProduto;
window.excluirProduto = excluirProduto;