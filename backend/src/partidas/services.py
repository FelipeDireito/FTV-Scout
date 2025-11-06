from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status

from src.partidas.models import Partida as PartidaModel
from src.partidas.schemas import PartidaCreate, PartidaUpdate, PartidaCreateComAtletas
from src.duplas.models import Dupla as DuplaModel
from src.atletas.models import Atleta as AtletaModel


def criar_partida(db: Session, partida: PartidaCreate) -> PartidaModel:
    nova_partida = PartidaModel(**partida.model_dump())
    db.add(nova_partida)
    db.commit()
    db.refresh(nova_partida)
    return nova_partida


def obter_todas_partidas(db: Session):
    return db.query(PartidaModel).all()


def obter_partidas_recentes(db: Session, limit: int = 3):
    partidas = (
        db.query(PartidaModel)
        .order_by(PartidaModel.data_hora.desc())
        .limit(limit)
        .all()
    )
    
    # Buscar duplas em uma única query
    duplas_ids = set()
    for partida in partidas:
        if partida.dupla_a_id:
            duplas_ids.add(partida.dupla_a_id)
        if partida.dupla_b_id:
            duplas_ids.add(partida.dupla_b_id)
    
    duplas_map = {}
    if duplas_ids:
        duplas = db.query(DuplaModel).filter(DuplaModel.dupla_id.in_(duplas_ids)).all()
        duplas_map = {dupla.dupla_id: dupla for dupla in duplas}
    
    # Montar resultado com duplas
    resultado = []
    for partida in partidas:
        dupla_a = duplas_map.get(partida.dupla_a_id)
        dupla_b = duplas_map.get(partida.dupla_b_id)
        
        if dupla_a and dupla_b:
            resultado.append({
                "partida_id": partida.partida_id,
                "nome_partida": partida.nome_partida,
                "data_hora": partida.data_hora,
                "dupla_a": {"dupla_id": dupla_a.dupla_id, "nome_dupla": dupla_a.nome_dupla},
                "dupla_b": {"dupla_id": dupla_b.dupla_id, "nome_dupla": dupla_b.nome_dupla},
                "dupla_vencedora_id": partida.dupla_vencedora_id,
                "placar_final_dupla_a": partida.placar_final_dupla_a,
                "placar_final_dupla_b": partida.placar_final_dupla_b,
            })
    
    return resultado


def obter_partida_por_id(db: Session, partida_id: int) -> PartidaModel | None:
    return db.query(PartidaModel).filter(PartidaModel.partida_id == partida_id).first()


def atualizar_partida(db: Session, partida_id: int, partida_update: PartidaUpdate) -> PartidaModel:
    db_partida = obter_partida_por_id(db, partida_id)
    if not db_partida:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Partida não encontrada")

    if partida_update.dupla_vencedora_id:
        if partida_update.dupla_vencedora_id not in (db_partida.dupla_a_id, db_partida.dupla_b_id):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A dupla vencedora deve ser uma das duplas que jogaram a partida."
            )

    update_data = partida_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_partida, key, value)

    db.add(db_partida)
    db.commit()
    db.refresh(db_partida)
    return db_partida


def _get_or_create_dupla(db: Session, atleta1_id: int, atleta2_id: int) -> DuplaModel:

    subquery = (
        db.query(DuplaModel.dupla_id)
        .join(DuplaModel.atletas)
        .filter(AtletaModel.atleta_id.in_([atleta1_id, atleta2_id]))
        .group_by(DuplaModel.dupla_id)
        .having(func.count(AtletaModel.atleta_id) == 2)
    ).subquery()

    q = (
        db.query(DuplaModel)
        .join(DuplaModel.atletas)
        .filter(DuplaModel.dupla_id.in_(subquery))
        .group_by(DuplaModel.dupla_id)
        .having(func.count(AtletaModel.atleta_id) == 2)
    )
    
    db_dupla = q.first()

    if db_dupla:
        return db_dupla

    atleta1 = db.query(AtletaModel).filter(AtletaModel.atleta_id == atleta1_id).first()
    atleta2 = db.query(AtletaModel).filter(AtletaModel.atleta_id == atleta2_id).first()
    
    if not atleta1 or not atleta2:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Um ou mais atletas não encontrados.")

    nova_dupla = DuplaModel(
        nome_dupla=f"{atleta1.nome_atleta} e {atleta2.nome_atleta}"
    )
    nova_dupla.atletas.append(atleta1)
    nova_dupla.atletas.append(atleta2)
    
    db.add(nova_dupla)
    db.flush()
    return nova_dupla


def criar_partida_com_atletas(db: Session, partida_data: PartidaCreateComAtletas) -> PartidaModel:
    try:
        with db.begin():
            dupla_a = _get_or_create_dupla(db, partida_data.atleta_dupla_a1_id, partida_data.atleta_dupla_a2_id)
            dupla_b = _get_or_create_dupla(db, partida_data.atleta_dupla_b1_id, partida_data.atleta_dupla_b2_id)

            if dupla_a.dupla_id == dupla_b.dupla_id:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="As duplas formadas são idênticas. Uma partida deve ter duplas diferentes."
                )

            nova_partida = PartidaModel(
                nome_partida=partida_data.nome_partida,
                dupla_a_id=dupla_a.dupla_id,
                dupla_b_id=dupla_b.dupla_id
            )
            db.add(nova_partida)
            db.flush()
            db.refresh(nova_partida)
            return nova_partida
    except Exception as e:
        db.rollback()
        raise e
