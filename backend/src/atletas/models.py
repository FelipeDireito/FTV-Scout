from sqlalchemy import Column, String, Integer
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from src.core.database import Base


class Atleta(Base):
    __tablename__ = "atletas"
    
    atleta_id = Column(Integer, primary_key=True, index=True)
    nome_atleta = Column(String, nullable=False)
    timestamp_atleta = Column(String, nullable=True, server_default=func.now())
    duplas = relationship("Dupla", secondary="dupla_atleta", back_populates="atletas")
