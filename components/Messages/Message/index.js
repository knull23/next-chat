import React from "react";
import { MessagesContainer, MessageBox, MessageText, SentBy } from "./styles"; // Assuming these are styled-components

function Message(props) {
  const {
    username,
    message: { user, message },
  } = props;

  // Determine if the current message is from the logged-in user
  const sentByCurrentUser = user === username;

  const background = sentByCurrentUser ? "blue" : "lightgray"; // light gray for other users
  const textPosition = sentByCurrentUser ? "end" : "start";
  const textColor = sentByCurrentUser ? "white" : "black";
  const sentBy = sentByCurrentUser ? "right" : "left";

  return (
    <MessagesContainer textPosition={textPosition}>
      <MessageBox background={background}>
        <MessageText color={textColor}>{message}</MessageText>
      </MessageBox>
      <SentBy sentBy={sentBy}>{user}</SentBy>
    </MessagesContainer>
  );
}

export default Message;
