# Multi-Provider AI Service

## Overview
ProductLogik now supports **both Google Gemini and OpenAI** with automatic fallback for maximum reliability.

---

## How It Works

### Priority System
1. **Primary**: Google Gemini Flash (free with Google One)
2. **Fallback**: OpenAI GPT-4o-mini (if Gemini fails)

### Automatic Failover
If Gemini fails (quota, timeout, error), the system automatically switches to OpenAI.

---

## Configuration

### Environment Variables
Both API keys can be configured in `backend/.env`:

```bash
# Primary: Google Gemini
GEMINI_API_KEY=AIzaSy...your_key_here

# Fallback: OpenAI
OPENAI_API_KEY=sk-proj-...your_key_here
```

### Initialization
On startup, the AI service checks which providers are available:

```
✅ Gemini AI initialized (Primary)
✅ OpenAI initialized (Fallback)
```

---

## Usage Scenarios

### Scenario 1: Both Available
- Uses **Gemini** (cheaper/free)
- OpenAI ready as backup

### Scenario 2: Only Gemini
- Uses **Gemini**
- No fallback needed

### Scenario 3: Only OpenAI
- Uses **OpenAI** as primary
- No fallback available

### Scenario 4: Gemini Fails
- Tries **Gemini** first
- Automatically falls back to **OpenAI**
- Logs: `⚠️ Gemini analysis failed` → `🔄 Falling back to OpenAI...`

---

## Benefits

✅ **Reliability**: Never fails if one provider is down  
✅ **Cost Optimization**: Uses cheaper provider first  
✅ **Flexibility**: Easy to switch providers  
✅ **No Downtime**: Seamless fallback  
✅ **Provider Independence**: Not locked to one vendor  

---

## Cost Comparison

| Provider | Model | Cost per 1M tokens | Free Tier |
|----------|-------|-------------------|-----------|
| **Gemini** | Flash | $0.075 | ✅ 15 req/min |
| **OpenAI** | GPT-4o-mini | $0.15 | ❌ None |

**Savings**: 2x cheaper with Gemini, often FREE!

---

## Testing

Both providers return the same JSON structure:
```json
{
  "themes": [...],
  "executive_summary": "...",
  "confidence_score": 85,
  "model_used": "gemini-flash-latest"  // or "gpt-4o-mini"
}
```

---

## Monitoring

Check logs to see which provider was used:
- `✅ Gemini AI initialized (Primary)`
- `✅ OpenAI initialized (Fallback)`
- `⚠️ Gemini analysis failed: ...`
- `🔄 Falling back to OpenAI...`

---

## Summary

**Multi-provider setup complete!**
- Gemini primary (free/cheap)
- OpenAI fallback (reliable)
- Automatic failover
- Zero configuration needed
