from sqlalchemy.orm import declarative_base
from sqlalchemy import *


Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    is_admin = Column(Boolean())

class ScriptLine(Base):
    __tablename__ = "texts"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    name = Column(Text())

class ReplyOption(Base):
    __tablename__ = "replies"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    question_id = Column(BigInteger())
    text = Column(Text())
    leads_to = Column(BigInteger())

class UserReply(Base):
    __tablename__ = "user_reply"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    option_id = Column(BigInteger())
    user_id = Column(BigInteger())