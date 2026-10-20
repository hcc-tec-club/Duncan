# Config

Settings and show content the firmware or software reads:

- servo limits and calibration (`servo-limits.json`)
- motion sequences (`sequences/`)
- audio presets for events (`audio/`)

Rules:

- Name files so it's obvious which SW number reads them.
- Document the format in that SW project's README (or the ICD).
- Changing a limit that protects hardware (servo travel, current) needs a
  pull request review like any code change.
- Audio files over a few MB: store in Drive and keep a list here instead.
