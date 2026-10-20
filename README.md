# Duncan Animatronic: code, firmware and electrical source

This repo holds everything for Duncan that is text-based and changes often:
firmware, software, electrical design source files and configuration.
Everything else (drawings, CAD, reviews, tests, purchasing) lives in the
project's Google Drive folder and the **Project Portal**. Start with the
**0. START HERE** doc in Drive.

| Where | What |
|---|---|
| This repo | Firmware, software, KiCad source, config (servo limits, audio presets, motion sequences) |
| Fusion 360 hub | Editable 3D models and drawings |
| Drive + Project Portal | Released PDFs/STEP/binaries, numbers, reviews, tests, orders |

## Layout

```
firmware/     code that runs on a microcontroller, one folder per SW number
software/     code that runs on a computer or phone, one folder per SW number
electrical/   KiCad projects, one folder per SCH number, plus shared libraries
config/       settings and show content read by the firmware/software
.github/      automatic builds and the pull request checklist
```

Every folder starts with its number from the Project Portal:
`firmware/SW-0003-eye-controller`, `electrical/SCH-0001-head-controller`.
Get the number **before** you make the folder.

## How work gets in

1. **Branch.** Never commit straight to `main`. Make a branch named after
   what you're doing: `sw-0003-blink-timing`.
2. **Commit** small, clear changes: "Fix eyelid closing too fast".
3. **Open a pull request.** Fill in the checklist. GitHub builds the
   firmware automatically and shows a green check or a red X.
4. **Review.** Another member reads it and approves. This is a design
   review for code. You can't approve your own.
5. **Merge.** Now it's in `main`.

## Releasing software (making a version official)

Versions are `MAJOR.MINOR.PATCH`:

- **PATCH** (v1.2.**1**): bug fix, nothing else changes
- **MINOR** (v1.**3**.0): new feature, still works with everything else
- **MAJOR** (v**2**.0.0): breaks something else (new pinout, new message
  format). Update the ICD and tell the other subsystem's owner.

To release:

1. Make sure the change is merged into `main`.
2. On GitHub: **Releases > Draft a new release > Choose a tag**, type
   `SW-0003-v1.2.0` (number, then version), target `main`, publish.
3. GitHub builds the firmware and attaches the files to that release
   (give it a couple of minutes).
4. In the **Project Portal > Release**, pick SW-0003, enter `v1.2.0`,
   paste the release link, attach the compiled file, explain what changed.
   An officer approves it and it's recorded in the Register.

## Rules

- No passwords or Wi-Fi keys in the repo. Put them in a file listed in
  `.gitignore` and commit an example version (`secrets.example.h`).
- Don't commit compiled files or CAD exports. GitHub Actions builds
  binaries; STEP/PDF files go through the Portal.
- Pin numbers live in **one** file per firmware project
  (`include/pins.h`) and must match the ICD.
- Print the firmware version over serial at startup so anyone can check
  what's running.

## Getting started

- Install **GitHub Desktop** (easiest way to branch, commit and push) and
  **VS Code** with the **PlatformIO** extension.
- Ask the president to add you to the GitHub organization.
- Clone this repo in GitHub Desktop, open the folder in VS Code, and build
  `firmware/SW-0000-example-blink` to check your setup.

## One-time setup (president)

1. Create a GitHub **organization** for the club (owned by the club, not a
   personal account). Add the president and the advisor as owners.
2. Create this repo inside it and push these files.
3. **Settings > Branches > Add rule** for `main`: require a pull request
   with 1 approval, and require the "Build" check to pass.
4. **Settings > Webhooks**: add the project Discord webhook URL with
   `/github` on the end, content type `application/json`.
5. Put the repo URL in `PJ_GITHUB_URL` at the top of Projects.gs in the
   Automation Brain, then run `refreshStartHere()`.
6. At handover, make the new president an owner of the organization.
