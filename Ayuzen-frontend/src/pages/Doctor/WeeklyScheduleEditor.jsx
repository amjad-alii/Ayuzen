import React, { useState, useEffect } from 'react';
import './WeeklyScheduleEditor.css';

const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const WeeklyScheduleEditor = ({ rules, onSave }) => {
    // Initialize state for each day, checking if a rule exists for it
    const [schedule, setSchedule] = useState(() => {
        const initialState = {};
        daysOfWeek.forEach(day => {
            const rule = rules.find(r => r.dayOfWeek === day);
            initialState[day] = {
                enabled: !!rule,
                startTime: rule?.startTime || '09:00',
                endTime: rule?.endTime || '17:00',
            };
        });
        return initialState;
    });

    const handleCheckboxChange = (day) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], enabled: !prev[day].enabled }
        }));
    };

    const handleTimeChange = (day, field, value) => {
        setSchedule(prev => ({
            ...prev,
            [day]: { ...prev[day], [field]: value }
        }));
    };

    const handleSaveChanges = () => {
        // Convert the state back into the format the API expects
        const updatedRules = daysOfWeek
            .filter(day => schedule[day].enabled)
            .map(day => ({
                dayOfWeek: day,
                startTime: schedule[day].startTime,
                endTime: schedule[day].endTime,
            }));
        onSave(updatedRules);
    };

    return (
        <div className="weekly-schedule-editor">
            {daysOfWeek.map(day => (
                <div key={day} className={`day-row ${schedule[day].enabled ? '' : 'disabled'}`}>
                    <div className="day-label">
                        <input
                            type="checkbox"
                            checked={schedule[day].enabled}
                            onChange={() => handleCheckboxChange(day)}
                            id={`check-${day}`}
                        />
                        <label htmlFor={`check-${day}`}>{day.charAt(0) + day.slice(1).toLowerCase()}</label>
                    </div>
                    <div className="time-inputs">
                        <input
                            type="time"
                            value={schedule[day].startTime}
                            onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                            disabled={!schedule[day].enabled}
                        />
                        <span>to</span>
                        <input
                            type="time"
                            value={schedule[day].endTime}
                            onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                            disabled={!schedule[day].enabled}
                        />
                    </div>
                </div>
            ))}
            <button onClick={handleSaveChanges} className="save-schedule-btn">
                Save Weekly Schedule
            </button>
        </div>
    );
};

export default WeeklyScheduleEditor;