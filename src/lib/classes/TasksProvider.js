import { Task } from "./Task";

export class TasksProvider {
    constructor() {
        this.tasks = [];
    }

    getTasks () {
        return this.tasks;
    }

    getTasksToDatabase ()
    {
        return this.tasks.map(taskEntry => taskEntry.task.getTask());
    }

    addTask (title, description, start, end, titleColor, textColor, date) {
        this.tasks.push({date: date, task: new Task(title, description, start, end, titleColor, textColor)});
        return this.getTasks();
    }
}