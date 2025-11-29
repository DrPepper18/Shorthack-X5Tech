from models.database import *
from fastapi import FastAPI
import uvicorn
import asyncio
from routes import base

app = FastAPI()
app.include_router(base.router)

async def startup():
    await init_db()

if __name__ == "__main__":
    asyncio.run(startup())
    uvicorn.run(app, host="0.0.0.0", port=8000)