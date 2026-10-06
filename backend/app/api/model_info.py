from fastapi import APIRouter

router = APIRouter()


@router.get("/info")
async def model_info():
    return {
        "name": "GPT-2 Small",
        "parameters": "124M",
        "layers": 12,
        "heads": 12,
        "vocab_size": 50257,
        "context_length": 1024,
        "description": "MiniMind educational LLM — GPT-2 architecture demo",
        "concepts": [
            {"id": 1, "name": "Token Embeddings", "description": "Maps token IDs to dense vectors"},
            {"id": 2, "name": "Positional Encoding", "description": "Adds position information to tokens"},
            {"id": 3, "name": "Self-Attention", "description": "Tokens attend to all previous tokens"},
            {"id": 4, "name": "Multi-Head Attention", "description": "12 parallel attention heads"},
            {"id": 5, "name": "Feed-Forward Network", "description": "Two-layer MLP after attention"},
            {"id": 6, "name": "Layer Normalization", "description": "Stabilizes training"},
            {"id": 7, "name": "Residual Connections", "description": "Enables deep networks"},
            {"id": 8, "name": "Softmax", "description": "Converts logits to probabilities"},
            {"id": 9, "name": "Next-Token Prediction", "description": "Autoregressive generation"},
            {"id": 10, "name": "Temperature Sampling", "description": "Controls randomness"},
            {"id": 11, "name": "Top-P Nucleus Sampling", "description": "Dynamic token filtering"},
            {"id": 12, "name": "Cross-Entropy Loss", "description": "Training objective"},
            {"id": 13, "name": "Attention Visualization", "description": "Shows which tokens influenced which"},
        ],
    }
