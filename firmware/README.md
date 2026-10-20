# Firmware

One folder per SW number, each a PlatformIO project:

```
firmware/SW-0003-eye-controller/
  platformio.ini     board and libraries
  include/pins.h     every pin number, matching the ICD
  src/main.cpp
  README.md          what it does, what board, how to flash it
```

Start a new one:

1. Get an SW number in the Project Portal.
2. In VS Code: PlatformIO > New Project, pick the board, and save it
   here as `SW-xxxx-short-name`.
3. Put all pin numbers in `include/pins.h`.
4. Define the version and print it at startup:
   `#define FW_VERSION "v0.1.0"` and `Serial.println(FW_VERSION);`
   Keep it equal to the tag you release.
5. Branch, commit, open a pull request. GitHub builds it automatically.

`SW-0000-example-blink` is a test project to check that your setup and
the automatic build work. Leave it alone.
