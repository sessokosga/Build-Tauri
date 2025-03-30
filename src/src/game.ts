'use strict';
import * as LittleJS from "littlejsengine";
import * as Functions from "./functions.js";

import {Data} from "./data.js";
import {DomUtils} from "./dom_utils.js";
import {Inventory} from "./inventory.js";
import {Result} from "./result.js";
import {Task} from "./task.js";
import {ShopEntry} from "./shop_entry.js";
import {Project} from "./project.js";
import {Unlock} from "./unlock.js";
import {Quest} from "./quest.js";
import {Automation} from "./automation.js";
import {Need} from "./need.js";

const {vec2, rgb} = LittleJS;

type NumberKeys<T> = {
    [K in keyof T]: T[K] extends number ? K : never;
}[keyof T];


Functions.init();

// show the LittleJS splash screen
LittleJS.setShowSplashScreen(true);

const STARTING_TASK = [
    "task_punch_berry",
    "task_punch_tree",
    "task_create_stick",
    "task_punch_rock",
]
const FOOD_PER_VILLAGER = 2;
const FOOD_PER_OFFSPRING = 1;
const FOOD_LIST = ["berries"];

// Dom elements
const shop = document.getElementById("shop");
const projects = document.getElementById("projects");
const sfx_new_game = document.querySelector<HTMLAudioElement>("#sfx_new_game")
const btn_keep_playing = document.querySelector<HTMLButtonElement>("#btn_keep_playing")
const btn_prestige = document.querySelector<HTMLButtonElement>("#btn_prestige")
const btn_new_game = document.querySelector<HTMLButtonElement>("#btn_new_game")
const btn_start_game = document.querySelector<HTMLButtonElement>("#btn_start_game")
const btn_sell = document.querySelector<HTMLButtonElement>("#btn_sell")
const btn_pause_moon = document.querySelector<HTMLButtonElement>("#btn_pause_moon")
const btn_speed_moon = document.querySelector<HTMLButtonElement>("#btn_speed_moon")
const sfx_game_over = document.querySelector<HTMLAudioElement>("#sfx_game_over")
const moon_reached = document.getElementById("moon_reached")
const shop_total = document.getElementById("shop_total")
const progress_moon = document.querySelector<HTMLProgressElement>("#progress_moon")
const prestige = document.getElementById("prestige")
const select_prestige = document.getElementById("select_prestige")
const music_background = document.querySelector<HTMLAudioElement>("#music_background")
const suggest_prestige = document.getElementById("suggest_prestige")
const sfx_task_cancelled = document.querySelector<HTMLAudioElement>("#sfx_task_cancelled")
const sfx_task_start = document.querySelector<HTMLAudioElement>("#sfx_task_start")
const sfx_moon_pause = document.querySelector<HTMLAudioElement>("#sfx_moon_pause")
const sfx_click = document.querySelector<HTMLAudioElement>("#sfx_click")
const sfx_quest_complete = document.querySelector<HTMLAudioElement>("#sfx_quest_complete")
const detail_title = document.getElementById("detail_title")
const detail = document.getElementById("detail")
const lab_moon_count = document.getElementById("lab_moon_count")
const lab_food_count_red = document.getElementById("lab_food_count_red")
const lab_food_count = document.getElementById("lab_food_count")
const lab_money_count = document.getElementById("lab_money_count")
const lab_moon_speed = document.getElementById("lab_moon_speed")

// game states
let food: number
let moon: number
let money: number
let isGameOver: boolean
let timeMultiplier: number
let costReduction = 0
let hasPrestige = false

let moonSpeed: number
let isMoonPaused: boolean
let foodNeeded: number
let gameHasStarted = false

// inventory states
let inventory: Inventory

let data = new Data();
let domUtils = new DomUtils();

let listTasks: Task[]
let listShopEntry: ShopEntry[]
let listProjects: Project[]
let listUnlocks: Unlock[]
let listQuests: Quest[]
let listPrestiges: string[] = []
let listAutomations: Automation[]
let enabledAutomations: { [key: string]: Boolean } = {};
let readyToUnlock: { [key: string]: Boolean } = {}
let resourcesSold: {}
let resourcesProduiced: {}

