from src.atletas.models import Atleta
from src.duplas.models import Dupla
from src.partidas.models import Partida
from src.pontuacao.models import Ponto, Acao, MotivoPonto, TipoAcao, TecnicaAcao
from src.core.database import Base, engine, SessionLocal

Base.metadata.create_all(bind=engine)


def popular_tabelas_fixas():
    session = SessionLocal()
    
    tipos_acoes = [
        TipoAcao(nome_acao="Saque"),
        TipoAcao(nome_acao="Recepção/Defesa"),
        TipoAcao(nome_acao="Levantamento"),
        TipoAcao(nome_acao="1º Toque de Correção"),
        TipoAcao(nome_acao="Ataque"),
        TipoAcao(nome_acao="Bloqueio")
    ]

    tecnicas = [
        TecnicaAcao(nome_tecnica="Cabeça"),
        TecnicaAcao(nome_tecnica="Ombro"),
        TecnicaAcao(nome_tecnica="Peito"),
        TecnicaAcao(nome_tecnica="Coxa"),
        TecnicaAcao(nome_tecnica="Peito do Pé"),
        TecnicaAcao(nome_tecnica="Chapa do Pé"),
        TecnicaAcao(nome_tecnica="Lateral do Pé (Chaleira)"),
        TecnicaAcao(nome_tecnica="Bicicleta"),
        TecnicaAcao(nome_tecnica="Shark"),
        TecnicaAcao(nome_tecnica="Voo do Águia"),
        TecnicaAcao(nome_tecnica="Defesa Baixa (slide)")
    ]

    motivos_ponto = [
        MotivoPonto(descricao="Erro não forçado"),
        MotivoPonto(descricao="Erro forçado"),
        MotivoPonto(descricao="Ponto de ataque"),
        MotivoPonto(descricao="Ponto de bloqueio"),
        MotivoPonto(descricao="Ponto de ace")
    ]
    
    session.add_all(tipos_acoes + tecnicas + motivos_ponto)
    session.commit()
    session.close()
    
if __name__ == "__main__":
    popular_tabelas_fixas()

