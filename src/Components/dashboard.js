import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from './api';

const Dashboard = () => {
    const navigate = useNavigate();

    const location = useLocation();
    const playerId = location.state?.response;

    const [room, setRoom] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [showJoinPopup, setShowJoinPopup] = useState(false);

    // Create refs for join room inputs
    const joinRoomRefs = [
        useRef(null),
        useRef(null),
        useRef(null),
        useRef(null)
    ];

    console.log(`Player Id: ${playerId}`);

    const renderRoomDetails = (room) => {
        return (
            <div className="room-details">
                <p className="room-id">Room ID: {room.id}</p>
                {console.log(room)}
                <style>
                    {`
                        .room-details {
                            background-color: rgba(255, 255, 255, 0.9);
                            padding: 2rem;
                            border-radius: 10px;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                            text-align: center;
                            margin: 1rem;
                        }
                        .room-id {
                            font-size: 1.5rem;
                            font-weight: bold;
                            color: #333;
                            margin: 0;
                            text-transform: uppercase;
                            letter-spacing: 1px;
                        }
                    `}
                </style>
            </div>
        );
    };

    return (
        <div className="dashboard-container">
            <style>
                {`
                    .dashboard-container {
                        height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 2rem;
                        background: linear-gradient(to right, black 50%, white 50%);
                        background-size: cover;
                        background-position: center;
                    }
                    .dashboard-button {
                        width: 250px;
                        height: 250px;
                        border: none;
                        border-radius: 15px;
                        font-size: 1.5rem;
                        font-weight: bold;
                        cursor: pointer;
                        transition: transform 0.3s, box-shadow 0.3s;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .dashboard-button:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
                    }
                    .create-button {
                        background-color: white;
                        color: black;
                        }
                    .create-button:hover {
                        background-color: #f5f5f5;
                    }
                    .join-button {
                        background-color: black;
                        color: white;
                        }
                    .join-button:hover {
                        background-color: #1a1a1a;
                    }
                `}
            </style>
            <div style={{ position: 'relative' }}>
                <button 
                    className="dashboard-button create-button"
                    onClick={async () => {
                        try {
                            const response = await api.get(`/create/${playerId}`);
                            const roomData = response.data;
                            setRoom(roomData); // Set room data first
                            setShowPopup(true);
                            
                            let attempts = 0;
                            const maxAttempts = 30;
                            let gameStarted = false;

                            // Use the roomData.id directly instead of accessing room state
                            while (!gameStarted && attempts < maxAttempts) {
                                const response = await api.get(`/startGame/${roomData.id}`);
                                await new Promise(resolve => setTimeout(resolve, 1000));
                                gameStarted = response.data;
                                console.log(gameStarted, attempts);
                                attempts++;
                            }

                            if (attempts >= maxAttempts) {
                                alert("Timeout waiting for other player to join. Please try again.");
                                return;
                            }

                            navigate('/home', { state: { roomId: roomData.id, player: 1 } });
                        } catch (error) {
                            console.error('Error creating room:', error);
                        }
                    }}
                >
                    Create Room
                </button>
                {showPopup && (
                    <div style={{
                        position: 'absolute',
                        left: '-350px', // Increased space between button and popup
                        top: '0',
                        width: '250px',
                        height: '250px',
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        animation: 'fadeIn 0.3s ease-in'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Room Created!</h3>
                        <p style={{ fontSize: '1.2rem', color: '#666' }}>Room Details:</p>
                        {room && renderRoomDetails(room)}
                    </div>
                )}
            </div>
            <div style={{ position: 'relative' }}>
                <button 
                    className="dashboard-button join-button"
                    onClick={() => setShowJoinPopup(true)}
                >
                    Join Room
                </button>
                {showJoinPopup && (
                    <div style={{
                        position: 'absolute',
                        right: '-350px',
                        top: '0',
                        width: '250px',
                        height: '250px',
                        backgroundColor: 'black',
                        borderRadius: '15px',
                        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '20px',
                        animation: 'fadeIn 0.3s ease-in'
                    }}>
                        <h3 style={{ margin: '0 0 20px 0', color: 'white' }}>Join Room</h3>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                            {joinRoomRefs.map((ref, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        textAlign: 'center',
                                        fontSize: '1.2rem',
                                        borderRadius: '8px',
                                        border: '1px solid white',
                                        backgroundColor: 'transparent',
                                        color: 'white'
                                    }}
                                    ref={ref}
                                    onChange={(e) => {
                                        if (e.target.value.length === 1 && index < 3) {
                                            joinRoomRefs[index + 1].current.focus();
                                        }
                                        if (e.target.value.length === 1 && index === 3) {
                                            const roomCode = joinRoomRefs.map(ref => ref.current.value).join('');
                                            api.get(`/join/${playerId}/${roomCode}`)
                                                .then(response => {
                                                    navigate('/home', { state: { roomId: roomCode, player: 2 } });
                                                })
                                                .catch(error => {
                                                    console.error('Error joining room:', error);
                                                });
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
