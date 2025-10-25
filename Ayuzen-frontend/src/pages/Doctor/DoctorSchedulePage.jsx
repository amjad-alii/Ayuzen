import React, { useEffect, useState } from 'react';
import {
    getAvailabilityRulesApi,
    setAvailabilityRulesApi,
    getTimeBlocksApi,
    addTimeBlockApi,
    deleteTimeBlockApi
} from '../../services/doctorAvailabilityService';
import WeeklyScheduleEditor from './WeeklyScheduleEditor'; 
import TimeBlockManager from './TimeBlockManager';       
import './DoctorSchedulePage.css';

const DoctorSchedulePage = () => {
    const [rules, setRules] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch both rules and blocks concurrently
            const [rulesData, blocksData] = await Promise.all([
                getAvailabilityRulesApi(),
                getTimeBlocksApi()
            ]);
            setRules(rulesData);
            setBlocks(blocksData);
        } catch (err) {
            setError('Failed to load schedule data. Please ensure the backend is running.');
            console.error("Fetch schedule data error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveRules = async (updatedRules) => {
        try {
            // Send the updated rules to the backend
            const savedRules = await setAvailabilityRulesApi(updatedRules);
            setRules(savedRules); // Update local state with the saved (potentially ID'd) rules
            alert('Weekly schedule updated successfully!');
        } catch (err) {
            alert('Failed to save weekly schedule.');
            console.error("Save rules error:", err);
        }
    };

    const handleAddTimeBlock = async (newBlock) => {
        try {
            // Send the new block to the backend
            const addedBlock = await addTimeBlockApi(newBlock);
            setBlocks(prev => [...prev, addedBlock]); // Add the newly created block (with ID) to local state
        } catch (err) {
            alert('Failed to add time block.');
            console.error("Add block error:", err);
        }
    };

    const handleDeleteTimeBlock = async (blockId) => {
         if (!window.confirm("Are you sure you want to remove this time block?")) return;
        try {
            // Tell the backend to delete the block
            await deleteTimeBlockApi(blockId);
            setBlocks(prev => prev.filter(b => b.id !== blockId)); // Remove the block from local state
        } catch (err) {
            alert('Failed to delete time block.');
            console.error("Delete block error:", err);
        }
    };

    if (isLoading) return <h2>Loading Your Schedule Settings...</h2>;
    if (error) return <h2 className="error-message">{error}</h2>;

    return (
        <div className="doctor-schedule-page">
            <h1>Manage Your Availability</h1>

            <section className="schedule-section">
                <h2>Standard Weekly Schedule</h2>
                <p>Set your recurring weekly working hours. These hours will be available for booking unless overridden by a specific time block below.</p>
                {/* Render the actual Weekly Schedule Editor */}
                <WeeklyScheduleEditor rules={rules} onSave={handleSaveRules} />
            </section>

            <section className="schedule-section">
                <h2>Time Blocks (Unavailable Times)</h2>
                <p>Add specific dates and times when you are unavailable (e.g., vacations, meetings, breaks). These will override your standard weekly schedule.</p>
                {/* Render the actual Time Block Manager */}
                <TimeBlockManager blocks={blocks} onAdd={handleAddTimeBlock} onDelete={handleDeleteTimeBlock} />
            </section>
        </div>
    );
};

export default DoctorSchedulePage;