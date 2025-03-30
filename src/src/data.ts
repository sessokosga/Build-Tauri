import {getData} from './content.ts'
import {Task} from "./task.ts"
import {Need} from "./need.js";
import {Result} from "./result.js";
import {Quest} from "./quest.js";
import { ShopEntry } from './shop_entry.js';
import { Project } from './project.js';
import { Unlock } from './unlock.js';
import { Automation } from './automation.js';

export class Data {
    json: any;
    tasks: any;
    resources: any;
    projects: any;
    unlocks: any;
    quests: any;
    automations: any;

    constructor() {
        this.json = JSON.parse(getData());
        this.tasks = this.getSheet("tasks");
        this.resources = this.getSheet("resources");
        this.projects = this.getSheet("projects");
        this.unlocks = this.getSheet("unlocks");
        this.quests = this.getSheet("quests");
        this.automations = this.getSheet("automations");
    }

    getSheet(name: string) {
        for (const sheet of this.json["sheets"]) {
            if (sheet["name"] === name) {
                return sheet
            }
        }
    }

    getTaskByID(id: string) {
        return this.getLineByID(this.tasks, id)
    }

    getLineByID(sheet: any, id: string) {
        for (let line of sheet["lines"]) {
            if (line["id"] === id) {
                return line;
            }
        }
        console.error("method `getLineByID` ", id, " not found")
    }

    /**
     * @param {String} id - Task id
     */
    getTaskInstanceByID(id: string) {
        if (id.length <= 0)
            return
        let line = this.getTaskByID(id)
        let describedNeed = "";
        for (const k in line["need"]) {
            describedNeed += line["need"][k] + "x " + k + "<br/>";
        }
        return new Task(
            line["name"],
            line["autoRestart"],
            new Need(
                line["need"]["villagers"],
                line["need"]["woods"],
                line["need"]["stones"],
                line["need"]["sticks"],
                line["need"]["offsprings"],
                line["need"]["money"]
            ),
            new Result(
                line["result"]["villagers"],
                line["result"]["woods"],
                line["result"]["stones"],
                line["result"]["sticks"],
                line["result"]["houses"],
                line["result"]["berries"],
                line["result"]["offsprings"],
                line["ModifyInvCap"],
                line["result"]["custom"]
            ),
            describedNeed,
            line["details"],
            line["speed"],
            id,
            line["type"],
            line["autoRemove"]
        )
    }

    getAllTaskInstances() {
        let listTasks = []
        for (const line of this.tasks["lines"]) {
            listTasks.push(this.getTaskInstanceByID(line["id"]))
            // let task = this.getTaskInstanceByID(line["id"])

            // Bind dom elements
            // const progress = document.getElementById(`progress_${task.id}`);
            // const btn=document.getElementById(`btn_${task.id}`);
            // const lab = document.getElementById(`lab_${task.id}`);
            // if (progress != null && btn!=null && lab != null){
            // 	listTasks.push(task);
            // 	task.bindDom(progress,btn,lab);
            // }else
            // 	break;
        }
        return listTasks
    }

    /**
     *
     * @param {String} id
     * @returns {ShopEntry}
     */
    getShopEntryInstanceByID(id: string): ShopEntry {
        let line = this.getLineByID(this.resources, id);
        return new ShopEntry(
            line["id"],
            line["name"],
            line["price"]
        )
    }

    getAllShopEntryInstances() {
        let listEntries = [];
        for (const line of this.resources["lines"]) {
            /**@type {ShopEntry} */
            let entry = this.getShopEntryInstanceByID(line["id"]);

            const price = document.getElementById(`price_${entry.id}`)
            const name = document.getElementById(`name_${entry.id}`)
            const amount: any = document.getElementById(`amount_${entry.id}`)
            const total = document.getElementById(`total_${entry.id}`)

            if (price != null && name != null && amount != null && total != null) {
                entry.bindDom(name, price, amount, total)
                listEntries.push(entry)
            }
        }
        return listEntries
    }

    getProjectInstanceByID(id: string) {
        const line = this.getLineByID(this.projects, id)
        return new Project(
            line["id"],
            line["name"],
            line["description"],
            line["log"],
            line["cost"],
            line["action"]
        )
    }

    getAllProjectInstances() {
        const projects = this.projects["lines"];
        let listProjects = [];
        for (const line of projects) {
            listProjects.push(this.getProjectInstanceByID(line["id"]));
        }
        return listProjects
    }

    getAllUnlockInstances():Unlock[] {
        let listUnlocks:Unlock[] = [];
        for (const line of this.unlocks["lines"]) {
            listUnlocks.push(new Unlock(
                line["id"],
                line["name"],
                line["condition"],
                line["action"],
            ))
        }
        return listUnlocks
    }

    getQuestInstanceByID(id: string): Quest {
        const line = this.getLineByID(this.quests, id);
        return new Quest(
            id,
            line["name"],
            line["condition"]
        )
    }

    getAllQuestInstances() {
        let listQuests = [];

        for (const line of this.quests['lines']) {
            let quest = this.getQuestInstanceByID(line["id"])
            listQuests.push(quest)
        }
        return listQuests
    }

    getAllAutomationInstances() {
        let listAutomations = [];

        for (const line of this.automations['lines']) {
            let auto = new Automation(
                line["id"],
                line["name"],
                line["startCondition"],
                line["taskID"],
                line["stopCondition"],
            );

            listAutomations.push(auto)
        }
        return listAutomations
    }
}
