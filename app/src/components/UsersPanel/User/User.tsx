import { UserType } from "../../../utils/types";
import "./User.scss";

interface UserProps {
    user: UserType;
    selected: boolean;
    select: () => void;
}

const User: React.FC<UserProps> = ({ user, selected, select }) => {
    return (
        <div
            className={`users-panel__list-item ${selected ? "active" : ""}`}
            onClick={select}>
            <div className="users-panel__list-item__nickname">
                {user.username}
            </div>
            <div
                className={`users-panel__list-item__last-message ${
                    user.readed ? "" : "unreaded"
                }`}>
                {user.lastMessage.content}
            </div>
        </div>
    );
};

export default User;
