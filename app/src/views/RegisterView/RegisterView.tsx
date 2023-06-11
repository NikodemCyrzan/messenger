import { useState } from "react";
import "./RegisterView.scss";
import WebsocketClient from "../../utils/websocketClient";

interface RegisterViewProps {}

const RegisterView: React.FC<RegisterViewProps> = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [password2, setPassword2] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleRegister = () => {
        if (username.length < 3) {
            setError("Nazwa użytkownika musi mieć co najmniej 3 znaki");
            return;
        }

        if (password.length < 3) {
            setError("Hasło musi mieć co najmniej 3 znaki");
            return;
        }

        if (password !== password2) {
            setError("Hasła nie są takie same");
            return;
        }

        WebsocketClient.sendRequest(
            "REGISTER",
            {
                username,
                password,
            },
            (response) => {
                if (response.success) setError("");
                else setError("Konto o podanej nazwie już istnieje");
            }
        );
    };

    return (
        <div className="register-view__container">
            <div className="register-view__form">
                <div className="register-view__title">Załóż konto</div>
                <div className="register-view__input__container">
                    <input
                        className="register-view__input"
                        type="text"
                        placeholder="Nazwa użytkownika"
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                    />
                </div>
                <div className="register-view__input__container">
                    <input
                        className="register-view__input"
                        type="password"
                        placeholder="Hasło"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                    />
                </div>
                <div className="register-view__input__container">
                    <input
                        className="register-view__input"
                        type="password"
                        placeholder="Powtórz hasło"
                        onChange={(e) => setPassword2(e.target.value)}
                        value={password2}
                    />
                </div>
                <div className="register-view__error">{error ? error : ""}</div>
                <div className="register-view__input__container">
                    <button
                        className="register-view__button"
                        onClick={handleRegister}>
                        Zarejestruj
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterView;
