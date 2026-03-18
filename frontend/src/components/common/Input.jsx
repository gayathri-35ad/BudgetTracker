import React from 'react';
import './Input.css';

const Input = ({ label, error, ...props }) => {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input className={`form-input ${error ? 'is-invalid' : ''}`} {...props} />
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Input;
