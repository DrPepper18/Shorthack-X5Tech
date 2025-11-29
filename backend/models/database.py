from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from models.models import * 
import sqlalchemy as db
from config import DB_NAME, DB_USER, DB_PASSWORD

DATABASE_URL = f"postgresql+asyncpg://{DB_USER}:{DB_PASSWORD}@localhost:5432/{DB_NAME}"
engine = create_async_engine(DATABASE_URL, echo=True, future=True) 
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False) 

async def init_db(): 
    async with engine.begin() as conn: 
        await conn.run_sync(Base.metadata.create_all)