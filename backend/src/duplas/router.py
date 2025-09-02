from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from src.core.database import get_db
from src.duplas.schemas import Dupla, DuplaLeitura
from src.duplas.services import criar_dupla, listar_dupla


duplas_router = APIRouter(tags=["duplas"], prefix="/duplas")

@duplas_router.post("", response_model=DuplaLeitura)
def cadastrar_dupla(dupla: Dupla, db: Session = Depends(get_db)):
    db_dupla = criar_dupla(db, dupla.nome_dupla, dupla.atletas_ids)
    return DuplaLeitura(
        dupla_id=db_dupla.dupla_id,
        nome_dupla=db_dupla.nome_dupla,
        atletas_ids=[a.atleta_id for a in db_dupla.atletas]
    )


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
