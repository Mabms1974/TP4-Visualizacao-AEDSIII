/**
 * ============================================
 * PARTE A – CAMADA DE DADOS E PERSISTÊNCIA
 * Responsável: [Seu nome]
 * 
 * Este arquivo utiliza a biblioteca ByteStream.js (do prof. Kutova)
 * para gerenciar a persistência de produtos em um vetor de bytes,
 * armazenado no LocalStorage.
 * ============================================
 */

// ------------------------------
// 1. DEFINIÇÃO DA ESTRUTURA (Tamanhos Fixos)
// ------------------------------

// Tamanho em bytes de cada campo
const TAMANHO_ID        = 4;   // int (usando ByteStream.writeInt)
const TAMANHO_NOME      = 50;  // 50 bytes fixos (com prefixo de 2 bytes do writeString + até 48 bytes UTF-8)
const TAMANHO_PRECO     = 8;   // double (usando ByteStream.writeDouble)
const TAMANHO_QUANTIDADE = 4;   // int (usando ByteStream.writeInt)

// Tamanho total do registro (soma fixa)
const TAMANHO_REGISTRO = TAMANHO_ID + TAMANHO_NOME + TAMANHO_PRECO + TAMANHO_QUANTIDADE; // 4+50+8+4 = 66 bytes

// Offsets (posições iniciais) de cada campo dentro do registro
const OFFSET_ID         = 0;
const OFFSET_NOME       = OFFSET_ID + TAMANHO_ID;          // 4
const OFFSET_PRECO      = OFFSET_NOME + TAMANHO_NOME;      // 54
const OFFSET_QUANTIDADE = OFFSET_PRECO + TAMANHO_PRECO;    // 62

// Chave para armazenar no LocalStorage
const STORAGE_KEY = 'produtos_bytes';

// ------------------------------
// 2. FUNÇÕES DE CONVERSÃO (Wrappers que chamam o ByteStream)
// ------------------------------

/**
 * Converte um inteiro (Number) para Int8Array de 4 bytes (big-endian).
 */
function intParaBytes(valor) {
    return ByteStream.writeInt(valor);
}

/**
 * Converte 4 bytes (Int8Array) para um inteiro (Number).
 */
function bytesParaInt(bytes) {
    return ByteStream.readInt(bytes);
}

/**
 * Converte um double (Number) para Int8Array de 8 bytes (big-endian).
 */
function doubleParaBytes(valor) {
    return ByteStream.writeDouble(valor);
}

/**
 * Converte 8 bytes (Int8Array) para um double (Number).
 */
function bytesParaDouble(bytes) {
    return ByteStream.readDouble(bytes);
}

/**
 * Converte uma string para um Int8Array de EXATAMENTE `tamanhoMax` bytes.
 * 
 * Estratégia para manter o tamanho fixo usando o ByteStream.writeString:
 * 1. Escreve a string com ByteStream.writeString (que adiciona 2 bytes de prefixo + UTF-8).
 * 2. Se o resultado for maior que `tamanhoMax`, trunca (corta o final).
 * 3. Se for menor, preenche o restante com zeros (0x00).
 * 
 * Isso garante que o campo tenha sempre o mesmo tamanho, facilitando o CRUD.
 */
function stringParaBytes(str, tamanhoMax) {
    // Passo 1: Obtém os bytes da string (já com prefixo de 2 bytes)
    let bytesStr = ByteStream.writeString(String(str));
    
    // Passo 2: Cria um array de bytes do tamanho exato, preenchido com 0
    const resultado = new Int8Array(tamanhoMax);
    
    // Passo 3: Copia o conteúdo da string, respeitando o limite
    const copiaLength = Math.min(bytesStr.length, tamanhoMax);
    for (let i = 0; i < copiaLength; i++) {
        resultado[i] = bytesStr[i];
    }
    // O restante já está preenchido com 0 (zeros)
    
    return resultado;
}

/**
 * Converte um array de bytes (exatamente `tamanhoMax`) de volta para string,
 * ignorando os zeros à direita (preenchimento) e usando o ByteStream.readString
 * para decodificar o prefixo + UTF-8.
 */
function bytesParaString(bytes, tamanhoMax) {
    // Cria uma cópia do array para não modificar o original
    const copia = new Int8Array(bytes);
    
    // Encontra onde começam os zeros (preenchimento) para truncar
    let tamanhoReal = 0;
    for (let i = 0; i < tamanhoMax; i++) {
        if (copia[i] !== 0) {
            tamanhoReal = i + 1;
        }
    }
    
    // Se não houver dados, retorna string vazia
    if (tamanhoReal === 0) return "";
    
    // Trunca o array para o tamanho real (onde o prefixo e os dados estão)
    const dadosValidos = copia.slice(0, tamanhoReal);
    
    // Usa o ByteStream para ler a string (ele entende o prefixo de 2 bytes)
    return ByteStream.readString(dadosValidos);
}

