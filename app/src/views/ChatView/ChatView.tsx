import "./ChatView.scss";
import UsersPanel from "../../components/UsersPanel/UsersPanel";
import Chat from "../../components/Chat/Chat";
import { useEffect, useState } from "react";
import { getMessages, getUsers } from "../../utils/api";
import { MessageType, UserType } from "../../utils/types";
import MessageInput from "../../components/MessageInput/MessageInput";
import WebsocketClient from "../../utils/websocketClient";

interface ChatViewProps {}

const ChatView: React.FC<ChatViewProps> = () => {
    const [selectedUser, selectUser] = useState(0);
    const [users, setUsers] = useState<UserType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        WebsocketClient.addOnReady(() => {
            WebsocketClient.sendRequest("GET_USERS", {}, (response) => {
                const { success, users } = response;
                if (!success) return;

                setUsers(users);
            });
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

                console.log(response);
                setMessages(messages);
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
                <MessageInput />
            </div>
        </div>
    );
};

export default ChatView;
