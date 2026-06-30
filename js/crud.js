/**
 * ============================================
 * PARTE B – LÓGICA DE MANIPULAÇÃO DO CRUD (NO BYTE ARRAY)
 * Responsável: Integrante 2
 *
 * Implementa as 4 operações de CRUD atuando diretamente sobre
 * o vetor de bytes (Int8Array).
 *
 * DEPENDÊNCIAS (carregadas antes deste script):
 *   - ByteStream.js  (biblioteca do Prof. Kutova)
 *   - dados.js       (Parte A: constantes, conversões e persistência)
 * ============================================
 */

// -----------------------------------------------------------------------------
// 0. CONSTANTES LOCAIS DE TAMANHO DE CAMPOS
// (dados.js exporta os OFFSETs mas não os TAMANHOs individuais; os declaramos
//  aqui localmente para uso interno das funções puras.)
// -----------------------------------------------------------------------------
const _TAM_ID         = 4;   // mesmo valor que TAMANHO_ID em dados.js
const _TAM_NOME       = 50;  // mesmo valor que TAMANHO_NOME em dados.js
const _TAM_PRECO      = 8;   // mesmo valor que TAMANHO_PRECO em dados.js
const _TAM_QUANTIDADE = 4;   // mesmo valor que TAMANHO_QUANTIDADE em dados.js

// Mapa: nome do campo → { offset global no registro, tamanho em bytes }
const CAMPOS_META = {
    nome:       { offset: OFFSET_NOME,       tamanho: _TAM_NOME       },
    preco:      { offset: OFFSET_PRECO,      tamanho: _TAM_PRECO      },
    quantidade: { offset: OFFSET_QUANTIDADE, tamanho: _TAM_QUANTIDADE }
};

// -----------------------------------------------------------------------------
// 1. FUNÇÕES AUXILIARES DE SUPORTE
// -----------------------------------------------------------------------------

/**
 * Verifica se um registro a partir do offset especificado está logicamente
 * excluído, ou seja, se todos os seus bytes são 0.
 *
 * ATENÇÃO: Um produto com id=0, nome="", preco=0.0, quantidade=0 também seria
 * considerado excluído. O controller.js deve garantir que id >= 1 para evitar
 * colisões com registros deletados.
 *
 * @param {Int8Array} byteArray - Vetor de bytes completo
 * @param {number} offset - Posição inicial do registro no vetor
 * @returns {boolean} true se o registro estiver totalmente zerado (excluído)
 */
function isRegistroExcluido(byteArray, offset) {
    for (let j = 0; j < TAMANHO_REGISTRO; j++) {
        if (byteArray[offset + j] !== 0) {
            return false;
        }
    }
    return true;
}

// -----------------------------------------------------------------------------
// 2. FUNÇÕES PURAS DE MANIPULAÇÃO DE BYTES  ← NÚCLEO DA PARTE B
// -----------------------------------------------------------------------------

/**
 * Busca um registro pelo ID percorrendo o vetor de bytes de registro em
 * registro (saltos de TAMANHO_REGISTRO bytes). Registros excluídos (todos
 * zeros) são ignorados.
 *
 * @param {Int8Array} byteArray - Vetor de bytes
 * @param {number} id - ID inteiro do produto a localizar
 * @returns {number} Offset (índice inicial) do registro encontrado, ou -1
 */
function buscar(byteArray, id) {
    for (let i = 0; i < byteArray.length; i += TAMANHO_REGISTRO) {
        // Pula registros marcados como excluídos (todos bytes == 0)
        if (isRegistroExcluido(byteArray, i)) {
            continue;
        }

        // Extrai os 4 bytes do campo ID e converte para inteiro
        const idBytes = byteArray.slice(i + OFFSET_ID, i + OFFSET_ID + _TAM_ID);
        const regId   = bytesParaInt(idBytes);

        if (regId === id) {
            return i; // Retorna o offset inicial do registro encontrado
        }
    }
    return -1; // ID não encontrado
}

