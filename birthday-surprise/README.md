# 🎂 Birthday Surprise Website

A one-page birthday surprise for your friend: floating hearts, a gift box
that reveals a photo, an envelope with a letter, and a live "wishes wall"
where people can leave birthday messages.

```
Hero (animated title) → Gift box → Photo reveal → Envelope + letter → Wishes wall
```

---

## 1. What's inside

```
birthday-surprise/
├── app.py                  ← Flask backend (serves the page + wishes API)
├── requirements.txt        ← just Flask
├── data/
│   └── wishes.json         ← wishes get saved here automatically
├── templates/
│   └── index.html          ← the page (edit names/message near the top)
└── static/
    ├── css/style.css       ← all the styling & animation
    ├── js/script.js        ← all the interactivity
    └── images/photo.jpg    ← your photo, already added
```

## 2. Personalize it (2 minutes)

Open `templates/index.html` and find this block near the top:

```html
<div id="config"
     data-friend-name="Your Friend's Name"
     data-your-name="Your Name"
     data-letter="I still remember the day we became friends...">
```

- **`data-friend-name`** → your friend's name (shows in the big headline and the letter)
- **`data-your-name`** → your name (shows as the letter's signature)
- **`data-letter`** → the message inside the envelope — rewrite it however you like, it can be as long as you want

Save the file — that's the only edit required. If you'd rather use a
different photo, just replace `static/images/photo.jpg` with your own
image (keep the file name `photo.jpg`, or update the `<img src="...">`
path in `templates/index.html` to match your new file name).

## 3. Run it on your laptop

You need **Python 3.8+** installed. Then, in a terminal:

```bash
cd birthday-surprise

# (recommended) create a virtual environment
python3 -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate

# install the one dependency
pip install -r requirements.txt

# run it
python app.py
```

You'll see something like:

```
 * Running on http://127.0.0.1:5000
```

Open that link in your browser — that's your live site, running locally.

To stop the server later, go back to the terminal and press `Ctrl + C`.

## 4. How each part works

- **Gift box** — click it once to watch it open; a polaroid with your
  photo slides in.
- **Envelope** — click (or press Enter/Space on it) to open and read
  the letter; click again to close it.
- **Wishes wall** — anyone viewing the page can type their name and a
  message and click "send wish." It's saved to `data/wishes.json` on
  your machine through the Flask backend, and instantly shows up in
  the wall for everyone who loads the page afterward.
- **"celebrate again"** button — replays the confetti burst.

## 5. Sharing it with your friend

Running `python app.py` only serves the page on **your own laptop**
(`127.0.0.1` = localhost) — your friend can't open that link over the
internet. To actually send it to him, you have a few options:

**Easiest — screen-record or share on your call.** Run it locally and
show it to him live, or open it during a video call.

**Free hosting (recommended if he should open it himself):**
1. Create a free account on [Render](https://render.com) or
   [PythonAnywhere](https://www.pythonanywhere.com).
2. Push this folder to a (private, if you like) GitHub repo.
3. On Render: "New Web Service" → connect the repo → build command
   `pip install -r requirements.txt`, start command
   `gunicorn app:app` (add `gunicorn` to `requirements.txt` first).
4. Render gives you a public link like `https://your-app.onrender.com`
   — send that to your friend.

Either way, keep the personalization step (Section 2) in mind — do it
*before* you deploy or show it, so his name and your letter are
already in place when he opens it.

## 6. Troubleshooting

- **"flask: command not found" / import errors** → make sure you ran
  `pip install -r requirements.txt` inside the same terminal/virtual
  environment you're using to run `python app.py`.
- **Photo doesn't show up** → confirm the file is at
  `static/images/photo.jpg` (exact name, lowercase).
- **Port already in use** → another program is using port 5000; run
  `python app.py` after closing it, or edit the last line of `app.py`
  to `app.run(debug=True, port=5001)` and open
  `http://127.0.0.1:5001` instead.

Happy surprising! 🎉
