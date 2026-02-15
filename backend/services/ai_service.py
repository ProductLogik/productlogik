import os
import json
from typing import List, Dict, Optional
import time
import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        """Initialize multi-provider AI service with Gemini as primary and OpenAI as fallback"""
        self.gemini_available = False
        self.openai_available = False
        self.primary_provider = None
        
        # Try to initialize Gemini
        try:
            from google import genai
            gemini_key = os.getenv("GEMINI_API_KEY")
            if gemini_key and gemini_key != "your_gemini_api_key_here":
                self.gemini_client = genai.Client(api_key=gemini_key)
                self.gemini_available = True
                self.primary_provider = "gemini"
                logger.info("✅ Gemini AI initialized (Primary)")
            else:
                 logger.warning("⚠️ Gemini API key not found or default")
        except Exception as e:
            logger.error(f"⚠️  Gemini initialization failed: {e}")
        
        # Try to initialize OpenAI
        try:
            from openai import OpenAI
            openai_key = os.getenv("OPENAI_API_KEY")
            if openai_key and openai_key.startswith("sk-"):
                self.openai_client = OpenAI(api_key=openai_key)
                self.openai_available = True
                if not self.primary_provider:
                    self.primary_provider = "openai"
                logger.info(f"✅ OpenAI initialized ({'Primary' if not self.gemini_available else 'Fallback'})")
        except Exception as e:
            logger.error(f"⚠️  OpenAI initialization failed: {e}")
        
        if not self.gemini_available and not self.openai_available:
            logger.error("❌ No AI provider available. Please configure GEMINI_API_KEY or OPENAI_API_KEY")
            # Do not raise error to allow server startup
            pass
    
    async def analyze_feedback(self, feedback_entries: List[Dict], upload_id: str) -> Dict:
        """
        Analyze feedback using available AI provider (Gemini primary, OpenAI fallback).
        
        Args:
            feedback_entries: List of feedback entry dicts with 'content' field
            upload_id: UUID of the upload
            
        Returns:
            Dict with themes, sentiment, confidence scores, and executive summary
        """
        start_time = time.time()
        
        try:
            # Extract feedback text
            feedback_texts = [entry.get('content', '') for entry in feedback_entries if entry.get('content')]
            
            if not feedback_texts:
                return self._empty_analysis()
            
            # Prepare feedback (limit to 100 for cost control)
            feedback_sample = feedback_texts[:100]
            
            # Try primary provider first, then fallback
            result = None
            provider_used = None
            
            if self.gemini_available:
                try:
                    result = await self._analyze_with_gemini(feedback_sample)
                    provider_used = "gemini-2.0-flash"
                except Exception as e:
                    logger.error(f"⚠️  Gemini analysis failed: {e}")
                    if self.openai_available:
                        logger.info("🔄 Falling back to OpenAI...")
            
            if not result and self.openai_available:
                try:
                    result = await self._analyze_with_openai(feedback_sample)
                    provider_used = "gpt-4o-mini"
                except Exception as e:
                    print(f"❌ OpenAI analysis failed: {e}")
                    return self._error_analysis(str(e))
            
            if not result:
                return self._error_analysis("All AI providers failed")
            
            # Add metadata
            processing_time_ms = int((time.time() - start_time) * 1000)
            result['processing_time_ms'] = processing_time_ms
            result['model_used'] = provider_used
            result['feedback_count'] = len(feedback_texts)
            result['feedback_analyzed'] = len(feedback_sample)
            
            # Calculate overall confidence
            if result.get('themes'):
                avg_confidence = sum(t.get('confidence', 0) for t in result['themes']) / len(result['themes'])
                result['confidence_score'] = avg_confidence
            else:
                result['confidence_score'] = 0
            
            return result
            
        except Exception as e:
            print(f"❌ AI analysis error: {e}")
            return self._error_analysis(str(e))
    
    async def _analyze_with_gemini(self, feedback_sample: List[str]) -> Dict:
        """Analyze feedback using Gemini"""
        feedback_list = "\n".join([f"{i+1}. {text}" for i, text in enumerate(feedback_sample)])
        
        prompt = f"""You are an expert product feedback analyst. Analyze the following {len(feedback_sample)} customer feedback items and extract key insights.

Your task:
1. Identify the top 3-5 most important themes
2. For each theme, provide:
   - Name (concise, descriptive)
   - Confidence score (0-100)
   - Sentiment (Positive, Neutral, Negative, or Critical)
   - Count (estimated number of feedback items)
   - Summary (1-2 sentences)
   - Evidence (3-5 actual quotes from feedback)
3. Provide an executive summary (2-3 sentences)

Return valid JSON with this structure:
{{
  "themes": [
    {{
      "name": "Theme name",
      "confidence": 85,
      "sentiment": "Critical",
      "count": 12,
      "summary": "Brief description",
      "evidence": ["quote 1", "quote 2", "quote 3"]
    }}
  ],
  "executive_summary": "Overall analysis..."
}}

Feedback:
{feedback_list}

Return ONLY the JSON object."""

        from google import genai
        from google.genai import types
        
        response = self.gemini_client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt,
            config=types.GenerateContentConfig(
                temperature=0.3,
                max_output_tokens=2000,
                response_mime_type="application/json"
            )
        )
        
        return json.loads(response.text)
    
    async def _analyze_with_openai(self, feedback_sample: List[str]) -> Dict:
        """Analyze feedback using OpenAI"""
        feedback_list = "\n".join([f"{i+1}. {text}" for i, text in enumerate(feedback_sample)])
        
        system_prompt = """You are an expert product feedback analyst. Extract key themes, sentiment, and insights.

Return valid JSON with this structure:
{
  "themes": [
    {
      "name": "Theme name",
      "confidence": 85,
      "sentiment": "Critical",
      "count": 12,
      "summary": "Brief description",
      "evidence": ["quote 1", "quote 2", "quote 3"]
    }
  ],
  "executive_summary": "Overall analysis..."
}

Sentiment must be: Positive, Neutral, Negative, or Critical"""

        user_prompt = f"""Analyze these {len(feedback_sample)} feedback items and extract:
1. Top 3-5 themes
2. Confidence score (0-100) for each
3. Sentiment for each
4. Evidence quotes
5. Executive summary

Feedback:
{feedback_list}

Return ONLY valid JSON."""

        response = self.openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.3,
            max_tokens=2000,
            response_format={"type": "json_object"}
        )
        
        return json.loads(response.choices[0].message.content)
    
    def _empty_analysis(self) -> Dict:
        """Return empty analysis when no feedback provided"""
        return {
            "themes": [],
            "executive_summary": "No feedback to analyze.",
            "confidence_score": 0,
            "processing_time_ms": 0,
            "model_used": self.primary_provider or "none",
            "feedback_count": 0
        }
    
    def _error_analysis(self, error_message: str) -> Dict:
        """Return error analysis"""
        return {
            "themes": [],
            "executive_summary": f"Analysis failed: {error_message}",
            "confidence_score": 0,
            "processing_time_ms": 0,
            "model_used": "error",
            "error": error_message
        }

# Create singleton instance
ai_service = AIService()
