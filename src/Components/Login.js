import React, { useState } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const Login = () => {

    const [name, setName] = useState('');
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <style>
                {`
                    .login-container {
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: linear-gradient(45deg,cyan,brown,pink);
                        background-size: cover;
                        background-position: center;
                    }
                    .login-box {
                        padding: 2rem;
                        border-radius: 15px;
                        background-color: rgba(255, 255, 255, 0.15);
                        backdrop-filter: blur(10px);
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                        width: 100%;
                        max-width: 400px;
                    }
                    .login-title {
                        text-align: center;
                        color: white;
                        margin-bottom: 2rem;
                    }
                    .login-form {
                        display: flex;
                        flex-direction: column;
                        gap: 1rem;
                    }
                    .login-input {
                        padding: 0.75rem;
                        border-radius: 8px;
                        border: 1px solid rgba(255, 255, 255, 0.3);
                        background-color: rgba(255, 255, 255, 0.1);
                        color: white;
                        outline: none;
                    }
                    .login-input::placeholder {
                        color: white;
                    }
                    .login-button {
                        padding: 0.75rem;
                        border-radius: 8px;
                        border: none;
                        background-color: #4CAF50;
                        color: white;
                        cursor: pointer;
                        transition: background-color 0.3s;
                        font-weight: bold;
                    }
                    .login-button:hover {
                        background-color: #45a049;
                    }
                `}
            </style>
            <div className="login-box">
                <h2 className="login-title">Cows and Bulls</h2>
                <div className="login-form">
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="login-input"
                    />
                    <button
                        className="login-button"
                        onClick={async () => {
                            try {
                                if (!name.trim()) {
                                    alert('Please enter your name');
                                    return;
                                }
                                const response = await api.get(`/player/${name}`);
                                navigate('/dashboard', { state: { response: response.data } });
                            } catch (error) {
                                console.error('Error :', error);
                            }
                        }}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Login;