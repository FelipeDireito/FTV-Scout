from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.partidas.schemas import Partida
from src.partidas.services import criar_partida, obter_todas_partidas
from src.core.database import get_db

partidas_router = APIRouter(tags=["partidas"], prefix="/partidas")

@partidas_router.post("", response_model=Partida)
def cadastrar_partida(partida: Partida, db: Session = Depends(get_db)):
    return criar_partida(db, partida)

@partidas_router.get("/{partida_id}")
def obter_partida(partida_id: int):
    return {"partida_id": partida_id, "detalhes": "Detalhes da Partida"}

@partidas_router.get("")
def listar_partidas(db: Session = Depends(get_db)):
    return obter_todas_partidas(db)
