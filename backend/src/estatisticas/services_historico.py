from sqlalchemy.orm import Session
from sqlalchemy import func
from src.atletas.models import Atleta
from src.duplas.models import Dupla
from src.partidas.models import Partida
from src.pontuacao.models import Ponto, MotivoPonto


def obtem_historico_partidas_atleta(db: Session, atleta_id: int):

    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        return None
    
    duplas_atleta = db.query(Dupla).filter(
        Dupla.atletas.any(atleta_id=atleta_id)
    ).all()
    
    if not duplas_atleta:
        return []
    
    duplas_ids = [dupla.dupla_id for dupla in duplas_atleta]
    duplas_atleta = db.query(Dupla).filter(
        Dupla.atletas.any(atleta_id=atleta_id)
    ).all()
    
    if not duplas_atleta:
        return []
    
    duplas_ids = [dupla.dupla_id for dupla in duplas_atleta]
    
    partidas = db.query(Partida).filter(
        (Partida.dupla_a_id.in_(duplas_ids)) | (Partida.dupla_b_id.in_(duplas_ids))
    ).order_by(Partida.data_hora.desc()).limit(10).all()
    
    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    resultado = []
    
    for partida in partidas:
        if partida.dupla_a_id in duplas_ids:
            dupla_atleta_id = partida.dupla_a_id
            dupla_adversaria_id = partida.dupla_b_id
        else:
            dupla_atleta_id = partida.dupla_b_id
            dupla_adversaria_id = partida.dupla_a_id

        dupla_adversaria_obj = db.query(Dupla).filter(Dupla.dupla_id == dupla_adversaria_id).first()
        dupla_adversaria_nome = dupla_adversaria_obj.nome_dupla if dupla_adversaria_obj else "Dupla Desconhecida"
        
        vitoria = partida.dupla_vencedora_id == dupla_atleta_id if partida.dupla_vencedora_id else False
        
        pontos_query = db.query(Ponto).filter(
            Ponto.partida_id == partida.partida_id,
            (Ponto.atleta_ponto_id == atleta_id) | (Ponto.atleta_erro_id == atleta_id)
        )
        ataque_pontos = pontos_query.filter(
            Ponto.atleta_ponto_id == atleta_id,
            Ponto.motivo_ponto_id == motivo_ataque.motivo_ponto_id if motivo_ataque else -1
        ).count()
        
        saque_aces = pontos_query.filter(
            Ponto.atleta_ponto_id == atleta_id,
            Ponto.motivo_ponto_id == motivo_ace.motivo_ponto_id if motivo_ace else -1
        ).count()
        
        total_erros = pontos_query.filter(
            Ponto.atleta_erro_id == atleta_id
        ).filter(
            (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
            (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
        ).count()

        partida_stats = {
            "partida_id": partida.partida_id,
            "nome_partida": partida.nome_partida,
            "data_partida": partida.data_hora.isoformat() if partida.data_hora else None,
            "dupla_adversaria": dupla_adversaria_nome,
            "placar_a": partida.placar_final_dupla_a or 0,
            "placar_b": partida.placar_final_dupla_b or 0,
            "vitoria": vitoria,
            "atleta_id": atleta.atleta_id,
            "nome_atleta": atleta.nome_atleta,
            "ataque_pontos": ataque_pontos,
            "saque_aces": saque_aces,
            "total_erros": total_erros
        }
        resultado.append(partida_stats)
    
    return resultado


def obtem_historico_partidas_dupla(db: Session, dupla_id: int):

    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()
    if not dupla:
        return None
    
    partidas = db.query(Partida).filter(
        (Partida.dupla_a_id == dupla_id) | (Partida.dupla_b_id == dupla_id)
    ).order_by(Partida.data_hora.desc()).limit(10).all()

    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    atletas_ids = [atleta.atleta_id for atleta in dupla.atletas]
    
    resultado = []
    
    for partida in partidas:
        if partida.dupla_a_id == dupla_id:
            dupla_adversaria_id = partida.dupla_b_id
        else:
            dupla_adversaria_id = partida.dupla_a_id

        dupla_adversaria_obj = db.query(Dupla).filter(Dupla.dupla_id == dupla_adversaria_id).first()
        dupla_adversaria_nome = dupla_adversaria_obj.nome_dupla if dupla_adversaria_obj else "Dupla Desconhecida"
        
        vitoria = partida.dupla_vencedora_id == dupla_id if partida.dupla_vencedora_id else False

        pontos_query = db.query(Ponto).filter(
            Ponto.partida_id == partida.partida_id,
            (Ponto.atleta_ponto_id.in_(atletas_ids)) | (Ponto.atleta_erro_id.in_(atletas_ids))
        )

        ataque_pontos = pontos_query.filter(
            Ponto.atleta_ponto_id.in_(atletas_ids),
            Ponto.motivo_ponto_id == motivo_ataque.motivo_ponto_id if motivo_ataque else -1
        ).count()
        
        saque_aces = pontos_query.filter(
            Ponto.atleta_ponto_id.in_(atletas_ids),
            Ponto.motivo_ponto_id == motivo_ace.motivo_ponto_id if motivo_ace else -1
        ).count()
        
        total_erros = pontos_query.filter(
            Ponto.atleta_erro_id.in_(atletas_ids)
        ).filter(
            (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
            (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
        ).count()

        partida_stats = {
            "partida_id": partida.partida_id,
            "nome_partida": partida.nome_partida,
            "data_partida": partida.data_hora.isoformat() if partida.data_hora else None,
            "dupla_adversaria": dupla_adversaria_nome,
            "placar_a": partida.placar_final_dupla_a or 0,
            "placar_b": partida.placar_final_dupla_b or 0,
            "vitoria": vitoria,
            "dupla_id": dupla.dupla_id,
            "nome_dupla": dupla.nome_dupla,
            "ataque_pontos": ataque_pontos,
            "saque_aces": saque_aces,
            "total_erros": total_erros
        }
        resultado.append(partida_stats)
    
    return resultado
