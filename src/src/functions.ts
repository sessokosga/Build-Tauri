const body = document.getElementById("body");
const welcome = document.getElementById("welcome");
const game_over = document.getElementById("game_over");
const prestige = document.getElementById("prestige");
function setMainVisible(visible: boolean): void {
    if(body)
        body.style.display = visible ? 'block' : 'none';
}
function setWelcomeVisible(visible: boolean): void {
    if (welcome)
    welcome.style.display = visible ? 'block' : 'none';
}
function setGameOverVisible(visible: boolean): void {
    if (game_over)
    game_over.style.display = visible ? 'block' : 'none';
}
function setPrestigeVisible(visible: boolean): void {
    if (prestige)
    prestige.style.display = visible ? 'block' : 'none';
}

function getCSSRuleIndex(selector: string): number {
    for (let idx = 0; idx < document.styleSheets[0].cssRules.length; idx++) {
        const rule:any = document.styleSheets[0].cssRules[idx];
        if (selector === rule["selectorText"]) {
            return idx;
        }
    }
    return -1;
}

function init(): void {
    setMainVisible(false);
    setWelcomeVisible(true);
    setGameOverVisible(false);
    setPrestigeVisible(false);
}


export {
    setMainVisible,
    setWelcomeVisible,
    setGameOverVisible,
    setPrestigeVisible,
    init,
    getCSSRuleIndex
}