function initVariables() {
    LittleJS.setPaused(false);
    food = 0;
    moon = 1;
    money = 0;
    isGameOver = false;
    timeMultiplier = 1;

    moonSpeed = .02;
    isMoonPaused = false;
    foodNeeded = 0;
    
    shop && projects

    inventory = new Inventory(
        document.getElementById("lab_wood_count"),
        document.getElementById("lab_stone_count"),
        document.getElementById("lab_stick_count"),
        document.getElementById("lab_house_count"),
        document.getElementById("lab_villager_count"),
        document.getElementById("lab_berry_count"),
        document.getElementById("lab_offspring_count"),
        inventoryChanged
    );

    listTasks = [];
    listShopEntry = [];
    listProjects = [];
    listUnlocks = [];
    listQuests = [];
    listAutomations = []
    if (!hasPrestige)
        listPrestiges = []

    resourcesSold = {
        "woods": 0,
        "sticks": 0,
        "berries": 0,
        "stones": 0
    }

    resourcesProduiced = {
        "woods": 0,
        "sticks": 0,
        "berries": 0,
        "stones": 0
    }

    enabledAutomations = {
        'auto_gather_food': false,
        'auto_build_shed': false,
        'auto_gather_wood': false,
        'auto_gather_stone': false,
    };

    enabledAutomations['auto_gather_stone']

    readyToUnlock = {
        'house': false,
        'procreation': false,
        'project': false,
        'shop': false,
    }
    
    readyToUnlock['house']
}

function newGame() {
    initVariables();
    sfx_new_game?.play()
    domUtils.clean();
    for (const task of listTasks) {
        task.resetIcon();
    }
    gameHasStarted = true;

    Functions.setGameOverVisible(false);
    Functions.setMainVisible(true);
    Functions.setWelcomeVisible(false);

    addTask(STARTING_TASK)
    listShopEntry = data.getAllShopEntryInstances();
    // listProjects = data.getAllProjectInstances();
    listUnlocks = data.getAllUnlockInstances();
    listQuests = data.getAllQuestInstances();
    listAutomations = data.getAllAutomationInstances();

    for (const quest of listQuests) {
        domUtils.addQuest(quest);
    }

    // eval unlock functions
    for (const unlock of listUnlocks) {
        unlock.condition = eval(`() => {
            ${unlock.strCondition}
        }`)
        unlock.action = eval(`() => {
            ${unlock.strAction}
        }`)
    }

    // eval project function
    for (const project of listProjects) {
        project.action = eval(`() => {
            ${project.strAction}
        }`)
    }

    // eval quest function
    for (const quest of listQuests) {
        quest.condition = eval(`() => {
            ${quest.strCondition}
        }`)
    }
    // eval task function
    for (const task of listTasks) {
        task.result.custom = eval(`() => {
            ${task.result.strCustom}
        }`)
    }

    // eval automation function
    for (const auto of listAutomations) {
        auto.stopCondition = eval(`() => {
            ${auto.strStopCondition}
        }`)
        auto.stopCondition = eval(`() => {
            ${auto.strStopCondition}
        }`)
    }

    // Update market total when market entry changes
    for (const entry of listShopEntry) {
        if (entry.eltAmount)
            entry.eltAmount.addEventListener('input', inventoryChanged);
        entry.valueChanged = updateMarketTotal;
    }
    inventoryChanged();
    disabledAllButton(false);
    if (progress_moon)
        progress_moon.value = 0;

    
    // document.styleSheets[0].insertRule(`#parent_body{height:${projects.offsetTop + 400}px !important;}`)


    if (hasPrestige) {
        for (const id of listPrestiges) {
            const project = data.getProjectInstanceByID(id);
            project.action()
        }
    }

}


