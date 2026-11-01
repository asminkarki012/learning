"""Package the generated mp3s into a single .apkg for AnkiDroid.

Usage:
    uv run build_apkg.py            # full deck
    uv run build_apkg.py 5          # first 5 rows, for a quick test

Requires generate_audio.py to have run first.
"""

import sys
from pathlib import Path

import genanki

from generate_audio import CSV, MEDIA, clip_name, parse_row

# Fixed IDs: re-importing an updated .apkg merges into the same deck
# instead of creating "Goethe A1-1", "-2", "-3".
DECK_ID = 2059400110
DECK_NAME = "Goethe A1"
MODEL_ID = 1607392401  # bumped: field list changed
OUTPUT = Path(__file__).parent / "out" / "Goethe_A1_Conrad.apkg"
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else None

CSS = """
.card {
  font-family: sans-serif;
  text-align: center;
}
.word { font-size: 34px; font-weight: 600; }
.type {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8a94a6;
  margin: 4px 0 18px;
}
.sentence { font-size: 22px; line-height: 1.5; }
.meaning { font-size: 26px; font-weight: 600; margin-top: 12px; }
.grammar { font-size: 15px; font-style: italic; color: #8a94a6; margin-top: 6px; }
.english { font-size: 22px; line-height: 1.5; margin-top: 14px; }

/* dark mode: lift the greys so they stay readable.
   Both selector forms: Anki puts .nightMode on <body>, AnkiDroid on the card. */
.nightMode .type, .card.nightMode .type,
.nightMode .grammar, .card.nightMode .grammar { color: #a8b3c0; }
"""

MODEL = genanki.Model(
    MODEL_ID,
    "German A1 (audio)",
    fields=[
        {"name": "Word"},
        {"name": "Type"},
        {"name": "Meaning"},
        {"name": "Grammar"},
        {"name": "Sentence"},
        {"name": "English"},
    ],
    templates=[
        {
            "name": "Recognition",
            "qfmt": (
                '<div class="word">{{Word}}</div>'
                '<div class="type">{{Type}}</div>'
                '<div class="sentence">{{Sentence}}</div>'
            ),
            "afmt": (
                "{{FrontSide}}"
                "<hr id=answer>"
                '<div class="meaning">{{Meaning}}</div>'
                '<div class="grammar">{{Grammar}}</div>'
                '<div class="english">{{English}}</div>'
            ),
        }
    ],
    css=CSS,
)


def build():
    deck = genanki.Deck(DECK_ID, DECK_NAME)
    lines = CSV.read_text(encoding="utf-8").splitlines()
    if LIMIT:
        lines = lines[:LIMIT]

    for line in lines:
        word, word_type, meaning, grammar, sentence, english = parse_row(line)
        deck.add_note(
            genanki.Note(
                MODEL,
                fields=[
                    f"{word}<br>[sound:{clip_name(word)}]",
                    word_type,
                    meaning,
                    grammar,
                    f"{sentence}<br>[sound:{clip_name(sentence)}]",
                    english,
                ],
            )
        )

    package = genanki.Package(deck)
    package.media_files = sorted(str(path) for path in MEDIA.glob("*.mp3"))
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    package.write_to_file(str(OUTPUT))
    print(f"Wrote {OUTPUT} ({len(package.media_files)} clips, {len(lines)} notes)")


if __name__ == "__main__":
    build()
