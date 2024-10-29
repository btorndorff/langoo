from openai import OpenAI
import os
from typing import List
from openai import OpenAI
from dotenv import load_dotenv
from pydantic import BaseModel

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def generate_learning_suggestions(activity_data: dict) -> List[str]:
    """
    Generate language learning suggestions based on activity data using GPT
    """
    prompt = f"""
    As a language learning assistant, provide 3-4 specific suggestions for improving this piece of writing.
    
    Title: {activity_data['title']}
    Learning Language: {activity_data['language']}
    Category of the activity: {activity_data['category']}
    Text: {activity_data['entry']}
    
    Focus on:
    1. Grammar improvements
    2. Vocabulary enhancements
    3. Style and fluency
    
    Provide clear, actionable suggestions.
    """

    model = "gpt-4o-mini"

    class Suggestions(BaseModel):
        class Suggestion(BaseModel):
            textPart: str
            suggestion: str

        suggestions: List[Suggestion]

    try:
        response = client.beta.chat.completions.parse(
            model=model,
            messages=[
                {"role": "system", "content": prompt},
            ],
            response_format=Suggestions,
        )

        return response.choices[0].message.parsed.suggestions
    except Exception as e:
        print(f"OpenAI API error: {str(e)}")
        raise Exception("Failed to generate suggestions")
