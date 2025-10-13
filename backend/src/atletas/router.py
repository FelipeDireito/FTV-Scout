from fastapi import APIRouter, Depends

from src.atletas.services import criar_atleta, obter_todos_atletas, deleta_atleta, obtem_atleta
from src.atletas.schemas import Atleta
from src.core.database import get_db

from sqlalchemy.orm import Session

atletas_router = APIRouter(tags=["atletas"], prefix="/atletas")

@atletas_router.post("", response_model=Atleta)
def cadastrar_atleta(atleta: Atleta, db: Session = Depends(get_db)):
    return criar_atleta(db, atleta)

@atletas_router.get("/{atleta_id}")
def obter_atleta(atleta_id: int, db: Session = Depends(get_db)):
    return obtem_atleta(atleta_id, db)

@atletas_router.get("")
def listar_atletas(db: Session = Depends(get_db)):
    return obter_todos_atletas(db)

@atletas_router.delete("/{atleta_id}")
def deletar_atleta(atleta_id: int, db: Session = Depends(get_db)):
    return deleta_atleta(db, atleta_id)
