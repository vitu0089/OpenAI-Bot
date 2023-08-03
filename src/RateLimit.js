"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RateLimit {
    constructor(RateLimit, Timespan) {
        this.RunningInstances = 0;
        this.Limit = RateLimit;
        this.Timespan = Timespan;
    }
    HasOpenSlot() {
        if (this.RunningInstances >= this.Limit) {
            return;
        }
        this.RunningInstances++;
        setTimeout(() => {
            this.RunningInstances--;
        }, this.Timespan * 1000);
        return "Thinking...";
    }
}
exports.default = RateLimit;
