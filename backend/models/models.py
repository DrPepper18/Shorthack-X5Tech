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
    __tablename__ = "reply_options"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    question_id = Column(BigInteger())
    text = Column(Text())
    leads_to = Column(BigInteger())

class UserReply(Base):
    __tablename__ = "user_reply"
    id = Column(BigInteger(), primary_key=True, autoincrement=True)
    user_id = Column(BigInteger())
    line_id = Column(BigInteger())
    option_id = Column(BigInteger())