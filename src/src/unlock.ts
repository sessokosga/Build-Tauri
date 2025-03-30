export class Unlock {
    condition:Function;
    action:Function;
    constructor(public id: string, public name: string, public strCondition: string, public strAction: string, public isCompleted: boolean = false) {
        this.condition = new Function;
        this.action = new Function;
    }
}