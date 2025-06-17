import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { forgotPassword } from '../../api/auth';
import './ForgotPassword.css'; // Assuming you have a CSS file for styling

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const history = useHistory();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const response = await forgotPassword({ email });
            setMessage(response.data.message);
            setTimeout(() => {
                history.push('/login'); // Redirect to login after success
            }, 3000);
        } catch (err) {
            setError(err.response.data.message || 'An error occurred. Please try again.');
        }
    };

    return (
        <div className="forgot-password-container">
            <h2>Forgot Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ForgotPassword;