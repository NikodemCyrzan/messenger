import "./MessageInput.scss";

interface MessageInputProps {}

const MessageInput: React.FC<MessageInputProps> = () => {
    return (
        <div className="message-input__container">
            <input
                type="text"
                className="message-input__input"
                placeholder="Aa"
            />
            <button className="message-input__send-button">Wyślij</button>
        </div>
    );
};

export default MessageInput;
