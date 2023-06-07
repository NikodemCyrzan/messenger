import { useState } from "react";
import "./App.css";
import UsersPanel from "./components/UsersPanel/UsersPanel";

function App() {
    const [selectedUser, selectUser] = useState(0);

    return (
        <>
            <UsersPanel
                users={[
                    {
                        id: "0",
                        nickname: "Kamil",
                        lastMessage: {
                            sender: "0",
                            content: "Cześć",
                            readed: false,
                        },
                    },
                    {
                        id: "1",
                        nickname: "Kamil",
                        lastMessage: {
                            sender: "1",
                            content: "Cześć",
                            readed: true,
                        },
                    },
                ]}
                selectUser={selectUser}
                selectedUser={selectedUser}
            />
        </>
    );
}

export default App;
