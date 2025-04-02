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
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS", "DELETE", "PUT"],
    allow_headers=[
        "Access-Control-Allow-Headers",
        "Origin",
        "Accept",
        "X-Requested-With",
        "Content-Type",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
        "Access-Control-Allow-Origin",
        "Access-Control-Allow-Methods"
        "Authorization",
        "X-Amz-Date",
        "X-Api-Key",
        "X-Amz-Security-Token"
    ]
)




@app.on_event("startup")
def startup_event():
    """Runs on server start to ensure chat rooms exist."""
    Base.metadata.create_all(bind=engine)  # Ensure DB tables exist
    ensure_default_chats()


app.include_router(router)
