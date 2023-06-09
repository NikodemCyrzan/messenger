import WebsocketClient from "./utils/websocketClient";
import "./App.css";
import ChatView from "./views/ChatView/ChatView";
import Memory from "./utils/memory";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        WebsocketClient.start("ws://localhost", 20000);

        WebsocketClient.addOnReady(() => {
            const username = Math.random().toString(36).substring(7);
            WebsocketClient.sendRequest(
                "REGISTER",
                {
                    username: username,
                    password: "test",
                },
                () => {
                    console.log(Memory.UserId);
                    WebsocketClient.sendRequest(
                        "LOGIN",
                        {
                            username: username,
                            password: "test",
                        },
                        (response) => {
                            console.log(response);
                        }
                    );
                }
            );
        });
    }, []);

    return (
        <>
            <ChatView />
        </>
    );
}

export default App;
