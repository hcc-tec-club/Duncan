#include <Arduino.h>

#define FW_VERSION "v0.0.0"

void setup() {
  Serial.begin(115200);
  Serial.println("SW-0000 example blink " FW_VERSION);
  pinMode(LED_BUILTIN, OUTPUT);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);
}
