from src.atletas.models import Atleta
from src.duplas.models import Dupla
from src.partidas.models import Partida
from src.pontuacao.models import Ponto, Acao, MotivoPonto, TipoAcao, TecnicaAcao
from src.core.database import Base, engine

Base.metadata.create_all(bind=engine)
