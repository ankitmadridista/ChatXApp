import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import ChatContainer from '../components/ChatContainer';
import Contacts from '../components/Contacts';
import Welcome from '../components/Welcome';
import { allUsersRoute, host } from '../utils/APIRoutes';

function Chat() {
    const socket = useRef();
    const [contacts, setContacts] = useState([]);
    const [currentChat, setCurrentChat] = useState(undefined);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [isLoaded, setIsLoaded] = useState(false);
    const [showContacts, setShowContacts] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = localStorage.getItem('chattiq-user');
        if (!user) {
            navigate('/login');
        } else {
            setCurrentUser(JSON.parse(user));
            setIsLoaded(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (currentUser) {
            socket.current = io(host);
            socket.current.emit('add-user', currentUser._id);
        }
    }, [currentUser]);

    useEffect(() => {
        if (!currentUser) return;
        const fetchContacts = async () => {
            try {
                const { data } = await axios.get(`${allUsersRoute}/${currentUser._id}`);
                setContacts(data);
            } catch (err) {
                console.error('Error fetching contacts:', err);
            }
        };
        fetchContacts();
    }, [currentUser]);

    const handleChatChange = (chat) => {
        setCurrentChat(chat);
        setShowContacts(false); // on mobile, switch to chat view
    };

    const handleBack = () => {
        setShowContacts(true);
        setCurrentChat(undefined);
    };

    return (
        <Container>
            <div className={`layout ${showContacts ? 'show-contacts' : 'show-chat'}`}>
                <div className="contacts-panel">
                    <Contacts
                        contacts={contacts}
                        currentUser={currentUser}
                        changeChat={handleChatChange}
                    />
                </div>
                <div className="chat-panel">
                    {isLoaded && currentChat === undefined ? (
                        <Welcome currentUser={currentUser} />
                    ) : (
                        <ChatContainer
                            currentChat={currentChat}
                            currentUser={currentUser}
                            socket={socket}
                            onBack={handleBack}
                        />
                    )}
                </div>
            </div>
        </Container>
    );
}

export default Chat;

const Container = styled.div`
    height: 100vh;
    width: 100vw;
    background: var(--bg-page);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;

    .layout {
        height: 90vh;
        width: 90vw;
        max-width: 1400px;
        background-color: #0d0d2b;
        border-radius: 1rem;
        overflow: hidden;
        display: grid;
        grid-template-columns: 280px 1fr;
        box-shadow: var(--shadow-app);
        align-items: stretch;

        @media screen and (max-width: 1024px) {
            grid-template-columns: 240px 1fr;
            width: 95vw;
        }

        @media screen and (max-width: 768px) {
            height: 100vh;
            width: 100vw;
            border-radius: 0;
            grid-template-columns: 1fr;

            .contacts-panel {
                display: none;
            }
            .chat-panel {
                display: flex;
                flex-direction: column;
            }

            &.show-contacts {
                .contacts-panel {
                    display: block;
                }
                .chat-panel {
                    display: none;
                }
            }

            &.show-chat {
                .contacts-panel {
                    display: none;
                }
                .chat-panel {
                    display: flex;
                }
            }
        }
    }

    .contacts-panel,
    .chat-panel {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        height: 100%;
    }
`;
