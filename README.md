# Sistema de Reservas - Restaurante

Uma aplicação web moderna e responsiva para gerenciamento de reservas de restaurante, desenvolvida em HTML, CSS e JavaScript puro, que consome uma API REST.

## 🎯 Visão Geral

O Sistema de Reservas é uma aplicação web completa que permite aos clientes fazerem reservas em um restaurante de forma simples e intuitiva, enquanto oferece aos administradores um painel completo para gerenciar todas as reservas.

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

## 🛠 Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Design moderno com Flexbox e Grid
- **JavaScript ES6+**: Lógica de negócio e interações
- **Font Awesome**: Ícones modernos
- **Google Fonts**: Tipografia Inter

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

