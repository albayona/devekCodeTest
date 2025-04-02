from sqlalchemy import create_engine, Column, String, ForeignKey, DateTime, Table, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

user_group_association = Table(
    "user_group_association", Base.metadata,
    Column("user_email", String, ForeignKey("users.email")),
    Column("groupchat_id", String, ForeignKey("groupchats.id"))
)

class User(Base):
    __tablename__ = "users"
    email = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    password = Column(String, nullable=False)
    group_chats = relationship("GroupChat", secondary=user_group_association, back_populates="members")

class GroupChat(Base):
    __tablename__ = "groupchats"
    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    members = relationship("User", secondary=user_group_association, back_populates="group_chats")
    messages = relationship("Message", back_populates="group_chat")

class Message(Base):
    __tablename__ = "messages"
    id = Column(Integer, primary_key=True)
    groupchat_id = Column(String, ForeignKey("groupchats.id"), nullable=False)
    sender = Column(String, ForeignKey("users.email"), nullable=False)
    text = Column(String, nullable=False)
    date = Column(DateTime, default=datetime.utcnow)
    group_chat = relationship("GroupChat", back_populates="messages")
