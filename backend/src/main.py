from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter
from src.core.database import Base, engine

from src.atletas.router import atletas_router
from src.partidas.router import partidas_router
from src.duplas.router import duplas_router
from src.pontuacao.router import pontuacao_router
from src.estatisticas.router import estatisticas_router

app = FastAPI(
    title="FTV",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
    
@app.get("/")
def read_root():
    return {"Hello": "World"}

app.include_router(partidas_router, prefix="/api/v1")
app.include_router(atletas_router, prefix="/api/v1")
app.include_router(duplas_router, prefix="/api/v1")
app.include_router(pontuacao_router, prefix="/api/v1")
app.include_router(estatisticas_router, prefix="/api/v1")
