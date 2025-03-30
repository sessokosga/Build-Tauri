export class Quest {
    private _isCompleted: boolean;
    eltCheckbox: null | HTMLInputElement = null;
    eltQuest: null | HTMLElement = null;
    condition:Function;

    set isCompleted(value: boolean) {
        this._isCompleted = value;
        if (!this.eltCheckbox || !this.eltQuest)
            return

        if (this._isCompleted) {
            this.eltCheckbox.checked = true;
            this.eltQuest.style.opacity = ".6.";
        } else {
            this.eltCheckbox.checked = false;
            this.eltQuest.style.opacity = "1";
        }
    }

    get isCompleted(): boolean {
        return this._isCompleted
    }


    constructor(public id: string, public name: string, public strCondition: string) {
        this._isCompleted = false;
        this.condition = new Function;
    }

    bindDom(quest: null | HTMLElement, checkbox: null | HTMLInputElement): void {
        this.eltCheckbox = checkbox;
        this.eltQuest = quest;
    }
}