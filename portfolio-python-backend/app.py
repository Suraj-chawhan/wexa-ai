from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from gtts import gTTS
from io import BytesIO
import requests

app = Flask(__name__)
CORS(app, resources={r"/ask": {"origins": "*"}}, methods=["POST", "OPTIONS"])



@app.route("/ask", methods=["POST", "OPTIONS"])
def ask():
    if request.method == "OPTIONS":
        # Allow preflight request
        return jsonify({"status": "ok"}), 200

    data = request.get_json()
    prompt = data.get("prompt", "")

    print(prompt)      

    tts = gTTS(prompt)
    mp3_fp = BytesIO()
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    return send_file(mp3_fp, mimetype="audio/mpeg")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
