import { CalendarEvent } from "./dataModels/CalendarEvent";
import {db } from "./db.js";

function createCalendarEvent(body) {
    const { title, startTime, endTime, description, creatorId } = body;

    const sql = db.prepare(`
        INSERT INTO calendarMeeting (title, description, dateStart, dateEnd, createdBy)
        VALUES (?, ?, ?, ?, ?)
    `);
    const result = sql.run(title, description, startTime, endTime, creatorId);
    return new CalendarEvent(result.id, title, new Date(startTime), new Date(endTime), description, creatorId);
}
function getCalendarEvent(id, userId) {
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE id = ? AND createdBy = ?");
    const row = sql.get(id, userId);
    if (!row) return null;
    return new CalendarEvent(row.id, row.title, new Date(row.dateStart), new Date(row.dateEnd), row.description, row.createdBy);
}
function getCalendarEventForMember(id, memberId) {
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE id = ? AND id IN (SELECT eventId FROM EventMembers WHERE userId = ?)");
    const row = sql.get(id, memberId);
    if (!row) return null;
    return new CalendarEvent(row.id, row.title, new Date(row.dateStart), new Date(row.dateEnd), row.description, row.createdBy);
}
function getAllCalendarEventsForUser(userId) {
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE createdBy = ?");
    const rows = sql.all(userId);
    return rows.map(row => new CalendarEvent(row.id, row.title, new Date(row.dateStart), new Date(row.dateEnd), row.description, row.createdBy));
}
function getAllCalendarEventsForMember(memberId) {
    const sql = db.prepare("SELECT * FROM calendarMeeting WHERE id IN (SELECT eventId FROM EventMembers WHERE userId = ?)");
    const rows = sql.all(memberId);
    return rows.map(row => new CalendarEvent(row.id, row.title, new Date(row.dateStart), new Date(row.dateEnd), row.description, row.createdBy));
}
function updateCalendarEvent(id, body, userId) {
    const { title, startTime, endTime, description } = body;
    const sql = db.prepare(`
        UPDATE calendarMeeting
        SET title = ?, description = ?, dateStart = ?, dateEnd = ?
        WHERE id = ? AND createdBy = ?
    `);
    const result = sql.run(title, description, startTime, endTime, id, userId);
    if (result.changes === 0) return null;
    return new CalendarEvent(id, title, new Date(startTime), new Date(endTime), description, userId);
}   
function deleteCalendarEvent(id, userId) {
    const sql = db.prepare("DELETE FROM calendarMeeting WHERE id = ? AND createdBy = ?");
    const result = sql.run(id, userId);
    return result.changes > 0;
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