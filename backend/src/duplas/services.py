from http import HTTPStatus
from fastapi import HTTPException
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


def adicionar_atleta_a_dupla(db: Session, dupla_id: int, atleta_id: int):
    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()
    if not dupla:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Dupla não encontrada")

    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Atleta não encontrado")

    if atleta in dupla.atletas:
        return {"message": f"Atleta {atleta_id} já está na dupla {dupla_id}"}

    if len(dupla.atletas) >= 2:
        return {"message": f"Dupla {dupla_id} ({dupla.nome_dupla}) já está completa com {len(dupla.atletas)} atletas"}

    dupla.atletas.append(atleta)
    db.commit()
    db.refresh(dupla)

    return {
        "message": f"Atleta {atleta_id} adicionado à dupla {dupla_id} com sucesso",
        "dupla": {
            "dupla_id": dupla.dupla_id,
            "nome_dupla": dupla.nome_dupla,
            "atletas_ids": [a.atleta_id for a in dupla.atletas]
        }
    }


def obtem_dupla(db: Session, dupla_id: int):
    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()

    if not dupla:
        raise HTTPException(status_code=HTTPStatus.NOT_FOUND, detail="Dupla não encontrada")

    return dupla
