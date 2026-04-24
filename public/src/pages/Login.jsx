import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';
import ThemeToggle from '../components/ThemeToggle';
import { loginRoute } from '../utils/APIRoutes';

function Login() {
    const [values, setValues] = useState({ username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toastOptions = {
        position: 'bottom-right',
        autoClose: 5000,
        pauseOnHover: true,
        draggable: false,
        theme: 'dark',
    };

    useEffect(() => {
        if (localStorage.getItem('chattiq-user')) navigate('/');
    }, [navigate]);

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password } = values;
        if (!username || !password) {
            toast.error('Username and password are required', toastOptions);
            return;
        }
        setLoading(true);
        try {
            const { data } = await axios.post(loginRoute, { username, password });
            if (!data.status) {
                toast.error(data.msg, toastOptions);
            } else {
                localStorage.setItem('chattiq-user', JSON.stringify(data.user));
                navigate('/');
            }
        } catch {
            toast.error('Something went wrong. Please try again.', toastOptions);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Page>
            <TopBar>
                <ThemeToggle />
            </TopBar>
            <Card>
                <div className="brand">
                    <img src={Logo} alt="Chattiq" />
                    <h1>Chattiq</h1>
                </div>
                <p className="subtitle">Welcome back</p>
                <form onSubmit={handleSubmit}>
                    <div className="field">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            value={values.username}
                            onChange={handleChange}
                            autoComplete="username"
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={values.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
                <span>
                    Don't have an account? <Link to="/register">Register</Link>
                </span>
            </Card>
            <ToastContainer />
        </Page>
    );
}

export default Login;

const Page = styled.div`
    min-height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-page);
    padding: 1rem;
    position: relative;
    transition: background 0.2s;
`;

const TopBar = styled.div`
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 100;
`;

const Card = styled.div`
    background: var(--bg-card);
    backdrop-filter: blur(12px);
    border: 1px solid var(--border);
    border-radius: 1.25rem;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    box-shadow: var(--shadow-app);
    transition: background 0.2s, border-color 0.2s;

    .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        justify-content: center;

        img { height: 2.5rem; }

        h1 {
            color: var(--text-primary);
            font-size: 1.6rem;
            font-weight: 700;
            letter-spacing: 0.05em;
            text-transform: uppercase;
        }
    }

    .subtitle {
        text-align: center;
        color: var(--text-muted);
        font-size: 0.9rem;
        margin-top: -0.5rem;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .field {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        label {
            color: var(--text-label);
            font-size: 0.8rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        input {
            background: var(--bg-field);
            border: 1px solid var(--border-field);
            border-radius: 0.6rem;
            padding: 0.75rem 1rem;
            color: var(--text-primary);
            font-size: 0.95rem;
            transition: border-color 0.2s, background 0.2s;
            width: 100%;

            &::placeholder { color: var(--text-muted); }

            &:focus {
                outline: none;
                border-color: var(--border-field-focus);
                background: var(--bg-field-focus);
            }
        }
    }

    button[type='submit'] {
        margin-top: 0.5rem;
        background: var(--accent-btn);
        color: white;
        padding: 0.85rem;
        border: none;
        border-radius: 0.6rem;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        transition: opacity 0.2s, transform 0.1s;
        text-transform: uppercase;
        letter-spacing: 0.05em;

        &:hover:not(:disabled) { opacity: 0.9; transform: translateY(-1px); }
        &:disabled { opacity: 0.6; cursor: not-allowed; }
    }

    span {
        text-align: center;
        color: var(--text-muted);
        font-size: 0.85rem;

        a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
            &:hover { text-decoration: underline; }
        }
    }
`;
