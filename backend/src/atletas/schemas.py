from pydantic import BaseModel, Field

class Atleta(BaseModel):
    nome_atleta: str = Field(..., example="Atleta1")
