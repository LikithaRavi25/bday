"""
Birthday Surprise — Flask backend
-----------------------------------
Serves the surprise page and a tiny JSON-file-backed API so visitors
(your friend!) can leave a birthday wish that gets saved and shown
on the "Wall of Wishes".

Run with:  python app.py
Then open: http://127.0.0.1:5000
"""

import json
import os
from datetime import datetime

from flask import Flask, jsonify, render_template, request

app = Flask(__name__)

DATA_FILE = os.path.join(os.path.dirname(__file__), "data", "wishes.json")


def load_wishes():
    if not os.path.exists(DATA_FILE):
        return []
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except (json.JSONDecodeError, FileNotFoundError):
        return []


def save_wishes(wishes):
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(wishes, f, ensure_ascii=False, indent=2)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/api/wishes", methods=["GET"])
def get_wishes():
    return jsonify(load_wishes())


@app.route("/api/wishes", methods=["POST"])
def add_wish():
    payload = request.get_json(silent=True) or {}
    name = (payload.get("name") or "A friend").strip()[:60]
    message = (payload.get("message") or "").strip()[:500]

    if not message:
        return jsonify({"error": "Message can't be empty."}), 400

    wishes = load_wishes()
    wishes.append(
        {
            "name": name,
            "message": message,
            "timestamp": datetime.now().strftime("%d %b %Y, %I:%M %p"),
        }
    )
    save_wishes(wishes)
    return jsonify({"ok": True, "wish": wishes[-1]})


if __name__ == "__main__":
    app.run(debug=True)

