import React from 'react';
import { BsSunFill, BsMoonFill } from 'react-icons/bs';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <Button onClick={toggleTheme} title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} aria-label="Toggle theme">
            {isDark ? <BsSunFill /> : <BsMoonFill />}
        </Button>
    );
};

export default ThemeToggle;

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: transparent;
    color: var(--text-secondary);
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
    flex-shrink: 0;

    svg { font-size: 0.95rem; }

    &:hover {
        background: var(--hover-bg);
        color: var(--text-primary);
        border-color: var(--accent);
    }
`;
