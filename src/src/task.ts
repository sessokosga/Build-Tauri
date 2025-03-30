import { Need } from "./need.js";
import { Result } from "./result.js";
import * as Functions from "./functions.js";
export class Task {
    private _isRunning: boolean;

    cssSelectorText: string;
    isCancelled: boolean;
    whyDisabled: string;

    onCompleted:null | Function = null;

    progress: null | HTMLProgressElement;
    btn: null | HTMLButtonElement;
    labTitle: null | HTMLElement;

    set isRunning(value: boolean) {
        if (this._isRunning != value) {
            if (value) {
                this.showProgress();
            } else {
                this.hideProgress();
            }
        }
        this._isRunning = value;
    }

    get isRunning(): boolean {
        return this._isRunning;
    }

    constructor(public name: string = "", public autoRestart: boolean = false, public need: Need, public result: Result, public describedNeed: string = "", public details: string = "", public speed: number = 1, public id: string = "", public type: number = 0, public autoRemove: boolean = false) {
        this.cssSelectorText = "";
        this.isCancelled = false;
        this.whyDisabled = "";
        this._isRunning = false;
        this.progress = null;
        this.btn = null;
        this.labTitle = null;
    }

    bindDom(progress: HTMLProgressElement | null, btn: HTMLButtonElement | null, labTitle: HTMLElement | null): void {
        this.progress = progress;
        this.btn = btn;
        this.labTitle = labTitle;
        if (this.labTitle)
            this.labTitle.textContent = this.name;// + (this.autoRestart ? '  ∞' : '');
        this.isRunning = false;

    }

    /**
     * Show the progress bar
     */
    hideProgress() {
        if (this.progress) {
            this.progress.style.visibility = 'hidden';
            this.progress.style.width = '0%';

            if (this.isCancelled) {
                this.progress.style.alignSelf = 'flex-start';
            } else {
                this.progress.style.alignSelf = 'flex-end';
            }
        }
    }

    /**
     * Hide the progress bar
     */
    showProgress() {
        if (this.progress) {
            this.progress.style.visibility = 'visible';
            this.progress.value = 0;
            this.progress.style.width = '100%';
            this.progress.style.alignSelf = 'flex-start';
        }
    }

    /**
     * Start the task
     */
    start() {
        this.isRunning = true;
        this.isCancelled = false;
        this.cssSelectorText = `#${this.btn?.id}::before`;
        this.setRunningIcon();
    }

    stop(cancelled: boolean=false): void {
        this.isCancelled = cancelled;
        this.isRunning = false;
        this.resetIcon();
    }

    /**
     * Reset the progress bar
     */
    resetProgress(): void {
        if (this.progress)
            this.progress.value = 0;
    }

    resetIcon() {
        const idx = Functions.getCSSRuleIndex(this.cssSelectorText);
        if (document.styleSheets[0].cssRules[idx] != null) {
            document.styleSheets[0].deleteRule(idx);
        }
    }

    setRunningIcon() {
        document.styleSheets[0].insertRule(`#${this.btn?.id}::before{content:"∎";}`);
    }

    reset() {
        this.resetProgress();
        this.isCancelled = false;
        this.isRunning = false;
    }
}