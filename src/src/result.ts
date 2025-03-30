export class Result {
    custom:Function;
    constructor(public villagers: number=0, public woods: number=0, public stones: number=0, public sticks: number=0, public houses: number=0, public berries: number=0, public offsprings: number=0, public modifyInventoryCap: boolean=false, public strCustom: string ) {
        this.custom = new Function
    }

}