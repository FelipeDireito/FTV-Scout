from fastapi import status, HTTPException
from sqlalchemy.orm import Session
import uuid

from src.pontuacao import models, schemas


def cadastra_acao(acao: schemas.Acao, db: Session):

    nova_acao = models.Acao(**acao.dict())
    db.add(nova_acao)
    db.commit()
    db.refresh(nova_acao)
    return nova_acao


def cadastra_ponto(ponto: schemas.Ponto, db: Session):
    novo_ponto = models.Ponto(
        partida_id=ponto.partida_id,
        dupla_vencedora_id=ponto.dupla_vencedora_id,
        motivo_ponto_id=ponto.motivo_ponto_id,
        numero_ponto_partida=ponto.numero_ponto_partida,
        atleta_ponto_id=ponto.atleta_ponto_id,
        atleta_erro_id=ponto.atleta_erro_id,
    )
    db.add(novo_ponto)
    db.commit()
    db.refresh(novo_ponto)
    
    # Atualiza todas as ações com o rally_id correspondente
    acoes_atualizadas = db.query(models.Acao).filter(models.Acao.rally_id == ponto.rally_id).update({
        "ponto_id": novo_ponto.ponto_id,
        "rally_id": None
    })
    db.commit()
    
    return {"ponto_criado": novo_ponto, "acoes_atualizadas": acoes_atualizadas}


def obtem_acoes(db: Session):
    return db.query(models.Acao).all()


def obter_por_id(partida_id: int, db: Session):
    pontos = db.query(models.Ponto).filter(models.Ponto.partida_id == partida_id).all()
    return pontos


def obter_acoes_partida_id(partida_id: int, db: Session):
    pontos = db.query(models.Ponto).filter(models.Ponto.partida_id == partida_id).all()
    ponto_ids = [ponto.ponto_id for ponto in pontos]
    
    acoes = db.query(models.Acao).filter(models.Acao.ponto_id.in_(ponto_ids)).all()
    return acoes


def volta_ponto(partida_id: int, db: Session):
    ultimo_ponto = db.query(models.Ponto)\
        .filter(models.Ponto.partida_id == partida_id)\
        .order_by(models.Ponto.numero_ponto_partida.desc())\
        .first()

    if not ultimo_ponto:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Nenhum ponto para voltar.")

    ponto_excluido_data = {
        "ponto_id": ultimo_ponto.ponto_id,
        "partida_id": ultimo_ponto.partida_id,
        "dupla_vencedora_id": ultimo_ponto.dupla_vencedora_id,
        "motivo_ponto_id": ultimo_ponto.motivo_ponto_id,
        "numero_ponto_partida": ultimo_ponto.numero_ponto_partida,
        "atleta_ponto_id": ultimo_ponto.atleta_ponto_id,
        "atleta_erro_id": ultimo_ponto.atleta_erro_id,
    }

    # Deletar as ações primeiro (FK)
    db.query(models.Acao).filter(models.Acao.ponto_id == ultimo_ponto.ponto_id).delete(synchronize_session=False)

    db.delete(ultimo_ponto)
    db.commit()

    return ponto_excluido_data


def atualiza_acao(acao_id: int, acao_update: schemas.AcaoUpdate, db: Session):
    db_acao = db.query(models.Acao).filter(models.Acao.acao_id == acao_id).first()

    if not db_acao:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ação não encontrada")

    update_data = acao_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(db_acao, key, value)

    db.add(db_acao)
    db.commit()
    db.refresh(db_acao)

    return db_acao
