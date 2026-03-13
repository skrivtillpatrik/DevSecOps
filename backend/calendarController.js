import { CalendarEvent } from "./dataModels/CalendarEvent.js";
import { getDB } from "./db.js";

function getDbOrThrow() {
    const db = getDB();
    if (!db) {
        throw new Error("Database not initialized. Call initDatabase() before using calendarController.");
    }
    return db;
}

function GetEventMembers(eventId) {
    const db = getDbOrThrow();
    const sql = db.prepare("SELECT userId FROM EventMembers WHERE eventId = ?");
    const rows = sql.all(eventId);
    return rows.map(r => r.userId);
}
function GetEventMembersNames(eventId) {
    const db = getDbOrThrow();
    const sql = db.prepare(`
        SELECT u.id AS userId, u.name
        FROM users u
        JOIN EventMembers em ON u.id = em.userId
        WHERE em.eventId = ?`);

    const rows = sql.all(eventId);
    return rows.map(r => ({ id: r.userId, name: r.name }));
}

function createCalendarEvent(body) {

    const db = getDbOrThrow();

    const event = new CalendarEvent(body);

    console.log('Creating calendar event:', event);

    const sql = db.prepare(`
        INSERT INTO calendarMeeting (title, description, dateStart, dateEnd, createdBy)
        VALUES (?, ?, ?, ?, ?)
    `);
    const EventMembers = db.prepare(`
        INSERT INTO EventMembers (eventId, userId)
        VALUES (?, ?)
    `);

    const result = sql.run(event.title, event.description, event.dateStart, event.dateEnd, event.createdBy);
    const eventId = result.lastInsertRowid;

    console.log('lägger in deltagare:', event.participants);
    for (const userId of event.participants) {
        EventMembers.run(eventId, userId);
    }
    return new CalendarEvent({ id: eventId, title: event.title, dateStart: event.dateStart, dateEnd: event.dateEnd, description: event.description, createdBy: event.createdBy, participants: event.participants });
}
function getCalendarEvent(id, userId) {
    const db = getDbOrThrow();
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE id = ? AND createdBy = ?");
    const row = sql.get(id, userId);

    if (!row) return null;
    return new CalendarEvent({ id: row.id, title: row.title, dateStart: row.dateStart, dateEnd: row.dateEnd, description: row.description, createdBy: row.createdBy, participants: GetEventMembers(row.id), participantsNames: GetEventMembersNames(row.id) });
}
function getCalendarEventForMember(id, memberId) {
    const db = getDbOrThrow();
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE id = ? AND id IN (SELECT eventId FROM EventMembers WHERE userId = ?)");
    const row = sql.get(id, memberId);
    if (!row) return null;
    return new CalendarEvent({ id: row.id, title: row.title, dateStart: row.dateStart, dateEnd: row.dateEnd, description: row.description, createdBy: row.createdBy, participants: GetEventMembers(row.id), participantsNames: GetEventMembersNames(row.id) });
}
function getAllCalendarEventsForUser(userId) {
    const db = getDbOrThrow();
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE createdBy = ?");
    const rows = sql.all(userId);
    return rows.map(row => new CalendarEvent({ id: row.id, title: row.title, dateStart: row.dateStart, dateEnd: row.dateEnd, description: row.description, createdBy: row.createdBy, participants: GetEventMembers(row.id), participantsNames: GetEventMembersNames(row.id) }));
}
function getAllCalendarEventsForMember(memberId) {
    const db = getDbOrThrow();
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE id IN (SELECT eventId FROM EventMembers WHERE userId = ?)");
    const rows = sql.all(memberId);
    return rows.map(row => new CalendarEvent({ id: row.id, title: row.title, dateStart: row.dateStart, dateEnd: row.dateEnd, description: row.description, createdBy: row.createdBy, participants: GetEventMembers(row.id), participantsNames: GetEventMembersNames(row.id) }));
}
function updateCalendarEvent(id, body, userId) {
    const db = getDbOrThrow();
    const event = new CalendarEvent(body);
    const sql = db.prepare(`
        UPDATE calendarMeeting
        SET title = ?, description = ?, dateStart = ?, dateEnd = ?
        WHERE id = ? AND createdBy = ?
    `);
    const result = sql.run(event.title, event.description, event.dateStart, event.dateEnd, id, userId);
    if (result.changes === 0) return null;
    return new CalendarEvent({ id: id, title: event.title, dateStart: event.dateStart, dateEnd: event.dateEnd, description: event.description, createdBy: userId, participants: GetEventMembers(id), participantsNames: GetEventMembersNames(id) });
}
function deleteCalendarEvent(id, userId) {
    const db = getDbOrThrow();
    const eventsql = db.prepare("SELECT * FROM calendarMeeting WHERE id = ? AND createdBy = ?");
    const event = eventsql.get(id, userId);
    if (!event) return null;
    const sql = db.prepare("DELETE FROM calendarMeeting WHERE id = ? AND createdBy = ?");
    const result = sql.run(id, userId);
    if (result.changes === 0) return null;
    return new CalendarEvent({
        id: event.id,
        title: event.title,
        dateStart: event.dateStart,
        dateEnd: event.dateEnd,
        description: event.description,
        createdBy: event.createdBy,
        participants: GetEventMembers(event.id),
        participantsNames: GetEventMembersNames(event.id)
    });
}

export default {
    createCalendarEvent,
    getCalendarEvent,
    getCalendarEventForMember,
    getAllCalendarEventsForUser,
    getAllCalendarEventsForMember,
    updateCalendarEvent,
    deleteCalendarEvent,
};