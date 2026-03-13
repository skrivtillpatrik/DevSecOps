import "../tests/setupTestDB";
import userController from "../backend/userController";
import calendarController from "../backend/calendarController";
import { describe, it, expect, beforeAll, afterAll } from "vitest";

let createdUserId;
let calendarUserID;
describe("User Controller tests", () => {
    it("should create a new user", () => {
        const userData = { name: "Test User" };
        const newUser = userController.NewUser(userData);
        expect(newUser).toHaveProperty("id");
        createdUserId = newUser.id;
        expect(newUser.name).toBe("Test User");
    });
    it("should get the created user by ID", () => {
        const user = userController.GetUser(createdUserId);
        expect(user).not.toBeNull();
        expect(user.id).toBe(createdUserId);
        expect(user.name).toBe("Test User");
    });
    it("should update the user's name", () => {
        const updatedData = { name: "Updated User" };
        const updatedUser = userController.UpdateUser(createdUserId, updatedData);
        expect(updatedUser).not.toBeNull();
        expect(updatedUser.name).toBe("Updated User");
    });
    it("should get the updated user", () => {
        const user = userController.GetUser(createdUserId);
        expect(user).not.toBeNull();
        expect(user.name).toBe("Updated User");
    });
    it("should delete the user", () => {
        const deletedUser = userController.DeleteUser(createdUserId);
        expect(deletedUser.id).toBe(createdUserId);
        const user = userController.GetUser(createdUserId);
        expect(user).toBeNull();
    });
    userController.NewUser({ name: "Another User" });
    userController.NewUser({ name: "Third User" });

    it("should get all users", () => {
        const users = userController.GetAllUsers();
        calendarUserID = users[0].id;
        expect(users.length).toBeGreaterThanOrEqual(2);
    });
});

describe("Edge case tests", () => {
    it("should return null for non-existent user", () => {
        const user = userController.GetUser(99999);
        expect(user).toBeNull();
    });
    it("should return null when updating non-existent user", () => {
        const updatedUser = userController.UpdateUser(99999, { name: "No User" });
        expect(updatedUser).toBeNull();
    });
});
let eventId;
describe("CalendarController tests", () => {
    it("should create a new calendar event", () => {
        console.assert(calendarUserID, "calendarUserID should be set from previous tests");
        const eventData = { title: "Test Event", dateStart: "2024-01-01", dateEnd: "2024-01-02", createdBy: calendarUserID, participants: [] };
        const newEvent = calendarController.createCalendarEvent(eventData);
        eventId = newEvent.id;
        expect(newEvent).toHaveProperty("id");
        expect(newEvent.title).toBe("Test Event");
        expect(newEvent.dateStart).toBe("2024-01-01");
        expect(newEvent.dateEnd).toBe("2024-01-02");
    });

    it("should get a calendar event by ID", () => {
        assert(calendarUserID, "calendarUserID should be set from previous tests");
        assert(eventId, "eventId should be set from previous tests");
        const event = calendarController.getCalendarEvent(eventId, calendarUserID);
        expect(event).not.toBeNull();
        expect(event.id).toBe(eventId);
    });

    it("should update a calendar event", () => {
        const updatedData = { title: "Updated Event", dateStart: "2024-02-01", dateEnd: "2024-02-02", description: "Updated description", createdBy: calendarUserID, participants: [] };
        const updatedEvent = calendarController.updateCalendarEvent(eventId, updatedData, calendarUserID);
        expect(updatedEvent).not.toBeNull();
        expect(updatedEvent.title).toBe("Updated Event");
        expect(updatedEvent.dateStart).toBe("2024-02-01");
        expect(updatedEvent.dateEnd).toBe("2024-02-02");
    });
    it("should delete a calendar event", () => {

        const deletedEvent = calendarController.deleteCalendarEvent(eventId, calendarUserID);
        expect(deletedEvent.id).toBe(eventId);
        const event = calendarController.getCalendarEvent(eventId, calendarUserID);
        expect(event).toBeNull();
    });
    it("should return null for non-existent calendar event", () => {
        const event = calendarController.getCalendarEvent(99999);
        expect(event).toBeNull();
    });
});