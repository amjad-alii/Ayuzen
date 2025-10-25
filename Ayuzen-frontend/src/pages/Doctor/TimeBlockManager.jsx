import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Ensure this is imported
import './TimeBlockManager.css';

const TimeBlockManager = ({ blocks, onAdd, onDelete }) => {
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [reason, setReason] = useState('');

    const handleAddBlock = (e) => {
        e.preventDefault();
        if (endTime <= startTime) {
            alert("End time must be after start time.");
            return;
        }
        const newBlock = {
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            reason: reason,
        };
        onAdd(newBlock);
        // Reset form
        setReason('');
    };

    return (
        <div className="time-block-manager">
            {/* Form to add new blocks */}
            <form onSubmit={handleAddBlock} className="add-block-form">
                <h4>Add Unavailability</h4>
                <div className="form-row">
                    <div className="date-picker-group">
                        <label>Start Time</label>
                        <DatePicker
                            selected={startTime}
                            onChange={(date) => setStartTime(date)}
                            showTimeSelect
                            dateFormat="Pp" // Format like "10/25/2025, 10:30 AM"
                            timeIntervals={30}
                            required
                        />
                    </div>
                    <div className="date-picker-group">
                        <label>End Time</label>
                        <DatePicker
                            selected={endTime}
                            onChange={(date) => setEndTime(date)}
                            showTimeSelect
                            dateFormat="Pp"
                            timeIntervals={30}
                            required
                        />
                    </div>
                </div>
                 <div className="form-row reason-row">
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Reason (optional, e.g., Vacation)"
                    />
                    <button type="submit" className="add-block-btn">Add Block</button>
                 </div>
            </form>

            {/* List of existing blocks */}
            <div className="existing-blocks">
                <h4>Current Time Blocks</h4>
                {blocks.length === 0 ? (
                    <p>No specific time blocks scheduled.</p>
                ) : (
                    <ul>
                        {blocks.map(block => (
                            <li key={block.id}>
                                <span className="block-time">
                                    {new Date(block.startTime).toLocaleString()} - {new Date(block.endTime).toLocaleString()}
                                </span>
                                <span className="block-reason">{block.reason}</span>
                                <button onClick={() => onDelete(block.id)} className="delete-block-btn">
                                    &times; {/* Simple delete icon */}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default TimeBlockManager;