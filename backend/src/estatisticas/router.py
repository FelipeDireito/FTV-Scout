from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from src.core.database import get_db
from src.estatisticas.schemas import (
    AtletaResumo, 
    DuplaResumo,
    EstatisticasAtaque,
    EstatisticasSaque,
    EstatisticasDefesa,
    DuplaEstatisticasCompletas,
    MapaCalor
)
from src.estatisticas.services import (
    obtem_estatisticas_atleta, 
    obtem_estatisticas_dupla,
    obtem_estatisticas_ataque_atleta,
    obtem_estatisticas_saque_atleta,
    obtem_estatisticas_defesa_atleta,
    obtem_estatisticas_ataque_dupla,
    obtem_estatisticas_saque_dupla,
    obtem_estatisticas_defesa_dupla,
    obtem_estatisticas_completas_dupla,
    obtem_mapa_calor_atleta
)


estatisticas_router = APIRouter(tags=["estatisticas"], prefix="/estatisticas")

@estatisticas_router.get("/atleta/{atleta_id}/resumo", response_model=AtletaResumo)
def obter_estatisticas_atleta(
    atleta_id: int, 
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas resumidas de um atleta.
    
    - **atleta_id**: ID do atleta
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    """
    resultado = obtem_estatisticas_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Atleta com ID {atleta_id} não encontrado"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/resumo", response_model=DuplaResumo)
def obter_estatisticas_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas resumidas de uma dupla.
    
    - **dupla_id**: ID da dupla
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    """
    resultado = obtem_estatisticas_dupla(db, dupla_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/ataque", response_model=EstatisticasAtaque)
def obter_estatisticas_ataque_atleta(
    atleta_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas detalhadas de ataque de um atleta.
    
    - **atleta_id**: ID do atleta
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Métricas:
    - **Tentativas**: Total de ataques realizados
    - **Pontos**: Ataques que resultaram em ponto
    - **Erros**: Ataques que resultaram em erro
    - **Aproveitamento**: (Pontos / Tentativas) * 100
    - **Eficiência**: ((Pontos - Erros) / Tentativas) * 100
    """
    resultado = obtem_estatisticas_ataque_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou sem dados de ataque"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/saque", response_model=EstatisticasSaque)
def obter_estatisticas_saque_atleta(
    atleta_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas detalhadas de saque de um atleta.
    
    - **atleta_id**: ID do atleta
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Métricas:
    - **Tentativas**: Total de saques realizados
    - **Aces**: Saques que resultaram em ponto direto
    - **Erros**: Saques que resultaram em erro
    - **Aproveitamento**: (Aces / Tentativas) * 100
    - **Eficiência**: ((Aces - Erros) / Tentativas) * 100
    """
    resultado = obtem_estatisticas_saque_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou sem dados de saque"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/defesa", response_model=EstatisticasDefesa)
def obter_estatisticas_defesa_atleta(
    atleta_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas detalhadas de defesa/recepção de um atleta.
    
    - **atleta_id**: ID do atleta
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Métricas:
    - **Tentativas**: Total de defesas/recepções realizadas
    - **Erros que viraram ponto**: Erros de defesa que resultaram em ponto adversário
    - **Eficiência Defensiva**: ((Tentativas - Erros) / Tentativas) * 100
    """
    resultado = obtem_estatisticas_defesa_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou sem dados de defesa"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/ataque", response_model=EstatisticasAtaque)
def obter_estatisticas_ataque_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas detalhadas de ataque de uma dupla jogando JUNTA.
    
    - **dupla_id**: ID da dupla
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Soma as estatísticas dos dois atletas apenas nas partidas onde jogaram juntos.
    
    Métricas:
    - **Tentativas**: Total de ataques realizados pela dupla
    - **Pontos**: Ataques que resultaram em ponto
    - **Erros**: Ataques que resultaram em erro
    - **Aproveitamento**: (Pontos / Tentativas) * 100
    - **Eficiência**: ((Pontos - Erros) / Tentativas) * 100
    """
    resultado = obtem_estatisticas_ataque_dupla(db, dupla_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/saque", response_model=EstatisticasSaque)
def obter_estatisticas_saque_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas detalhadas de saque de uma dupla jogando JUNTA.
    
    - **dupla_id**: ID da dupla
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Soma as estatísticas dos dois atletas apenas nas partidas onde jogaram juntos.
    
    Métricas:
    - **Tentativas**: Total de saques realizados pela dupla
    - **Aces**: Saques que resultaram em ponto direto
    - **Erros**: Saques que resultaram em erro
    - **Aproveitamento**: (Aces / Tentativas) * 100
    - **Eficiência**: ((Aces - Erros) / Tentativas) * 100
    """
    resultado = obtem_estatisticas_saque_dupla(db, dupla_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/defesa", response_model=EstatisticasDefesa)
def obter_estatisticas_defesa_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna estatísticas detalhadas de defesa/recepção de uma dupla jogando JUNTA.
    
    - **dupla_id**: ID da dupla
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Soma as estatísticas dos dois atletas apenas nas partidas onde jogaram juntos.
    
    Métricas:
    - **Tentativas**: Total de defesas/recepções realizadas pela dupla
    - **Erros que viraram ponto**: Erros de defesa que resultaram em ponto adversário
    - **Eficiência Defensiva**: ((Tentativas - Erros) / Tentativas) * 100
    """
    resultado = obtem_estatisticas_defesa_dupla(db, dupla_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/completo", response_model=DuplaEstatisticasCompletas)
def obter_estatisticas_completas_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna TODAS as estatísticas consolidadas de uma dupla em uma única resposta.
    
    - **dupla_id**: ID da dupla
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Este endpoint consolida:
    - Resumo geral (pontos, vitórias, derrotas)
    - Estatísticas de ataque (tentativas, aproveitamento, eficiência)
    - Estatísticas de saque (aces, aproveitamento, eficiência)
    - Estatísticas de defesa (tentativas, eficiência defensiva)
    
    Ideal para dashboards que precisam exibir todas as métricas de uma vez.
    """
    resultado = obtem_estatisticas_completas_dupla(db, dupla_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/mapa-calor", response_model=MapaCalor)
def obter_mapa_calor_atleta(
    atleta_id: int,
    tipo_acao_id: int = Query(..., description="ID do tipo de ação"),
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):
    """
    Retorna mapa de calor com estatísticas por fluxo origem→destino na quadra.
    
    - **atleta_id**: ID do atleta
    - **tipo_acao_id**: ID do tipo de ação (ex: 1=Saque, 2=Ataque, 3=Recepção/Defesa)
    - **partida_id**: (Opcional) ID da partida para filtrar estatísticas específicas
    
    Retorna estatísticas agrupadas por fluxo origem→destino:
    - **posicao_origem**: De onde a bola veio (1-9, ou 0 se sem origem)
    - **posicao_destino**: Para onde a bola foi (1-9)
    - **total_acoes**: Quantas vezes ocorreu este fluxo origem→destino
    - **pontos**: Pontos marcados neste fluxo
    - **erros**: Erros cometidos neste fluxo
    - **eficiencia**: ((Pontos - Erros) / Total) * 100
    
    Exemplo de fluxo:
    - Origem 5 → Destino 2: Levantamento da posição 5 para ataque na posição 2
    - Total de 15 ações, 10 pontos, 2 erros, 53.33% de eficiência
    
    Ideal para visualizações de mapa de calor e análise tática no frontend.
    """
    resultado = obtem_mapa_calor_atleta(db, atleta_id, tipo_acao_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou tipo de ação inválido"
        )
    
    return resultado
