import uuid
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from models import User, GroupChat, Message
from utils import hash_password, verify_password, create_access_token, get_db, get_current_user

router = APIRouter()


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class GroupChatModel(BaseModel):
    name: str

class MessageModel(BaseModel):
    text: str
    date: datetime = datetime.utcnow()

@router.post("/signup/")
def signup(user: UserSignup, db: Session = Depends(get_db)):
    try:
        if db.query(User).filter(User.email == user.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        db_user = User(email=user.email, name=user.name, password=hash_password(user.password))
        db.add(db_user)
        db.commit()
        return {"message": "User registered successfully"}
    except Exception as e:
        print(f"Error in signup: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/login/")
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    try:
        db_user = db.query(User).filter(User.email == login_data.email).first()
        if not db_user or not verify_password(login_data.password, db_user.password):
            raise HTTPException(status_code=400, detail="Invalid email or password")
        access_token = create_access_token({"sub": db_user.email})
        return {"access_token": access_token, "token_type": "bearer", "user": db_user.email}
    except Exception as e:
        print(f"Error in login: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/groupchats/create/")
def create_groupchat(groupchat: GroupChatModel, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        groupchat_id = str(uuid.uuid4())
        new_groupchat = GroupChat(id=groupchat_id, name=groupchat.name)
        new_groupchat.members.append(current_user)
        db.add(new_groupchat)
        db.commit()
        return {"message": "Group chat created", "groupchat_id": groupchat_id}
    except Exception as e:
        print(f"Error in creating group chat: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/groupchats/joined/")
def get_joined_groupchats(current_user: User = Depends(get_current_user)):
    try:
        return {"joined_groupchats": [chat.name for chat in current_user.group_chats]}
    except Exception as e:
        print(f"Error in fetching joined groupchats: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/groupchats/available/")
def get_available_groupchats(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        all_chats = db.query(GroupChat).all()
        joined_chat_ids = {chat.id for chat in current_user.group_chats}
        available_chats = [chat.name for chat in all_chats if chat.id not in joined_chat_ids]
        return {"available_groupchats": available_chats}
    except Exception as e:
        print(f"Error in fetching available groupchats: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/groupchats/join/{groupchat_id}")
def join_groupchat(groupchat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        group_chat = db.query(GroupChat).filter(GroupChat.name == groupchat_id).first()
        if not group_chat:
            raise HTTPException(status_code=404, detail="Group chat not found")
        group_chat.members.append(current_user)
        db.commit()
        return {"message": "Joined group chat"}
    except Exception as e:
        print(f"Error in joining group chat: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/groupchats/leave/{groupchat_id}")
def leave_groupchat(groupchat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        group_chat = db.query(GroupChat).filter(GroupChat.name == groupchat_id).first()
        if not group_chat:
            raise HTTPException(status_code=404, detail="Group chat not found")
        group_chat.members.remove(current_user)
        db.commit()
        return {"message": "Left group chat"}
    except Exception as e:
        print(f"Error in leaving group chat: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.post("/groupchats/{groupchat_id}/message/")
def send_message(groupchat_id: str, message: MessageModel, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        group_chat = db.query(GroupChat).filter(GroupChat.name == groupchat_id).first()
        if not group_chat:
            raise HTTPException(status_code=404, detail="Group chat not found")
        new_message = Message(groupchat_id=groupchat_id, sender=current_user.email, text=message.text)
        db.add(new_message)
        db.commit()
        return {"message": "Message sent"}
    except Exception as e:
        print(f"Error in sending message: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.get("/groupchats/{groupchat_id}/messages/")
def get_group_messages(groupchat_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        group_chat = db.query(GroupChat).filter(GroupChat.name == groupchat_id).first()
        if not group_chat:
            raise HTTPException(status_code=404, detail="Group chat not found")

        messages = db.query(Message).filter(Message.groupchat_id == groupchat_id).order_by(Message.timestamp).all()
        return {"groupchat_id": groupchat_id, "messages": messages}
    except Exception as e:
        print(f"Error in retrieving messages: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

