export class CalendarEvent {
    constructor(id, title, startTime, endTime, description = '', creatorId = null) {
        this.id = id; // Unique identifier for the event
        this.title = title; // Title of the event
        this.startTime = startTime; // Start time of the event (Date object)
        this.endTime = endTime; // End time of the event (Date object)
        this.description = description; // Optional description of the event
        this.creatorId = creatorId; // Optional creator of the event
        
    }

}