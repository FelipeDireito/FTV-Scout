from sqlalchemy.orm import Session
from src.duplas.models import Dupla
from src.atletas.models import Atleta

def criar_dupla(db: Session, nome_dupla: str, atletas_ids: list[int]):
    atletas = db.query(Atleta).filter(Atleta.atleta_id.in_(atletas_ids)).all()
    db_dupla = Dupla(nome_dupla=nome_dupla, atletas=atletas)
    db.add(db_dupla)
    db.commit()
    db.refresh(db_dupla)
    return db_dupla

def listar_dupla(db: Session):
    return db.query(Dupla).all()
