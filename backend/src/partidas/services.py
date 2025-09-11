from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from src.partidas.models import Partida as PartidaModel
from src.partidas.schemas import PartidaCreate, PartidaUpdate


def criar_partida(db: Session, partida: PartidaCreate) -> PartidaModel:
    nova_partida = PartidaModel(**partida.model_dump())
    db.add(nova_partida)
    db.commit()
    db.refresh(nova_partida)
    return nova_partida


def obter_todas_partidas(db: Session):
    return db.query(PartidaModel).all()


def obter_partida_por_id(db: Session, partida_id: int) -> PartidaModel | None:
    return db.query(PartidaModel).filter(PartidaModel.partida_id == partida_id).first()


def atualizar_partida(db: Session, partida_id: int, partida_update: PartidaUpdate) -> PartidaModel:
    db_partida = obter_partida_por_id(db, partida_id)
    if not db_partida:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partida não encontrada")

    if partida_update.dupla_vencedora_id:
        if partida_update.dupla_vencedora_id not in (db_partida.dupla_a_id, db_partida.dupla_b_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A dupla vencedora deve ser uma das duplas que jogaram a partida."
            )

    update_data = partida_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_partida, key, value)

    db.add(db_partida)
    db.commit()
    db.refresh(db_partida)
    return db_partida
