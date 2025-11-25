import pytest
from fastapi.testclient import TestClient


def test_criar_atleta(client: TestClient):
    """Testa a criação de um atleta."""
    atleta_data = {
        "nome_atleta": "Joao Silva",
    }
    
    response = client.post("/api/v1/atletas", json=atleta_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["nome_atleta"] == atleta_data["nome_atleta"]


def test_listar_atletas_vazio(client: TestClient):
    """Testa listagem de atletas quando não há nenhum."""
    response = client.get("/api/v1/atletas")
    assert response.status_code == 200
    assert response.json() == []


def test_listar_atletas(client: TestClient):
    """Testa listagem de atletas."""
    atleta1 = {"nome_atleta": "Atleta 1"}
    atleta2 = {"nome_atleta": "Atleta 2"}
    
    client.post("/api/v1/atletas", json=atleta1)
    client.post("/api/v1/atletas", json=atleta2)
    
    response = client.get("/api/v1/atletas")
    assert response.status_code == 200
    
    atletas = response.json()
    assert len(atletas) == 2
    assert atletas[0]["nome_atleta"] == "Atleta 1"
    assert atletas[1]["nome_atleta"] == "Atleta 2"


def test_buscar_atleta_por_id(client: TestClient):
    """Testa busca de atleta por ID."""
    atleta_data = {"nome_atleta": "Teste"}
    create_response = client.post("/api/v1/atletas", json=atleta_data)
    atleta_id = create_response.json()["atleta_id"]

    response = client.get(f"/api/v1/atletas/{atleta_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["atleta_id"] == atleta_id
    assert data["nome_atleta"] == "Teste"


def test_buscar_atleta_inexistente(client: TestClient):
    """Testa busca de atleta que não existe."""
    response = client.get("/api/v1/atletas/99999")
    assert response.status_code == 404


def test_deletar_atleta(client: TestClient):
    """Testa deleção de atleta"""

    atleta_data = {"nome_atleta": "Para Deletar"}
    create_response = client.post("/api/v1/atletas", json=atleta_data)
    atleta_id = create_response.json()["atleta_id"]
    
    response = client.delete(f"/api/v1/atletas/{atleta_id}")
    assert response.status_code == 200
    
    get_response = client.get(f"/api/v1/atletas/{atleta_id}")
    assert get_response.status_code == 404
