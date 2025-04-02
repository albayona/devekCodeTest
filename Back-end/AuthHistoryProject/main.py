from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from fastapi.responses import HTMLResponse
from db import SessionLocal, engine
from endpoints import router
from models import GroupChat, Base
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()



FUNNY_NAMES = [
    "Cheesy Penguins", "Spicy Unicorns", "Banana Ninjas", "Fluffy Llamas",
    "Dancing Pickles", "Witty Wizards", "Jolly Jellybeans", "Sneaky Tacos",
    "Epic Pineapples", "Zebra Detectives"
]


def ensure_default_chats():
    """Checks if the default funny group chats exist; if not, creates them."""
    db: Session = SessionLocal()

    existing_chats = {chat.name for chat in db.query(GroupChat).all()}

    for name in FUNNY_NAMES:
        if name not in existing_chats:
            db.add(GroupChat(id=name.replace(" ", "_").lower(), name=name))

    db.commit()
    db.close()


# Configure CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://devek.bayona.s3-website.us-east-2.amazonaws.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"]
)




@app.on_event("startup")
def startup_event():
    """Runs on server start to ensure chat rooms exist."""
    Base.metadata.create_all(bind=engine)  # Ensure DB tables exist
    ensure_default_chats()


app.include_router(router)
