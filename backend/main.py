from models.database import *
from fastapi import FastAPI
from contextlib import asynccontextmanager
import uvicorn
from routes import base

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown (if needed)

app = FastAPI(lifespan=lifespan)
app.include_router(base.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)