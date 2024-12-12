export class Task {
  constructor(title, description, start, end, backgroundColor, textColor) {
    this.title = title;
    this.description = description;
    this.start = this.timeToPixels(start);
    this.startHour = start;
    this.end = this.timeToPixels(end);
    this.endHour = end;
    this.duration = this.end - this.start;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
  }

  timeToPixels(time) {
    const [hours, minutes] = time.split(":").map(Number);
    const pixelHours = hours * 112 + 8 + minutes * (9.3 / 5) + 25;

    return pixelHours;
  }

  updateTask(title, description, start, end, backgroundColor, textColor) {
    this.title = title;
    this.description = description;
    this.start = this.timeToPixels(start);
    this.startHour = start;
    this.end = this.timeToPixels(end);
    this.endHour = end;
    this.duration = this.end - this.start;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
    return this.getTask();
  }

  getTask() {
    return {
      title: this.title,
      description: this.description,
      start: this.start,
      startHour: this.startHour,
      end: this.end,
      endHour: this.endHour,
      duration: this.duration,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
    };
  }
}
