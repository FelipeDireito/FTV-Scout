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


def deleta_atleta(db: Session, atleta_id: int):
    db_atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if db_atleta:
        db.delete(db_atleta)
        db.commit()
        return {"message": f"Atleta {atleta_id} deletado com sucesso"}
    return {"message": f"Atleta {atleta_id} não encontrado"}
