import { Task } from "./Task";

export class TasksProvider {
  constructor() {
    this.tasks = [];
    this.columns = [];
  }

  getTasks() {
    const columnCount = this.calculateColumns();
    return this.tasks.map((task, index) => ({
      ...task,
      column: this.columns[index],
      columnCount
    }));
  }

  getTasksToDatabase() {
    return this.tasks.map((taskEntry) => taskEntry.task.getTask());
  }

  addTask(title, description, start, end, backgroundColor, textColor, date, completed = false) {
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
        completed
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

    this.calculateColumns();

    this.tasks = this.tasks.map((task, index) => ({
      ...task,
      id: index
    }));
  }

  calculateColumns() {
    this.columns = this.tasks.map(() => 0);
    
    for (let i = 0; i < this.tasks.length; i++) {
      const task1 = this.tasks[i].task;
      let column = 0;

      for (let j = 0; j < i; j++) {
        const task2 = this.tasks[j].task;
        if (this.tasksOverlap(task1, task2) && this.columns[j] === column) {
          column++;
          j = -1;
        }
      }
      
      this.columns[i] = column;
    }
    
    const maxColumn = Math.max(...this.columns);
    return maxColumn + 1;
  }

  tasksOverlap(task1, task2) {
    return !(task1.end < task2.start || task2.end < task1.start);
  }

  toggleTaskComplete(id) {
    const task = this.tasks.find(item => item.id === id);
    if (task) {
      task.task.toggleComplete();
    }
  }

  getTasksForDate(date) {
    return this.tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate.getDate() === date.getDate() &&
             taskDate.getMonth() === date.getMonth() &&
             taskDate.getFullYear() === date.getFullYear();
    });
  }
}
