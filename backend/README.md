# Backend - FTV-Scout API

API REST desenvolvida com FastAPI.

## Pré-requisitos

- Python 3.13 ou superior
- Poetry (gerenciador de dependências)

## Instalação e Configuração

### 1. Instalar Dependências

```bash
# Navegue até a pasta do backend
cd backend

# Instale as dependências do projeto
poetry install

# Ative o ambiente virtual
poetry shell
```

### 2. Inicializar o Banco de Dados

```bash
# Execute o script de inicialização (apenas na primeira vez)
poetry run python init_db.py
```

Este comando cria o arquivo `dados.db` e popula o banco com dados iniciais:
- Tipos de ação (Saque, Ataque, Defesa, etc.)
- Técnicas (Cabeça, Peito, Shark, etc.)
- Motivos de Ponto (Ataque, Saque, Erro forçado, etc.)

## Executando a Aplicação

### Modo Desenvolvimento

```bash
# Com o poetry shell ativado
fastapi dev ./src/main.py

# Ou sem ativar o shell
poetry run fastapi dev ./src/main.py
```

A API estará disponível em:
- **API**: http://localhost:8000
- **Documentação Swagger**: http://localhost:8000/docs
- **Documentação ReDoc**: http://localhost:8000/redoc


## 📁 Estrutura do Projeto

```
backend/
├── src/
│   ├── atletas/          # Módulo de atletas
│   │   ├── models.py     # Modelo de dados
│   │   ├── schemas.py    # Schemas Pydantic
│   │   ├── services.py   # Lógica de negócio
│   │   └── routes.py     # Endpoints da API
│   ├── duplas/           # Módulo de duplas
│   ├── partidas/         # Módulo de partidas
│   ├── pontuacao/        # Módulo de pontuação
│   ├── estatisticas/     # Módulo de estatísticas
│   ├── core/             # Configurações e database
│   │   ├── database.py   # Conexão com banco
│   │   └── config.py     # Configurações gerais
│   └── main.py           # Aplicação FastAPI
├── tests/                # Testes automatizados
├── init_db.py            # Script de inicialização do DB
├── pyproject.toml        # Dependências e configurações
└── dados.db              # Banco de dados SQLite
```


## Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
2. Commit suas mudanças usando Conventional Commits
3. Push para a branch (`git push origin feature/nova-feature`)
4. Abra um Pull Request

## Licença

GPL-3.0 License
