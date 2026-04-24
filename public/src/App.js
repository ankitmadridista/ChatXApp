import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import SetAvatar from './pages/SetAvatar';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    static getDerivedStateFromError() {
        return { hasError: true };
    }
    componentDidCatch(error, info) {
        console.error('Error occurred:', error, info);
    }
    render() {
        if (this.state.hasError) {
            return <h1 style={{ color: 'white', textAlign: 'center', marginTop: '2rem' }}>Something went wrong. Please refresh.</h1>;
        }
        return this.props.children;
    }
}

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <ErrorBoundary>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/setAvatar" element={<SetAvatar />} />
                        <Route path="/" element={<Chat />} />
                    </Routes>
                </ErrorBoundary>
                <ToastContainer />
            </BrowserRouter>
        </ThemeProvider>
    );
}
