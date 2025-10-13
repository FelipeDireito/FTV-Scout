from pydantic import BaseModel, Field
from typing import List, Optional


class AtletaResumo(BaseModel):

    atleta_id: int
    nome_atleta: str
    total_pontos: int
    total_aces: int
    total_pontos_ataque: int
    total_erros: int
    total_partidas: int

    class Config:
        from_attributes = True


class DuplaResumo(BaseModel):
    
    dupla_id: int
    nome_dupla: str
    atletas: List[str]
    atletas_ids: List[int]
    total_pontos: int
    total_aces: int
    total_pontos_ataque: int
    total_erros: int
    total_partidas: int
    total_vitorias: int
    total_derrotas: int

    class Config:
        from_attributes = True


class EstatisticasAtaque(BaseModel):
    
    atleta_id: Optional[int] = None
    dupla_id: Optional[int] = None
    nome: str
    tentativas: int = Field(..., description="Total de tentativas de ataque")
    pontos: int = Field(..., description="Pontos marcados com ataque")
    erros: int = Field(..., description="Erros de ataque")
    aproveitamento: float = Field(..., description="Porcentagem de acerto (Pontos / Tentativas) * 100")
    eficiencia: float = Field(..., description="Eficiência ((Pontos - Erros) / Tentativas) * 100")

    class Config:
        from_attributes = True


class EstatisticasSaque(BaseModel):
    
    atleta_id: Optional[int] = None
    dupla_id: Optional[int] = None
    nome: str
    tentativas: int = Field(..., description="Total de tentativas de saque")
    aces: int = Field(..., description="Aces (pontos diretos de saque)")
    erros: int = Field(..., description="Erros de saque")
    aproveitamento: float = Field(..., description="Porcentagem de acerto (Aces / Tentativas) * 100")
    eficiencia: float = Field(..., description="Eficiência ((Aces - Erros) / Tentativas) * 100")

    class Config:
        from_attributes = True


class EstatisticasDefesa(BaseModel):
    
    atleta_id: Optional[int] = None
    dupla_id: Optional[int] = None
    nome: str
    tentativas: int = Field(..., description="Total de tentativas de defesa/recepção")
    erros_que_viraram_ponto: int = Field(..., description="Erros de defesa que resultaram em ponto adversário")
    eficiencia_defensiva: float = Field(..., description="Eficiência defensiva ((Tentativas - Erros) / Tentativas) * 100")

    class Config:
        from_attributes = True


class DuplaEstatisticasCompletas(BaseModel):
    
    dupla_id: int
    nome_dupla: str
    atletas: List[str]
    atletas_ids: List[int]

    total_pontos: int
    total_aces: int
    total_pontos_ataque: int
    total_erros: int
    total_partidas: int
    total_vitorias: int
    total_derrotas: int
    percentual_vitorias: float = Field(..., description="Percentual de vitórias")

    ataque_tentativas: int
    ataque_pontos: int
    ataque_erros: int
    ataque_aproveitamento: float
    ataque_eficiencia: float

    saque_tentativas: int
    saque_aces: int
    saque_erros: int
    saque_aproveitamento: float
    saque_eficiencia: float

    defesa_tentativas: int
    defesa_erros: int
    defesa_eficiencia: float

    class Config:
        from_attributes = True


class FluxoPosicao(BaseModel):
    
    posicao_origem: int = Field(..., description="Posição de origem da bola (1-9)")
    posicao_destino: int = Field(..., description="Posição de destino da bola (1-9)")
    total_acoes: int = Field(..., description="Total de ações deste fluxo origem→destino")
    pontos: int = Field(..., description="Pontos marcados neste fluxo")
    erros: int = Field(..., description="Erros cometidos neste fluxo")
    eficiencia: float = Field(..., description="Eficiência ((Pontos - Erros) / Total) * 100")

    class Config:
        from_attributes = True


class MapaCalor(BaseModel):
    
    atleta_id: Optional[int] = None
    dupla_id: Optional[int] = None
    nome: str
    tipo_acao_id: int = Field(..., description="ID do tipo de ação")
    tipo_acao_nome: str = Field(..., description="Nome do tipo de ação")
    fluxos: List[FluxoPosicao] = Field(..., description="Lista de fluxos origem→destino com estatísticas")
    total_acoes: int = Field(..., description="Total de ações em todos os fluxos")

    class Config:
        from_attributes = True
