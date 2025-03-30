export class Inventory {
    private _max_villagers: number;
    private _villagers: number;
    private _max_houses: number;
    private _houses: number;
    private _max_sticks: number;
    private _sticks: number;
    private _max_stones: number;
    private _stones: number;
    private _max_woods: number;
    private _woods: number;
    private _max_berries: number;
    private _berries: number;
    private _max_offsprings: number;
    private _offsprings: number;

    working_villagers: number
    sheds: number;
    warehouses: number;

    get max_villagers(): number {
        return this._max_villagers;
    }

    get villagers() {
        return this._villagers;
    }

    get max_houses() {
        return this._max_houses;
    }

    get houses() {
        return this._houses;
    }

    get max_sticks() {
        return this._max_sticks;
    }

    get sticks() {
        return this._sticks;
    }

    get max_stones() {
        return this._max_stones;
    }

    get stones() {
        return this._stones;
    }

    get max_woods() {
        return this._max_woods;
    }

    get woods() {
        return this._woods;
    }

    get berries() {
        return this._berries;
    }

    get max_berries() {
        return this._max_berries;
    }

    get offsprings() {
        return this._offsprings;
    }

    get max_offsprings() {
        return this._max_offsprings;
    }

    set max_villagers(value: number) {
        this._max_villagers = value;
        if (this.eltVillagers)
            this.eltVillagers.textContent = this.villagers + '/' + this.max_villagers;
    }

    set villagers(value: number) {
        this._villagers = value;
        if (this._villagers > this._max_villagers)
            this._villagers = this._max_villagers;
        if (this.eltVillagers)
            this.eltVillagers.textContent = this.villagers + '/' + this.max_villagers;

    }

    set max_houses(value: number) {
        this._max_houses = value;
        if (this.eltHouse)
            this.eltHouse.textContent = this.houses + '/' + this.max_houses;
    }

    set houses(value: number) {
        this._houses = value;
        if (this._houses > this._max_houses)
            this._houses = this._max_houses;
        if (this.eltHouse)
            this.eltHouse.textContent = this.houses + '/' + this.max_houses;

    }

    set max_sticks(value: number) {
        this._max_sticks = value;
        if (this.eltStick)
            this.eltStick.textContent = this.sticks + '/' + this.max_sticks;
    }

    set sticks(value: number) {
        this._sticks = value;
        if (this._sticks > this._max_sticks)
            this._sticks = this._max_sticks;
        if (this.eltStick)
            this.eltStick.textContent = this.sticks + '/' + this.max_sticks;
        if (this.valueChanged)
            this.valueChanged()
    }

    set max_stones(value: number) {
        this._max_stones = value;
        if (this.eltStone)
            this.eltStone.textContent = this.stones + '/' + this.max_stones;
    }

    set stones(value: number) {
        this._stones = value;
        if (this._stones > this._max_stones)
            this._stones = this._max_stones;
        if (this.eltStone)
            this.eltStone.textContent = this.stones + '/' + this.max_stones;
        if (this.valueChanged)
            this.valueChanged()
    }

    set max_woods(value: number) {
        this._max_woods = value;
        if (this.eltWood)
            this.eltWood.textContent = this.woods + '/' + this.max_woods;
    }

    set woods(value: number) {
        this._woods = value;
        if (this._woods > this._max_woods)
            this._woods = this._max_woods;
        if (this.eltWood)
            this.eltWood.textContent = this.woods + '/' + this.max_woods;
        if (this.valueChanged)
            this.valueChanged()
    }

    set berries(value: number) {
        this._berries = value;
        if (this._berries > this._max_berries)
            this._berries = this._max_berries;
        if (this.eltBerry)
            this.eltBerry.textContent = this.berries + '/' + this.max_berries;
        if (this.valueChanged)
            this.valueChanged()
    }

    set max_berries(value: number) {
        this._max_berries = value;
        if (this.eltBerry)
            this.eltBerry.textContent = this.berries + '/' + this.max_berries;
    }

    set offsprings(value: number) {
        this._offsprings = value;
        if (this._offsprings > this._max_offsprings)
            this._offsprings = this._max_offsprings;
        if (this.eltOffspring)
            this.eltOffspring.textContent = this.offsprings + '/' + this.max_offsprings;
        if (this.valueChanged)
            this.valueChanged()
    }

    set max_offsprings(value: number) {
        this._max_offsprings = value;
        if (this.eltOffspring)
            this.eltOffspring.textContent = this.offsprings + '/' + this.max_offsprings;
    }

    constructor(public eltWood: null | HTMLElement, public eltStone: null | HTMLElement, public eltStick: null | HTMLElement, public eltHouse: null | HTMLElement, public eltVillagers: null | HTMLElement, public eltBerry: null | HTMLElement, public eltOffspring: null | HTMLElement, public valueChanged: null | Function) {
        this._woods = 0;
        this._max_woods = 15;

        this._stones = 0;
        this._max_stones = 15;

        this._sticks = 0;
        this._max_sticks = 15;

        this._houses = 0;
        this._max_houses = 2;

        this._villagers = 1;
        this._max_villagers = 2;

        this.working_villagers = 0;

        this._berries = 0;
        this._max_berries = 15;

        this._offsprings = 0;
        this._max_offsprings = 2;

        this.sheds = 0;
        this.warehouses = 0;


    }


    reset(): void {
        this.woods = 0;
        this.max_woods = 15;

        this.stones = 0;
        this.max_stones = 15;

        this.sticks = 0;
        this.max_sticks = 15;

        this.houses = 0;
        this.max_houses = 2;

        this.villagers = 1;
        this.max_villagers = 2;

        this.working_villagers = 0;

        this.berries = 0;
        this.max_berries = 15;
    }
}