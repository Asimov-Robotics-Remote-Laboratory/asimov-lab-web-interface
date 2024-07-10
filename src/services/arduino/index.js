export default {
    listArduinoScopeAndQualifiers:()=>{
      return "const\n" +
        "scope\n" +
        "static\n" +
        "volatile"
    },
    listArduinoDataTypes:()=>{
      return "array\n" +
        "bool\n" +
        "boolean\n" +
        "byte\n" +
        "char\n" +
        "double\n" +
        "float\n" +
        "int\n" +
        "long\n" +
        "short\n" +
        "size_t\n" +
        "string\n" +
        "String()\n" +
        "unsigned char\n" +
        "unsigned int\n" +
        "unsigned long\n" +
        "void\n" +
        "word"
    },
    listArduinoConstants: () => {
      return "HIGH\n" +
        "LOW\n" +
        "INPUT\n" +
        "INPUT_PULLUP\n" +
        "OUTPUT\n" +
        "LED_BUILTIN\n" +
        "true\n" +
        "false";
    },
    listArduinoMethodes: () => {
        return "digitalRead()\n" +
          "digitalWrite()\n" +
          "pinMode()\n" +
          "analogRead()\n" +
          "analogReadResolution()\n" +
          "analogReference()\n" +
          "analogWrite()\n" +
          "analogWriteResolution()\n" +
          "Advanced I/O\n" +
          "noTone()\n" +
          "pulseIn()\n" +
          "pulseInLong()\n" +
          "shiftIn()\n" +
          "shiftOut()\n" +
          "tone()\n" +
          "delay()\n" +
          "delayMicroseconds()\n" +
          "micros()\n" +
          "millis()\n" +
          "abs()\n" +
          "constrain()\n" +
          "map()\n" +
          "max()\n" +
          "min()\n" +
          "pow()\n" +
          "sq()\n" +
          "sqrt()\n" +
          "cos()\n" +
          "sin()\n" +
          "tan()\n" +
          "isAlpha()\n" +
          "isAlphaNumeric()\n" +
          "isAscii()\n" +
          "isControl()\n" +
          "isDigit()\n" +
          "isGraph()\n" +
          "isHexadecimalDigit()\n" +
          "isLowerCase()\n" +
          "isPrintable()\n" +
          "isPunct()\n" +
          "isSpace()\n" +
          "isUpperCase()\n" +
          "isWhitespace()\n" +
          "random()\n" +
          "randomSeed()\n" +
          "bit()\n" +
          "bitClear()\n" +
          "bitRead()\n" +
          "bitSet()\n" +
          "bitWrite()\n" +
          "highByte()\n" +
          "lowByte()\n" +
          "attachInterrupt()\n" +
          "detachInterrupt()\n" +
          "digitalPinToInterrupt()\n" +
          "Interrupts\n" +
          "interrupts()\n" +
          "noInterrupts()\n" +
          "available()\n" +
          "availableForWrite()\n" +
          "begin()\n" +
          "end()\n" +
          "find()\n" +
          "findUntil()\n" +
          "flush()\n" +
          "parseFloat()\n" +
          "parseInt()\n" +
          "peek()\n" +
          "sizeof()\n"+
          "byte()\n" +
          "char()\n" +
          "float()\n" +
          "int()\n" +
          "long()\n" +
          "word()\n"+
          "Serial.print()\n" +
          "Serial.println()\n" +
          "Serial.read()\n" +
          "Serial.readBytes()\n" +
          "Serial.readBytesUntil()\n" +
          "Serial.readString()\n" +
          "Serial.readStringUntil()\n" +
          "Serial.setTimeout()\n" +
          "Serial.write()"
    },

}
