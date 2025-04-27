from queue_service import RedisQueue
from generation_service import GenerationService
import os
import json

def main():

    HOST = os.getenv("HOST")
    PORT = int(os.getenv("PORT"))
    DB = int(os.getenv("DB"))
    PASSWORD = os.getenv("PASSWORD")
    GENERATION_QUEUE_NAME = os.getenv("GENERATION_QUEUE_NAME")
    API_KEY = os.getenv("API_KEY")
    DECK_QUEUE_NAME = os.getenv("DECK_QUEUE_NAME")
    QUIZ_QUEUE_NAME = os.getenv("QUIZ_QUEUE_NAME")

    queue = RedisQueue(host=HOST, port=PORT, db=DB, password=PASSWORD)
    generationService = GenerationService(API_KEY)

    while True:
        message = queue.wait_message(queue=GENERATION_QUEUE_NAME)
        message = json.loads(message[1])

        if message["targetDataType"] == "DECK":
            prompt = f"Generate an array of at least 30 flashcards (not specifically basic question forms—try to form complex front and back pairs) in the form of an array of JSON objects for the following text (which can be a transcript for a video or any type of educative material but it shouldn't address the material or lecture directly, avoid hate speech, we are interested in the lecture subject). Don't add any other comment; I just want an array of JSON objects with fields `front` and `back`, make sure you generate the content in this language: {message['language']}, so the answer must be like [{{\"back\": \"\", \"front\": \"\"}}]. Here is the text: {message['text']}"
            response = generationService.generate_content(prompt)

            response_text = response.text

            first_squared_bracket = response_text.find("[")
            last_squared_bracket = response_text.rfind("]") + 1

            deck = json.loads(
                response_text[first_squared_bracket:last_squared_bracket])

            deckTask = {"flashcards": deck, "name": f"auto_generation_{message['fileNames'][0]}",
                        "userId": message["userId"], "mediaProcessingRecordId": message["mediaProcessingRecordId"]}
            queue.enqueue(DECK_QUEUE_NAME, deckTask)
            print(deckTask)

        elif message["targetDataType"] == "QUIZ":
            prompt = f"Generate an array of at least 30 test questions (not necessarily basic forms — try to form complex text-based questions) in the form of an array of JSON objects for the following text (which can be a transcript for a video or any type of educative material but it shouldn't address the material or lecture directly, avoid hate speech, we are interested in the lecture subject). Make sure you generate the content in this language: {message['language']}. Don't add any other comment, I just want an array of JSON objects with fields: `descriptipn` (which is the question text), `options` (as an array of five texts), `answer` (which must be a letter from a to e for the five options), `hint` which is a small hint(it shouldn't address/mention the lecture material it must be directly give an information) and `explanation` which formally explains the answer in at most a few sentences(again don't mention the lecture material). So the answer must be like [{{\"description\": \"\", \"options\": [\"\", \"\", \"\", \"\", \"\"], \"answer\": \"\", \"hint\": \"\", \"explanation\": \"\"}}]. Here is the text: {message['text']}"
            response = generationService.generate_content(prompt)

            response_text = response.text

            print(response.text)

            first_squared_bracket = response_text.find("[")
            last_squared_bracket = response_text.rfind("]") + 1

            quiz = json.loads(response_text[first_squared_bracket:last_squared_bracket])

            quizTask = {"questions": quiz, "name": f"auto_generation_{message['fileNames'][0]}",
                        "userId": message["userId"], "mediaProcessingRecordId": message["mediaProcessingRecordId"]}
            queue.enqueue(QUIZ_QUEUE_NAME, quizTask)
            print(quizTask)


if __name__ == "__main__":
    main()
