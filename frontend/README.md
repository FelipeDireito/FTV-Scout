# Frontend - FTV-Scout

Interface web responsiva desenvolvida com React.


## Pré-requisitos

- Node.js 18 ou superior
- npm ou yarn
- Backend rodando em `http://localhost:8000`

## Instalação e Configuração

### 1. Instalar Dependências

```bash
# Navegue até a pasta do frontend
cd frontend

# Instale as dependências
npm install

```


## Executando a Aplicação


```bash
# Inicia o servidor de desenvolvimento
npm run dev

```

A aplicação estará disponível em:
- **HTTPS**: https://localhost:5173
- **HTTP Network**: https://[SEU_IP]:5173

> ⚠️ O frontend usa HTTPS com certificado auto-assinado. Aceite o aviso de segurança no navegador.

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/           # Componentes reutilizáveis
│   │   ├── ButtonAtleta.jsx  # Botão de atleta na partida
│   │   ├── DisplayQuadra.jsx # Visualização da quadra
│   │   ├── Header.jsx        # Cabeçalho da aplicação
│   │   └── ...
│   ├── pages/                # Páginas da aplicação
│   │   ├── Home.jsx          # Página inicial
│   │   ├── Partida/          # Página de partida
│   │   │   ├── index.jsx     # Componente principal
│   │   │   ├── useControlePartida.jsx
│   │   │   ├── useRallyLogica.jsx
│   │   │   └── ...
│   │   ├── HistoricoAtleta/  # Estatísticas de atleta
│   │   ├── HistoricoDupla/   # Estatísticas de dupla
│   │   └── ...
│   ├── hooks/                # Custom hooks globais
│   ├── services/             # Serviços de API
│   │   └── api.js            # Cliente Axios configurado
│   ├── constants/            # Constantes da aplicação
│   │   ├── acoes.js          # Tipos de ação
│   │   └── tecnicas.js       # Técnicas disponíveis
│   ├── App.jsx               # Componente raiz
│   ├── main.jsx              # Entry point
│   └── index.css             # Estilos globais
├── public/                   # Arquivos estáticos
│   ├── manifest.json         # Manifesto PWA
│   └── icons/                # Ícones do app
├── tests/                    # Testes automatizados
├── vite.config.js            # Configuração do Vite
├── tailwind.config.js        # Configuração do Tailwind
├── eslint.config.js          # Configuração do ESLint
└── package.json              # Dependências e scripts
```

### Acesso Externo com Ngrok

```bash
# Instale o ngrok
# https://ngrok.com/download

# Exponha o frontend
ngrok http https://localhost:5173

# Use a URL fornecida (ex: https://abc123.ngrok.io)
```

## 🔌 Integração com Backend

O frontend usa proxy reverso configurado no `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

Todas as requisições para `/api/*` são redirecionadas para o backend automaticamente.


## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Siga as convenções de código (ESLint)
3. Adicione testes para novas funcionalidades
4. Commit usando Conventional Commits
5. Push para a branch (`git push origin feature/nova-feature`)
6. Abra um Pull Request

## Licença

GPL-3.0 License
