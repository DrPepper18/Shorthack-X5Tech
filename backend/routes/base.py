from fastapi import APIRouter, HTTPException, status, Query
from pydantic import BaseModel

from services.base import *

class ScriptLineRequest(BaseModel):
    user_id: int
    line_id: int | None = None
    option_id: int | None = None
    line_id_requested: int | None = None

router = APIRouter()


@router.post("/scriptline")
async def get_scriptline(data: ScriptLineRequest):
    try:
        if data.option_id:
            await save_user_reply(
                user_id=data.user_id,
                line_id=data.line_id,
                option_id=data.option_id
            )
        
        # Получить текст
        if data.option_id:
            line_id = await get_next_text_id(option_id=data.option_id)
        elif data.line_id_requested:
            line_id = data.line_id_requested
        else:
            raise HTTPException(status_code=400, detail="Either option_id or line_id_requested must be provided")
        
        scriptline = await get_text_by_id(text_id=line_id)
        
        if scriptline is None:
            raise HTTPException(status_code=404, detail=f"Script line with id {line_id} not found")

        # Получить варианты действий
        options = await get_reply_options(question_id=line_id)

        return {
            "scriptline": scriptline,
            "options": options,
            "line_id": line_id
        }
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")


@router.get("/health", status_code=status.HTTP_200_OK)
async def get_health():
    return {"health": "ok"}