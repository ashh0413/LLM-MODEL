# Ponytail: model service with attention extraction
from dataclasses import dataclass
import torch
import numpy as np

_transformer_model = None
_tokenizer = None


def _load_model():
    global _transformer_model, _tokenizer
    if _transformer_model is None:
        from transformers import GPT2LMHeadModel, GPT2Tokenizer
        device = "cuda" if torch.cuda.is_available() else "cpu"
        _tokenizer = GPT2Tokenizer.from_pretrained("gpt2")
        _transformer_model = GPT2LMHeadModel.from_pretrained("gpt2", output_attentions=True).to(device)
        _transformer_model.eval()
    return _transformer_model, _tokenizer


@dataclass
class GenerationResult:
    text: str
    tokens: list[int]
    log_probs: list[float]
    attention_weights: list[dict]


def generate(prompt: str, max_new_tokens: int = 100, temperature: float = 1.0, top_p: float = 0.9) -> GenerationResult:
    model, tokenizer = _load_model()
    device = next(model.parameters()).device

    inputs = tokenizer(prompt, return_tensors="pt", return_attention_mask=True)
    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    attention_weights = []
    hooks = []

    def make_hook(layer_idx):
        def hook(module, input, output):
            if len(output) > 1 and output[1] is not None:
                weights = output[1].detach().cpu().numpy()
                attention_weights.append({"layer": layer_idx, "weights": weights.tolist()})
        return hook

    for i, layer in enumerate(model.transformer.h):
        hooks.append(layer.attn.register_forward_hook(make_hook(i)))

    with torch.no_grad():
        outputs = model.generate(
            input_ids,
            attention_mask=attention_mask,
            max_new_tokens=max_new_tokens,
            temperature=temperature,
            top_p=top_p,
            do_sample=True,
            output_scores=True,
            return_dict_in_generate=True,
        )

    for h in hooks:
        h.remove()

    generated_ids = outputs.sequences[0][input_ids.shape[1]:]
    text = tokenizer.decode(generated_ids, skip_special_tokens=True)

    log_probs = []
    if hasattr(outputs, "scores") and outputs.scores:
        for score in outputs.scores:
            probs = torch.softmax(score.float(), dim=-1)
            top_prob = torch.max(probs, dim=-1).values.item()
            log_probs.append(np.log(top_prob + 1e-10))

    return GenerationResult(
        text=text,
        tokens=generated_ids.tolist(),
        log_probs=log_probs,
        attention_weights=attention_weights,
    )
