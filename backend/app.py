import subprocess

from flask import Flask, jsonify, request
from ollama import chat
from ollama import ChatResponse
from flask_cors import CORS
from gtts import gTTS
import speech_recognition as sr

app = (Flask(__name__))
CORS(app, origins=["http://localhost:5173"])

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)  # Debug mode only for local testing
