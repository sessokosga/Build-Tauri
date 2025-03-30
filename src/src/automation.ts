import { Task } from "./task.js";

export class Automation{
    isRunning :boolean;
    stoppedTaskID :string;
    runningTask: null|Task;
    storedAutoRestart :boolean;
    isWaiting :boolean;
    stopCondition:Function;
    startCondition:Function;
    constructor(public id:string, public name:string, public strStartCondition:string, public taskID:string, public strStopCondition:string){
        this.isRunning = false;
        this.stoppedTaskID = "";
        this.runningTask = null;
        this.storedAutoRestart = false;
        this.isWaiting = false;
        this.stopCondition = new Function;
        this.startCondition = new Function;
    }
}