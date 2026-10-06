from fastapi import APIRouter
from pydantic import BaseModel
from app.model.generator import generate, GenerationResult

router = APIRouter()


class GenerateRequest(BaseModel):
    prompt: str
    max_new_tokens: int = 100
    temperature: float = 1.0
    top_p: float = 0.9


class GenerateResponse(BaseModel):
    text: str
    tokens: list[int]
    log_probs: list[float]
    attention_weights: list[dict]
    token_details: list[dict]


@router.post("/generate", response_model=GenerateResponse)
async def generate_endpoint(req: GenerateRequest) -> GenerateResponse:
    result = generate(
        req.prompt,
        max_new_tokens=req.max_new_tokens,
        temperature=req.temperature,
        top_p=req.top_p,
    )
    # Enrich with token strings for frontend display
    model, tokenizer = _load_model()  # reuse
    token_details = []
    for tok in result.tokens:
        tok_str = tokenizer.decode([tok])
        token_details.append({"id": tok, "str": repr(tok_str)})

    return GenerateResponse(
        text=result.text,
        tokens=result.tokens,
        log_probs=result.log_probs,
        attention_weights=result.attention_weights,
        token_details=token_details,
    )


# Ponytail: avoid circular import, lazy loader
def _load_model():
    from app.model.generator import _load_model as _lm
    return _lm()
