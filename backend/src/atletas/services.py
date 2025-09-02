from sqlalchemy.orm import Session
from src.atletas.models import Atleta

def criar_atleta(db: Session, atleta: Atleta):
    db_atleta = Atleta(nome_atleta=atleta.nome_atleta)
    db.add(db_atleta)
    db.commit()
    db.refresh(db_atleta)
    return db_atleta

def obter_todos_atletas(db: Session):
    return db.query(Atleta).all()