import WebsocketClient from "./utils/websocketClient";
import "./App.css";
import ChatView from "./views/ChatView/ChatView";

function App() {
    WebsocketClient.start("ws://localhost", 20000);

    WebsocketClient.sendRequest("REGISTER", { pass: "dupa janka" }, (data) => {
        console.log(data);
    });
    console.log(localStorage);

    return (
        <>
            <ChatView />
        </>
    );
}

export default App;
