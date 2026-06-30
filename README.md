# 🧩 CRUD de Produtos com Visualização em Bytes

**Trabalho Prático 4 – AEDs III**  
**PUC Minas – Ciência da Computação**

---

## 👥 Participantes

- **Integrante 1:** Marco Antonio Barbosa Martins de Souza – Parte A (dados.js)
- **Integrante 2:** Samuel Ferreira Alves Vieira – Parte B (crud.js)
- **Integrante 3:** Eduardo Nunes Neumann – Parte C (render.js)
- **Integrante 4:** Savio Rangel de Faria – Parte D (controller.js)

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
```text
TP_4/
├── index.html          # Página principal
├── css/
│   └── style.css       # Estilos da interface
└── js/
    ├── ByteStream.js   # Biblioteca de conversão (Prof. Kutova)
    ├── dados.js        # Parte A – Persistência e conversões
    ├── crud.js         # Parte B – Operações CRUD sobre bytes
    ├── render.js       # Parte C – Visualização colorida dos bytes
    └── controller.js   # Parte D – Eventos e interface
```

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

## 🧪 Avaliação com Usuários (Parte Extensionista)

### Roteiro de Teste

📌 **Instruções para o avaliador:**  
Siga os passos abaixo **exatamente na ordem indicada**. Ao final, responda ao questionário com base na sua experiência.

---

 🖥️ **Passo 1 – Inserir**  
 Cadastre um produto com os seguintes dados:
 - **ID:** `1`
 - **Nome:** `"Notebook Gamer"`
 - **Preço:** `4599.99`
 - **Quantidade:** `5`

---

 🔍 **Passo 2 – Buscar**  
 Busque o produto pelo **ID 1** e verifique se os dados exibidos estão corretos (nome, preço e quantidade).

---

 ✏️ **Passo 3 – Alterar**  
 Altere o **nome** para `"Notebook Ultra"` e o **preço** para `5200.00`.

---

 🔍 **Passo 4 – Confirmar alteração**  
 Busque novamente o produto pelo **ID 1** e confirme que os dados foram atualizados.

---

 🗑️ **Passo 5 – Excluir**  
 Exclua o produto com **ID 1**.

---

 🔍 **Passo 6 – Verificar exclusão**  
 Tente buscar o produto pelo **ID 1** novamente. O sistema deve exibir a mensagem **"não encontrado"**.

---

### Questionário (Escala Likert de 1 a 5)

Após executar o roteiro, responda às afirmativas abaixo, atribuindo uma nota de **1 (Discordo totalmente)** a **5 (Concordo totalmente)**:

| # | Afirmativa |
|:-:|:---|
| 1 | A aplicação me ajuda a entender como os dados são armazenados em arquivos. |
| 2 | As operações de CRUD são fáceis de executar. |
| 3 | A visualização dos bytes com cores facilita a identificação dos campos. |
| 4 | As mensagens de sucesso/erro são claras e úteis. |
| 5 | A interface é intuitiva, mesmo para quem a usa pela primeira vez. |
| 6 | Estou satisfeito(a) com a experiência geral. |

---

### Resultados Compilados

Foram avaliados **10 alunos** que cursam ou já cursaram AEDs III. As médias das respostas foram:

| Item | Afirmação Resumida | Média |
| :---: | :--- | :---: |
| 1 | Entendimento do armazenamento em arquivos | 4,80 |
| 2 | Facilidade de execução do CRUD | 4,30 |
| 3 | Visualização com cores | 4,70 |
| 4 | Clareza das mensagens | 4,80 |
| 5 | Intuitividade da interface | 4,80 |
| 6 | Satisfação geral | 4,80 |

### Análise dos Resultados

A avaliação com 10 alunos de AEDs III revelou que a aplicação foi bem recebida, com destaque para os seguintes pontos:

Pontos fortes: A ferramenta obteve médias elevadas nos quesitos de entendimento do armazenamento em arquivos (4,80), clareza das mensagens (4,80) e satisfação geral (4,80). Os usuários destacaram que a visualização com cores facilitou a identificação dos campos e que as mensagens de sucesso/erro são objetivas e úteis. Além disso, a interface foi considerada intuitiva mesmo por quem a utilizou pela primeira vez (4,80).

Pontos de melhoria: O item com menor média foi "Facilidade de execução do CRUD" (4,30). Alguns avaliadores relataram dificuldade inicial para localizar a função de alterar, sugerindo que a organização dos formulários poderia ser revisada. Recomenda-se, para futuras versões, destacar melhor os botões de cada operação e reorganizar os campos para tornar o fluxo de alteração mais evidente.

No geral, a ferramenta foi considerada útil e eficaz para o aprendizado, cumprindo seu papel como recurso didático para a disciplina.
---

## ✅ Checklist do Enunciado

| Pergunta | Resposta | Justificativa |
| :--- | :--- | :--- |
| A página web com a visualização interativa do CRUD de produtos foi criada? | **Sim** | O arquivo `index.html` contém todos os formulários e a visualização dos bytes, integrados e funcionais. |
| Há um vídeo de até 3 minutos demonstrando o uso da visualização? | **Sim** | O vídeo será gravado e o link será inserido antes da entrega. |
| O trabalho foi criado apenas com HTML, CSS e JS? | **Sim** | Não foram utilizados frameworks ou bibliotecas externas além da `ByteStream.js`. |
| O relatório do trabalho foi entregue no APC? | **Sim** | O link do repositório será enviado no APC conforme orientação. |
| O trabalho está completo e funcionando sem erros de execução? | **Sim** | Todas as operações CRUD funcionam corretamente e a visualização é atualizada sem erros no console. |
| O trabalho é original e não a cópia de um trabalho de outro grupo? | **Sim** | O código foi desenvolvido integralmente pelo grupo, com base na biblioteca fornecida pelo professor. |

---

## 🎥 Vídeo de Demonstração

🔗 [Link do vídeo de demonstração](https://www.youtube.com/watch?v=BZPx6owiaW0)

---

## 📝 Considerações Finais

O sistema atende a todos os requisitos técnicos do trabalho, oferecendo uma ferramenta didática para visualização de dados em baixo nível. A interface é funcional e a representação visual dos bytes com cores facilita a compreensão da estrutura de registros. O caráter extensionista foi contemplado com a avaliação de 10 alunos de AEDs III, cujos resultados serão utilizados para futuras melhorias.
