from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from database import create_db_and_tables, engine
from sqlmodel import Session, SQLModel, select
from models.session import Session as SessionModel

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

def get_session():
    with Session(engine) as session:
        yield session

@app.post("/sessions/")
def create_session(session_data: SessionModel, db: Session = Depends(get_session)):
    db.add(session_data)
    db.commit()
    db.refresh(session_data)
    return session_data

@app.get("/sessions/")
def read_session(db: Session = Depends(get_session)):
    return db.exec(select(SessionModel)).all()
    