/**
 * Insere os bytes de um novo registro anexando-os ao final do vetor de bytes.
 * Retorna um NOVO array (não modifica o original).
 *
 * @param {Int8Array} byteArray - Vetor de bytes atual
 * @param {Int8Array} novoRegistroBytes - Bytes do novo registro (deve ter exatamente TAMANHO_REGISTRO bytes)
 * @returns {Int8Array} Novo vetor de bytes com o registro adicionado
 */
function inserir(byteArray, novoRegistroBytes) {
    if (novoRegistroBytes.length !== TAMANHO_REGISTRO) {
        throw new RangeError(
            `inserir: novoRegistroBytes deve ter ${TAMANHO_REGISTRO} bytes, mas tem ${novoRegistroBytes.length}.`
        );
    }

    // Aloca um novo array com espaço adicional para o novo registro
    const novoArray = new Int8Array(byteArray.length + TAMANHO_REGISTRO);

    // Copia os dados existentes para o início do novo array
    novoArray.set(byteArray, 0);

    // Anexa o novo registro no final
    novoArray.set(novoRegistroBytes, byteArray.length);

    return novoArray;
}

/**
 * Altera os bytes de um campo específico de um registro identificado pelo ID.
 *
 * NOTA: Esta função modifica o byteArray IN-PLACE (comportamento esperado para
 * typed arrays de tamanho fixo) e também retorna a mesma referência.
 * Salve os dados com salvarDados() após chamar esta função.
 *
 * @param {Int8Array} byteArray - Vetor de bytes atual (será modificado in-place)
 * @param {number} id - ID do produto a ser alterado
 * @param {string} campo - Nome do campo: 'nome', 'preco' ou 'quantidade'
 * @param {Int8Array} novosBytes - Bytes do novo valor (tamanho deve bater com o campo)
 * @returns {Int8Array|null} O mesmo byteArray modificado, ou null se ID não for encontrado
 */
function alterar(byteArray, id, campo, novosBytes) {
    const meta = CAMPOS_META[campo];
    if (!meta) {
        throw new Error(`alterar: campo "${campo}" inválido. Use 'nome', 'preco' ou 'quantidade'.`);
    }

    // Verifica se o tamanho dos novos bytes bate com o campo destino
    if (novosBytes.length !== meta.tamanho) {
        throw new RangeError(
            `alterar: campo "${campo}" espera ${meta.tamanho} bytes, mas recebeu ${novosBytes.length}.`
        );
    }

    const pos = buscar(byteArray, id);
    if (pos === -1) {
        return null; // ID não encontrado
    }

    // Substitui os bytes do campo diretamente no array (in-place)
    byteArray.set(novosBytes, pos + meta.offset);

    return byteArray;
}

/**
 * Exclui logicamente um registro zerando todos os seus TAMANHO_REGISTRO bytes.
 *
 * NOTA: Esta função modifica o byteArray IN-PLACE e também retorna a mesma
 * referência. Salve os dados com salvarDados() após chamar esta função.
 *
 * @param {Int8Array} byteArray - Vetor de bytes atual (será modificado in-place)
 * @param {number} id - ID do produto a ser excluído
 * @returns {Int8Array|null} O mesmo byteArray com o registro zerado, ou null se ID não for encontrado
 */
function excluir(byteArray, id) {
    const pos = buscar(byteArray, id);
    if (pos === -1) {
        return null; // ID não encontrado
    }

    // Sobrescreve todos os bytes do registro com 0 (exclusão lógica)
    for (let i = 0; i < TAMANHO_REGISTRO; i++) {
        byteArray[pos + i] = 0;
    }

    return byteArray;
}

// -----------------------------------------------------------------------------
// 3. FUNÇÕES INTEGRADAS DE CONTROLE (WRAPPERS PARA O controller.js)
// Estas funções gerenciam o LocalStorage e servem de ponte com a interface.
// Nenhuma lógica de manipulação de bytes vive aqui — apenas coordenação.
// -----------------------------------------------------------------------------

/**
 * Busca um produto pelo ID e retorna seus dados para exibição na interface.
 * @param {number} id - ID do produto
 * @returns {{ encontrado: boolean, produto?: object }}
 */
