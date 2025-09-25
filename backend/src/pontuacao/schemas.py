from pydantic import BaseModel, Field
from enum import Enum
import uuid


class TiposAcoes(str, Enum):
    saque = "Saque"
    recepcao = "Recepção/Defesa"
    levantamento = "Levantamento"
    primeiro_toque_correcao = "1º Toque de Correção"
    ataque = "Ataque"
    bloqueio = "Bloqueio"


class TecnicasAcoes(str, Enum):
    cabeca = "Cabeça"
    ombro = "Ombro"
    peito = "Peito"
    coxa = "Coxa"
    peito_pe = "Peito do Pé"
    chapa_pe = "Chapa do Pé"
    lateral_pe = "Lateral do Pé (Chaleira)"
    bicicleta = "Bicicleta"
    shark = "Shark"
    aguia = "Voo do Águia"
    defesa_baixa = "Defesa Baixa (slide)"


class MotivosPonto(str, Enum):
    erro_nao_forcado = "Erro não forçado"
    erro_forcado = "Erro forçado"
    ponto_ataque = "Ponto de ataque"
    ponto_bloqueio = "Ponto de bloqueio"
    ponto_ace = "Ponto de ace"


class MotivoPonto(BaseModel):
    descricao: MotivosPonto | None = None


class TipoAcao(BaseModel):
    nome_acao: TiposAcoes | None = None


class TecnicaAcao(BaseModel):
    nome_tecnica: TecnicasAcoes | None = None


class Ponto(BaseModel):
    rally_id: uuid.UUID | None = Field(None, example="123e4567-e89b-12d3-a456-426614174000")
    partida_id: int = Field(..., example=1)
    dupla_vencedora_id: int = Field(..., example=2)
    motivo_ponto_id: int = Field(..., example=1)
    numero_ponto_partida: int = Field(..., example=3)
    atleta_ponto_id: int | None = Field(None)
    atleta_erro_id: int | None = Field(None)


class Acao(BaseModel):
    acao_id: int | None = Field(None, example=1)
    ponto_id: int | None = Field(None, example=1)
    rally_id: uuid.UUID | None = Field(None, example="123e4567-e89b-12d3-a456-426614174000")
    atleta_id: int = Field(..., example=3)
    tipo_acao_id: int = Field(..., example=1)
    tecnica_acao_id: int = Field(..., example=1)
    posicao_quadra: int | None = Field(None, example=5)


class AcaoResposta(Acao):
    acao_id: int
    ponto_id: int | None
    
    class Config:
        from_attributes = True
