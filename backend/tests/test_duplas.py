import pytest
from fastapi.testclient import TestClient


@pytest.fixture
def atletas_criados(client: TestClient):
    """Cria atletas para usar nos testes de duplas."""
    atleta1 = client.post("/api/v1/atletas", json={
        "nome_atleta": "Atleta 1"
    }).json()
    
    atleta2 = client.post("/api/v1/atletas", json={
        "nome_atleta": "Atleta 2"
    }).json()
    
    return atleta1["atleta_id"], atleta2["atleta_id"]


def test_criar_dupla(client: TestClient, atletas_criados):
    """Testa a criação de uma dupla."""
    atleta1_id, atleta2_id = atletas_criados

    dupla_data = {
        "nome_dupla": "Dupla Teste",
        "atletas_ids": [atleta1_id, atleta2_id]
    }
    
    response = client.post("/api/v1/duplas", json=dupla_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["nome_dupla"] == "Dupla Teste"
    assert data["atletas_ids"] == [atleta1_id, atleta2_id]
    assert "dupla_id" in data


def test_listar_duplas_vazio(client: TestClient):
    """Testa listagem de duplas quando não há nenhuma."""
    response = client.get("/api/v1/duplas")
    assert response.status_code == 200
    assert response.json() == []


def test_listar_duplas(client: TestClient, atletas_criados):
    """Testa listagem de duplas."""
    atleta1_id, atleta2_id = atletas_criados
    
    dupla_data = {
        "nome_dupla": "Dupla 1",
        "atletas_ids": [atleta1_id, atleta2_id]
    }
    client.post("/api/v1/duplas", json=dupla_data)
    
    response = client.get("/api/v1/duplas")
    assert response.status_code == 200
    
    duplas = response.json()
    assert len(duplas) == 1
    assert duplas[0]["nome_dupla"] == "Dupla 1"


def test_buscar_dupla_por_id(client: TestClient, atletas_criados):
    """Testa busca de dupla por ID."""
    atleta1_id, atleta2_id = atletas_criados
    
    dupla_data = {
        "nome_dupla": "Dupla Teste",
        "atletas_ids": [atleta1_id, atleta2_id]
    }
    create_response = client.post("/api/v1/duplas", json=dupla_data)
    dupla_id = create_response.json()["dupla_id"]
    
    response = client.get(f"/api/v1/duplas/{dupla_id}")
    assert response.status_code == 200
    
    data = response.json()
    assert data["dupla_id"] == dupla_id
    assert data["nome_dupla"] == "Dupla Teste"


def test_buscar_dupla_inexistente(client: TestClient):
    """Testa busca de dupla que não existe."""
    response = client.get("/api/v1/duplas/99999")
    assert response.status_code == 404


