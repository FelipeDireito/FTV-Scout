
from typing_extensions import Self
from pydantic import BaseModel, Field, model_validator
from datetime import date

class Partida(BaseModel):
    data_hora: date = Field(default_factory=date.today)
    dupla_a_id: int = Field(..., example=1)
    dupla_b_id: int = Field(..., example=2)
    dupla_vencedora_id: int = Field(..., example=2)
    placar_final_dupla_a: int = Field(..., example=11)
    placar_final_dupla_b: int = Field(..., example=15)
    
    @model_validator(mode="after")
    def check_integridade(self) -> Self:
        if self.dupla_a_id == self.dupla_b_id:
            raise ValueError("As duplas A e B devem ser diferentes.")
        if self.dupla_vencedora_id not in (self.dupla_a_id, self.dupla_b_id):
            raise ValueError("A dupla vencedora deve ser uma das duplas que jogaram a partida.")
        return self
