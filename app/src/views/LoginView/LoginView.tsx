import { useState } from "react";
import "./LoginView.scss";
import WebsocketClient from "../../utils/websocketClient";

interface LoginViewProps {}

const LoginView: React.FC<LoginViewProps> = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleLogin = () => {
        WebsocketClient.sendRequest(
            "LOGIN",
            {
                username,
                password,
            },
            (response) => {
                if (response.success) setError("");
                else setError("Nieprawidłowa nazwa użytkownika lub hasło");
            }
        );
    };

    return (
        <div className="login-view__container">
            <div className="login-view__form">
                <div className="login-view__title">Zaloguj się</div>
                <div className="login-view__input__container">
                    <input
                        className="login-view__input"
                        type="text"
                        placeholder="Nazwa użytkownika"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className="login-view__input__container">
                    <input
                        className="login-view__input"
                        type="password"
                        placeholder="Hasło"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <div className="login-view__error">{error ? error : ""}</div>
                <a href="./register" className="login-view__register">
                    Nie masz konta?
                </a>
                <div className="login-view__input__container">
                    <button
                        className="login-view__button"
                        onClick={handleLogin}>
                        Zaloguj
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
