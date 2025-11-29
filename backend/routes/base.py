from fastapi import APIRouter, HTTPException, status, Query

router = APIRouter()

@router.get("/scriptline")
async def get_scriptline():
    # Получить текст
    # Получить варианты действий
    pass

@router.post("/option")
async def pick_an_option():
    pass


@router.get("/health", status_code=status.HTTP_200_OK)
async def get_health():
    return {"health": "ok"}