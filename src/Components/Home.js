import React, { useRef, useState } from "react";
import api from "./api";
import { useLocation } from "react-router-dom";

const Home = () => {
    const location = useLocation();
    const { roomId, player } = location.state;

    
    const player1Refs = [useRef(), useRef(), useRef(), useRef()];
    const player2Refs = [useRef(), useRef(), useRef(), useRef()];

    const [player1CodeLocked, setPlayer1CodeLocked] = useState(false);
    const [showPassword, setShowPassword] = useState(true)

    const [guesses, setGuesses] = useState([]);
    const [results, setResults] = useState([]);

    const [guesses2, setGuesses2] = useState([]);
    const [results2, setResults2] = useState([]);

    const handleInput = (e, refs, index) => {
        if (e.target.value.length === 1 && index < 3) {
            refs[index + 1].current.focus();
        } else if (e.target.value.length === 0 && index > 0) {
            refs[index - 1].current.focus();
        }
    };

    const handleKeyPress = async (e) => {
        if (e.key === 'Enter') {
            const code = player1Refs.map(ref => ref.current.value).join('');
            if (code.length === 4) {
                setPlayer1CodeLocked(true);
                console.log(code);
                const response = await api.get(`/set/playersc/${roomId}/${player}/${code}`);
                console.log("set playersc"+response);
            }
        }
    };

    const handlePlayer2KeyPress = async (e) => {
        if (e.key === 'Enter') {
            const guess = player2Refs.map(ref => ref.current.value).join('');
            if (guess.length === 4) {
                try {
                    const res = await api.get(`guess/${roomId}/${player}/${guess}`);
                    const response = await api.get(`/check/${roomId}/${player}/${guess}`);
                    const response2 = await api.get(`/playerGuessResult/${roomId}/${player}`, {
                        headers: {
                            'Accept': 'application/json'
                        }
                    });
                   
                    if (response2.data && response2.data.guesses && response2.data.results) {
                        setGuesses2(response2.data.guesses);
                        setResults2(response2.data.results);
                    } else {
                        console.error('Invalid response data structure:', response2.data);
                    }

                    if(response.data==='4C0B') alert("You guessed it correctly🐮🏆");
                    setGuesses(prevGuesses => [...prevGuesses, guess]);
                    const formattedResult = response.data.split('').map((char, i) => {
                        if (i === 1) return '🐄  ';
                        if (i === 3) return '🐂 ';
                        return char;
                    }).join('');
                    setResults(prevResults => [...prevResults, formattedResult]);
                    
                    // Clear inputs
                    player2Refs.forEach(ref => {
                        ref.current.value = '';
                    });
                    player2Refs[0].current.focus(); // Set focus to first input after clearing
                } catch (error) {
                    console.error('Error making guess:', error);
                }
            }
        }
    };

    return (
        <div>
            <style>
                {`
                    .home-container {
                        height: 100vh;
                        background-color: black;
                        background-size: fit;
                        background-position: center;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .home-title {
                        color: white;
                        text-align: center;
                        font-size: 2.5rem;
                        margin: 2rem 0;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    }
                    .secret-codes-container {
                        display: flex;
                        justify-content: space-around;
                        width: 100%;
                        margin-bottom: 2rem;
                    }
                    .secret-code-wrapper {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }
                    .secret-code-label {
                        color: white;
                        font-size: 1.5rem;
                        margin-bottom: 1rem;
                        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
                    }
                    .secret-code-inputs {
                        display: flex;
                        gap: 1rem;
                    }
                    .secret-code-input {
                        width: 50px;
                        height: 50px;
                        text-align: center;
                        font-size: 1.5rem;
                        border: 2px solid white;
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                    }
                    .tables-container {
                        display: flex;
                        gap: 8rem;
                        padding: 3rem;
                        background-color: transparent;
                        border-radius: 10px;
                        height: 100%;
                        align-items: center;
                    }
                    .table-wrapper {
                        flex: 1;
                        padding: 2rem;
                    }
                    .table {
                        color: white !important;
                        margin: 0;
                        border: 2px solid white;
                        border-radius: 12px;
                        border-spacing: 0;
                        overflow: hidden;
                        background-color: transparent;
                        width: 100%;
                        min-width: 400px;
                    }
                    .table td, .table th {
                        text-align: center;
                        padding: 1.25rem;
                        border-right: 2px solid white;
                        font-size: 1.1rem;
                    }
                    .table td:last-child, .table th:last-child {
                        border-right: none;
                    }
                    th {
                        color: white;
                        border-bottom: 3px solid white !important;
                        font-size: 1.2rem;
                    }
                `}
            </style>
            <div className="home-container">
                <h1 className="home-title">Cows and Bulls</h1>
                <div className="secret-codes-container">
                    <div className="secret-code-wrapper">
                        <div className="secret-code-label">{`Your Secret Code`}</div>
                        <div className="secret-code-inputs" style={{ display: 'flex', alignItems: 'center' }}>
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    ref={player1Refs[index]}
                                    maxLength="1"
                                    className="secret-code-input"
                                    type={showPassword ? "text" : "password"}
                                    onChange={(e) => !player1CodeLocked && handleInput(e, player1Refs, index)}
                                    onKeyDown={handleKeyPress}
                                    disabled={player1CodeLocked}
                                />
                            ))}
                            <button 
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'white',
                                    cursor: 'pointer',
                                    marginLeft: '10px',
                                    fontSize: '1.2rem'
                                }}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    <div className="secret-code-wrapper">
                        <div className="secret-code-label">Opponent's Secret Code</div>
                        <div className="secret-code-inputs">
                            {[0, 1, 2, 3].map((index) => (
                                <input
                                    key={index}
                                    ref={player2Refs[index]}
                                    maxLength="1"
                                    className="secret-code-input"
                                    type="text"
                                    onChange={(e) => handleInput(e, player2Refs, index)}
                                    onKeyDown={handlePlayer2KeyPress}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <div className="tables-container">
                    <div className="table-wrapper" style={{ maxHeight: "calc(9 * 3.5rem + 3.5rem)", overflowY: "auto" }}>
                        <table className="table table-dark table-borderless">
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.8)" }}>
                                <tr>
                                    <th>Opponent's Guess</th>
                                    <th>Cows and Bulls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guesses2.map((guess, index) => (
                                    <tr key={index}>
                                        <td>{guess}</td>
                                        <td>{results2[index]}</td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
                    <div className="table-wrapper" style={{ maxHeight: "calc(9 * 3.5rem + 3.5rem)", overflowY: "auto" }}>
                        <table className="table table-dark table-borderless">
                            <thead style={{ position: "sticky", top: 0, backgroundColor: "rgba(0,0,0,0.8)" }}>
                                <tr>
                                    <th>Your Guess</th>
                                    <th>Cows and Bulls</th>
                                </tr>
                            </thead>
                            <tbody>
                                {guesses.map((guess, index) => (
                                    <tr key={index}>
                                        <td>{guess}</td>
                                        <td>{results[index]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;