export class CalendarEvent {
    // constructor(id, title, startTime, endTime, description = '', creatorId = null) {
    //     this.id = id; // Unique identifier for the event
    //     this.title = title; // Title of the event
    //     this.startTime = startTime; // Start time of the event (Date object)
    //     this.endTime = endTime; // End time of the event (Date object)
    //     this.description = description; // Optional description of the event
    //     this.creatorId = creatorId; // Optional creator of the event
    //     this.participants = []; // List of user IDs participating in the event
    // }
    constructor(body) {
        const createdBy = body.createdBy ?? body.creatorId;

        if(!body.title || !body.dateStart || !body.dateEnd || createdBy == null) {
            throw new Error("Cannot create calendarEvent, Missing required fields");
        }
        this.id = body.id; // May be undefined for new events
        this.title = body.title;
        this.dateStart = body.dateStart;
        this.dateEnd = body.dateEnd;
        this.description = body.description || '';
        this.createdBy = createdBy;
        this.participants = body.participants || [];
        this.participantsNames = body.participantsNames || []; // Optional list of participant names for easier frontend display

        // ID will be assigned by the database upon insertion
    }

}