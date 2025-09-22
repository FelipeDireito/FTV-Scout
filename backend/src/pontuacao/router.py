from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


from src.core.database import get_db
from src.pontuacao.services import cadastra_ponto, cadastra_acao, obter_por_id, obter_acoes_partida_id, obtem_acoes, volta_ponto
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


@pontuacao_router.get("/acoes")
def obter_acoes(db: Session = Depends(get_db)):
    return obtem_acoes(db)


@pontuacao_router.get("/acoes/{partida_id}")
def obter_acoes_partida(partida_id: int, db: Session = Depends(get_db)):
    return obter_acoes_partida_id(partida_id, db)


@pontuacao_router.get("/{partida_id}")
def obter_pontuacao_partida(partida_id: int, db: Session = Depends(get_db)):
    return obter_por_id(partida_id, db)


@pontuacao_router.delete("/voltar_ponto/{partida_id}")
def voltar_ponto(partida_id: int, db: Session = Depends(get_db)):
    return volta_ponto(partida_id, db)
