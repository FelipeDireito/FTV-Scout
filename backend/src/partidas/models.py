from sqlalchemy import Column, String, Integer, ForeignKey, CheckConstraint
from src.core.database import Base
from sqlalchemy.sql import func


class Partida(Base):
    __tablename__ = "partidas"
    __table_args__ = (
        CheckConstraint("dupla_a_id != dupla_b_id", name="check_duplas_diferentes"),
    )

    partida_id = Column(Integer, primary_key=True, index=True)
    data_hora = Column(String, nullable=True, server_default=func.now())
    dupla_a_id = Column(Integer, ForeignKey('duplas.dupla_id'), nullable=False)
    dupla_b_id = Column(Integer, ForeignKey('duplas.dupla_id'), nullable=False)
    dupla_vencedora_id = Column(Integer, ForeignKey('duplas.dupla_id'), nullable=True)
    placar_final_dupla_a = Column(Integer, nullable=False, default=0)
    placar_final_dupla_b = Column(Integer, nullable=False, default=0)
