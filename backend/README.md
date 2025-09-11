# Comando importantes para o Backend

1. Rodar a aplicação no terminal com o Poetry

```bash
# Entre na pasta do backend
cd ./backend

# Entrar no ambiente configurado
poetry shell

# Rodar a aplicação
fastapi dev ./src/main.py
```

2. Inicializar o banco de dados

```bash
# Dentro da pasta backend e com o poetry shell ativado
poetry run python ./init_db.py
```
