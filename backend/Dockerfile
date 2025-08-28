FROM python:3.13-slim
ENV POETRY_VIRTUALENVS_CREATE=false

WORKDIR /app

RUN pip install poetry

COPY pyproject.toml poetry.lock* ./
RUN poetry config installer.max-workers 10
RUN poetry install --no-interaction --no-ansi --no-root

COPY . .

EXPOSE 8000

# CMD poetry run uvicorn --host 0.0.0.0 --port 8000 src.main:app
CMD ["poetry", "run", "uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]