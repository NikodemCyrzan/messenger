import { useState } from "react";
import "./UsersPanel.scss";
import { UserType } from "../../utils/types";
import User from "./User/User";

interface UsersPanelProps {
    users: UserType[];
    selectUser: (index: number) => void;
    selectedUser: number;
}

const UsersPanel: React.FC<UsersPanelProps> = ({
    users,
    selectUser,
    selectedUser,
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
                        <User
                            user={user}
                            selected={i === selectedUser}
                            select={() => selectUser(i)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default UsersPanel;
