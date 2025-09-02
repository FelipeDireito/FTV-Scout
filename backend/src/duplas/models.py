from sqlalchemy import Column, Integer, String, ForeignKey, Table
from sqlalchemy.orm import relationship
from src.core.database import Base


dupla_atleta_table = Table(
    'dupla_atleta',
    Base.metadata,
    Column('dupla_id', Integer, ForeignKey('duplas.dupla_id'), primary_key=True),
    Column('atleta_id', Integer, ForeignKey('atletas.atleta_id'), primary_key=True)
)


class Dupla(Base):
    __tablename__ = "duplas"
    
    dupla_id = Column(Integer, primary_key=True, index=True)
    nome_dupla = Column(String, nullable=False)

    atletas = relationship("Atleta", secondary=dupla_atleta_table, back_populates="duplas")
