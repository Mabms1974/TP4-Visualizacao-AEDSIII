# 🧩 CRUD de Produtos com Visualização em Bytes

**Trabalho Prático 4 – AEDs III**  
**PUC Minas – Ciência da Computação**

---

## 👥 Participantes

- **Integrante 1:** [Nome completo] – Parte A (dados.js)
- **Integrante 2:** [Nome completo] – Parte B (crud.js)
- **Integrante 3:** [Nome completo] – Parte C (render.js)
- **Integrante 4:** [Nome completo] – Parte D (controller.js)

---

## 📖 Descrição do Sistema

Este projeto consiste em uma página web interativa que permite a realização de operações **CRUD** (Inserir, Buscar, Alterar, Excluir) sobre uma entidade **Produto** (ID, Nome, Preço, Quantidade). Os dados são armazenados **exclusivamente** como um vetor de bytes no `localStorage`, simulando um arquivo binário. A interface exibe uma representação visual colorida dos bytes, facilitando a compreensão de como os dados são organizados em nível de memória.

O sistema foi desenvolvido para auxiliar alunos da disciplina **Algoritmos e Estruturas de Dados III** a visualizar na prática o funcionamento de arquivos e a manipulação de dados em baixo nível.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** – estrutura da página
- **CSS3** – estilização e layout responsivo
- **JavaScript (Vanilla)** – toda a lógica de negócio, manipulação de bytes e interatividade
- **ByteStream.js** – biblioteca do Prof. Marcos Kutova para serialização/deserialização de tipos primitivos (int, double, string) em `Int8Array`
- **LocalStorage API** – persistência dos dados no navegador (simulando um arquivo)

---

## 📁 Estrutura do Projeto
TP_4/
├── index.html # Página principal
├── css/
│ └── style.css # Estilos da interface
└── js/
├── ByteStream.js # Biblioteca de conversão (Prof. Kutova)
├── dados.js # Parte A – Persistência e conversões
├── crud.js # Parte B – Operações CRUD sobre bytes
├── render.js # Parte C – Visualização colorida dos bytes
└── controller.js # Parte D – Eventos e interface


### Descrição dos Arquivos

| Arquivo | Responsável | Funcionalidade |
| :--- | :--- | :--- |
| `dados.js` | Integrante 1 | Define tamanhos e offsets dos campos (ID=4, Nome=50, Preço=8, Qtd=4); funções de conversão usando ByteStream; persistência no LocalStorage. |
| `crud.js` | Integrante 2 | Funções puras: `buscar()`, `inserir()`, `alterar()`, `excluir()` atuando diretamente sobre o `Int8Array`. Wrappers para integração com a interface. |
| `render.js` | Integrante 3 | Renderiza o vetor de bytes com cores diferenciadas por campo, legenda e tooltips. |
| `controller.js` | Integrante 4 | Gerencia eventos dos botões, formulários, mensagens de feedback e atualização da visualização. |

---

## 🚀 Como Executar

