export class Task {
    constructor (title, description, start, end, titleColor, textColor) {
        this.title = title;
        this.description = description;
        this.start = this.timeToPixels(start);
        this.end = this.timeToPixels(end);
        this.duration = this.start - this.end;
        this.titleColor = titleColor;
        this.textColor = textColor;
    }

    timeToPixels (time) {
        let [hours, minutes] = time.split(":").map(Number);
        let pixelHours = hours * 112 + 8 + minutes / 112 + 25;

        return pixelHours;
    }

    getTask () {
        return {
            title: this.title,
            description: this.description,
            start: this.start,
            end: this.end,
            duration: this.duration,
            titleColor: this.titleColor,
            textColor: this.textColor
        }
    }
}