// ------------------------------
// 3. MONTAGEM E DESMONTAGEM DO REGISTRO
// ------------------------------

/**
 * Converte um objeto Produto para um Int8Array (registro de 66 bytes).
 * @param {object} produto - { id, nome, preco, quantidade }
 * @returns {Int8Array} array de bytes do registro
 */
function produtoParaBytes(produto) {
    // Cria um buffer vazio de 66 bytes (todos zeros)
    const registro = new Int8Array(TAMANHO_REGISTRO);
    
    // 1. Escreve o ID (4 bytes) na posição 0
    const idBytes = intParaBytes(produto.id);
    registro.set(idBytes, OFFSET_ID);
    
    // 2. Escreve o Nome (50 bytes) na posição 4
    const nomeBytes = stringParaBytes(produto.nome, TAMANHO_NOME);
    registro.set(nomeBytes, OFFSET_NOME);
    
    // 3. Escreve o Preço (8 bytes) na posição 54
    const precoBytes = doubleParaBytes(produto.preco);
    registro.set(precoBytes, OFFSET_PRECO);
    
    // 4. Escreve a Quantidade (4 bytes) na posição 62
    const qtdBytes = intParaBytes(produto.quantidade);
    registro.set(qtdBytes, OFFSET_QUANTIDADE);
    
    return registro;
}

/**
 * Extrai um objeto Produto a partir de um Int8Array (registro de 66 bytes),
 * começando em um determinado offset (posição).
 * @param {Int8Array} byteArray - vetor de bytes completo
 * @param {number} offset - posição inicial do registro
 * @returns {object} produto { id, nome, preco, quantidade }
 */
function bytesParaProduto(byteArray, offset) {
    // Garante que estamos trabalhando com Int8Array
    const arr = byteArray instanceof Int8Array ? byteArray : new Int8Array(byteArray);
    
    // Extrai cada campo como um sub-array
    const idBytes     = arr.slice(offset + OFFSET_ID, offset + OFFSET_ID + TAMANHO_ID);
    const nomeBytes   = arr.slice(offset + OFFSET_NOME, offset + OFFSET_NOME + TAMANHO_NOME);
    const precoBytes  = arr.slice(offset + OFFSET_PRECO, offset + OFFSET_PRECO + TAMANHO_PRECO);
    const qtdBytes    = arr.slice(offset + OFFSET_QUANTIDADE, offset + OFFSET_QUANTIDADE + TAMANHO_QUANTIDADE);
    
    return {
        id: bytesParaInt(idBytes),
        nome: bytesParaString(nomeBytes, TAMANHO_NOME),
        preco: bytesParaDouble(precoBytes),
        quantidade: bytesParaInt(qtdBytes)
    };
}

// ------------------------------
// 4. PERSISTÊNCIA NO LOCALSTORAGE
// ------------------------------

/**
 * Carrega o vetor de bytes do LocalStorage.
 * Se não existir, retorna um Int8Array vazio.
 * @returns {Int8Array} array de bytes
 */
function carregarDados() {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados === null) {
        return new Int8Array(0); // vazio
    }
    // O LocalStorage guarda como string JSON de um array comum.
    // Convertemos de volta para Int8Array.
    const arrayComum = JSON.parse(dados);
    return new Int8Array(arrayComum);
}

/**
 * Salva o vetor de bytes (Int8Array) no LocalStorage.
 * @param {Int8Array} byteArray - array de bytes
 */
function salvarDados(byteArray) {
    // Converte Int8Array para array comum para serializar em JSON
    const arrayComum = Array.from(byteArray);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arrayComum));
}

/**
 * Obtém o número de registros armazenados.
 * @returns {number} quantidade de produtos
 */
function contarRegistros() {
    const dados = carregarDados();
    return Math.floor(dados.length / TAMANHO_REGISTRO);
}

// ------------------------------
// 5. EXPORTAÇÃO (para outros scripts)
// ------------------------------

// Torna tudo disponível GLOBALMENTE (window) para os outros arquivos JS usarem.
window.TAMANHO_REGISTRO = TAMANHO_REGISTRO;
window.OFFSET_ID = OFFSET_ID;
window.OFFSET_NOME = OFFSET_NOME;
window.OFFSET_PRECO = OFFSET_PRECO;
window.OFFSET_QUANTIDADE = OFFSET_QUANTIDADE;

window.carregarDados = carregarDados;
window.salvarDados = salvarDados;
window.contarRegistros = contarRegistros;
window.produtoParaBytes = produtoParaBytes;
window.bytesParaProduto = bytesParaProduto;
// Exporta os wrappers também, caso alguém precise converter tipos avulsos
window.intParaBytes = intParaBytes;
window.bytesParaInt = bytesParaInt;
window.doubleParaBytes = doubleParaBytes;
window.bytesParaDouble = bytesParaDouble;
window.stringParaBytes = stringParaBytes;
window.bytesParaString = bytesParaString;