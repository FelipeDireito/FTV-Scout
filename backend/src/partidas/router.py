from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from src.partidas.schemas import Partida, PartidaCreate, PartidaUpdate
from src.partidas.services import (
    criar_partida,
    obter_todas_partidas,
    obter_partida_por_id,
    atualizar_partida,
)
from src.core.database import get_db


partidas_router = APIRouter(tags=["partidas"], prefix="/partidas")


@partidas_router.post("", response_model=Partida, status_code=status.HTTP_201_CREATED)
def cadastrar_partida(partida: PartidaCreate, db: Session = Depends(get_db)):
    return criar_partida(db, partida)


@partidas_router.get("/{partida_id}", response_model=Partida)
def obter_partida(partida_id: int, db: Session = Depends(get_db)):
    db_partida = obter_partida_por_id(db, partida_id)
    if db_partida is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partida não encontrada")
    return db_partida


@partidas_router.get("", response_model=List[Partida])
def listar_partidas(db: Session = Depends(get_db)):
    return obter_todas_partidas(db)


@partidas_router.patch("/{partida_id}", response_model=Partida)
def finalizar_partida(partida_id: int, partida_update: PartidaUpdate, db: Session = Depends(get_db)):
    return atualizar_partida(db, partida_id, partida_update)
