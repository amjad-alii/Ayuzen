import React from 'react';
import './OtpInput.css';

const OtpInput = ({ value, onChange }) => {
  return (
    <div className="otp-container">
      <label htmlFor="otp">Enter OTP</label>
      <input
        id="otp"
        type="text"
        value={value}
        onChange={onChange}
        className="otp-input"
        maxLength="6"
        placeholder="------"
      />
    </div>
  );
};

export default OtpInput;