export class ShopEntry {
    private _price: number;
    private _amount: number;

    get price(): number {
        return this._price;
    }

    get amount() {
        return this._amount;
    }

    total: number;

    eltPrice: null | HTMLElement = null;
    eltTotal: null | HTMLElement = null;
    eltName: null | HTMLElement = null;
    eltAmount: null | HTMLInputElement = null;

    valueChanged: null | Function = null;

    set price(value: number) {
        this._price = value;
        if (this.eltPrice)
            this.eltPrice.textContent = value.toString();
        this.total = this.amount * value;
        if (this.valueChanged != null)
            this.valueChanged();
    }

    set amount(value) {
        this._amount = value;
        this.total = this.amount * this.price;
        if (this.eltTotal)
            this.eltTotal.textContent = this.total.toString();
        if (this.valueChanged != null)
            this.valueChanged();
    }


    constructor(public id: string, public name: string, price: number) {
        this._price = price;
        this._amount = 0;
        this.total = 0;
    }

    bindDom(name: HTMLElement, price: HTMLElement, amount: HTMLInputElement, total: HTMLElement, valueChanged: null | Function = null) {
        this.eltName = name;
        this.eltPrice = price;
        this.eltAmount = amount;
        this.eltTotal = total;
        this.valueChanged = valueChanged

        this.eltAmount.onchange = () => {
            if (this.eltAmount)
                this.amount = parseInt(this.eltAmount.value)
        }

        this.eltAmount.value = "0";
        this.total = 0;
        this.amount = 0;

        this.price = this._price;

        this.eltName.textContent = this.name;
    }
}