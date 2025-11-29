from models.models import *
from models.database import async_session_maker
from sqlalchemy import select, update
from typing import List, Optional
from datetime import datetime

"""
-- Новый абзац
SELECT text 
FROM texts
WHERE id = $id

-- Варианты ответа
SELECT text, leads_to
FROM replies
WHERE question_id = $id
"""
async def get_text_by_id(text_id: int) -> str:
    async with async_session_maker() as session:
        stmt = select(ScriptLine.name).where(ScriptLine.id == text_id)
        result = await session.execute(stmt)
        text_obj = result.scalar_one_or_none()
        return text_obj
    

async def get_reply_options(question_id: int) -> list[tuple]:
    async with async_session_maker() as session:
        stmt = select(ReplyOption).where(
            ReplyOption.question_id == question_id
        )
        result = await session.execute(stmt)
        options = result.scalars().all()
    
    return [
            [option.id, option.text, option.leads_to] 
            for option in options
    ]

"""
-- Сохраняем ответ игрока
INSERT INTO user_reply (user_id, option_id)
VALUES
    ($user_id, $option_id)

-- Даем следующую строчку в сценарии
SELECT leads_to
FROM reply_options
WHERE option_id = $option_id
"""
async def save_user_reply(user_id: int, option_id: int):
    async with async_session_maker() as session:
        user_reply = UserReply(user_id=user_id, option_id=option_id)
        session.add(user_reply)
        await session.commit()

async def get_next_text_id(option_id: int) -> int:
    async with async_session_maker() as session:
        stmt = select(ReplyOption.leads_to).where(ReplyOption.id == option_id)
        result = await session.execute(stmt)
        next_text_id = result.scalar_one()
        return next_text_id