export class Project {
    isRemoved: boolean;
    element: null | HTMLElement = null;
    action:Function;

    constructor(public id: string, public name: string, public description: string, public log: string, public cost: number, public strAction: string) {
        this.isRemoved = false;
        this.action = new Function;
    }

    bindDom(element: HTMLElement | null): void {
        this.element = element;
    }

}