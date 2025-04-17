import requests
import json
import google.generativeai as genai


class GenerationService:

    def __init__(self, api_key):

        self.api_key = api_key
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel("gemini-1.5-flash")

    def generate_content(self, prompt, files=None):
        try:

            prompt = [prompt]
            if files:
                for file in files:
                    prompt.append(
                        {
                            "inline_data": {
                                "mime_type": "image/jpeg",
                                "data": file
                            }
                        }
                    )

            response = self.model.generate_content(prompt)

            return response

        except Exception as e:
            return f"Generation failed: {str(e)}"

    def generate_query(self, prompt, model="gemini-default", max_tokens=1000, temperature=0.7):

        headers = {
            "Content-Type": "application/json"
        }

        payload = {
            "contents": [{
                "parts": [{"text": prompt}]
            }]
        }

        try:

            response = requests.post(
                self.api_endpoint+"?key="+self.api_key, headers=headers, data=json.dumps(payload))

            if response.status_code == 200:
                result = response.json()
                return result
            else:
                return f"Error: {response.status_code} - {response.text}"

        except requests.exceptions.RequestException as e:
            return f"Request failed: {str(e)}"
