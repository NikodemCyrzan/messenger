function uuidv4() {
    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
        uuid[i] = Math.floor(Math.random() * 16);
    }
    uuid[14] = 4;
    uuid[19] = uuid[19] &= ~(1 << 2);
    uuid[19] = uuid[19] |= 1 << 3;
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = "-";
    return uuid.map((x) => x.toString(16)).join("");
}

type TListener = {
    title: string;
    callback: (data: object) => Promise<object> | object | void;
};

type TPendingRequest = {
    id: string;
    callback: (data: object) => void;
};

type TWaitingRequest = {
    title: string;
    data: object;
    callback: (data: object) => void;
};

type TWaitingMessage = {
    title: string;
    data: object;
};

class WebsocketClient {
    static connection: WebSocket | null;
    static port: number;
    static url: string;
    static listeners: TListener[] = [];
    static pendingRequests: TPendingRequest[] = [];
    static requestsQueue: TWaitingRequest[] = [];
    static messagesQueue: TWaitingMessage[] = [];

    static start(url: string, port: number) {
        WebsocketClient.port = port;
        WebsocketClient.url = url;

        (async () => {
            if (await WebsocketClient.connect(url, port)) {
                WebsocketClient.prepareConnection();
            } else {
                // TODO: handle connection error
            }
        })();
    }

    static prepareConnection() {
        this.connection!.onopen = null;
        this.connection!.onclose = () => {
            this.connection = null;
            // TODO: handle connection lost
            this.reconnect();
        };
        this.connection!.onmessage = ({ data: rawData }) => {
            const data = JSON.parse(rawData.toString()),
                { id: _id, title: _title, data: _data } = data;

            switch (_title) {
                case "RES":
                    {
                        let req = this.pendingRequests.find(
                            (r) => r.id === _id
                        );
                        req?.callback(_data);
                        this.pendingRequests = this.pendingRequests.filter(
                            (r) => r !== req
                        );
                    }
                    break;
                case "REQ":
                    {
                        for (const listener of this.listeners) {
                            if (listener.title === data.listenerTitle)
                                (async () => {
                                    this.sendResponse(
                                        (await listener.callback(
                                            _data
                                        )) as object,
                                        _id
                                    );
                                })();
                        }
                    }
                    break;
                case "MSG":
                    {
                        for (const listener of this.listeners)
                            if (listener.title === data.listenerTitle)
                                listener.callback(_data);
                    }
                    break;
            }
        };

        this.requestsQueue.forEach((req) => {
            this.sendRequest(req.title, req.data, req.callback);
            this.requestsQueue = this.requestsQueue.filter((r) => r !== req);
        });

        this.messagesQueue.forEach((req) => {
            this.sendMessage(req.title, req.data);
            this.messagesQueue = this.messagesQueue.filter((r) => r !== req);
        });
    }

    static async connect(url: string, port: number) {
        try {
            return new Promise((resolve) => {
                const socket = new WebSocket(`${url}:${port}`);
                socket.onopen = () => {
                    WebsocketClient.connection = socket;
                    resolve(true);
                };

                socket.onerror = () => {
                    resolve(false);
                };
            });
        } catch (error) {
            return false;
        }
    }

    static reconnect() {
        let delay = 100;

        const tryConnect = async () => {
            if (
                await WebsocketClient.connect(
                    WebsocketClient.url,
                    WebsocketClient.port
                )
            ) {
                WebsocketClient.prepareConnection();
                // TODO: handle connection restored
            } else
                setTimeout(() => {
                    delay *= 1.5;
                    tryConnect();
                }, delay);
        };

        tryConnect();
    }

    static addListener(
        title: string,
        callback: (data: any) => Promise<object> | object | void
    ) {
        WebsocketClient.listeners.push({ title, callback });
    }

    static sendRequest(
        title: string,
        data: object,
        callback: (data: object) => void
    ) {
        try {
            if (WebsocketClient.connection) {
                const uuid = uuidv4();
                WebsocketClient.pendingRequests.push({ id: uuid, callback });
                WebsocketClient.connection.send(
                    WebsocketClient.prepareRequest(title, data, uuid)
                );
            } else {
                WebsocketClient.requestsQueue.push({ title, data, callback });
            }
        } catch (error) {}
    }

    static sendResponse(data: object, id: string) {
        try {
            WebsocketClient.connection!.send(
                WebsocketClient.prepareResponse(data, id)
            );
        } catch (error) {}
    }

    static sendMessage(title: string, data: object) {
        try {
            if (WebsocketClient.connection) {
                WebsocketClient.connection!.send(
                    WebsocketClient.prepareMessage(title, data)
                );
            } else {
                WebsocketClient.messagesQueue.push({ title, data });
            }
        } catch (error) {}
    }

    static prepareRequest(title: string, data: object, id: string): string {
        return JSON.stringify({ title: "REQ", listenerTitle: title, data, id });
    }

    static prepareResponse(data: object, id: string): string {
        return JSON.stringify({ title: "RES", data, id });
    }

    static prepareMessage(title: string, data: object): string {
        return JSON.stringify({ title: "MSG", listenerTitle: title, data });
    }
}

WebsocketClient.addListener("GET_SESSION_UUID", () => {
    return {
        uuid: localStorage.getItem("session_uuid")
            ? localStorage.getItem("session_uuid")
            : false,
    };
});

WebsocketClient.addListener("NEW_SESSION_UUID", ({ uuid }) => {
    localStorage.setItem("session_uuid", uuid);
});

export default WebsocketClient;
