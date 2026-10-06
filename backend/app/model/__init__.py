# Ponytail: lazy singleton model loader
_transformer_model = None
_tokenizer = None


def get_model():
    global _transformer_model, _tokenizer
    if _transformer_model is None:
        import torch
        from transformers import GPT2LMHeadModel, GPT2Tokenizer

        device = "cuda" if torch.cuda.is_available() else "cpu"
        _tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        _transformer_model = GPT2LMHeadModel.from_pretrained("gpt2").to(device)
        _transformer_model.eval()
    return _transformer_model, _tokenizer
