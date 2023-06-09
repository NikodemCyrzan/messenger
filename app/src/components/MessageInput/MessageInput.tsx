import { useEffect, useState } from "react";
import "./MessageInput.scss";

interface MessageInputProps {
    sendMessage: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ sendMessage }) => {
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        document.body.addEventListener("click", () => {});
    }, []);

    return (
        <div className="message-input__container">
            <input
                onKeyPress={(e) => {
                    if (inputValue.length === 0) return;

                    if (e.key === "Enter") {
                        sendMessage(inputValue);
                        setInputValue("");
                    }
                }}
                type="text"
                className="message-input__input"
                placeholder="Aa"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button
                className="message-input__send-button"
                onClick={() => {
                    if (inputValue.length === 0) return;

                    sendMessage(inputValue);
                    setInputValue("");
                }}>
                Wyślij
            </button>
        </div>
    );
};

export default MessageInput;
