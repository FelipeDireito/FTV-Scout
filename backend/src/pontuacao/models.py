from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.sql import func
from src.core.database import Base


class MotivoPonto(Base):
    __tablename__ = 'motivos_pontos'

    motivo_ponto_id = Column(Integer, primary_key=True, index=True)
    descricao = Column(String, nullable=False)


class TipoAcao(Base):
    __tablename__ = 'tipos_acoes'

    tipo_acao_id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)


class TecnicaAcao(Base):
    __tablename__ = 'tecnicas_acoes'

    tecnica_acao_id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)


class Ponto(Base):
    __tablename__ = 'pontos'

    ponto_id = Column(Integer, primary_key=True, index=True)
    partida_id = Column(Integer, ForeignKey('partidas.partida_id', ondelete='CASCADE'), nullable=False)
    dupla_vencedora_id = Column(Integer, ForeignKey('duplas.dupla_id'), nullable=False)
    motivo_ponto_id = Column(Integer, ForeignKey('motivos_pontos.motivo_ponto_id'), nullable=False)
    numero_ponto_partida = Column(Integer, nullable=False)


class Acao(Base):
    __tablename__ = 'acoes'

    acao_id = Column(Integer, primary_key=True, index=True)
    ponto_id = Column(Integer, ForeignKey('pontos.ponto_id', ondelete='CASCADE'), nullable=False)
    atleta_id = Column(Integer, ForeignKey('atletas.atleta_id'), nullable=False)
    tipo_acao_id = Column(Integer, ForeignKey('tipos_acoes.tipo_acao_id'), nullable=False)
    tecnica_acao_id = Column(Integer, ForeignKey('tecnicas_acoes.tecnica_acao_id'), nullable=False)
    timestamp_acao = Column(String, nullable=True, server_default=func.now())
    posicao_quadra_x = Column(Integer, nullable=True)
    posicao_quadra_y = Column(Integer, nullable=True)
