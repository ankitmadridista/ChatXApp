import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import { allUsersRoute, host } from "../utils/APIRoutes";
import {io} from "socket.io-client";

function Chat() {
  const socket = useRef();
  const [contacts, setContacts] = useState([]);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [isLoaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Define an async function inside the useEffect
    const fetchData = async () => {
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      } else {
        setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
        setIsLoaded(true);
      }
    };

    fetchData(); // Call the async function

  }, [navigate]);


  useEffect(() => {
    if(currentUser){
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser])


  useEffect(() => {
    const setContactsAsync = async () => {
      if (currentUser) {
        // if (currentUser.isAvatarImageSet) {
        try {
          const response = await axios.get(`${allUsersRoute}/${currentUser._id}`);
          setContacts(response.data);
        } catch (error) {
          console.error("Error fetching contacts:", error);
        }
        // } 
        // else {
        //   navigate('/');
        // }
      }
    };
    setContactsAsync();
  }, [currentUser, navigate]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
  };

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts} currentUser={currentUser} changeChat={handleChatChange} />
        {isLoaded && currentChat === undefined ?
          (<Welcome currentUser={currentUser} />) :
          (<ChatContainer currentChat={currentChat} currentUser={currentUser} socket={socket}/>)}

      </div>
    </Container>
  );
}

// function Chat(){
//     const [currentUser, setCurrentUser] = useState(undefined);
//     const navigate = useNavigate();
//   useEffect(() => {
//         // Define an async function inside the useEffect
//         const fetchData = async () => {
//           if (!localStorage.getItem("chat-app-user")) {
//             navigate("/login");
//           } else {
//             setCurrentUser(JSON.parse(localStorage.getItem("chat-app-user")));
//           }
//         };

//         fetchData(); // Call the async function

//       }, [navigate]);
//   return (<>Ram</>)
// }

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;
  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;

export default Chat;
