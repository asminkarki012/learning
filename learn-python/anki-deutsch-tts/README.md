# anki-deutsch-tts

Generates German audio for the Goethe A1 vocabulary list and packages it into a
single `.apkg` you can import into AnkiDroid.

Source: `~/Downloads/Goethe_A1_Anki.csv` (787 rows, `;`-delimited)
Output: `out/Goethe_A1_Conrad.apkg` (787 notes, 1543 audio clips, ~19 MB)

## Usage

```bash
uv run generate_audio.py        # synthesize clips -> out/media/  (~36 min first run)
uv run build_apkg.py            # package clips -> out/Goethe_A1_Conrad.apkg
```

Both accept an optional row limit for testing: `uv run generate_audio.py 5`.

Generation skips clips that already exist, so re-running only fills in gaps.

## Import into AnkiDroid

1. Copy `out/Goethe_A1_Conrad.apkg` to your phone (USB, Google Drive, email to self).
2. Open the file from your file manager → it opens in AnkiDroid → **Import**.
3. Deck "Goethe A1" appears with audio on both the word and the sentence.

To re-import after changing the CSV, delete the deck in AnkiDroid first.
The deck and model IDs are fixed, so a re-import would merge notes and duplicate
cards. If you imported an earlier build with 3 fields, delete that deck too.

## How it works

- **Voice**: `de-DE-ConradNeural` (set `VOICE` in `generate_audio.py`).
- **Filenames**: `de_<md5-8>.mp3` — ASCII-safe, stable across runs, deduplicated.
  Identical sentences share one clip (30 sentences repeat in the CSV).
- **Card**: front shows the German word (with article), its word type, and the
  example sentence — both with audio. Back adds the English meaning, the grammar
  note (Plural / Partizip II), and the English sentence.
- **Fixed IDs**: `DECK_ID` / `MODEL_ID` in `build_apkg.py` keep the deck identity
  stable so updates land in the same deck. `MODEL_ID` must change whenever the
  field list changes.

## Files

| File | Purpose |
| --- | --- |
| `pyproject.toml` | uv project: `edge-tts`, `genanki` |
| `generate_audio.py` | CSV → mp3 clips |
| `build_apkg.py` | mp3 clips → `.apkg` |
| `out/media/` | generated clips |
| `out/Goethe_A1_Conrad.apkg` | import this |
