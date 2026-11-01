"""Synthesize one mp3 per German word and one per example sentence.

Usage:
    uv run generate_audio.py        # all 786 rows
    uv run generate_audio.py 5      # first 5 rows, for a quick test
"""

import asyncio
import hashlib
import sys
from pathlib import Path

import edge_tts

CSV = Path.home() / "Downloads/Goethe_A1_Anki.csv"
MEDIA = Path(__file__).parent / "out" / "media"
VOICE = "de-DE-ConradNeural"
LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else None


def parse_row(line):
    """CSV row -> (word, word_type, meaning, grammar, sentence, english).

    Col 1: "abfahren<br>verb (separable)"          -> word, word_type
    Col 2: "to depart<br>Partizip II: ...<br><br>Der Zug fährt ab.<br>The train leaves."
           -> meaning, grammar (optional), sentence, english
    Col 3: tags (ignored)

    The German sentence is always second-to-last, the English always last.
    """
    front, back, _tags = line.split(";")
    word, word_type = front.split("<br>")

    parts = [part for part in back.split("<br>") if part]
    meaning = parts[0]
    grammar = parts[1] if len(parts) == 4 else ""
    sentence, english = parts[-2], parts[-1]

    return word, word_type, meaning, grammar, sentence, english


def clip_name(text):
    """Stable ASCII filename, e.g. 'de_9f3a1c02.mp3'. Safe for AnkiDroid."""
    return f"de_{hashlib.md5(text.encode()).hexdigest()[:8]}.mp3"


async def synth(text, path):
    """Write speech to path. Skips work already done, so re-runs are cheap."""
    if path.exists():
        return
    await edge_tts.Communicate(text, VOICE).save(str(path))


async def main():
    MEDIA.mkdir(parents=True, exist_ok=True)
    lines = CSV.read_text(encoding="utf-8").splitlines()
    if LIMIT:
        lines = lines[:LIMIT]

    for index, line in enumerate(lines, start=1):
        word, _type, _meaning, _grammar, sentence, _english = parse_row(line)
        await synth(word, MEDIA / clip_name(word))
        await synth(sentence, MEDIA / clip_name(sentence))
        print(f"[{index}/{len(lines)}] {word}")

    print(f"Done. {len(list(MEDIA.glob('*.mp3')))} clips in {MEDIA}")


if __name__ == "__main__":
    asyncio.run(main())
