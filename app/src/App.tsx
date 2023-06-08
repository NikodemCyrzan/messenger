import WebsocketClient from "./utils/websocketClient";
import "./App.css";
import ChatView from "./views/ChatView/ChatView";
import { useEffect } from "react";

function App() {
    useEffect(() => {
        WebsocketClient.start("ws://localhost", 20000);

        WebsocketClient.addOnReady(() => {
            // console.log(localStorage);
            WebsocketClient.sendRequest(
                "REGISTER",
                {
                    username: "test",
                    password: "test",
                },
                (response) => {
                    console.log(response);
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
