# Getting Your Gemini API Key

## Step-by-Step Instructions

### 1. Go to Google AI Studio
Visit: **https://aistudio.google.com/app/apikey**

### 2. Sign In
- Sign in with your Google account (the one with Google One)
- You should see the API key management page

### 3. Create API Key
- Click **"Create API Key"** button
- Choose **"Create API key in new project"** (or select existing project)
- Your API key will be generated instantly

### 4. Copy the API Key
- Copy the generated API key (starts with `AIza...`)
- **Important**: Save it somewhere safe - you won't be able to see it again!

### 5. Add to Your Project
Open `backend/.env` and replace the placeholder:

```bash
GEMINI_API_KEY=AIzaSy...your_actual_key_here
```

### 6. Restart the Backend
```bash
./stop.sh
./start.sh
```

## Pricing (Very Affordable!)

**Gemini 1.5 Flash** (what we're using):
- **Free tier**: 15 requests per minute, 1 million tokens per day
- **Paid tier**: $0.075 per 1 million input tokens
- **Your cost**: Essentially FREE for this project!

With your Google One subscription, you get generous free quotas.

## Benefits of Gemini 1.5 Flash

✅ **Faster** than GPT-4o-mini  
✅ **Cheaper** (often free with Google One)  
✅ **Excellent quality** for feedback analysis  
✅ **Large context window** (1M tokens)  
✅ **JSON mode** built-in  

## Troubleshooting

**If you get quota errors:**
- Check you're signed in with the right Google account
- Verify your Google One subscription is active
- Try creating a new API key

**If API key doesn't work:**
- Make sure you copied the entire key
- Check for extra spaces in `.env` file
- Restart the backend after adding the key
