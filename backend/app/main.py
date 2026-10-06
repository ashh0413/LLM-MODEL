from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import chat, conversations, model_info

app = FastAPI(title="MiniMind API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(conversations.router, prefix="/api/conversations", tags=["conversations"])
app.include_router(model_info.router, prefix="/api/model-info", tags=["model-info"])


@app.get("/health")
async def health():
    return {"status": "ok"}
