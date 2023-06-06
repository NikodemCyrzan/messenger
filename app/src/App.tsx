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
                        nickname: "Jan Kowalski",
                        lastMessage: "Cześć!",
                        unreaded: true,
                    },
                    {
                        nickname: "Jan Kowalski",
                        lastMessage: "Ty: Cześć!",
                        unreaded: false,
                    },
                ]}
                selectedUser={selectedUser}
                selectUser={selectUser}
            />
        </>
    );
}

export default App;
