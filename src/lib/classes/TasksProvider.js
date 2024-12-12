import { Task } from "./Task";

export class TasksProvider {
  constructor() {
    this.tasks = [];
  }

  getTasks() {
    return this.tasks;
  }

  getTasksToDatabase() {
    return this.tasks.map((taskEntry) => taskEntry.task.getTask());
  }

  addTask(title, description, start, end, backgroundColor, textColor, date) {
    this.tasks.push({
      id: this.tasks.length,
      date: date,
      task: new Task(
        title,
        description,
        start,
        end,
        backgroundColor,
        textColor,
      ),
    });
    return this.getTasks();
  }

  editTask(
    id,
    title,
    description,
    start,
    end,
    backgroundColor,
    textColor,
    date = false,
  ) {
    const taskToChange = this.tasks.find((item) => item.id === id);
    date ? (taskToChange.date = date) : (taskToChange.date = taskToChange.date);
    taskToChange.task = taskToChange.task.updateTask(
      title,
      description,
      start,
      end,
      backgroundColor,
      textColor,
    );

    return this.getTasks();
  }

  removeTask(id) {
    this.tasks = this.tasks.filter((item) => !(item.id === id));
  }
}
