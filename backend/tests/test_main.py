import pytest
from fastapi.testclient import TestClient


def test_read_root(client: TestClient):
    """Testa o endpoint raiz."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"Hello": "World"}


def test_cors_headers(client: TestClient):
    """Testa se os headers CORS estão configurados."""
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "*"


def test_api_documentation_available(client: TestClient):
    """Testa se a documentação da API está disponível."""
    response = client.get("/docs")
    assert response.status_code == 200
    
    response = client.get("/openapi.json")
    assert response.status_code == 200
    assert "openapi" in response.json()
