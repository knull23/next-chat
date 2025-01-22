import React, { useEffect, useState } from "react";
import { Input } from "antd";
import "antd/dist/antd.css";
import "font-awesome/css/font-awesome.min.css";
import Header from "./Header";
import Messages from "./Messages";
import List from "./List";
import { io } from "socket.io-client";
import {
  ChatContainer,
  StyledContainer,
  ChatBox,
  StyledButton,
  SendIcon,
} from "../styles/styles";

function ChatRoom({ username, id }) {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const BASE_URL = "http://localhost:1337";

  useEffect(() => {
    const ioInstance = io(BASE_URL);
    setSocket(ioInstance);

    ioInstance.emit("join", { username }, (error) => {
      if (error) alert(error);
    });

    ioInstance.on("welcome", async (data) => {
      const welcomeMessage = {
        user: data.user,
        message: data.text,
      };
      setMessages((prev) => [welcomeMessage, ...prev]);

      // Fetch initial messages
      try {
        const res = await fetch(`${BASE_URL}/api/messages`);
        const response = await res.json();
        const allMessages = response.data.map((one) => one.attributes);
        setMessages((prev) => [...prev, ...allMessages]);
      } catch (err) {
        console.error("Error fetching messages:", err.message);
      }
    });

    // Listen for new messages
    ioInstance.on("message", async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/messages`);
        const response = await res.json();
        const allMessages = response.data.map((one) => one.attributes);
        setMessages(allMessages);
      } catch (err) {
        console.error("Error fetching new messages:", err.message);
      }
    });

    // Listen for users list update (user join/leave)
    ioInstance.on("users", (activeUsers) => {
      setUsers(activeUsers);
    });

    // Clean up the socket connection and event listeners
    return () => {
      ioInstance.disconnect();
    };
  }, [username]);

  const sendMessage = () => {
    if (!message.trim()) {
      alert("Message can't be empty");
      return;
    }

    if (socket) {
      socket.emit("sendMessage", { message, user: username }, (error) => {
        if (error) alert(error);
      });
      setMessage(""); // Reset message input
    }
  };

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleClick = () => {
    sendMessage();
  };

  return (
    <ChatContainer>
      <Header room="Group Chat" />
      <StyledContainer>
        <List users={users} id={id} usersname={username} />
        <ChatBox>
          <Messages messages={messages} username={username} />
          <Input
            type="text"
            placeholder="Type your message"
            value={message}
            onChange={handleChange}
            onPressEnter={handleClick} // Allow sending message on Enter
          />
          <StyledButton onClick={handleClick}>
            <SendIcon>
              <i className="fa fa-paper-plane" />
            </SendIcon>
          </StyledButton>
        </ChatBox>
      </StyledContainer>
    </ChatContainer>
  );
}

export default ChatRoom;
