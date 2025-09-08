from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from src.core.database import get_db
from src.pontuacao.services import cadastra_ponto, cadastra_acao
from src.pontuacao.schemas import Ponto, Acao

pontuacao_router = APIRouter(tags=["pontuacao"], prefix="/pontuacao")

@pontuacao_router.get("")
def obter_pontuacao():
    return 

@pontuacao_router.post("/acao", response_model=Acao)
def cadastrar_acao(acao: Acao, db: Session = Depends(get_db)):
    return cadastra_acao(acao, db)


@pontuacao_router.post("/ponto", status_code=201)
def cadastrar_ponto(ponto: Ponto, db: Session = Depends(get_db)):
    return cadastra_ponto(ponto, db)


