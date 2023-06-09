import "./ChatView.scss";
import UsersPanel from "../../components/UsersPanel/UsersPanel";
import Chat from "../../components/Chat/Chat";
import { useEffect, useState } from "react";
import { MessageType, UserType } from "../../utils/types";
import MessageInput from "../../components/MessageInput/MessageInput";
import WebsocketClient from "../../utils/websocketClient";

interface ChatViewProps {}

const ChatView: React.FC<ChatViewProps> = () => {
    const [selectedUser, selectUser] = useState(0);
    const [users, setUsers] = useState<UserType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(function () {
        WebsocketClient.addOnReady(() => {
            WebsocketClient.sendRequest("GET_USERS", {}, (response) => {
                const { success, users } = response;
                if (!success) return;

                setUsers(users);
            });
        });

        WebsocketClient.addListener("NEW_MESSAGE", function (data) {
            const { message, user } = data;

            setUsers((users) => {
                if (user.id !== users[selectedUser].id) return [...users];

                users[selectedUser].lastMessage.content = message.content;
                return [...users];
            });

            setMessages((messages) => {
                return [
                    ...messages,
                    {
                        sender: user.id,
                        content: message,
                    },
                ];
            });
        });

        WebsocketClient.addListener("NEW_USER", (data) => {
            setUsers((users) => [...users, data]);
        });
    }, []);

    const handleSelectUser = (index: number) => {
        selectUser(index);

        WebsocketClient.sendRequest(
            "GET_CONVERSATION",
            { with: users[index].id },
            (response) => {
                const { success, messages } = response;
                if (!success) return;

                setMessages(messages);
            }
        );
    };

    const handleSendMessage = (message: string) => {
        WebsocketClient.sendRequest(
            "SEND_MESSAGE",
            { to: users[selectedUser].id, message },
            (response) => {
                const { success, message } = response;
                if (!success) return;

                setMessages((messages) => [...messages, message]);
            }
        );
    };

    return (
        <div className="chat-view__container">
            <div className="chat-view__users-panel">
                {
                    <UsersPanel
                        users={users}
                        selectUser={handleSelectUser}
                        selectedUser={selectedUser}
                    />
                }
            </div>
            <div className="chat-view__chat">
                <Chat messages={messages} />
                <MessageInput sendMessage={handleSendMessage} />
            </div>
        </div>
    );
};

export default ChatView;
