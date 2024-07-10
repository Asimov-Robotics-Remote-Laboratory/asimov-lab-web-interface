export default class Laboratory {
    constructor() {
        this.id = ""
        this.name = ""
        this.description = ""
        this.password = ""
        this.imageLink = ""
        this.defaultCode = "#include \"Arduino.h\"\n" +
            "\n" +
            "void setup(){\n" +
            "\tpinMode(2,OUTPUT);\n" +
            "}\n" +
            "\n" +
            "void loop(){\n" +
            "\tdigitalWrite(2,HIGH);\n" +
            "\tdelay(1000);\n" +
            "\tdigitalWrite(2,LOW);\n" +
            "\tdelay(1000);\n" +
            "}"
    }
}
