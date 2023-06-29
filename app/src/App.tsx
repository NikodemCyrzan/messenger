import WebsocketClient from "./utils/websocketClient";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterView from "./views/RegisterView/RegisterView";
import Memory from "./utils/memory";
import { useEffect } from "react";
import ChatView from "./views/ChatView/ChatView";
import LoginView from "./views/LoginView/LoginView";

function App() {
    useEffect(() => {
        WebsocketClient.start("ws://localhost", 20000);
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<ChatView />} />
                <Route path="/login" element={<LoginView />} />
                <Route path="/register" element={<RegisterView />} />
                <Route path="/chat" element={<ChatView />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
