import WebsocketClient from "./websocketClient";

class Memory {
    static UserId: string;
}

const loadMemory = () => {
    WebsocketClient.sendRequest("GET_ID", {}, (data: any) => {
        Memory.UserId = data.id;
    });
};

export { loadMemory };

export default Memory;
