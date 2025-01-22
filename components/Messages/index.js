import React, { useEffect, useRef } from "react";
import Message from "./Message"; // Ensure you are importing the correct path
import styled from "styled-components";

function Messages(props) {
  const { messages, username: user } = props;
  const messagesEndRef = useRef(null); // Reference for scrolling to the bottom

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Scrolls to the bottom after rendering new messages
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Runs whenever `messages` updates

  return (
    <StyledMessages>
      {messages.map((message, i) => (
        <div key={i} ref={messagesEndRef}>
          <Message message={message} username={user} />
        </div>
      ))}
    </StyledMessages>
  );
}

export default Messages;

const StyledMessages = styled.div`
  padding: 5% 0;
  overflow: auto;
  flex: 1; // Ensure the chat container grows to fill available space
  max-height: 80vh; // Optional: Limiting the height of the chat container
`;
