export default class RateLimit {
    private Limit:number
    private Timespan:number
    private RunningInstances = 0

    constructor(RateLimit:number,Timespan:number) {
        this.Limit = RateLimit
        this.Timespan = Timespan
    }

    HasOpenSlot():string | undefined {
        if (this.RunningInstances >= this.Limit) {
            return
        }

        this.RunningInstances++

        setTimeout(() => {
            this.RunningInstances--
        },this.Timespan * 1000)

        return "Thinking..."
    }
}