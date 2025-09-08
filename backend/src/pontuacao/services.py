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
        numero_ponto_partida=ponto.numero_ponto_partida
    )
    db.add(novo_ponto)
    db.commit()
    db.refresh(novo_ponto)
    
    # 2. Atualiza todas as ações com o rally_id correspondente
    acoes_atualizadas = db.query(models.Acao).filter(models.Acao.rally_id == ponto.rally_id).update({
        "ponto_id": novo_ponto.ponto_id,
        "rally_id": None
    })
    db.commit()
    
    return {"ponto_criado": novo_ponto, "acoes_atualizadas": acoes_atualizadas}
