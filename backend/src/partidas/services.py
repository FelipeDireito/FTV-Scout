from sqlalchemy.orm import Session

from src.partidas.models import Partida

def criar_partida(db: Session, partida: Partida):
    nova_partida = Partida(**partida.dict())
    db.add(nova_partida)
    db.commit()
    db.refresh(nova_partida)
    return nova_partida

def obter_todas_partidas(db: Session):
    return db.query(Partida).all()
