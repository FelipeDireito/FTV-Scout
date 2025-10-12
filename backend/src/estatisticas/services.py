from sqlalchemy import distinct, func
from sqlalchemy.orm import Session
from src.atletas.models import Atleta
from src.duplas.models import Dupla
from src.partidas.models import Partida
from src.pontuacao.models import Acao, MotivoPonto, Ponto, TipoAcao


def obtem_estatisticas_atleta(db: Session, atleta_id: int, partida_id: int = None):
    """
    Calcula estatísticas resumidas de um atleta.
    
    Args:
        db: Sessão do banco de dados
        atleta_id: ID do atleta
        partida_id: ID da partida (opcional, para filtrar por partida específica)
    
    Returns:
        Dicionário com estatísticas do atleta ou None se não encontrado
    """
    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        return None

    if partida_id:
        partida = db.query(Partida).filter(Partida.partida_id == partida_id).first()
    
    pontos_query = db.query(Ponto).filter(
        (Ponto.atleta_ponto_id == atleta_id) | (Ponto.atleta_erro_id == atleta_id)
    )
    
    if partida_id:
        pontos_query = pontos_query.filter(Ponto.partida_id == partida_id)
    
    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    total_aces = pontos_query.filter(
        Ponto.atleta_ponto_id == atleta_id,
        Ponto.motivo_ponto_id == motivo_ace.motivo_ponto_id if motivo_ace else -1
    ).count()
    
    total_pontos_ataque = pontos_query.filter(
        Ponto.atleta_ponto_id == atleta_id,
        Ponto.motivo_ponto_id == motivo_ataque.motivo_ponto_id if motivo_ataque else -1
    ).count()
    
    total_pontos = total_aces + total_pontos_ataque
    
    total_erros = pontos_query.filter(
        Ponto.atleta_erro_id == atleta_id
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    ).count()
    
    acoes_query = db.query(Acao).filter(Acao.atleta_id == atleta_id)
    if partida_id:
        acoes_partida = acoes_query.join(Ponto).filter(Ponto.partida_id == partida_id).first()
        total_partidas = 1 if acoes_partida else 0
    else:
        total_partidas = db.query(func.count(distinct(Ponto.partida_id))).join(
            Acao, Acao.ponto_id == Ponto.ponto_id
        ).filter(Acao.atleta_id == atleta_id).scalar() or 0
    
    return {
        "atleta_id": atleta.atleta_id,
        "nome_atleta": atleta.nome_atleta,
        "total_pontos": total_pontos,
        "total_aces": total_aces,
        "total_pontos_ataque": total_pontos_ataque,
        "total_erros": total_erros,
        "total_partidas": total_partidas
    }


