import requests
import json

class GenerationService:

  def __init__(self, api_endpoint, api_key):

        self.api_endpoint = api_endpoint
        self.api_key = api_key

  def generate_query(self, prompt, model="gemini-default", max_tokens=1000, temperature=0.7):
    
    headers = {
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [{
                    "parts":[{"text": prompt}]
                    }]
    }

    try:
        
        response = requests.post(self.api_endpoint+"?key="+self.api_key, headers=headers, data=json.dumps(payload))

        if response.status_code == 200:
            result = response.json()
            return result
        else:
            return f"Error: {response.status_code} - {response.text}"

    except requests.exceptions.RequestException as e:
        return f"Request failed: {str(e)}"