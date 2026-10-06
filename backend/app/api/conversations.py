from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.database.session import get_db, init_db

router = APIRouter()
init_db()


class ConversationCreate(BaseModel):
    title: str = "New Chat"


class ConversationResponse(BaseModel):
    id: int
    title: str
    created_at: str
    updated_at: str


class MessageCreate(BaseModel):
    conversation_id: int
    role: str
    content: str
    tokens: int | None = None
    attention_weights: str | None = None


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    tokens: int | None
    created_at: str


@router.get("/", response_model=list[ConversationResponse])
async def list_conversations():
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM conversations ORDER BY updated_at DESC LIMIT 50"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/", response_model=ConversationResponse)
async def create_conversation(data: ConversationCreate):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO conversations (title) VALUES (?)", (data.title,)
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM conversations WHERE id = ?", (cur.lastrowid,)
    ).fetchone()
    conn.close()
    return dict(row)


@router.delete("/{conv_id}")
async def delete_conversation(conv_id: int):
    conn = get_db()
    conn.execute("DELETE FROM messages WHERE conversation_id = ?", (conv_id,))
    conn.execute("DELETE FROM conversations WHERE id = ?", (conv_id,))
    conn.commit()
    conn.close()
    return {"ok": True}


@router.get("/{conv_id}/messages", response_model=list[MessageResponse])
async def get_messages(conv_id: int):
    conn = get_db()
    rows = conn.execute(
        "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
        (conv_id,),
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]


@router.post("/messages", response_model=MessageResponse)
async def create_message(data: MessageCreate):
    conn = get_db()
    cur = conn.execute(
        "INSERT INTO messages (conversation_id, role, content, tokens, attention_weights) VALUES (?,?,?,?,?)",
        (data.conversation_id, data.role, data.content, data.tokens, data.attention_weights),
    )
    conn.execute(
        "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (data.conversation_id,),
    )
    conn.commit()
    row = conn.execute(
        "SELECT * FROM messages WHERE id = ?", (cur.lastrowid,)
    ).fetchone()
    conn.close()
    return dict(row)
