import "./ChatView.scss";
import UsersPanel from "../../components/UsersPanel/UsersPanel";
import Chat from "../../components/Chat/Chat";
import { useEffect, useState } from "react";
import { getMessages, getUsers } from "../../utils/api";
import { MessageType, UserType } from "../../utils/types";
import MessageInput from "../../components/MessageInput/MessageInput";

interface ChatViewProps {}

const ChatView: React.FC<ChatViewProps> = () => {
    const [selectedUser, selectUser] = useState(0);
    const [users, setUsers] = useState<UserType[]>([]);
    const [messages, setMessages] = useState<MessageType[]>([]);

    useEffect(() => {
        (async () => {
            setUsers(await getUsers());
        })();
    }, []);

    const handleSelectUser = (index: number) => {
        selectUser(index);

        (async () => {
            setMessages(await getMessages(users[index].id));
        })();
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
