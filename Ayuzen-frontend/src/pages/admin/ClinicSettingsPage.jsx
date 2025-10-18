import React, { useEffect, useState } from 'react';
import apiClient from '../../services/authService';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ClinicSettingsPage.css';

const ClinicSettingsPage = () => {
    const [settings, setSettings] = useState({ openingTime: '', closingTime: '', workingDays: '' });
    const [holidays, setHolidays] = useState([]);
    const [isLoadingSettings, setIsLoadingSettings] = useState(true);
    const [isLoadingHolidays, setIsLoadingHolidays] = useState(true);
    const [error, setError] = useState(null);

    // State for adding a new holiday
    const [newHolidayDate, setNewHolidayDate] = useState(new Date());
    const [newHolidayDescription, setNewHolidayDescription] = useState('');

    useEffect(() => {
        fetchSettings();
        fetchHolidays();
    }, []);

    const fetchSettings = async () => {
        setIsLoadingSettings(true);
        try {
            const response = await apiClient.get('/admin/settings');
            setSettings(response.data || { openingTime: '', closingTime: '', workingDays: '' });
        } catch (err) {
            setError('Failed to fetch clinic settings.');
        } finally {
            setIsLoadingSettings(false);
        }
    };

    const fetchHolidays = async () => {
        setIsLoadingHolidays(true);
        try {
            const response = await apiClient.get('/admin/settings/holidays');
            setHolidays(response.data);
        } catch (err) {
            setError('Failed to fetch holidays.');
        } finally {
            setIsLoadingHolidays(false);
        }
    };

    const handleSettingsChange = (e) => {
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleUpdateSettings = async (e) => {
        e.preventDefault();
        try {
            await apiClient.put('/admin/settings', settings);
            alert('Clinic settings updated successfully!');
        } catch (err) {
            alert('Failed to update settings.');
        }
    };

    const handleAddHoliday = async (e) => {
        e.preventDefault();
        const holidayData = {
            holidayDate: newHolidayDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            description: newHolidayDescription,
        };
        try {
            await apiClient.post('/admin/settings/holidays', holidayData);
            setNewHolidayDescription(''); // Clear form
            fetchHolidays(); // Refresh list
        } catch (err) {
            alert('Failed to add holiday.');
        }
    };

    const handleDeleteHoliday = async (id) => {
        if (window.confirm('Are you sure you want to delete this holiday?')) {
            try {
                await apiClient.delete(`/admin/settings/holidays/${id}`);
                fetchHolidays(); // Refresh list
            } catch (err) {
                alert('Failed to delete holiday.');
            }
        }
    };

    return (
        <div className="clinic-settings-page">
            <h1>Clinic Settings</h1>

            {error && <p className="error-message">{error}</p>}

            {/* Clinic Hours Section */}
            <section className="settings-section">
                <h2>Operating Hours</h2>
                {isLoadingSettings ? <p>Loading settings...</p> : (
                    <form onSubmit={handleUpdateSettings} className="settings-form">
                        <div className="form-group">
                            <label htmlFor="openingTime">Opening Time</label>
                            <input type="time" id="openingTime" name="openingTime" value={settings.openingTime || ''} onChange={handleSettingsChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="closingTime">Closing Time</label>
                            <input type="time" id="closingTime" name="closingTime" value={settings.closingTime || ''} onChange={handleSettingsChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="workingDays">Working Days (comma-separated)</label>
                            <input type="text" id="workingDays" name="workingDays" value={settings.workingDays || ''} onChange={handleSettingsChange} placeholder="e.g., Monday,Tuesday,Wednesday" />
                        </div>
                        <button type="submit" className="save-button">Save Hours</button>
                    </form>
                )}
            </section>

            {/* Holidays Section */}
            <section className="settings-section">
                <h2>Manage Holidays</h2>
                <form onSubmit={handleAddHoliday} className="add-holiday-form">
                    <DatePicker selected={newHolidayDate} onChange={(date) => setNewHolidayDate(date)} dateFormat="yyyy-MM-dd" />
                    <input type="text" value={newHolidayDescription} onChange={(e) => setNewHolidayDescription(e.target.value)} placeholder="Holiday description (e.g., Diwali)" required />
                    <button type="submit" className="add-button">Add Holiday</button>
                </form>

                <h3>Scheduled Holidays</h3>
                {isLoadingHolidays ? <p>Loading holidays...</p> : (
                    <ul className="holiday-list">
                        {holidays.map(holiday => (
                            <li key={holiday.id}>
                                <span>{holiday.holidayDate}: {holiday.description}</span>
                                <button onClick={() => handleDeleteHoliday(holiday.id)} className="delete-button">Delete</button>
                            </li>
                        ))}
                    </ul>
                )}
                {holidays.length === 0 && !isLoadingHolidays && <p>No holidays scheduled.</p>}
            </section>
        </div>
    );
};

export default ClinicSettingsPage;