///////////////////////////////////////////////////////////////////////////////
function gameInit() {
    initVariables();
    Functions.setGameOverVisible(false);
    Functions.setMainVisible(false);
    Functions.setWelcomeVisible(true);
    Functions.setPrestigeVisible(false);

    // music_background?.play()


    if (btn_keep_playing)
        btn_keep_playing.onclick = onBtnKeepPlayingPressed;
    if (btn_prestige)
        btn_prestige.onclick = onBtnPrestigePressed;

    if (btn_new_game)
        btn_new_game.onclick = newGame;
    if (btn_start_game)
        btn_start_game.onclick = newGame;

    if (btn_sell) {
        btn_sell.onclick = onBtnSellPressed;
        btn_sell.addEventListener('keydown', (e) => {
            console.log("down ", e.key)
            if (e.key == 'Enter')
                onBtnSellPressed()
        })
    }
    if (btn_pause_moon)
        btn_pause_moon.onclick = onBtnPauseMoonPressed;
    if (btn_speed_moon)
        btn_speed_moon.onclick = onBtnSpeedPressed


    // newGame();
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {

    if (isGameOver)
        return;

    if (gameHasStarted && music_background && music_background.readyState === 4 && music_background.paused)
        music_background?.play()

    showGameStatus();

    if (!isMoonPaused) {
        for (const task of listTasks) {
            if (task.isRunning && task.progress) {
                task.progress.value += task.speed * timeMultiplier;
                if (task.onCompleted && task.progress.value >= task.progress.max)
                    task.onCompleted();
            }
        }
    }

    checkTaskAvailability();
    checkProjectAvailability();
    checkUnlocks();
    checkQuests();
    checkAutomations();

    // Check game over
    if (inventory.villagers <= 0 && !isGameOver) {
        isGameOver = true;
        sfx_game_over?.play()
        Functions.setGameOverVisible(isGameOver);
        Functions.setMainVisible(true);
        Functions.setWelcomeVisible(false);
        if (moon_reached)
            moon_reached.textContent = (moon - 1).toString();
        disabledAllButton();
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {
}

///////////////////////////////////////////////////////////////////////////////
function gameRender() {
    LittleJS.drawRect(vec2(), vec2(1920, 1080), rgb(1, 1, 1, 1));
}


///////////////////////////////////////////////////////////////////////////////
function gameRenderPost() {

}

///////////////////////////////////////////////////////////////////////////////
// Listeners - Jobs


function onTaskCompleted(this: Task) {
    const task: Task = this;

    if (task.result.modifyInventoryCap) {
        for (let elt in task.result) {
            if (elt in inventory) {
                const max = ('max_' + elt) as NumberKeys<Inventory>;
                const p = elt as NumberKeys<Result>;
                inventory[max] += task.result[p];
            }
        }

    } else {
        for (let elt in task.result) {
            if (elt in inventory) {
                const iv = elt as NumberKeys<Inventory>;
                const p = elt as NumberKeys<Result>;
                inventory[iv] += task.result[p];
                if (elt in resourcesProduiced) { // @ts-ignore
                    resourcesProduiced[elt] += task.result[elt];
                }
            }
        }

    }
    task.result.custom();

    inventory.working_villagers -= task.need.villagers;

    task.stop();

    let isAutomationWaiting = false;
    let autoTask = null;
    for (const auto of listAutomations) {
        if (auto.isWaiting) {
            autoTask = auto;
            isAutomationWaiting = true;
            break;
        }
    }


    const isVillagerAvailable = inventory.villagers > inventory.working_villagers + task.need.villagers;

    if (task.autoRestart && !task.isCancelled) {
        if (!isVillagerAvailable && isAutomationWaiting) {
            if (autoTask)
                autoTask.stoppedTaskID = task.id;
        } else {
            startTask(task);
        }
    } else
        task.resetIcon();

    if (task.autoRemove) {
        domUtils.remove(task.id)
        listTasks = listTasks.filter((t) => t.id != task.id)
    }

}

function cancelTask(task: Task) {
    task.stop(true)
    restoreCost(task.need);
}

function onTaskBtnPressed(this: Task) {
    if (isMoonPaused || isGameOver)
        return;
    /** @type {Task}*/
    var task = this;
    if (task.isRunning) {
        sfx_task_cancelled?.play()
        cancelTask(task)
    } else {
        sfx_task_start?.play()
        startTask(task)
    }
}

function onBtnSpeedPressed() {
    if (isGameOver)
        return;
    sfx_moon_pause?.play()
    timeMultiplier *= 2;
    if (timeMultiplier == 2) {
        if (music_background)
            music_background.playbackRate = 1.2;
    } else if (timeMultiplier == 4) {
        if (music_background)
            music_background.playbackRate = 1.4;
    } else if (timeMultiplier == 8) {
        if (music_background)
            music_background.playbackRate = 1.6;
    } else if (timeMultiplier > 8) {
        timeMultiplier = 1;
        if (music_background)
            music_background.playbackRate = 1;
    }
    if (lab_moon_speed)
        lab_moon_speed.textContent = String(timeMultiplier);
}

function onBtnPauseMoonPressed() {
    if (isGameOver)
        return;
    sfx_moon_pause?.play()
    const idx = Functions.getCSSRuleIndex("#btn_pause_moon::before")
    if (idx >= 0 && idx < document.styleSheets[0].cssRules.length) {
        document.styleSheets[0].deleteRule(idx);
    }


    isMoonPaused = !isMoonPaused;
    if (isMoonPaused) {
        document.styleSheets[0].insertRule(`#btn_pause_moon::before{content:"►";}`);
    }


}

/**
 *
 * @param {Project} project
 */
function onProjectPressed(project: Project) {
    if (!project.element || project.element.ariaDisabled === "true" || project.isRemoved || isGameOver || isMoonPaused) {
        return
    }
    sfx_click?.play()
    money -= project.cost;
    project.action()
    project.isRemoved = true;
    domUtils.addLog(project.log);
    domUtils.remove(project.element.id);
    listProjects = listProjects.filter((p) => !p.isRemoved)
}

function onBtnSellPressed() {
    if (isGameOver)
        return;
    sfx_click?.play()
    if (shop_total && shop_total.textContent !== null)
        money += parseInt(shop_total.textContent)
    for (const entry of listShopEntry) {
        if (entry.id in inventory) {
            // @ts-ignore
            inventory[entry.id] -= entry._amount;
            // @ts-ignore
            resourcesSold[entry.id] += parseInt(entry._amount)
            // @ts-ignore
            entry.eltAmount.value = 0
            entry.amount = 0
        }
    }
}

function onBtnKeepPlayingPressed() {
    Functions.setPrestigeVisible(false);
    hasPrestige = false;
}

function onBtnPrestigePressed() {
    if (!select_prestige || !suggest_prestige)
        return
    hasPrestige = true;
    if (prestige)
        prestige.style.width = "500";

    let list_choices = document.querySelectorAll<HTMLElement>('.prestige_choice');
    for (const choice of list_choices) {
        choice.onclick = () => {
            if (prestige)
                prestige.style.width = "400";
            Functions.setPrestigeVisible(false);
            select_prestige.style.display = 'none';
            suggest_prestige.style.display = 'block';
            listPrestiges.push(choice.id);
            newGame();
        }
    }

    select_prestige.style.display = 'block';
    suggest_prestige.style.display = 'none';


    // setPrestigeVisible(false);
}

///////////////////////////////////////////////////////////////////////////////
// Checks

function isInventoryFull(ignore:boolean=false): boolean {
    if (ignore)
        return false
    const resources: string[] = ["woods", "sticks", "stones", "berries"]
    for (const elt of resources) {
        if (elt in inventory && `max_${elt}` in inventory) {
            // @ts-ignore
            if (inventory[elt] >= inventory[`max_${elt}`]) {
                return true
            }
        }
    }
    return false
}

isInventoryFull(true)

function hasEnoughResourcesForTask(task: Task): boolean {
    // check the number of available villager
    let available_villagers = inventory.villagers - inventory.working_villagers;

    for (let elt in task.need) {
        // @ts-ignore
        if (elt != 'villagers' && task.need[elt] > 0 && task.need[elt] > inventory[elt]) {
            return false;
        }
    }
    return available_villagers >= task.need.villagers;
}

function whatIsLackingForTask(task: Task) {
    let available_villagers = inventory.villagers - inventory.working_villagers;
    let lacking = {}
    for (let elt in task.need) {
        // @ts-ignore
        if (elt != 'villagers' && task.need[elt] > 0 && task.need[elt] > inventory[elt]) {

            // @ts-ignore
            lacking[elt] = task.need[elt] - inventory[elt]
        }
    }

    if (available_villagers < task.need.villagers) { // @ts-ignore
        lacking["villagers"] = task.need.villagers
    }
    return lacking
}

/**
 *
 * @param {Task} task
 */
function hasEnoughInventorySpace(task: Task) {
    if (task.result.modifyInventoryCap)
        return true;

    for (const elt in task.result) {
        if (elt in inventory) {
            // @ts-ignore
            if (inventory[`max_${elt}`] < task.result[elt] + inventory[elt])
                return false
        }
    }

    return true
}

function checkTaskAvailability() {

    for (let task of listTasks) {
        task.whyDisabled = "";

        if (!hasEnoughInventorySpace(task))
            task.whyDisabled = "Inventory is full"
        else if (!hasEnoughResourcesForTask(task)) {
            task.whyDisabled = "Lacking: "
            const lacks = whatIsLackingForTask(task);
            for (const id in lacks) {
                if (id === "villagers")
                    task.whyDisabled += "free ";
                // @ts-ignore
                task.whyDisabled += `${id}(${lacks[id]}), `;
            }
        }

        if (task.btn) {
            if (isGameOver || isMoonPaused || !hasEnoughInventorySpace(task)) {
                task.btn.disabled = true;
            } else
                task.btn.disabled = !task.isRunning && !hasEnoughResourcesForTask(task);

            if (task.btn.disabled && !isMoonPaused)
                task.resetIcon();

        }
    }
}

function checkProjectAvailability() {
    for (const project of listProjects) {
        if (project.element) {

            if (project.cost > money)
                project.element.ariaDisabled = "true";
            else
                project.element.ariaDisabled = "false";
        }

    }
}

function checkUnlocks() {
    for (const unlock of listUnlocks) {
        if (unlock.condition() && !unlock.isCompleted) {
            unlock.action()
            unlock.isCompleted = true;
            domUtils.addLog(unlock.name)
        }
    }
}

function checkQuests() {
    // Show one new quest
    for (const quest of listQuests) {
        if (!quest.isCompleted && quest.eltQuest && quest.eltQuest.style.display == 'block') {


            if (quest.condition()) {
                quest.isCompleted = true;
                sfx_quest_complete?.play()
                domUtils.addLog(`Quest Completed : ${quest.name} `)
            }
        }
    }

    // Show two more quest
    let completedQuest = 0
    let new_quest = 0
    for (const quest of listQuests) {
        if (!quest.isCompleted && quest.eltQuest) {
            quest.eltQuest.style.display = 'block';
            quest.isCompleted = false;
            new_quest++;
            if (completedQuest < 4)
                break;
            else if (new_quest >= 2)
                break
        } else {
            completedQuest++;
        }
    }
}

function checkAutomations() {
    for (let a of listAutomations) {
        let auto = a;
        if (auto.isRunning) {

            if (auto.stopCondition() || (auto.runningTask != null && !auto.runningTask.isRunning)) {
                auto.isRunning = false;
                if (auto.runningTask)
                    auto.runningTask.autoRestart = auto.storedAutoRestart;
                auto.runningTask = null;
                if (auto.stoppedTaskID != "") {
                    startTaskID(auto.stoppedTaskID)
                }
            }
        } else {
            if (auto.startCondition()) {
                if (inventory.villagers > inventory.working_villagers) {
                    if (auto.runningTask)
                        auto.runningTask = startTaskID(auto.taskID);
                    if (auto.runningTask != null) {
                        auto.storedAutoRestart = auto.runningTask.autoRestart;
                        auto.runningTask.autoRestart = false;
                        auto.isRunning = true;
                        auto.isWaiting = false;
                    }
                } else {
                    auto.isWaiting = true;
                }
            }
        }

    }
}

///////////////////////////////////////////////////////////////////////////////
// Actions
function suggestPrestige(ignore:boolean=false) {
    if (ignore)return
    isMoonPaused = true;
    Functions.setPrestigeVisible(true);
}

suggestPrestige(true)

/**
 *
 * @param {Number} percentage
 */
function increaseResourceCost(percentage: number) {
    if (percentage <= 0)
        return
    for (let entry of listShopEntry) {
        entry.price += entry.price * percentage / 100
    }
}
increaseResourceCost(0)
/**
 *
 * @param {Number} percentage
 */
function increaseJobResults(percentage: number) {
    if (percentage <= 0)
        return
    for (let task of listTasks) {
        if (task.type !== 0)
            continue

        for (const res in task.result) {
            if (res !== "custom") {
                // @ts-ignore
                task.result[res] += task.result[res] * percentage / 100;
            }
        }
    }
}
increaseJobResults(0)

function addTask(IDs: string[]) {
    for (const id of IDs) {
        const task = data.getTaskInstanceByID(id);
        if (task != null) {
            task.result.custom = eval(`() => {
                ${task.result.strCustom}
            }`)
            listTasks.push(task);
            domUtils.addTask(task);

            // Connect onclick event
            if (task.btn)
                task.btn.onclick = onTaskBtnPressed.bind(task);
            // task.btn.ontouchstart = onTaskBtnPressed.bind(task);
            task.onCompleted = onTaskCompleted.bind(task);

            // Show task details on hover
            if (task.labTitle && detail && detail_title)
                task.labTitle.onmouseenter = function () {
                    detail_title.textContent = task.name;
                    if (task.whyDisabled.trim().length > 0)
                        detail.innerHTML = task.details + `<br/><b style="color:red">${task.whyDisabled}</b>` + "<br/>Requires:<br/>" + task.describedNeed;
                    else
                        detail.innerHTML = task.details + "<br/><br/>Requires:<br/>" + task.describedNeed;
                }

            // task.labTitle.ontouchstart = function () {
            //     detail_title.textContent = task.name;
            //     detail.innerHTML = task.details + "<br/><br/>Requires:<br/>" + task.describedNeed;
            // }

            if (task.labTitle && detail_title && detail)
                task.labTitle.onmouseleave = function () {
                    detail_title.textContent = "";
                    detail.innerHTML = "";
                }

        }
    }
}

function addProject(IDs: string[] = []) {
    for (const id of IDs) {
        const project = data.getProjectInstanceByID(id);
        if (project != null) {
            project.action = eval(`() => {
                ${project.strAction}
            }`)
            project.cost -= project.cost * costReduction;
            listProjects.push(project);
            domUtils.addProject(project);

            if (project.element)
                project.element.onclick = () => {
                    onProjectPressed(project);
                }


            // project.element.ontouchstart = () => {
            //     onProjectPressed(project);
            // }
        }
    }
}
addProject()
function applyCost(need: Need) {
    inventory.working_villagers += need.villagers;

    for (let elt in need) {
        if (elt != 'villagers') { // @ts-ignore
            inventory[elt] -= need[elt];
        }
    }
}

/**
 * @param {Task} task
 */
function startTask(task: Task) {
    if (hasEnoughResourcesForTask(task) && hasEnoughInventorySpace(task)) {
        applyCost(task.need);
        task.start();
        return true
    } else {
        task.resetIcon();
    }
    return false
}

/**
 * @param {String} id
 */
function startTaskID(id: string) {
    for (const task of listTasks) {
        if (task.id === id) {
            if (startTask(task))
                task.setRunningIcon();
            return task;
        }
    }
    return null
}


function restoreCost(need: Need) {
    for (let elt in need) {
        if (elt != 'villagers') { // @ts-ignore
            inventory[elt] += need[elt];
        }
    }

    inventory.working_villagers -= need.villagers;
}

function showGameStatus() {
    if (!lab_moon_count || !lab_food_count_red || !lab_food_count || !progress_moon || !lab_money_count)
        return
    food = 0;
    foodNeeded = inventory.villagers * FOOD_PER_VILLAGER + inventory.offsprings * FOOD_PER_OFFSPRING;
    lab_moon_count.textContent = moon.toString();
    for (let elt of FOOD_LIST) {
        if (elt in inventory) {
            // @ts-ignore
            food += inventory[elt]
        }
    }
    if (food < foodNeeded) {
        lab_food_count_red.style.display = "block";
        lab_food_count_red.textContent = `Food: ${food}/${foodNeeded}`;

        lab_food_count.style.display = "none";
    } else {
        lab_food_count_red.style.display = "none";

        lab_food_count.style.display = "block";
        lab_food_count.textContent = `Food: ${food}/${foodNeeded}`;
    }

    // Moon progress
    if (!isMoonPaused) {
        progress_moon.value += moonSpeed * timeMultiplier;
        if (progress_moon.value >= 100) {
            progress_moon.value = 0;
            feedVillagers();
            moon += 1;
        }
    }

    lab_money_count.textContent = money.toString()
}

function feedVillagers() {
    let villagersFed = food / FOOD_PER_VILLAGER - food % FOOD_PER_VILLAGER;
    let starvingVilagers = Math.floor(inventory.villagers - villagersFed)
    if (starvingVilagers < 0)
        starvingVilagers = 0;

    while (foodNeeded > 0 && food > 0) {
        for (let elt of FOOD_LIST) {
            if (elt in inventory) {
                // @ts-ignore
                inventory[elt] -= 1;
                food -= 1;
                foodNeeded -= 1;
            }
        }
    }
    inventory.villagers -= starvingVilagers
}


function updateMarketTotal() {
    let total = 0;
    for (const e of listShopEntry) {
        /**@type {ShopEntry} */
        let entry = e
        total += entry.total;
    }
    if (shop_total)
        shop_total.textContent = total.toString();
    if (btn_sell)
        btn_sell.disabled = total <= 0;
}

function inventoryChanged() {
    for (const e of listShopEntry) {
        /**@type {ShopEntry} */
        const entry = e;
        if (entry.id in inventory) {
            // @ts-ignore
            entry.eltAmount.max = inventory[entry.id]
            // @ts-ignore
            if (entry.eltAmount.value > inventory[entry.id]) {
                // @ts-ignore
                entry.eltAmount.value = inventory[entry.id]
                // @ts-ignore
                entry.amount = inventory[entry.id]
            }
        }
    }
}

function disabledAllButton(disable = true) {
    for (const elt of document.getElementsByTagName('button')) {
        if (elt.id != 'btn_new_game')
            elt.disabled = disable;
    }
    // for (const elt of document.querySelectorAll('.shop input[type="number"'))
    //     elt.disabled = disable;
}

// function stopAllTasks() {
//     for (const task of listTasks) {
//         task.stop(true);
//         task.resetIcon();
//         task.reset()
//     }
// }
function totalResourcesSold() {
    let total = 0;
    for (const r in resourcesSold) {
        // @ts-ignore
        total += resourcesSold[r];
    }
    return total;
}

totalResourcesSold()

function totalResourcesProduiced() {
    let total = 0;
    for (const r in resourcesProduiced) {
        // @ts-ignore
        total += resourcesProduiced[r];
    }
    return total;
}

totalResourcesProduiced()

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
LittleJS.setHeadlessMode(true)
// setGlEnable(false)

LittleJS.engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);