import { useState } from "react";
import "./UsersPanel.scss";

interface UsersPanelProps {
    users: {
        nickname: string;
        lastMessage: string;
        unreaded: boolean;
    }[];
    selectedUser: number;
    selectUser: (index: number) => void;
}

const UsersPanel: React.FC<UsersPanelProps> = ({
    users,
    selectedUser,
    selectUser,
}) => {
    const [scrollPosition, setScrollPosition] = useState(0);

    return (
        <div className="users-panel__container">
            <div className="users-panel__header">Użytkownicy</div>
            <div
                className={`users-panel__list ${
                    scrollPosition > 10 ? "scrolled" : ""
                }`}
                onScroll={(e) =>
                    setScrollPosition((e.target as HTMLElement).scrollTop)
                }>
                {users.map((user, i) => {
                    return (
                        <div
                            key={i}
                            className={`users-panel__list-item ${
                                selectedUser === i ? "active" : ""
                            }`}
                            onClick={() => selectUser(i)}>
                            <div className="users-panel__list-item__nickname">
                                {user.nickname}
                            </div>
                            <div
                                className={`users-panel__list-item__last-message ${
                                    user.unreaded ? "unreaded" : ""
                                }`}>
                                {user.lastMessage}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default UsersPanel;
