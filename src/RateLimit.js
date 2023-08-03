"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class RateLimit {
    constructor(RateLimit, Timespan) {
        this.Queue = [];
        this.Limit = RateLimit;
        this.Timespan = Timespan;
    }
    GenerateID() {
        var ID = "";
        for (var i = 1; i < 4; i++) {
            ID += Math.floor(Math.random() * 9).toString();
        }
        if (this.Queue.find(v => v == ID)) {
            return this.GenerateID();
        }
        return ID;
    }
    HasOpenSlot() {
        if (this.Queue.length >= this.Limit) {
            return;
        }
        const ID = this.GenerateID();
        const Index = this.Queue.push(ID);
        setTimeout(() => {
            this.Queue.slice(Index, Index + 1);
        }, this.Timespan * 1000);
        return ID;
    }
}
exports.default = RateLimit;
