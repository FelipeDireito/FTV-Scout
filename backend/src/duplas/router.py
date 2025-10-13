from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.duplas.schemas import Dupla, DuplaLeitura, AdicionarAtletaDupla
from src.duplas.services import criar_dupla, listar_dupla, adicionar_atleta_a_dupla, obtem_dupla


duplas_router = APIRouter(tags=["duplas"], prefix="/duplas")

@duplas_router.post("", response_model=DuplaLeitura)
def cadastrar_dupla(dupla: Dupla, db: Session = Depends(get_db)):
    db_dupla = criar_dupla(db, dupla.nome_dupla, dupla.atletas_ids)
    return DuplaLeitura(
        dupla_id=db_dupla.dupla_id,
        nome_dupla=db_dupla.nome_dupla,
        atletas_ids=[a.atleta_id for a in db_dupla.atletas]
    )

@duplas_router.get("/{dupla_id}")
def obter_dupla(dupla_id: int, db: Session = Depends(get_db)):
    return obtem_dupla(db, dupla_id)

@duplas_router.get("")
def listar_duplas(db: Session = Depends(get_db)):
    duplas = listar_dupla(db)
    # return duplas
    return [
        DuplaLeitura(
            dupla_id=d.dupla_id,
            nome_dupla=d.nome_dupla,
            atletas_ids=[a.atleta_id for a in d.atletas]
        ) for d in duplas
    ]


@duplas_router.post("/adicionar_atleta")
def adicionar_atleta_dupla(dados: AdicionarAtletaDupla, db: Session = Depends(get_db)):
    return adicionar_atleta_a_dupla(db, dados.dupla_id, dados.atleta_id)

