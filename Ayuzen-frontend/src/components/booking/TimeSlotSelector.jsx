import React, { useState } from 'react';
import './TimeSlotSelector.css';

// Mock function to generate time slots for a given day
const generateTimeSlots = () => {
  return ["10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "04:00 PM", "04:30 PM", "05:00 PM"];
};

const TimeSlotSelector = ({ onSlotSelect }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(null);
  const timeSlots = generateTimeSlots();

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    onSlotSelect({ date: selectedDate, time }); // Pass selection to parent
  };

  return (
    <div className="slot-selector-container">
      <h4>Select a Time Slot</h4>
      <div className="date-selector">
        {/* In a real app, this would be a full calendar. For now, a placeholder. */}
        <p>Date: <strong>{selectedDate.toLocaleDateString()}</strong></p>
      </div>
      <div className="time-grid">
        {timeSlots.map((time) => (
          <button
            key={time}
            className={`time-slot ${selectedTime === time ? 'selected' : ''}`}
            onClick={() => handleTimeSelect(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimeSlotSelector;