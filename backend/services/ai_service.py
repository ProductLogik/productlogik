import os
import random
from typing import List, Dict

# Placeholder for real AI logic
# In Phase 4, we will connect this to OpenAI via `openai` package using `os.getenv("OPENAI_API_KEY")`

class AIService:
    @staticmethod
    async def analyze_feedback(items: List[str]) -> Dict:
        """
        Mock AI Analysis:
        Returns dummy themes and an Agile Anti-Pattern score.
        """
        # Simulate processing time
        import asyncio
        await asyncio.sleep(2)

        return {
            "themes": [
                {
                    "name": "Mobile Login Issues",
                    "sentiment": "Critical",
                    "score": 85,
                    "summary": "Users are unable to login on iOS devices due to timeout errors.",
                    "count": 12
                },
                {
                    "name": "Dark Mode Request",
                    "sentiment": "Feature Request",
                    "score": 45,
                    "summary": "Many developers are asking for a dark theme for late-night work.",
                    "count": 8
                },
                {
                    "name": "CSV Export Slowness",
                    "sentiment": "Performance",
                    "score": 60,
                    "summary": "Exporting large datasets (>500 rows) takes over 30 seconds.",
                    "count": 5
                }
            ],
            "agile_risk": {
                "detected": True,
                "pattern": "Feature Factory",
                "confidence": 0.92,
                "advice": "You are shipping output (features) but impact (satisfaction) is flat. Pause new features and fix the Login bug immediately."
            }
        }
