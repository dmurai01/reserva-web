# 🚀 Instruções para Executar na Porta 4000

## Opção 1: Usando npm (Recomendado)

### Pré-requisitos
- Node.js instalado
- API REST rodando em `http://localhost:3000`

### Passos
1. **Instale as dependências** (se ainda não instalou):
   ```bash
   npm install
   ```

2. **Execute a aplicação**:
   ```bash
   npm start
   ```

3. **Acesse no navegador**:
   ```
   http://localhost:4000
   ```

## Opção 2: Usando npm run dev (Desenvolvimento)

Para desenvolvimento com auto-reload:

```bash
npm run dev
```

A aplicação será aberta automaticamente em `http://localhost:4000`

## Opção 3: Usando http-server diretamente

```bash
npx http-server -p 4000 -o
```

## Opção 4: Usando live-server diretamente

```bash
npx live-server --port=4000 --open=/
```

## ⚠️ Importante

- Certifique-se de que a **API REST está rodando em `http://localhost:3000`**
- A aplicação frontend rodará em `http://localhost:4000`
- Se a API estiver em uma porta diferente, edite o arquivo `js/utils.js` e altere a constante `API_BASE_URL`

## 🔧 Configuração da API

A aplicação espera que a API esteja disponível com os seguintes endpoints:

### Reservas
- `POST /api/reservas` - Criar uma nova reserva
- `GET /api/reservas/disponibilidade` - Verificar disponibilidade de datas
- `GET /api/reservas/verificar/{cpf}` - Verificar se CPF tem reserva ativa

### Administrador
- `POST /api/admin/login` - Login de administrador
- `GET /api/admin/reservas` - Listar todas as reservas
- `GET /api/admin/reservas/{data}` - Listar reservas por data
- `GET /api/admin/estatisticas` - Obter estatísticas das reservas

## 🐛 Solução de Problemas

**Erro: "Cannot find module 'http-server'"**
```bash
npm install -g http-server
```

**Erro: "Cannot find module 'live-server'"**
```bash
npm install -g live-server
```

**Aplicação não conecta com a API**
- Verifique se a API está rodando em `http://localhost:3000`
- Acesse `http://localhost:3000/api-docs` para verificar

**Porta 4000 já está em uso**
```bash
# Encontre o processo usando a porta
netstat -ano | findstr :4000

# Encerre o processo (substitua PID pelo número do processo)
taskkill /PID <PID> /F
```

## 📱 Acesso

- **Frontend**: http://localhost:4000
- **API**: http://localhost:3000
- **Documentação da API**: http://localhost:3000/api-docs 