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

### Descrição dos Arquivos

#### `index.html`
- Estrutura HTML semântica
- Formulário de reserva completo
- Painel administrativo
- Modais e componentes de UI

#### `css/styles.css`
- Design system completo
- Layout responsivo
- Animações e transições
- Componentes reutilizáveis

#### `js/utils.js`
- Funções de formatação (CPF, telefone, data)
- Validações básicas
- Manipulação de DOM
- Gerenciamento de localStorage

#### `js/validation.js`
- Validação em tempo real
- Máscaras de input
- Verificação de disponibilidade
- Classes de validação

#### `js/api.js`
- Classe API para comunicação
- Endpoints organizados por funcionalidade
- Tratamento de erros
- Funções de exportação

#### `js/app.js`
- Lógica principal da aplicação
- Gerenciamento de estado
- Event handlers
- Navegação entre seções

## 🚀 Instalação e Configuração

### Pré-requisitos
- Servidor web (Apache, Nginx, ou servidor local)
- API REST rodando em `http://localhost:3000`
- Navegador moderno (Chrome, Firefox, Safari, Edge)

### Passos para Instalação
1. **Clone ou baixe o projeto**
   ```bash
   git clone [url-do-repositorio]
   cd reserva-web
   ```

2. **Configure o servidor web**
   - Coloque os arquivos em um diretório do seu servidor web
   - Ou use um servidor local como Live Server (VS Code)

3. **Verifique a API**
   - Certifique-se de que a API está rodando em `http://localhost:3000`
   - Acesse `http://localhost:3000/api-docs` para verificar a documentação

4. **Acesse a aplicação**
   ```bash
   npm start
   ```
   - Acesse `http://localhost:4000`
   ```

### Configuração da API
A aplicação espera que a API esteja disponível em `http://localhost:3000` com os seguintes endpoints:

#### Reservas
- `POST /api/reservas` - Criar uma nova reserva
- `GET /api/reservas/disponibilidade` - Verificar disponibilidade de datas
- `GET /api/reservas/verificar/{cpf}` - Verificar se CPF tem reserva ativa

#### Administrador
- `POST /api/admin/login` - Login de administrador
- `GET /api/admin/reservas` - Listar todas as reservas
- `GET /api/admin/reservas/{data}` - Listar reservas por data
- `GET /api/admin/estatisticas` - Obter estatísticas das reservas

## 📖 Como Usar

### Para Clientes

1. **Acesse a aplicação**
   - Abra o navegador e vá para a página principal

2. **Preencha o formulário**
   - Nome completo (obrigatório)
   - CPF válido (obrigatório)
   - Telefone com DDD (obrigatório)
   - Quantidade de pessoas (1-4)
   - Data da reserva (hoje ou futuro)

3. **Confirme a reserva**
   - Clique em "Confirmar Reserva"
   - Aguarde a confirmação

### Para Administradores
1. **Acesse o login**
   - Clique em "Administrador" no menu

2. **Faça login**
   - Digite usuário e senha
   - Clique em "Entrar"

3. **Gerencie reservas**
   - Visualize estatísticas
   - Liste todas as reservas
   - Filtre por data
   - Cancele reservas se necessário
   - Exporte dados

## 🔌 API Endpoints

### Reservas
```
POST   /api/reservas                    # Criar uma nova reserva
GET    /api/reservas/disponibilidade    # Verificar disponibilidade de datas
GET    /api/reservas/verificar/{cpf}    # Verificar se CPF tem reserva ativa
```

### Administrador
```
POST   /api/admin/login                 # Login de administrador
GET    /api/admin/reservas              # Listar todas as reservas
GET    /api/admin/reservas/{data}       # Listar reservas por data
GET    /api/admin/estatisticas          # Obter estatísticas das reservas
```

## 📋 Requisitos Funcionais

| ID   | Título do Requisito                              | Status |
|------|--------------------------------------------------|--------|
| RF01 | Cadastro de Reserva                              | ✅     |
| RF02 | Limite de uma reserva por CPF                    | ✅     |
| RF03 | Limite de mesas por dia                          | ✅     |
| RF04 | Validação de CPF                                 | ✅     |
| RF05 | Campo obrigatório: Nome completo                 | ✅     |
| RF06 | Campo obrigatório: Número de celular com DDD     | ✅     |
| RF07 | Campo obrigatório: Quantidade de pessoas (1 a 4) | ✅     |
| RF08 | Campo obrigatório: Data da reserva               | ✅     |
| RF09 | Seletor de data com disponibilidade              | ✅     |
| RF10 | Datas indisponíveis bloqueadas                   | ✅     |
| RF11 | Confirmação da reserva                           | ✅     |
| RF12 | Identificação única por CPF                      | ✅     |
| RF13 | Site acessível para usuários                     | ✅     |
| RF14 | Página de login para administrador               | ✅     |
| RF15 | Relatório de reservas para administrador         | ✅     |
| RF16 | Mensagem para CPF com reserva ativa              | ✅     |

---

**Projeto de Portifólio Pessoal da Mentoria 2.0 do Júlio de Lima** 
