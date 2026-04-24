import React, { useState } from 'react';
import styled from 'styled-components';
import Logo from '../assets/logo.svg';

const Contacts = ({ contacts, currentUser, changeChat }) => {
    const [currentSelected, setCurrentSelected] = useState(undefined);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        changeChat(contact);
    };

    const getInitial = (name) => name?.[0]?.toUpperCase() || '?';

    if (!currentUser) return null;

    return (
        <Container>
            <div className="brand">
                <img src={Logo} alt="Chattiq logo" />
                <h3>Chattiq</h3>
            </div>

            <div className="contacts">
                {contacts.length === 0 ? (
                    <p className="no-contacts">No other users yet</p>
                ) : (
                    contacts.map((contact, index) => (
                        <div
                            key={contact._id}
                            className={`contact ${index === currentSelected ? 'selected' : ''}`}
                            onClick={() => changeCurrentChat(index, contact)}
                        >
                            <div className="avatar">
                                {contact.avatarImage ? (
                                    <img
                                        src={`data:image/svg+xml;base64,${contact.avatarImage}`}
                                        alt={contact.username}
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        {getInitial(contact.username)}
                                    </div>
                                )}
                            </div>
                            <div className="username">
                                <h3>{contact.username}</h3>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="current-user">
                <div className="avatar">
                    {currentUser.avatarImage ? (
                        <img
                            src={`data:image/svg+xml;base64,${currentUser.avatarImage}`}
                            alt={currentUser.username}
                        />
                    ) : (
                        <div className="avatar-placeholder">
                            {getInitial(currentUser.username)}
                        </div>
                    )}
                </div>
                <div className="username">
                    <h2>{currentUser.username}</h2>
                </div>
            </div>
        </Container>
    );
};

export default Contacts;

const Container = styled.div`
    display: grid;
    grid-template-rows: 64px 1fr 72px;
    overflow: hidden;
    background: var(--bg-sidebar);
    border-right: 1px solid var(--border);
    transition: background 0.2s, border-color 0.2s;

    .brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        justify-content: center;
        border-bottom: 1px solid var(--border);
        img { height: 1.8rem; }
        h3 { color: var(--text-primary); font-size: 1.1rem; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; }
    }

    .contacts {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 0.5rem 0;

        &::-webkit-scrollbar { width: 4px; }
        &::-webkit-scrollbar-thumb { background: var(--scrollbar); border-radius: 4px; }

        .no-contacts { color: var(--text-muted); text-align: center; padding: 2rem 1rem; font-size: 0.85rem; }

        .contact {
            display: flex;
            align-items: center;
            gap: 0.85rem;
            padding: 0.65rem 1rem;
            cursor: pointer;
            transition: background 0.15s;

            &:hover { background: var(--bg-contact-hover); }

            .avatar {
                flex-shrink: 0;
                img { height: 2.6rem; width: 2.6rem; border-radius: 50%; object-fit: cover; }
                .avatar-placeholder {
                    height: 2.6rem; width: 2.6rem; border-radius: 50%;
                    background: var(--accent-gradient);
                    display: flex; align-items: center; justify-content: center;
                    color: white; font-weight: 700; font-size: 1rem;
                }
            }

            .username h3 { color: var(--text-secondary); font-size: 0.95rem; font-weight: 500; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        }

        .selected {
            background: var(--bg-contact-sel) !important;
            border-left: 3px solid var(--border-sel);
            .username h3 { color: var(--text-primary); font-weight: 600; }
        }
    }

    .current-user {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        padding: 0 1rem;
        background: var(--bg-header);
        border-top: 1px solid var(--border);
        transition: background 0.2s;

        .avatar {
            flex-shrink: 0;
            img, .avatar-placeholder {
                height: 2.4rem; width: 2.4rem; border-radius: 50%; object-fit: cover;
                border: 2px solid var(--border-sel);
            }
            .avatar-placeholder {
                background: var(--accent-gradient);
                display: flex; align-items: center; justify-content: center;
                color: white; font-weight: 700; font-size: 0.9rem;
            }
        }

        .username h2 { color: var(--text-primary); font-size: 0.9rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }
`;
