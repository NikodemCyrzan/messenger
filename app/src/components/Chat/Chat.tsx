import React from "react";
import { MessageType } from "../../utils/types";
import "./Chat.scss";
import { UserId } from "../../utils/memory";

interface MessageProps {
    message: MessageType;
    position: "left" | "right";
}

const Message: React.FC<MessageProps> = ({ message, position }) => {
    return (
        <div className={`chat__message__container ${position}`}>
            <div className={`chat__message__content ${position}`}>
                {message.content}
            </div>
        </div>
    );
};

interface ChatProps {
    messages?: MessageType[];
}

const Chat: React.FC<ChatProps> = ({ messages = [] }) => {
    return (
        <div className="chat__container">
            {messages.map((message) => (
                <Message
                    message={message}
                    position={message.sender === UserId ? "right" : "left"}
                />
            ))}
        </div>
    );
};

export default Chat;
