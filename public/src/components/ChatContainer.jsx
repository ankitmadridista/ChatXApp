import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { getAllMessagesRoute, sendMessageRoute } from '../utils/APIRoutes';
import ChatInput from './ChatInput';
import Logout from './Logout';
import ThemeToggle from './ThemeToggle';
import { v4 as uuidv4 } from 'uuid';
import { IoArrowBack } from 'react-icons/io5';

const ChatContainer = ({ currentChat, currentUser, socket, onBack }) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const messagesEndRef = useRef();

    // Fetch message history when chat changes
    useEffect(() => {
        if (!currentChat || !currentUser) return;
        const fetchMessages = async () => {
            const response = await axios.post(getAllMessagesRoute, {
                from: currentUser._id,
                to: currentChat._id,
            });
            setMessages(response.data);
        };
        fetchMessages();
    }, [currentChat, currentUser]);

    const handleSendMessage = async (msg) => {
        // Optimistic update
        setMessages((prev) => [...prev, { fromSelf: true, message: msg }]);
        await axios.post(sendMessageRoute, {
            from: currentUser?._id,
            to: currentChat._id,
            message: msg,
        });
        if (socket?.current) {
            socket.current.emit('send-msg', {
                to: currentChat._id,
                from: currentUser._id,
                msg,
            });
        }
    };

    // BUG FIX: only accept incoming messages from the currently open chat
    useEffect(() => {
        if (!socket?.current) return;
        const socketInstance = socket.current;

        const handler = (data) => {
            if (data.from === currentChat?._id) {
                setArrivalMessage({ fromSelf: false, message: data.msg });
            }
        };

        socketInstance.on('msg-recieve', handler);

        return () => {
            socketInstance.off('msg-recieve', handler);
        };
    }, [socket, currentChat]);

    useEffect(() => {
        if (arrivalMessage) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <Container>
            <div className="chat-header">
                <div className="user-details">
                    <button className="back-btn" onClick={onBack} aria-label="Back">
                        <IoArrowBack />
                    </button>
                    <div className="avatar">
                        {currentChat?.avatarImage ? (
                            <img src={`data:image/svg+xml;base64,${currentChat.avatarImage}`} alt={currentChat.username} />
                        ) : (
                            <div className="avatar-placeholder">{currentChat?.username?.[0]?.toUpperCase()}</div>
                        )}
                    </div>
                    <div className="username">
                        <h3>{currentChat?.username}</h3>
                        <span className="status">● Online</span>
                    </div>
                </div>
                <div className="header-actions">
                    <ThemeToggle />
                    <Logout />
                </div>
            </div>

            <div className="chat-messages">
                {messages.length === 0 && (
                    <div className="empty-state">
                        <p>No messages yet. Say hello! 👋</p>
                    </div>
                )}
                {messages.map((msg) => (
                    <div key={uuidv4()} className={`message-row ${msg.fromSelf ? 'sended' : 'received'}`}>
                        <div className="bubble">
                            <p>{msg.message}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <ChatInput handleSendMessage={handleSendMessage} />
        </Container>
    );
};

export default ChatContainer;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    background: var(--bg-app);
    transition: background 0.2s;

    .chat-header {
        flex-shrink: 0;
        height: 64px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 1.25rem;
        background: var(--bg-header);
        border-bottom: 1px solid var(--border);
        transition: background 0.2s, border-color 0.2s;

        .user-details {
            display: flex;
            align-items: center;
            gap: 0.75rem;

            .back-btn {
                display: none;
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 1.25rem;
                cursor: pointer;
                padding: 0.25rem;
                border-radius: 50%;
                transition: background 0.15s;
                &:hover { background: var(--bg-contact-hover); }
                @media screen and (max-width: 768px) { display: flex; align-items: center; }
            }

            .avatar {
                img, .avatar-placeholder {
                    height: 2.6rem;
                    width: 2.6rem;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--border-sel);
                }
                .avatar-placeholder {
                    background: var(--accent-gradient);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 700;
                    font-size: 1rem;
                }
            }

            .username {
                h3 { color: var(--text-primary); font-size: 0.95rem; font-weight: 600; margin: 0; line-height: 1.2; }
                .status { font-size: 0.7rem; color: var(--online); letter-spacing: 0.02em; }
            }
        }

        .header-actions {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
    }

    .chat-messages {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1.25rem 1.5rem;
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-track { background: transparent; }
        &::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

        .empty-state {
            flex: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            p { color: var(--text-muted); font-size: 0.9rem; }
        }

        .message-row {
            display: flex;

            .bubble {
                max-width: 58%;
                overflow-wrap: break-word;
                word-break: break-word;
                padding: 0.6rem 0.95rem;
                font-size: 0.92rem;
                line-height: 1.5;
                border-radius: 1.1rem;
                p { margin: 0; }
                @media screen and (max-width: 768px) { max-width: 78%; }
            }
        }

        .sended {
            justify-content: flex-end;
            .bubble {
                background: var(--bg-bubble-self);
                color: var(--text-bubble-self);
                border-bottom-right-radius: 4px;
                box-shadow: 0 2px 8px rgba(91,33,182,0.25);
            }
        }

        .received {
            justify-content: flex-start;
            .bubble {
                background: var(--bg-bubble-other);
                color: var(--text-bubble-other);
                border-bottom-left-radius: 4px;
                border: 1px solid var(--border);
            }
        }
    }
`;
