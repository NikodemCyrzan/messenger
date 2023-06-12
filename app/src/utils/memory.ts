import WebsocketClient from "./websocketClient";

class Memory {
    static UserId: string;
}

const loadMemory: (callback: () => void) => void = (callback) => {
    WebsocketClient.sendRequest("GET_ID", {}, (data: any) => {
        Memory.UserId = data.id;
        callback();
    });
};

export { loadMemory };

export default Memory;
