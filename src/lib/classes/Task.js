export class Task {
  constructor(title, description, start, end, backgroundColor, textColor) {
    this.title = title;
    this.description = description;
    this.start = this.timeToPixels(start);
    this.end = this.timeToPixels(end);
    this.duration = this.end - this.start;
    this.backgroundColor = backgroundColor;
    this.textColor = textColor;
  }

  timeToPixels(time) {
    let [hours, minutes] = time.split(":").map(Number);
    let pixelHours = hours * 112 + 8 + minutes * (9.3 / 5) + 25;

    return pixelHours;
  }

  getTask() {
    return {
      title: this.title,
      description: this.description,
      start: this.start,
      end: this.end,
      duration: this.duration,
      backgroundColor: this.backgroundColor,
      textColor: this.textColor,
    };
  }
}
