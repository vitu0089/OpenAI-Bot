export default class RateLimit {
    private Limit:number
    private Timespan:number
    private Queue:string[] = []

    constructor(RateLimit:number,Timespan:number) {
        this.Limit = RateLimit
        this.Timespan = Timespan
    }

    private GenerateID():string {
        var ID = ""

        for (var i=1; i < 4; i++) {
            ID += Math.floor(Math.random() * 9).toString()
        }

        if (this.Queue.find(v => v == ID)) {
            return this.GenerateID()
        }

        return ID
    }

    HasOpenSlot():string | undefined {
        if (this.Queue.length >= this.Limit) {
            return
        }
        
        const ID = this.GenerateID()
        const Index = this.Queue.push(ID)

        setTimeout(() => {
            delete this.Queue[Index]
        },this.Timespan * 1000)

        return ID
    }
}