function buscarProdutoPorId(id) {
    const byteArray = carregarDados();
    const pos = buscar(byteArray, id);

    if (pos === -1) {
        return { encontrado: false };
    }

    // Reconstrói o produto a partir dos bytes daquela posição
    const produto = bytesParaProduto(byteArray, pos);
    return { encontrado: true, produto };
}

/**
 * Converte um objeto produto em bytes e o insere no banco de bytes.
 * @param {{ id: number, nome: string, preco: number, quantidade: number }} produto
 */
function inserirProduto(produto) {
    const byteArray        = carregarDados();
    const novoRegistroBytes = produtoParaBytes(produto);
    const novoArray        = inserir(byteArray, novoRegistroBytes);
    salvarDados(novoArray);
}

/**
 * Altera um campo de um produto identificado pelo ID.
 * Converte o novo valor para bytes usando as funções da Parte A antes de
 * chamar alterar().
 *
 * @param {number} id
 * @param {'nome'|'preco'|'quantidade'} campo
 * @param {string} valor - Valor como string, vindo do input HTML
 * @returns {{ sucesso: boolean, mensagem: string }}
 */
function alterarProduto(id, campo, valor) {
    // Converte o novo valor para bytes de acordo com o tipo do campo
    let novosBytes;
    try {
        if (campo === 'nome') {
            if (!valor || valor.trim() === '') {
                return { sucesso: false, mensagem: 'O nome não pode ser vazio.' };
            }
            novosBytes = stringParaBytes(valor.trim(), _TAM_NOME);

        } else if (campo === 'preco') {
            const precoStr = valor.trim();
            if (!/^\d+(\.\d+)?$/.test(precoStr)) {
                return { sucesso: false, mensagem: 'Preço inválido. Digite um número positivo.' };
            }
            const preco = parseFloat(precoStr);
            novosBytes = doubleParaBytes(preco);

        } else if (campo === 'quantidade') {
            const qtdStr = valor.trim();
            if (!/^\d+$/.test(qtdStr)) {
                return { sucesso: false, mensagem: 'Quantidade inválida. Digite um inteiro positivo.' };
            }
            const qtd = parseInt(qtdStr, 10);
            novosBytes = intParaBytes(qtd);

        } else {
            return { sucesso: false, mensagem: `Campo "${campo}" não reconhecido.` };
        }
    } catch (e) {
        return { sucesso: false, mensagem: `Erro ao converter valor: ${e.message}` };
    }

    // Aplica a alteração diretamente no vetor de bytes
    const byteArray = carregarDados();
    const resultado = alterar(byteArray, id, campo, novosBytes);

    if (resultado === null) {
        return { sucesso: false, mensagem: `Produto com ID ${id} não encontrado.` };
    }

    salvarDados(resultado);
    return { sucesso: true, mensagem: `Produto ID ${id} — campo "${campo}" atualizado com sucesso!` };
}

/**
 * Exclui logicamente um produto pelo ID (zera todos os seus bytes).
 * @param {number} id
 * @returns {{ sucesso: boolean, mensagem: string }}
 */
function excluirProduto(id) {
    const byteArray = carregarDados();
    const resultado = excluir(byteArray, id);

    if (resultado === null) {
        return { sucesso: false, mensagem: `Produto com ID ${id} não encontrado.` };
    }

    salvarDados(resultado);
    return { sucesso: true, mensagem: `Produto ID ${id} excluído com sucesso!` };
}

// -----------------------------------------------------------------------------
// 4. EXPORTAÇÃO GLOBAL (window)
// -----------------------------------------------------------------------------

// Funções puras — Parte B
window.isRegistroExcluido = isRegistroExcluido;
window.buscar             = buscar;
window.inserir            = inserir;
window.alterar            = alterar;
window.excluir            = excluir;

// Wrappers de integração — chamados pelo controller.js (Parte D)
window.buscarProdutoPorId = buscarProdutoPorId;
window.inserirProduto     = inserirProduto;
window.alterarProduto     = alterarProduto;
window.excluirProduto     = excluirProduto;