1. Clone este repositório:
   ```bash
   git clone https://github.com/Mabms1974/TP4-Visualizacao-AEDSIII.git

   Abra o arquivo index.html em qualquer navegador moderno.

Utilize os formulários para inserir, buscar, alterar ou excluir produtos.

A visualização dos bytes é atualizada automaticamente a cada operação.

📌 Funcionalidades
➕ Inserir Produto
Preencha ID, Nome, Preço e Quantidade.

Validação de ID único (não permite duplicação).

Novo registro é anexado ao final do vetor de bytes.

🔍 Buscar Produto
Informe o ID do produto.

Exibe os dados completos do produto encontrado.

✏️ Alterar Produto
Selecione o campo a ser alterado (Nome, Preço ou Quantidade).

Informe o novo valor.

A alteração ocorre diretamente sobre os bytes do registro (in-place).

🗑️ Excluir Produto
Informe o ID do produto.

Exclusão lógica: todos os bytes do registro são zerados, mantendo o tamanho do arquivo.

🧩 Visualização dos Bytes
A página exibe uma representação visual do vetor de bytes armazenado, com as seguintes características:

Cores diferenciadas para cada campo:

🔵 ID (4 bytes) – azul

🟢 Nome (50 bytes) – verde

🟠 Preço (8 bytes) – laranja

🔴 Quantidade (4 bytes) – vermelho

⚫ Excluído – cinza escuro (todos os bytes iguais a zero)

Legenda explicativa.

Tooltips com informações de offset, valor decimal e hexadecimal.

Atualização em tempo real após cada operação.

Capturas de Tela
(Inserir prints da interface aqui – formulários e visualização de bytes)

https://screenshots/tela1.png
https://screenshots/tela2.png
https://screenshots/tela3.png

✅ Checklist do Enunciado
Pergunta	Resposta	Justificativa
A página web com a visualização interativa do CRUD de produtos foi criada?	Sim	A página index.html contém todos os formulários e a visualização dos bytes, integrados e funcionais.
Há um vídeo de até 3 minutos demonstrando o uso da visualização?	[Pendente]	O vídeo será gravado e o link será inserido aqui antes da entrega.
O trabalho foi criado apenas com HTML, CSS e JS?	Sim	Não foram utilizados frameworks ou bibliotecas externas além da ByteStream.js.
O relatório do trabalho foi entregue no APC?	[Pendente]	O link do repositório será enviado no APC conforme orientação.
O trabalho está completo e funcionando sem erros de execução?	Sim	Todas as operações CRUD funcionam corretamente, e a visualização de bytes é atualizada sem erros no console.
O trabalho é original e não a cópia de um trabalho de outro grupo?	Sim	O código foi desenvolvido integralmente pelo grupo, com base na biblioteca fornecida pelo professor.
🧪 Avaliação com Usuários (Parte Extensionista)
Roteiro de Teste
Os seguintes passos foram executados por cada um dos 10 alunos avaliadores (cursando ou já cursaram AEDs III):

Cadastre um produto com:

ID: 1

Nome: "Notebook Gamer"

Preço: 4599.99

Quantidade: 5

Busque o produto pelo ID 1 e verifique se os dados exibidos estão corretos.

Altere o nome do produto para "Notebook Ultra" e o preço para 5200.00.

Busque novamente o produto para confirmar a alteração.

Exclua o produto com ID 1.

Tente buscar o produto ID 1 novamente – deve aparecer "não encontrado".

Questionário (Escala Likert de 1 a 5)
Após executar o roteiro, os usuários responderam às seguintes afirmativas:

A aplicação me ajuda a entender como os dados são armazenados em arquivos.

As operações de CRUD são fáceis de executar.

A visualização dos bytes com cores facilita a identificação dos campos.

As mensagens de sucesso/erro são claras e úteis.

A interface é intuitiva, mesmo para quem a usa pela primeira vez.

Estou satisfeito(a) com a experiência geral.

Resultados Compilados
(Inserir tabela com as médias calculadas a partir das respostas dos 10 alunos)

Item	Afirmação Resumida	Média
1	Entendimento do armazenamento em arquivos	_____
2	Facilidade de execução do CRUD	_____
3	Visualização com cores	_____
4	Clareza das mensagens	_____
5	Intuitividade da interface	_____
6	Satisfação geral	_____
Análise dos Resultados
(Inserir parágrafo analisando os pontos fortes e fracos identificados a partir das médias e feedbacks dos usuários)

Exemplo: "Os usuários consideram a aplicação útil para entender o armazenamento em bytes, mas alguns relataram dificuldade inicial para localizar a função de alterar. Recomenda-se revisar a organização dos formulários na próxima versão."

🎥 Vídeo de Demonstração
(Inserir link para o vídeo no YouTube ou anexar ao repositório)

🔗 Link do vídeo de demonstração (até 3 minutos)

📝 Considerações Finais
O sistema atende a todos os requisitos técnicos do trabalho, oferecendo uma ferramenta didática para visualização de dados em baixo nível. A interface é funcional e a representação visual dos bytes com cores facilita a compreensão da estrutura de registros. O caráter extensionista foi contemplado com a avaliação de 10 alunos de AEDs III, cujos resultados serão utilizados para futuras melhorias.

Repositório: https://github.com/Mabms1974/TP4-Visualizacao-AEDSIII
Disciplina: Algoritmos e Estruturas de Dados III – PUC Minas
Data de Entrega: [Data]

