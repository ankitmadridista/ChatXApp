import React from 'react';
import styled from 'styled-components';
import robot from '../assets/robot.gif';

const Welcome = ({ currentUser }) => {
    return (
        <Container>
            <img src={robot} alt="Welcome" />
            <h1>Hey, <span>{currentUser?.username}!</span></h1>
            <p>Select a contact to start chatting</p>
        </Container>
    );
};

export default Welcome;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: 1.5rem;
    background: var(--bg-app);
    color: var(--text-primary);
    height: 100%;
    transition: background 0.2s;

    img {
        height: 12rem;
        opacity: 0.8;
        @media screen and (max-width: 768px) { height: 8rem; }
    }

    h1 {
        font-size: 1.5rem;
        font-weight: 600;
        span { color: var(--accent); }
        @media screen and (max-width: 768px) { font-size: 1.1rem; }
    }

    p { color: var(--text-muted); font-size: 0.9rem; }
`;
