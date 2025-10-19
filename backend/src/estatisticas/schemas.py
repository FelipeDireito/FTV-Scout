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
    tentativas: int = Field(..., description="Total de tentativas de defesa")
    erros_que_viraram_ponto: int = Field(..., description="Erros de defesa que resultaram em ponto adversário")
    aproveitamento_defesa: float = Field(..., description="Eficiência defensiva ((Tentativas - Erros) / Tentativas) * 100")

    class Config:
        from_attributes = True


class EstatisticasRecepcao(BaseModel):
    
    atleta_id: Optional[int] = None
    dupla_id: Optional[int] = None
    nome: str
    tentativas: int = Field(..., description="Total de tentativas de recepção")
    erros_que_viraram_ponto: int = Field(..., description="Erros de recepção que resultaram em ponto adversário")
    aproveitamento_recepcao: float = Field(..., description="Eficiência de recepção ((Tentativas - Erros) / Tentativas) * 100")

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
    defesa_aproveitamento: float

    recepcao_tentativas: int
    recepcao_erros: int
    recepcao_aproveitamento: float

    bloqueio_pontos: int

    class Config:
        from_attributes = True


class AtletaEstatisticasCompletas(BaseModel):
    atleta_id: int
    nome_atleta: str
    
    total_pontos: int
    total_aces: int
    total_pontos_ataque: int
    total_erros: int
    total_partidas: int

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
    defesa_aproveitamento: float

    recepcao_tentativas: int
    recepcao_erros: int
    recepcao_aproveitamento: float

    bloqueio_pontos: int

    class Config:
        from_attributes = True


class FluxoPosicao(BaseModel):
    
    posicao_origem: int = Field(..., description="Posição de origem da bola (1-9, ou 0 se sem origem)")
    posicao_destino: int = Field(..., description="Posição de destino da bola (1-9)")
    lado_origem: str = Field(..., description="Lado da quadra de origem (A ou B)")
    lado_destino: str = Field(..., description="Lado da quadra de destino (A ou B)")
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
    lado_quadra: str = Field(..., description="Lado da quadra onde o atleta está jogando (A ou B)")
    fluxos: List[FluxoPosicao] = Field(..., description="Lista de fluxos origem→destino com estatísticas")
    total_acoes: int = Field(..., description="Total de ações em todos os fluxos")

    class Config:
        from_attributes = True


class PosicaoStats(BaseModel):
    
    posicao: int = Field(..., description="Posição na quadra (1-6)")
    total_acoes: int = Field(..., description="Total de ações nesta posição")
    pontos: int = Field(..., description="Pontos marcados nesta posição")
    erros: int = Field(..., description="Erros cometidos nesta posição")
    acoes_neutras: int = Field(..., description="Ações que não resultaram em ponto nem erro")
    eficiencia: float = Field(..., description="Eficiência ((Pontos - Erros) / Total) * 100")
    taxa_ponto: float = Field(..., description="Taxa de pontos (Pontos / Total) * 100")
    taxa_erro: float = Field(..., description="Taxa de erros (Erros / Total) * 100")

    class Config:
        from_attributes = True


class MapaCalorPosicoes(BaseModel):
    
    atleta_id: int
    nome: str
    tipo_acao_id: int = Field(..., description="ID do tipo de ação")
    tipo_acao_nome: str = Field(..., description="Nome do tipo de ação")
    lado_quadra: str = Field(..., description="Lado da quadra onde o atleta está jogando (A ou B)")
    lado_destino: str = Field(..., description="Lado da quadra de destino das ações (A ou B)")
    posicoes: List[PosicaoStats] = Field(..., description="Lista de posições com estatísticas agregadas")
    total_acoes: int = Field(..., description="Total de ações em todas as posições")
    total_pontos: int = Field(..., description="Total de pontos marcados")
    total_erros: int = Field(..., description="Total de erros cometidos")
    eficiencia_geral: float = Field(..., description="Eficiência geral ((Pontos - Erros) / Total) * 100")

    class Config:
        from_attributes = True
