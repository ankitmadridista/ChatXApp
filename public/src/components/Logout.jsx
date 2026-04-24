import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BiPowerOff } from 'react-icons/bi';

const Logout = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <Button onClick={handleClick} title="Logout">
            <BiPowerOff />
        </Button>
    );
};

export default Logout;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    background-color: transparent;
    border: 1px solid #ffffff25;
    cursor: pointer;
    color: #ffffff80;
    transition: background-color 0.2s, color 0.2s, border-color 0.2s;

    svg {
        font-size: 1.1rem;
    }

    &:hover {
        background-color: #ff4d4d20;
        border-color: #ff4d4d60;
        color: #ff6b6b;
    }
`;
