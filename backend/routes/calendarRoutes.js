import express from 'express';
import calendarController from '../calendarController.js';

const router = express.Router();


// Calendar Event Routes
router.post('/calendarEvents', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }

    try {
        const eventInput = {
            ...req.body,
            createdBy: req.session.userId
        };
        console.log('Creating calendar event with data:', eventInput);
        const event = calendarController.createCalendarEvent(eventInput);
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating calendar event:', error);
        res.status(400).send(error.message);
    }
});

router.get('/calendarEvents', (req, res) => {
    const events = calendarController.getAllCalendarEventsForUser(req.session.userId);
    res.json(events);
});

router.get('/calendarEvents/member', (req, res) => {
    const events = calendarController.getAllCalendarEventsForMember(req.session.userId);
    res.json(events);
});

router.get('/calendarEvents/:id/', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }

    const event = calendarController.getCalendarEvent(req.params.id, req.session.userId);
    event ? res.json(event) : res.status(404).send('Event not found');
});

router.put('/calendarEvents/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }

    const eventInput = {
        ...req.body,
        createdBy: req.session.userId
    };

    const event = calendarController.updateCalendarEvent(req.params.id, eventInput, req.session.userId);
    if (!event) return res.status(404).send('Event not found');
    res.status(200).json(event);
});

router.delete('/calendarEvents/:id', (req, res) => {
    if (!req.session.userId) {
        return res.status(401).send('Not authenticated');
    }

    const event = calendarController.deleteCalendarEvent(req.params.id, req.session.userId);
    if (!event) return res.status(404).send('Event not found');
    res.status(200).json(event);
});

export default router;