def obtem_estatisticas_dupla(db: Session, dupla_id: int, partida_id: int = None):
    """
    Calcula estatísticas resumidas de uma dupla.
    
    Filtra apenas as partidas onde a dupla jogou em conjunto.
    
    Args:
        db: Sessão do banco de dados
        dupla_id: ID da dupla
        partida_id: ID da partida (opcional, para filtrar por partida específica)
    
    Returns:
        Dicionário com estatísticas da dupla
    """
    
    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()
    
    if not dupla:
        return None
    
    nomes_atletas = [atleta.nome_atleta for atleta in dupla.atletas]
    
    atletas_ids = [atleta.atleta_id for atleta in dupla.atletas]

    partidas_dupla_query = db.query(Partida.partida_id).filter(
        ((Partida.dupla_a_id == dupla_id) | (Partida.dupla_b_id == dupla_id))
    )

    if partida_id:
        partidas_dupla_query = partidas_dupla_query.filter(Partida.partida_id == partida_id)


    partidas_ids = [p.partida_id for p in partidas_dupla_query.all()]

    pontos_query = db.query(Ponto).filter(
        Ponto.partida_id.in_(partidas_ids),
        (Ponto.atleta_ponto_id.in_(atletas_ids) | Ponto.atleta_erro_id.in_(atletas_ids))
    )
    
    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    total_aces = pontos_query.filter(
        Ponto.atleta_ponto_id.in_(atletas_ids),
        Ponto.motivo_ponto_id == motivo_ace.motivo_ponto_id if motivo_ace else -1
    ).count()
    
    total_pontos_ataque = pontos_query.filter(
        Ponto.atleta_ponto_id.in_(atletas_ids),
        Ponto.motivo_ponto_id == motivo_ataque.motivo_ponto_id if motivo_ataque else -1
    ).count()
    
    total_pontos = total_aces + total_pontos_ataque
    
    total_erros = pontos_query.filter(
        Ponto.atleta_erro_id.in_(atletas_ids)        
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    ).count()
    
    partidas_dupla = db.query(Partida).filter(
        ((Partida.dupla_a_id == dupla_id) | (Partida.dupla_b_id == dupla_id))
    )
    if partida_id:
        partida_existe = partidas_dupla.filter(Partida.partida_id == partida_id).first()
        total_partidas = 1 if partida_existe else 0
    else:
        total_partidas = partidas_dupla.count()
    
    total_vitorias = partidas_dupla.filter(
        Partida.dupla_vencedora_id == dupla_id
    ).count()
    
    total_derrotas = partidas_dupla.filter(
        Partida.dupla_vencedora_id != dupla_id
    ).count()
    
    return {
        "dupla_id": dupla.dupla_id,
        "nome_dupla": dupla.nome_dupla,
        "atletas": nomes_atletas,
        "total_pontos": total_pontos,
        "total_aces": total_aces,
        "total_pontos_ataque": total_pontos_ataque,
        "total_erros": total_erros,
        "total_partidas": total_partidas,
        "total_vitorias": total_vitorias,
        "total_derrotas": total_derrotas
    }


def obtem_estatisticas_ataque_atleta(db: Session, atleta_id: int, partida_id: int = None):
    """
    Calcula estatísticas de ataque de um atleta.
    
    Args:
        db: Sessão do banco de dados
        atleta_id: ID do atleta
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas de ataque ou None se não encontrado
    """
    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        return None
    
    tipo_ataque = db.query(TipoAcao).filter(TipoAcao.nome_acao == "Ataque").first()
    if not tipo_ataque:
        return None
    
    acoes_query = db.query(Acao).filter(
        Acao.atleta_id == atleta_id,
        Acao.tipo_acao_id == tipo_ataque.tipo_acao_id
    )
    
    if partida_id:
        acoes_query = acoes_query.join(Ponto).filter(Ponto.partida_id == partida_id)

    tentativas = acoes_query.count()
    
    if tentativas == 0:
        return {
            "atleta_id": atleta.atleta_id,
            "nome": atleta.nome_atleta,
            "tentativas": 0,
            "pontos": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }


    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    

    pontos_query = db.query(Ponto).filter(
        Ponto.atleta_ponto_id == atleta_id,
        Ponto.motivo_ponto_id == motivo_ataque.motivo_ponto_id if motivo_ataque else -1
    )
    if partida_id:
        pontos_query = pontos_query.filter(Ponto.partida_id == partida_id)
    
    pontos = pontos_query.count()
    

    erros_query = db.query(Ponto).filter(
        Ponto.atleta_erro_id == atleta_id
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    )
    if partida_id:
        erros_query = erros_query.filter(Ponto.partida_id == partida_id)
    

    erros_ataque = 0
    for ponto in erros_query.all():
        acao_ataque = db.query(Acao).filter(
            Acao.ponto_id == ponto.ponto_id,
            Acao.atleta_id == atleta_id,
            Acao.tipo_acao_id == tipo_ataque.tipo_acao_id
        ).first()
        if acao_ataque:
            erros_ataque += 1
    

    aproveitamento = (pontos / tentativas * 100) if tentativas > 0 else 0.0
    eficiencia = ((pontos - erros_ataque) / tentativas * 100) if tentativas > 0 else 0.0
    
    return {
        "atleta_id": atleta.atleta_id,
        "nome": atleta.nome_atleta,
        "tentativas": tentativas,
        "pontos": pontos,
        "erros": erros_ataque,
        "aproveitamento": round(aproveitamento, 2),
        "eficiencia": round(eficiencia, 2)
    }


