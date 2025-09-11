from typing import Optional
from typing_extensions import Self
from pydantic import BaseModel, Field, model_validator
from datetime import datetime


class PartidaCreate(BaseModel):
    nome_partida: str = Field(..., example="Final Campeonato 2024")
    data_hora: datetime = Field(default_factory=datetime.utcnow)
    dupla_a_id: int = Field(..., example=1)
    dupla_b_id: int = Field(..., example=2)

    @model_validator(mode="after")
    def check_duplas_diferentes(self) -> Self:
        if self.dupla_a_id == self.dupla_b_id:
            raise ValueError("As duplas A e B devem ser diferentes.")
        return self

class PartidaUpdate(BaseModel):
    dupla_vencedora_id: Optional[int] = Field(None, example=2)
    placar_final_dupla_a: Optional[int] = Field(None, example=11)
    placar_final_dupla_b: Optional[int] = Field(None, example=15)
    nome_partida: Optional[str] = Field(None, example="Final Campeonato 2024 - Atualizado")

class Partida(BaseModel):
    partida_id: int
    nome_partida: str
    data_hora: datetime
    dupla_a_id: int
    dupla_b_id: int
    dupla_vencedora_id: Optional[int] = None
    placar_final_dupla_a: Optional[int] = None
    placar_final_dupla_b: Optional[int] = None

    class Config:
        from_attributes = True
