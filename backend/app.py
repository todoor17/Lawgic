from flask import Flask, jsonify, request
from ollama import chat
from ollama import ChatResponse
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
@app.route("/")
def hello_world():
    return "Hello!"


@app.route("/gptt")
def gpt():
    prompt = request.args.get("prompt")
    response: ChatResponse = chat(model='llama3.2', messages=[
        {
            'role': 'user',
            'content': f'{prompt} In 50 words',  # Type any message that you want
        },
    ])
    print(response['message']['content'])
    # or access fields directly from the response object
    # print(response.message.content)
    return jsonify(response['message']['content'])

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Debug mode only for local testing