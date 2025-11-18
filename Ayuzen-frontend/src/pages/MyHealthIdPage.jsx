import React, { useState, useEffect } from 'react';
import { initiateAbhaCreationApi, verifyAbhaOtpApi, getAbhaStatusApi } from '../services/abdmService';
import './MyHealthIdPage.css'; // We'll create this CSS file

const MyHealthIdPage = () => {
    const [abhaDetails, setAbhaDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    // Flow State
    const [step, setStep] = useState('CHECK_STATUS'); // 'CHECK_STATUS', 'INPUT_MOBILE', 'INPUT_OTP', 'SUCCESS'
    
    // Form Data
    const [mobileNumber, setMobileNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [transactionId, setTransactionId] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        fetchStatus();
    }, []);

    const fetchStatus = async () => {
        setIsLoading(true);
        try {
            const data = await getAbhaStatusApi();
            if (data && data.abhaNumber) {
                setAbhaDetails(data);
            }
        } catch (err) {
            // If 404 or empty, it just means no ABHA linked yet
            console.log("No ABHA linked yet or failed to fetch status.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleInitiate = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const txnId = await initiateAbhaCreationApi(mobileNumber);
            setTransactionId(txnId);
            setStep('INPUT_OTP');
        } catch (err) {
            setError('Failed to send OTP. Please check the number and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const newAbha = await verifyAbhaOtpApi(transactionId, otp);
            setAbhaDetails(newAbha);
            setStep('SUCCESS');
        } catch (err) {
            setError('Invalid OTP or verification failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="abha-page-container"><h2>Loading Health ID details...</h2></div>;

    return (
        <div className="abha-page-container">
            <div className="abha-header">
                <img 
                    src="https://cdn.jsdelivr.net/gh/AmjadAli9/assets/abha-logo.png" 
                    alt="ABHA Logo" 
                    className="abha-logo" 
                    onError={(e) => e.target.style.display = 'none'} // Hide if logo missing
                />
                <h1>My Health ID (ABHA)</h1>
            </div>

            {abhaDetails ? (
                /* --- VIEW 1: ABHA ALREADY LINKED --- */
                <div className="abha-card">
                    <div className="abha-card-header">
                        <span className="verified-badge">✔ Verified</span>
                    </div>
                    <div className="abha-card-content">
                        <div className="abha-field">
                            <label>ABHA Number</label>
                            <p>{abhaDetails.abhaNumber}</p>
                        </div>
                        <div className="abha-field">
                            <label>ABHA Address</label>
                            <p>{abhaDetails.abhaAddress}</p>
                        </div>
                        <div className="abha-field">
                            <label>Name</label>
                            <p>{abhaDetails.fullName || "User"}</p>
                        </div>
                    </div>
                    <div className="abha-card-footer">
                        <p>Your health records are now linked to the National Digital Health Ecosystem.</p>
                    </div>
                </div>
            ) : (
                /* --- VIEW 2: CREATE / LINK FLOW --- */
                <div className="create-abha-container">
                    {step === 'CHECK_STATUS' && (
                         <div className="intro-step">
                            <p>Create or link your Ayushman Bharat Health Account (ABHA) to manage your digital health records securely.</p>
                            <button className="btn-primary" onClick={() => setStep('INPUT_MOBILE')}>
                                Create / Link ABHA ID
                            </button>
                         </div>
                    )}

                    {step === 'INPUT_MOBILE' && (
                        <form onSubmit={handleInitiate} className="step-form">
                            <h3>Step 1: Enter Mobile Number</h3>
                            <p className="step-desc">We will send an OTP to verify your identity.</p>
                            {error && <p className="error-message">{error}</p>}
                            
                            <input 
                                type="tel" 
                                placeholder="Enter Mobile Number" 
                                value={mobileNumber} 
                                onChange={(e) => setMobileNumber(e.target.value)}
                                required 
                                maxLength="10"
                            />
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setStep('CHECK_STATUS')}>Cancel</button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Sending...' : 'Send OTP'}
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 'INPUT_OTP' && (
                        <form onSubmit={handleVerify} className="step-form">
                            <h3>Step 2: Verify OTP</h3>
                            <p className="step-desc">Enter the OTP sent to {mobileNumber}</p>
                            {error && <p className="error-message">{error}</p>}
                            
                            <input 
                                type="text" 
                                placeholder="Enter 6-digit OTP" 
                                value={otp} 
                                onChange={(e) => setOtp(e.target.value)}
                                required 
                                maxLength="6"
                            />
                            <div className="form-actions">
                                <button type="button" className="btn-secondary" onClick={() => setStep('INPUT_MOBILE')}>Back</button>
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Verifying...' : 'Verify & Link'}
                                </button>
                            </div>
                        </form>
                    )}
                    
                    {step === 'SUCCESS' && (
                        <div className="success-message">
                            <h3>🎉 Success!</h3>
                            <p>Your ABHA ID has been successfully linked to your Ayuzen account.</p>
                            <button className="btn-primary" onClick={() => setAbhaDetails({})}>View My Card</button> 
                            {/* Note: The onClick above is a trick to trigger re-render, ideally fetchStatus() again */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MyHealthIdPage;