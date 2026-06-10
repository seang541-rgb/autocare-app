# LokalGo AI Care

Local Ollama model for the first AI customer-service integration.

## Model

- Base model: `gemma4:12b`
- LokalGo model: `lokalgo-care:12b`
- Modelfile: `ai/lokalgo-care.Modelfile`

Create or update the local model:

```powershell
ollama create lokalgo-care:12b -f ai\lokalgo-care.Modelfile
```

## API Call

Use Ollama chat API:

```http
POST http://localhost:11434/api/chat
```

Important request settings:

```json
{
  "model": "lokalgo-care:12b",
  "stream": false,
  "think": false,
  "messages": [
    { "role": "user", "content": "Can I pay with TnG now?" }
  ]
}
```

`think: false` is required for app usage. Gemma 4 can spend a long time in thinking mode and may return an empty visible answer if the output limit is consumed by thinking tokens.

## Current Knowledge

The model is configured for:

- LokalGo marketplace positioning.
- Car care, food, retail, and services categories.
- Preview merchants and service prices.
- Preview orders such as `#LG2398` and `#LG2401`.
- Payment policy: demo/manual mode until merchants provide real TnG, FPX, card, or bank details.
- Complaint policy: collect order number, merchant, issue, photo if available, and contact preference.
- Order change policy: ask for confirmation before changes.
- Language policy: reply in the user's latest language, English, Chinese, or Bahasa Melayu.

## Runtime Notes

- Do not call the 12B local model in parallel from the app.
- Use a backend queue or one request per user session.
- Keep answers short for mobile UI.
- Add real order and merchant data as runtime context when the backend is connected.
- Use fine-tuning later only after collecting enough real support conversations.
