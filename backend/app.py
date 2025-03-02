import subprocess

from flask import Flask, jsonify, request
from ollama import chat
from ollama import ChatResponse
from flask_cors import CORS
from gtts import gTTS
import speech_recognition as sr
from flask_sqlalchemy import SQLAlchemy
import pymysql
from sqlalchemy import text

app = (Flask(__name__))
CORS(app, origins=["http://localhost:5173"])

app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:Norocel17@localhost:3306/lawgic"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route("/")
def hello_world():
    tts = gTTS(text="Hello, this is a robot voice.", lang='en')
    tts.save("response.mp3")

    return "Hello!"


@app.route("/gptt")
def gpt():
    prompt = request.args.get("prompt")
    response: ChatResponse = chat(model='llama3.2', messages=[
        {
            'role': 'user',
            'content': f'{prompt}',
        },
    ])

    print(response['message']['content'])
    # or access fields directly from the response object
    # print(response.message.content)
    return jsonify(response['message']['content'])


@app.route("/voice")
def voice():
    prompt = request.args.get("prompt")
    req_type = request.args.get("type")
    print(req_type)

    if (req_type == "response"):
        print(prompt)
        tts = gTTS(text=prompt, lang="en")
        tts.save("response.mp3")
    elif (req_type == "input"):
        print(prompt)
        tts = gTTS(text=prompt, lang="en")
        tts.save("input.mp3")
    return "dummy"


@app.route("/stt")
def stt():
    r = sr.Recognizer()
    title = request.args.get("title")

    audio_file = f"C:/Users/Todor/Downloads/{title}"
    wav_file = "recording.wav"

    # Convert WebM to WAV using FFmpeg
    try:
        subprocess.run(
            ["ffmpeg", "-y", "-i", audio_file, "-vn", "-acodec", "pcm_s16le", "-ar", "16000", "-ac", "1", wav_file],
            check=True,
        )
        print("FFmpeg conversion successful.")

    except Exception as e:
        print("Error:")
        return jsonify({"error": str(e)}, 500)

    # Process the WAV file with SpeechRecognition
    try:
        with sr.AudioFile(wav_file) as source:
            print("Processing audio file...")
            audio = r.record(source)

            print("Recognizing...")
            text = r.recognize_google(audio)
            print("Transcription:", text)
            return jsonify({"transcription": text})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": f"{e}"}, 500)


def checkUniqueness(username, email):
    username_match = 0
    email_match = 0
    query1 = text("SELECT COUNT(u.userId) FROM users u WHERE u.username = :username")
    query2 = text("SELECT COUNT(u.userId) FROM users u WHERE u.email = :email")
    with db.engine.connect() as connection:
        username_match = connection.execute(query1, {"username": username}).scalar()
        email_match = connection.execute(query2, {"email": email}).scalar()

    if (username_match):
        return {"status": "error", "error": "An account with that username already exists."}
    elif (email_match):
        return {"status": "error", "error": "An account with that email already exists."}

    return {"status": "ok"}

def createAccount(first_name, last_name, username, email, password):
    query = text("INSERT INTO users(firstName, lastName, username, email, password) VALUES (:first_name, :last_name, :username, :email, :password)")
    with db.engine.connect() as connection:
        connection.execute(query, {"first_name": first_name, "last_name": last_name, "username": username, "email": email, "password": password})
        connection.commit()

@app.route("/signin", methods=["POST"])
def signin():
    dataFromServer = request.get_json(force=True)
    unique = checkUniqueness(dataFromServer["username"], dataFromServer["email"])

    if unique["status"] == "error":
        return jsonify(unique)

    createAccount(dataFromServer["firstName"], dataFromServer["lastName"], dataFromServer["username"],
                  dataFromServer["email"], dataFromServer["password"])
    return jsonify({"status": "success", "error": "none"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Debug mode only for local testing
