# Sistema de Reservas - Restaurante
Uma aplicação web moderna e responsiva para gerenciamento de reservas de restaurante, desenvolvida em HTML, CSS e JavaScript puro, que consome a API Reserva-api (`https://github.com/dmurai01/reserva-api.git`).

## ✨ Funcionalidades
### Para Clientes
- ✅ Cadastro de reservas com validação completa
- ✅ Verificação de disponibilidade em tempo real
- ✅ Validação de CPF com algoritmo oficial
- ✅ Máscaras automáticas para CPF e telefone
- ✅ Seleção de quantidade de pessoas (1-4)
- ✅ Confirmação visual da reserva
- ✅ Interface responsiva e acessível

### Para Administradores
- ✅ Login seguro com autenticação
- ✅ Dashboard com estatísticas em tempo real
- ✅ Lista completa de reservas com filtros
- ✅ Cancelamento de reservas
- ✅ Exportação de dados (CSV/JSON)
- ✅ Relatórios detalhados
- ✅ Gerenciamento de configurações

## 📁 Estrutura do Projeto

```
reserva-web/
├── index.html              # Página principal
├── css/
│   └── styles.css          # Estilos da aplicação
├── js/
│   ├── utils.js            # Funções utilitárias
│   ├── validation.js       # Validações e formatações
│   ├── api.js             # Comunicação com API
│   └── app.js             # Lógica principal
└── README.md              # Documentação
```

## 🚀 Instalação e Configuração

### Passos para Instalação
1. **Clone ou baixe o projeto**
   ```bash
   git clone `https://github.com/dmurai01/reserva-web.git`
   cd reserva-web
   ```
2. **Instale as dependências** (se ainda não instalou):
   ```bash
   npm install
   ```

3. **Verifique a API**
   - A API deve estar baixada e instalada (`https://github.com/dmurai01/reserva-api.git`)
   - Certifique-se de que a API está rodando em `http://localhost:3000`
   - Acesse `http://localhost:3000/api-docs` para verificar a documentação

4. **Acesse a aplicação**
   ```bash
   npm start
   ```
   - Acesse `http://localhost:4000`
   - Admin `http://localhost:4000/admin.html`
   ```

### Padrões de Código
- **JavaScript**: ES6+ com semicolons
- **CSS**: BEM methodology
- **HTML**: Semântico e acessível
- **Comentários**: Em português
- **Indentação**: 4 espaços

### Documentações do Projeto
- Acesse `https://github.com/dmurai01/reserva-web/wiki`

### Instrução para execução dos testes automatizados

1. **Certifique-se de que a aplicação está rodando**
   ```bash
   npm start
   ```

2. **Execute os testes automatizados**
   ```bash
   npx cypress run
   ```
   Ou para abrir o Cypress em modo interativo:
   ```bash
   npx cypress open
   ```

3. **Visualize os relatórios de testes**
   - Após a execução dos testes, os relatórios HTML serão gerados na pasta `cypress/reports`
   - Abra o arquivo `cypress/reports/html/index.html` no seu navegador para visualizar o relatório detalhado
   - Os relatórios incluem:
     - Resumo de testes passados/falhados
     - Tempo de execução
     - Screenshots de falhas (quando ocorrem)
     - Detalhes de cada caso de teste

4. **Estrutura dos testes**
   - Os testes estão organizados em arquivos `.cy.js` na pasta `cypress/e2e/`
   - Testes de reserva: `cypress/e2e/reserva.cy.js`
   - Testes de administração: `cypress/e2e/admin.cy.js`
