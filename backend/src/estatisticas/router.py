from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional, List

from src.core.database import get_db
from src.estatisticas.schemas import (
    AtletaResumo, 
    DuplaResumo,
    EstatisticasAtaque,
    EstatisticasSaque,
    EstatisticasDefesa,
    EstatisticasRecepcao,
    DuplaEstatisticasCompletas,
    AtletaEstatisticasCompletas,
    MapaCalor,
    MapaCalorPosicoes,
    MapaCalorPosicoesDupla,
    PartidaHistoricoAtleta,
    PartidaHistoricoDupla,
    EstatisticasVitoriasAtleta,
    EstatisticasVitoriasDupla
)
from src.estatisticas.services import (
    obtem_estatisticas_atleta, 
    obtem_estatisticas_dupla,
    obtem_estatisticas_ataque_atleta,
    obtem_estatisticas_saque_atleta,
    obtem_estatisticas_defesa_atleta,
    obtem_estatisticas_recepcao_atleta,
    obtem_estatisticas_ataque_dupla,
    obtem_estatisticas_saque_dupla,
    obtem_estatisticas_defesa_dupla,
    obtem_estatisticas_recepcao_dupla,
    obtem_estatisticas_completas_dupla,
    obtem_estatisticas_completas_atleta,
    obtem_mapa_calor_atleta,
    obtem_mapa_calor_posicoes_atleta,
    obtem_mapa_calor_posicoes_dupla
)
from src.estatisticas.services_historico import (
    obtem_estatisticas_vitorias_atleta,
    obtem_estatisticas_vitorias_dupla
)

estatisticas_router = APIRouter(tags=["estatisticas"], prefix="/estatisticas")

@estatisticas_router.get("/atleta/{atleta_id}/resumo", response_model=AtletaResumo)
def obter_estatisticas_atleta(
    atleta_id: int, 
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):

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

    resultado = obtem_estatisticas_defesa_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou sem dados de defesa"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/recepcao", response_model=EstatisticasRecepcao)
def obter_estatisticas_recepcao_atleta(
    atleta_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):

    resultado = obtem_estatisticas_recepcao_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou sem dados de recepção"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/completo", response_model=AtletaEstatisticasCompletas)
def obter_estatisticas_completas_atleta(
    atleta_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):

    resultado = obtem_estatisticas_completas_atleta(db, atleta_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/ataque", response_model=EstatisticasAtaque)
def obter_estatisticas_ataque_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):

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

    resultado = obtem_estatisticas_defesa_dupla(db, dupla_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/recepcao", response_model=EstatisticasRecepcao)
def obter_estatisticas_recepcao_dupla(
    dupla_id: int,
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):

    resultado = obtem_estatisticas_recepcao_dupla(db, dupla_id, partida_id)
    
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

    resultado = obtem_mapa_calor_atleta(db, atleta_id, tipo_acao_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou tipo de ação inválido"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/mapa-calor-posicoes", response_model=MapaCalorPosicoes)
def obter_mapa_calor_posicoes_atleta(
    atleta_id: int,
    tipo_acao_id: int = Query(..., description="ID do tipo de ação (1=Saque, 5=Ataque, etc)"),
    partida_id: Optional[int] = Query(None, description="ID da partida para filtrar estatísticas"),
    db: Session = Depends(get_db)
):

    resultado = obtem_mapa_calor_posicoes_atleta(db, atleta_id, tipo_acao_id, partida_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado ou tipo de ação inválido"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/mapa-calor-posicoes", response_model=MapaCalorPosicoesDupla)
def endpoint_mapa_calor_posicoes_dupla(
    dupla_id: int,
    tipo_acao_id: int = Query(..., description="ID do tipo de ação (1=Saque, 5=Ataque, etc)"),
    partida_id: Optional[int] = Query(None, description="ID da partida (opcional)"),
    db: Session = Depends(get_db)
):

    resultado = obtem_mapa_calor_posicoes_dupla(db, dupla_id, tipo_acao_id, partida_id)
    
    if resultado is None:
        raise HTTPException(status_code=404, detail="Dupla ou tipo de ação não encontrado")
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/historico-partidas", response_model=List[PartidaHistoricoAtleta])
def obter_historico_partidas_atleta(
    atleta_id: int,
    db: Session = Depends(get_db)
):

    from src.estatisticas.services_historico import obtem_historico_partidas_atleta
    
    resultado = obtem_historico_partidas_atleta(db, atleta_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/historico-partidas", response_model=List[PartidaHistoricoDupla])
def obter_historico_partidas_dupla(
    dupla_id: int,
    db: Session = Depends(get_db)
):

    from src.estatisticas.services_historico import obtem_historico_partidas_dupla
    
    resultado = obtem_historico_partidas_dupla(db, dupla_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado


@estatisticas_router.get("/atleta/{atleta_id}/estatisticas-vitorias", response_model=EstatisticasVitoriasAtleta)
def obter_estatisticas_vitorias_atleta(
    atleta_id: int,
    db: Session = Depends(get_db)
):

    resultado = obtem_estatisticas_vitorias_atleta(db, atleta_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Atleta com ID {atleta_id} não encontrado"
        )
    
    return resultado


@estatisticas_router.get("/dupla/{dupla_id}/estatisticas-vitorias", response_model=EstatisticasVitoriasDupla)
def obter_estatisticas_vitorias_dupla(
    dupla_id: int,
    db: Session = Depends(get_db)
):

    resultado = obtem_estatisticas_vitorias_dupla(db, dupla_id)
    
    if resultado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dupla com ID {dupla_id} não encontrada"
        )
    
    return resultado
