import Picker from 'emoji-picker-react';
import React, { useState } from 'react';
import { BsEmojiSmileFill } from 'react-icons/bs';
import { IoMdSend } from 'react-icons/io';
import styled from 'styled-components';

export default function ChatInput({ handleSendMessage }) {
    const [msg, setMsg] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        setMsg((prev) => prev + emojiObject.emoji);
    };

    const sendChat = (event) => {
        event.preventDefault();
        if (msg.trim().length > 0) {
            handleSendMessage(msg.trim());
            setMsg('');
            setShowEmojiPicker(false);
        }
    };

    return (
        <Container>
            <div className="button-container">
                <div className="emoji">
                    <BsEmojiSmileFill onClick={() => setShowEmojiPicker((v) => !v)} />
                    {showEmojiPicker && (
                        <div className="emoji-picker-wrapper">
                            <Picker onEmojiClick={handleEmojiClick} theme="dark" />
                        </div>
                    )}
                </div>
            </div>
            <form className="input-container" onSubmit={sendChat}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    onChange={(e) => setMsg(e.target.value)}
                    value={msg}
                    autoComplete="off"
                />
                <button type="submit" disabled={msg.trim().length === 0}>
                    <IoMdSend />
                </button>
            </form>
        </Container>
    );
}

const Container = styled.div`
    flex-shrink: 0;
    display: grid;
    align-items: center;
    grid-template-columns: 44px 1fr;
    gap: 0.4rem;
    background: var(--bg-input);
    padding: 0.6rem 1rem;
    border-top: 1px solid var(--border);
    transition: background 0.2s, border-color 0.2s;

    @media screen and (max-width: 480px) {
        grid-template-columns: 40px 1fr;
        padding: 0.5rem;
    }

    .button-container {
        display: flex;
        align-items: center;
        justify-content: center;

        .emoji {
            position: relative;
            svg {
                font-size: 1.4rem;
                color: #ffdd57;
                cursor: pointer;
                transition: transform 0.2s;
                &:hover { transform: scale(1.15); }
            }
            .emoji-picker-wrapper {
                position: absolute;
                bottom: 3rem;
                left: 0;
                z-index: 200;
                border-radius: 0.75rem;
                overflow: hidden;
                box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            }
        }
    }

    .input-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--bg-field);
        border-radius: 2rem;
        padding: 0.35rem 0.35rem 0.35rem 1rem;
        border: 1px solid var(--border-field);
        transition: border-color 0.2s, background 0.2s;

        &:focus-within { border-color: var(--border-field-focus); }

        input {
            flex: 1;
            background: transparent;
            color: var(--text-primary);
            border: none;
            font-size: 0.95rem;
            outline: none;
            min-width: 0;
            &::placeholder { color: var(--text-muted); }
            &::selection { background: var(--accent); }
        }

        button {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 2.2rem;
            height: 2.2rem;
            border-radius: 50%;
            background: var(--accent-btn);
            border: none;
            cursor: pointer;
            transition: opacity 0.2s, transform 0.15s;
            flex-shrink: 0;

            &:disabled { opacity: 0.35; cursor: not-allowed; }
            &:not(:disabled):hover { transform: scale(1.08); }

            svg { font-size: 1.05rem; color: white; }
        }
    }
`;
