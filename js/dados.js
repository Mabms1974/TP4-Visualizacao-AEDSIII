/**
 * dados.js – Camada de persistência e conversão de tipos para bytes.
 * Define tamanhos fixos dos campos, offsets, e funções para salvar/carregar
 * o vetor de bytes no LocalStorage.
 */

// ---------- Estrutura do registro ----------
const TAMANHO_ID        = 4;
const TAMANHO_NOME      = 50;
const TAMANHO_PRECO     = 8;
const TAMANHO_QUANTIDADE = 4;
const TAMANHO_REGISTRO = TAMANHO_ID + TAMANHO_NOME + TAMANHO_PRECO + TAMANHO_QUANTIDADE;

const OFFSET_ID         = 0;
const OFFSET_NOME       = OFFSET_ID + TAMANHO_ID;
const OFFSET_PRECO      = OFFSET_NOME + TAMANHO_NOME;
const OFFSET_QUANTIDADE = OFFSET_PRECO + TAMANHO_PRECO;

const STORAGE_KEY = 'produtos_bytes';

// ---------- Wrappers de conversão (usam ByteStream) ----------
function intParaBytes(v)        { return ByteStream.writeInt(v); }
function bytesParaInt(b)        { return ByteStream.readInt(b); }
function doubleParaBytes(v)     { return ByteStream.writeDouble(v); }
function bytesParaDouble(b)     { return ByteStream.readDouble(b); }

/**
 * stringParaBytes – Converte string para bytes com tamanho fixo.
 * Preenche com zeros à direita se for mais curta.
 */
function stringParaBytes(str, maxLen) {
    let bytes = ByteStream.writeString(String(str));
    const out = new Int8Array(maxLen);
    const copyLen = Math.min(bytes.length, maxLen);
    for (let i = 0; i < copyLen; i++) out[i] = bytes[i];
    return out;
}

/**
 * bytesParaString – Extrai string de bytes de tamanho fixo,
 * ignorando os zeros de preenchimento.
 */
function bytesParaString(bytes, maxLen) {
    const copy = new Int8Array(bytes);
    let realLen = 0;
    for (let i = 0; i < maxLen; i++) {
        if (copy[i] !== 0) realLen = i + 1;
    }
    if (realLen === 0) return "";
    const valid = copy.slice(0, realLen);
    return ByteStream.readString(valid);
}

/**
 * produtoParaBytes – Monta o registro de bytes a partir de um objeto produto.
 */
function produtoParaBytes(prod) {
    const reg = new Int8Array(TAMANHO_REGISTRO);
    reg.set(intParaBytes(prod.id), OFFSET_ID);
    reg.set(stringParaBytes(prod.nome, TAMANHO_NOME), OFFSET_NOME);
    reg.set(doubleParaBytes(prod.preco), OFFSET_PRECO);
    reg.set(intParaBytes(prod.quantidade), OFFSET_QUANTIDADE);
    return reg;
}

/**
 * bytesParaProduto – Extrai um objeto produto a partir de bytes, dado um offset.
 */
function bytesParaProduto(byteArray, offset) {
    const arr = byteArray instanceof Int8Array ? byteArray : new Int8Array(byteArray);
    const idB = arr.slice(offset + OFFSET_ID, offset + OFFSET_ID + TAMANHO_ID);
    const nomeB = arr.slice(offset + OFFSET_NOME, offset + OFFSET_NOME + TAMANHO_NOME);
    const precoB = arr.slice(offset + OFFSET_PRECO, offset + OFFSET_PRECO + TAMANHO_PRECO);
    const qtdB = arr.slice(offset + OFFSET_QUANTIDADE, offset + OFFSET_QUANTIDADE + TAMANHO_QUANTIDADE);
    return {
        id: bytesParaInt(idB),
        nome: bytesParaString(nomeB, TAMANHO_NOME),
        preco: bytesParaDouble(precoB),
        quantidade: bytesParaInt(qtdB)
    };
}

// ---------- Persistência no LocalStorage ----------
function carregarDados() {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados === null) return new Int8Array(0);
    return new Int8Array(JSON.parse(dados));
}

function salvarDados(byteArray) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(byteArray)));
}

function contarRegistros() {
    const d = carregarDados();
    return Math.floor(d.length / TAMANHO_REGISTRO);
}

// ---------- Exportação global ----------
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
window.intParaBytes = intParaBytes;
window.bytesParaInt = bytesParaInt;
window.doubleParaBytes = doubleParaBytes;
window.bytesParaDouble = bytesParaDouble;
window.stringParaBytes = stringParaBytes;
window.bytesParaString = bytesParaString;