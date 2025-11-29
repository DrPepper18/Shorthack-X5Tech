from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel

from services.base import *

class ScriptLineRequest(BaseModel):
    user_id: int
    line_id: int | None = None
    option_id: int | None = None

router = APIRouter()


@router.post("/scriptline")
async def get_scriptline(data: ScriptLineRequest):

    if data.option_id:
        await save_user_reply(user_id=data.user_id, option_id=data.option_id)
    
    # Получить текст
    if data.option_id:
        line_id = await get_next_text_id(option_id=data.option_id)
    else:
        line_id = data.line_id
    
    scriptline = await get_text_by_id(text_id=line_id)

    # Получить варианты действий
    options = await get_reply_options(question_id=line_id)

    return {
        "scriptline": scriptline,
        "options": options
    }


@router.get("/health", status_code=status.HTTP_200_OK)
async def get_health():
    return {"health": "ok"}