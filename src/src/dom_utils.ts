import * as Functions from './functions.js';
import { Project } from './project.js';
import { Quest } from './quest.js';
import { Task } from './task.js';

export class DomUtils {
    taskContainerIDs: Array<string>;

    constructor() {
        this.taskContainerIDs = ["job_container", "construction_container", "exploration_container", "reproduction_container"]

    }

    addProject(project: Project) {
        // exit when the element already exist
        if (document.getElementById(project.id) != null) {
            console.error(`The element id ${project.id} was already created`)
            return
        }


        const parent = document.getElementById("project_container")
        if (!parent || !parent.parentElement)
            return;
        parent.parentElement.style.display = "block";
        parent.insertAdjacentHTML("beforeend", `
            <li aria-disabled="true" id="${project.id}" class="item project">
                <span class="project_title">
                    <span class="project_name">${project.name}</span>
                    <span class="project_cost">(Money: ${project.cost})</span>
                </span>
                <p class="project_description">${project.description}</p>
            </li>
        `);
        project.bindDom(document.getElementById(project.id));
    }

    addTask(task: Task) {
        // exit when the parent container is not found
        if (task.type >= this.taskContainerIDs.length) {
            console.error(`Task type ${task.type} unknown, task ID: ${task.id}`);
            return
        }

        // exit when the element already exist
        if (document.getElementById(`progress_${task.id}`) != null || document.getElementById(`btn_${task.id}`) != null || document.getElementById(`lab_${task.id}`) != null) {
            console.error(`The element id ${task.id} was already created`)
            return
        }

        const parent = document.getElementById(this.taskContainerIDs[task.type]);
        if (!parent || !parent.parentElement)
            return;
        parent.parentElement.style.display = "block";


        parent.insertAdjacentHTML("beforeend", `
            <li class="job" id="${task.id}">
                <div class="title">
                    <span id="lab_${task.id}">${task.name}</span>
                    <button title="Play" id="btn_${task.id}" class="icon-only icon-play"
                        type="button"></button>
                </div>
                <progress id="progress_${task.id}" max="100" min="0" value="0"></progress>
            </li>
        `);

        task.bindDom(document.querySelector(`#progress_${task.id}`), document.querySelector(`#btn_${task.id}`), document.querySelector(`#lab_${task.id}`))
    }

    addQuest(quest: Quest) {
        const parent = document.getElementById("quest_container")
        if (!parent || !parent.parentElement)
            return;

        // exit when the element already exist
        if (document.getElementById(`${quest.id}`) != null) {
            console.error(`The element id ${quest.id} was already created`)
            return
        }

        parent.insertAdjacentHTML("beforeend", `
            <li id="${quest.id}" class="quest" style="display:none">
                <input disabled type="checkbox" name="${quest.name}" id="checkbox_${quest.id}" >
                <label id="lab_${quest.id}" for="checkbox_${quest.id}">${quest.name}</label>
            </li>
        `);

        quest.bindDom(document.querySelector(`#${quest.id}`), document.querySelector(`#checkbox_${quest.id}`));
    }

    clean(): void {
        // Reset pause moon icon
        const idx = Functions.getCSSRuleIndex("#btn_pause_moon::before")
        if (idx >= 0 && idx < document.styleSheets[0].cssRules.length) {
            document.styleSheets[0].deleteRule(idx);
        }

        // Remove Quests
        const quests = document.getElementsByClassName('quest')
        while (quests.length > 0) {
            quests[0].remove();
        }

        // Remove Projects
        const project_parent = document.getElementById('projects');
        if (project_parent)
            project_parent.style.display = 'none';

        const projects = document.getElementsByClassName('project')
        while (projects.length > 0) {
            projects[0].remove();
        }

        // Remove tasks
        const tasks = document.getElementsByClassName('job')
        while (tasks.length > 0) {
            tasks[0].remove();
        }

        // Reset Shop
        const shop_parent = document.getElementById('shop')
        if (shop_parent)
            shop_parent.style.display = 'none';
        const elts:NodeListOf<HTMLInputElement> = document.querySelectorAll<HTMLInputElement>('.shop input[type="number"]');
        for (const elt of elts)
            elt.value = "0";

        for (const elt of document.getElementsByClassName('total'))
            elt.textContent = "0";


    }

    addLog(log: string): void {
        if (log.trim().length <= 0)
            return
        const parent = document.getElementById("activity_log_container");
        if (!parent)
            return;
        // Remove old logs
        while (parent.children.length > 2)
            parent.children[0].remove()


        parent.insertAdjacentHTML("beforeend", `<li>${log}</li>`);
    }

    remove(id: string): void {
        const elt = document.getElementById(id);
        if (elt) {
            elt.remove()
        }
    }

}