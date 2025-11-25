from pydantic import BaseModel, Field

class Atleta(BaseModel):
    nome_atleta: str = Field(..., example="Atleta1")
    atleta_id: int | None = Field(None, example=1)

    class Config:
        from_attributes = True
