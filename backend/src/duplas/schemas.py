from pydantic import BaseModel, Field


class Dupla(BaseModel):
    nome_dupla: str = Field(..., example="Dupla A")
    atletas_ids: list[int] = Field(..., min_items=2, max_items=2, example=[1, 2])

class DuplaLeitura(BaseModel):
    dupla_id: int
    nome_dupla: str
    atletas_ids: list[int]

class AdicionarAtletaDupla(BaseModel):
    dupla_id: int = Field(..., example=1)
    atleta_id: int = Field(..., example=3)
