export default class Schedule {
    constructor() {
        this.id = ""
        this.title = ""
        this.userId = ""
        this.laboratoryId = ""
        this.time = {
          start:"",
          end:""
        },
        this.isEditable = true
    }
}