def obtem_estatisticas_saque_atleta(db: Session, atleta_id: int, partida_id: int = None):
    """
    Calcula estatísticas de saque de um atleta.
    
    Args:
        db: Sessão do banco de dados
        atleta_id: ID do atleta
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas de saque ou None se não encontrado
    """
    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        return None
    
    tipo_saque = db.query(TipoAcao).filter(TipoAcao.nome_acao == "Saque").first()
    if not tipo_saque:
        return None
    
    acoes_query = db.query(Acao).filter(
        Acao.atleta_id == atleta_id,
        Acao.tipo_acao_id == tipo_saque.tipo_acao_id
    )
    
    if partida_id:
        acoes_query = acoes_query.join(Ponto).filter(Ponto.partida_id == partida_id)
    
    tentativas = acoes_query.count()
    
    if tentativas == 0:
        return {
            "atleta_id": atleta.atleta_id,
            "nome": atleta.nome_atleta,
            "tentativas": 0,
            "aces": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    
    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    aces_query = db.query(Ponto).filter(
        Ponto.atleta_ponto_id == atleta_id,
        Ponto.motivo_ponto_id == motivo_ace.motivo_ponto_id if motivo_ace else -1
    )
    if partida_id:
        aces_query = aces_query.filter(Ponto.partida_id == partida_id)
    
    aces = aces_query.count()
    
    erros_query = db.query(Ponto).filter(
        Ponto.atleta_erro_id == atleta_id
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    )
    if partida_id:
        erros_query = erros_query.filter(Ponto.partida_id == partida_id)
    
    erros_saque = 0
    for ponto in erros_query.all():
        acao_saque = db.query(Acao).filter(
            Acao.ponto_id == ponto.ponto_id,
            Acao.atleta_id == atleta_id,
            Acao.tipo_acao_id == tipo_saque.tipo_acao_id
        ).first()
        if acao_saque:
            erros_saque += 1
    
    aproveitamento = (aces / tentativas * 100) if tentativas > 0 else 0.0
    eficiencia = ((aces - erros_saque) / tentativas * 100) if tentativas > 0 else 0.0
    
    return {
        "atleta_id": atleta.atleta_id,
        "nome": atleta.nome_atleta,
        "tentativas": tentativas,
        "aces": aces,
        "erros": erros_saque,
        "aproveitamento": round(aproveitamento, 2),
        "eficiencia": round(eficiencia, 2)
    }


def obtem_estatisticas_defesa_atleta(db: Session, atleta_id: int, partida_id: int = None):
    """
    Calcula estatísticas de defesa/recepção de um atleta.
    
    Args:
        db: Sessão do banco de dados
        atleta_id: ID do atleta
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas de defesa ou None se não encontrado
    """
    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        return None
    
    tipo_defesa = db.query(TipoAcao).filter(TipoAcao.nome_acao == "Recepção/Defesa").first()
    if not tipo_defesa:
        return None
    
    acoes_query = db.query(Acao).filter(
        Acao.atleta_id == atleta_id,
        Acao.tipo_acao_id == tipo_defesa.tipo_acao_id
    )

    if partida_id:
        acoes_query = acoes_query.join(Ponto).filter(Ponto.partida_id == partida_id)
    
    tentativas = acoes_query.count()

    if tentativas == 0:
        return {
            "atleta_id": atleta.atleta_id,
            "nome": atleta.nome_atleta,
            "tentativas": 0,
            "erros_que_viraram_ponto": 0,
            "eficiencia_defensiva": 0.0
        }
    
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    erros_query = db.query(Ponto).filter(
        Ponto.atleta_erro_id == atleta_id
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    )
    if partida_id:
        erros_query = erros_query.filter(Ponto.partida_id == partida_id)
    
    erros_defesa = 0
    for ponto in erros_query.all():
        acao_defesa = db.query(Acao).filter(
            Acao.ponto_id == ponto.ponto_id,
            Acao.atleta_id == atleta_id,
            Acao.tipo_acao_id == tipo_defesa.tipo_acao_id
        ).first()
        if acao_defesa:
            erros_defesa += 1
    
    eficiencia_defensiva = ((tentativas - erros_defesa) / tentativas * 100) if tentativas > 0 else 0.0
    
    return {
        "atleta_id": atleta.atleta_id,
        "nome": atleta.nome_atleta,
        "tentativas": tentativas,
        "erros_que_viraram_ponto": erros_defesa,
        "eficiencia_defensiva": round(eficiencia_defensiva, 2)
    }


def obtem_estatisticas_ataque_dupla(db: Session, dupla_id: int, partida_id: int = None):
    """
    Calcula estatísticas de ataque de uma dupla
    
    Args:
        db: Sessão do banco de dados
        dupla_id: ID da dupla
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas de ataque da dupla ou None se não encontrada
    """
    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()
    if not dupla:
        return None
    
    atletas_ids = [atleta.atleta_id for atleta in dupla.atletas]

    partidas_dupla_query = db.query(Partida.partida_id).filter(
        ((Partida.dupla_a_id == dupla_id) | (Partida.dupla_b_id == dupla_id))
    )
    
    if partida_id:
        partidas_dupla_query = partidas_dupla_query.filter(Partida.partida_id == partida_id)
    
    partidas_ids = [p.partida_id for p in partidas_dupla_query.all()]
    
    if not partidas_ids:
        return {
            "dupla_id": dupla.dupla_id,
            "nome": dupla.nome_dupla,
            "tentativas": 0,
            "pontos": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    
    tipo_ataque = db.query(TipoAcao).filter(TipoAcao.nome_acao == "Ataque").first()
    if not tipo_ataque:
        return None
    
    tentativas = db.query(Acao).join(Ponto).filter(
        Acao.atleta_id.in_(atletas_ids),
        Acao.tipo_acao_id == tipo_ataque.tipo_acao_id,
        Ponto.partida_id.in_(partidas_ids)
    ).count()
    
    if tentativas == 0:
        return {
            "dupla_id": dupla.dupla_id,
            "nome": dupla.nome_dupla,
            "tentativas": 0,
            "pontos": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    
    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    pontos = db.query(Ponto).filter(
        Ponto.atleta_ponto_id.in_(atletas_ids),
        Ponto.motivo_ponto_id == motivo_ataque.motivo_ponto_id if motivo_ataque else -1,
        Ponto.partida_id.in_(partidas_ids)
    ).count()
    
    erros_query = db.query(Ponto).filter(
        Ponto.atleta_erro_id.in_(atletas_ids),
        Ponto.partida_id.in_(partidas_ids)
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    )
    
    erros = 0
    for ponto in erros_query.all():
        acao_ataque = db.query(Acao).filter(
            Acao.ponto_id == ponto.ponto_id,
            Acao.atleta_id.in_(atletas_ids),
            Acao.tipo_acao_id == tipo_ataque.tipo_acao_id
        ).first()
        if acao_ataque:
            erros += 1
    
    aproveitamento = (pontos / tentativas * 100) if tentativas > 0 else 0.0
    eficiencia = ((pontos - erros) / tentativas * 100) if tentativas > 0 else 0.0
    
    return {
        "dupla_id": dupla.dupla_id,
        "nome": dupla.nome_dupla,
        "tentativas": tentativas,
        "pontos": pontos,
        "erros": erros,
        "aproveitamento": round(aproveitamento, 2),
        "eficiencia": round(eficiencia, 2)
    }


def obtem_estatisticas_saque_dupla(db: Session, dupla_id: int, partida_id: int = None):
    """
    Calcula estatísticas de saque de uma dupla.
    
    Args:
        db: Sessão do banco de dados
        dupla_id: ID da dupla
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas de saque da dupla ou None se não encontrada
    """
    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()
    if not dupla:
        return None
    
    atletas_ids = [atleta.atleta_id for atleta in dupla.atletas]
    
    partidas_dupla_query = db.query(Partida.partida_id).filter(
        ((Partida.dupla_a_id == dupla_id) | (Partida.dupla_b_id == dupla_id))
    )
    
    if partida_id:
        partidas_dupla_query = partidas_dupla_query.filter(Partida.partida_id == partida_id)
    
    partidas_ids = [p.partida_id for p in partidas_dupla_query.all()]
    
    if not partidas_ids:
        return {
            "dupla_id": dupla.dupla_id,
            "nome": dupla.nome_dupla,
            "tentativas": 0,
            "aces": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    
    tipo_saque = db.query(TipoAcao).filter(TipoAcao.nome_acao == "Saque").first()
    if not tipo_saque:
        return None
    
    tentativas = db.query(Acao).join(Ponto).filter(
        Acao.atleta_id.in_(atletas_ids),
        Acao.tipo_acao_id == tipo_saque.tipo_acao_id,
        Ponto.partida_id.in_(partidas_ids)
    ).count()
    
    if tentativas == 0:
        return {
            "dupla_id": dupla.dupla_id,
            "nome": dupla.nome_dupla,
            "tentativas": 0,
            "aces": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    
    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    aces = db.query(Ponto).filter(
        Ponto.atleta_ponto_id.in_(atletas_ids),
        Ponto.motivo_ponto_id == motivo_ace.motivo_ponto_id if motivo_ace else -1,
        Ponto.partida_id.in_(partidas_ids)
    ).count()
    
    erros_query = db.query(Ponto).filter(
        Ponto.atleta_erro_id.in_(atletas_ids),
        Ponto.partida_id.in_(partidas_ids)
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    )
    
    erros = 0
    for ponto in erros_query.all():
        acao_saque = db.query(Acao).filter(
            Acao.ponto_id == ponto.ponto_id,
            Acao.atleta_id.in_(atletas_ids),
            Acao.tipo_acao_id == tipo_saque.tipo_acao_id
        ).first()
        if acao_saque:
            erros += 1
    
    aproveitamento = (aces / tentativas * 100) if tentativas > 0 else 0.0
    eficiencia = ((aces - erros) / tentativas * 100) if tentativas > 0 else 0.0
    
    return {
        "dupla_id": dupla.dupla_id,
        "nome": dupla.nome_dupla,
        "tentativas": tentativas,
        "aces": aces,
        "erros": erros,
        "aproveitamento": round(aproveitamento, 2),
        "eficiencia": round(eficiencia, 2)
    }


def obtem_estatisticas_defesa_dupla(db: Session, dupla_id: int, partida_id: int = None):
    """
    Calcula estatísticas de defesa de uma dupla.
    
    Args:
        db: Sessão do banco de dados
        dupla_id: ID da dupla
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas de defesa da dupla ou None se não encontrada
    """
    dupla = db.query(Dupla).filter(Dupla.dupla_id == dupla_id).first()
    if not dupla:
        return None
    
    atletas_ids = [atleta.atleta_id for atleta in dupla.atletas]
    
    partidas_dupla_query = db.query(Partida.partida_id).filter(
        ((Partida.dupla_a_id == dupla_id) | (Partida.dupla_b_id == dupla_id))
    )
    
    if partida_id:
        partidas_dupla_query = partidas_dupla_query.filter(Partida.partida_id == partida_id)
    
    partidas_ids = [p.partida_id for p in partidas_dupla_query.all()]
    
    if not partidas_ids:
        return {
            "dupla_id": dupla.dupla_id,
            "nome": dupla.nome_dupla,
            "tentativas": 0,
            "erros_que_viraram_ponto": 0,
            "eficiencia_defensiva": 0.0
        }
    
    tipo_defesa = db.query(TipoAcao).filter(TipoAcao.nome_acao == "Recepção/Defesa").first()
    if not tipo_defesa:
        return None
    
    tentativas = db.query(Acao).join(Ponto).filter(
        Acao.atleta_id.in_(atletas_ids),
        Acao.tipo_acao_id == tipo_defesa.tipo_acao_id,
        Ponto.partida_id.in_(partidas_ids)
    ).count()
    
    if tentativas == 0:
        return {
            "dupla_id": dupla.dupla_id,
            "nome": dupla.nome_dupla,
            "tentativas": 0,
            "erros_que_viraram_ponto": 0,
            "eficiencia_defensiva": 0.0
        }
    
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    erros_query = db.query(Ponto).filter(
        Ponto.atleta_erro_id.in_(atletas_ids),
        Ponto.partida_id.in_(partidas_ids)
    ).filter(
        (Ponto.motivo_ponto_id == motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) |
        (Ponto.motivo_ponto_id == motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)
    )
    
    erros = 0
    for ponto in erros_query.all():
        acao_defesa = db.query(Acao).filter(
            Acao.ponto_id == ponto.ponto_id,
            Acao.atleta_id.in_(atletas_ids),
            Acao.tipo_acao_id == tipo_defesa.tipo_acao_id
        ).first()
        if acao_defesa:
            erros += 1
    
    eficiencia_defensiva = ((tentativas - erros) / tentativas * 100) if tentativas > 0 else 0.0
    
    return {
        "dupla_id": dupla.dupla_id,
        "nome": dupla.nome_dupla,
        "tentativas": tentativas,
        "erros_que_viraram_ponto": erros,
        "eficiencia_defensiva": round(eficiencia_defensiva, 2)
    }


def obtem_estatisticas_completas_dupla(db: Session, dupla_id: int, partida_id: int = None):
    """
    Retorna estatísticas completas consolidadas de uma dupla.
    
    Args:
        db: Sessão do banco de dados
        dupla_id: ID da dupla
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com todas as estatísticas da dupla ou None se não encontrada
    """

    resumo = obtem_estatisticas_dupla(db, dupla_id, partida_id)
    if resumo is None:
        return None
    

    ataque = obtem_estatisticas_ataque_dupla(db, dupla_id, partida_id)
    if ataque is None:
        ataque = {
            "tentativas": 0,
            "pontos": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    

    saque = obtem_estatisticas_saque_dupla(db, dupla_id, partida_id)
    if saque is None:
        saque = {
            "tentativas": 0,
            "aces": 0,
            "erros": 0,
            "aproveitamento": 0.0,
            "eficiencia": 0.0
        }
    

    defesa = obtem_estatisticas_defesa_dupla(db, dupla_id, partida_id)
    if defesa is None:
        defesa = {
            "tentativas": 0,
            "erros_que_viraram_ponto": 0,
            "eficiencia_defensiva": 0.0
        }
    
    percentual_vitorias = (resumo["total_vitorias"] / resumo["total_partidas"] * 100) if resumo["total_partidas"] > 0 else 0.0
    
    return {
        "dupla_id": resumo["dupla_id"],
        "nome_dupla": resumo["nome_dupla"],
        "atletas": resumo["atletas"],
        
        "total_pontos": resumo["total_pontos"],
        "total_aces": resumo["total_aces"],
        "total_pontos_ataque": resumo["total_pontos_ataque"],
        "total_erros": resumo["total_erros"],
        "total_partidas": resumo["total_partidas"],
        "total_vitorias": resumo["total_vitorias"],
        "total_derrotas": resumo["total_derrotas"],
        "percentual_vitorias": round(percentual_vitorias, 2),
        
        "ataque_tentativas": ataque["tentativas"],
        "ataque_pontos": ataque["pontos"],
        "ataque_erros": ataque["erros"],
        "ataque_aproveitamento": ataque["aproveitamento"],
        "ataque_eficiencia": ataque["eficiencia"],
        
        "saque_tentativas": saque["tentativas"],
        "saque_aces": saque["aces"],
        "saque_erros": saque["erros"],
        "saque_aproveitamento": saque["aproveitamento"],
        "saque_eficiencia": saque["eficiencia"],
        
        "defesa_tentativas": defesa["tentativas"],
        "defesa_erros": defesa["erros_que_viraram_ponto"],
        "defesa_eficiencia": defesa["eficiencia_defensiva"]
    }


def obtem_mapa_calor_atleta(db: Session, atleta_id: int, tipo_acao_id: int, partida_id: int = None):
    """
    Gera mapa de calor com estatísticas na quadra para um atleta.
    
    Args:
        db: Sessão do banco de dados
        atleta_id: ID do atleta
        tipo_acao_id: ID do tipo de ação
        partida_id: ID da partida (opcional)
    
    Returns:
        Dicionário com estatísticas por fluxo origem→destino ou None se não encontrado
    """
    atleta = db.query(Atleta).filter(Atleta.atleta_id == atleta_id).first()
    if not atleta:
        return None
    
    tipo_acao_obj = db.query(TipoAcao).filter(TipoAcao.tipo_acao_id == tipo_acao_id).first()
    if not tipo_acao_obj:
        return None
    
    acoes_query = db.query(Acao).filter(
        Acao.atleta_id == atleta_id,
        Acao.tipo_acao_id == tipo_acao_obj.tipo_acao_id,
        Acao.posicao_quadra_destino.isnot(None)
    )
    
    if partida_id:
        acoes_query = acoes_query.join(Ponto).filter(Ponto.partida_id == partida_id)
    
    acoes = acoes_query.all()
    
    motivo_ace = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ace").first()
    motivo_ataque = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Ponto de ataque").first()
    motivo_erro_nao_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro não forçado").first()
    motivo_erro_forcado = db.query(MotivoPonto).filter(MotivoPonto.descricao == "Erro forçado").first()
    
    fluxos_stats = {}
    
    for acao in acoes:
        posicao_destino = acao.posicao_quadra_destino
        posicao_origem = acao.posicao_quadra_origem if acao.posicao_quadra_origem else 0  # 0 = sem origem
        
        fluxo_key = (posicao_origem, posicao_destino)
        
        if fluxo_key not in fluxos_stats:
            fluxos_stats[fluxo_key] = {
                "posicao_origem": posicao_origem,
                "posicao_destino": posicao_destino,
                "total_acoes": 0,
                "pontos": 0,
                "erros": 0
            }
        
        fluxos_stats[fluxo_key]["total_acoes"] += 1
        
        if acao.ponto_id:
            ponto = db.query(Ponto).filter(Ponto.ponto_id == acao.ponto_id).first()
            if ponto:
                # Ponto marcado
                if ponto.atleta_ponto_id == atleta_id:
                    if tipo_acao_obj.nome_acao == "Saque" and ponto.motivo_ponto_id == (motivo_ace.motivo_ponto_id if motivo_ace else -1):
                        fluxos_stats[fluxo_key]["pontos"] += 1
                    elif tipo_acao_obj.nome_acao == "Ataque" and ponto.motivo_ponto_id == (motivo_ataque.motivo_ponto_id if motivo_ataque else -1):
                        fluxos_stats[fluxo_key]["pontos"] += 1
                
                # Erro cometido
                if ponto.atleta_erro_id == atleta_id:
                    if (ponto.motivo_ponto_id == (motivo_erro_nao_forcado.motivo_ponto_id if motivo_erro_nao_forcado else -1) or
                        ponto.motivo_ponto_id == (motivo_erro_forcado.motivo_ponto_id if motivo_erro_forcado else -1)):
                        fluxos_stats[fluxo_key]["erros"] += 1

    fluxos_lista = []
    total_acoes_geral = 0
    
    for fluxo_stats in fluxos_stats.values():
        total = fluxo_stats["total_acoes"]
        pontos = fluxo_stats["pontos"]
        erros = fluxo_stats["erros"]
        eficiencia = ((pontos - erros) / total * 100) if total > 0 else 0.0
        
        fluxos_lista.append({
            "posicao_origem": fluxo_stats["posicao_origem"],
            "posicao_destino": fluxo_stats["posicao_destino"],
            "total_acoes": total,
            "pontos": pontos,
            "erros": erros,
            "eficiencia": round(eficiencia, 2)
        })
        
        total_acoes_geral += total
    
    fluxos_lista.sort(key=lambda x: (x["posicao_destino"], x["posicao_origem"]))
    
    return {
        "atleta_id": atleta.atleta_id,
        "nome": atleta.nome_atleta,
        "tipo_acao_id": tipo_acao_obj.tipo_acao_id,
        "tipo_acao_nome": tipo_acao_obj.nome_acao,
        "fluxos": fluxos_lista,
        "total_acoes": total_acoes_geral
    }
