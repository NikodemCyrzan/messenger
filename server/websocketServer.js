const { WebSocketServer, WebSocket } = require("ws");
const SessionStorage = require("./sessionStorage");
const { v4 } = require("uuid");

class WebsocketServer {
    /**
     * @type {number}
     */
    port;
    /**
     * @type {WebSocket.Server<WebSocket>}
     */
    instance;
    /**
     * @type {{socket: WebSocket.WebSocket[], uuid: string, connected: boolean, sessionCloseTimeout: NodeJS.Timeout | null}[]}
     */
    sessions = [];
    /**
     * @type {{title: string, callback: (data: object, session: {socket: WebSocket.WebSocket[], uuid: string}) => Promise<object> | object}}[]}
     */
    listeners = [];
    /**
     * @type {{id: string, callback: (data: object) => void}[]}
     */
    pendingRequests = [];

    /**
     * @param {number} port
     */
    constructor(port) {
        this.port = port;
        this.instance = new WebSocketServer({ port });

        this.instance.on("connection", (socket) => {
            /**
             * @type {{socket: WebSocket.WebSocket[], uuid: string, connected: boolean}}
             */
            let session;
            this.sendRequest(socket, "GET_SESSION_UUID", {}, ({ uuid }) => {
                if (typeof uuid === "string") session = this.getSession(uuid);

                if (session) {
                    session.socket = socket;
                    session.connected = true;

                    if (session?.sessionCloseTimeout) {
                        clearTimeout(session?.sessionCloseTimeout);
                        session.sessionCloseTimeout = null;
                    }
                    this.sendMessage(socket, "SESSION_READY", {});
                    return;
                }

                session = this.createSession(socket);
                SessionStorage.createKey(session.uuid);

                this.sendMessage(socket, "NEW_SESSION_UUID", {
                    uuid: session.uuid,
                });

                this.sendMessage(socket, "SESSION_READY", {});
            });

            socket.on("message", (rawData) => {
                let json;
                try {
                    json = JSON.parse(rawData.toString());
                } catch (error) {}

                if (!json) return;

                const data = JSON.parse(rawData.toString()),
                    { title: _title, data: _data } = data;

                switch (_title) {
                    case "RES":
                        {
                            let req = this.pendingRequests.find(
                                (r) => r.id === data.id
                            );
                            req?.callback(_data);
                            this.pendingRequests = this.pendingRequests.filter(
                                (r) => r !== req
                            );
                        }
                        break;
                    case "REQ":
                        {
                            for (const listener of this.listeners)
                                if (listener.title === data.listenerTitle)
                                    (async () => {
                                        this.sendResponse(
                                            socket,
                                            await listener.callback(
                                                _data,
                                                session
                                            ),
                                            data.id
                                        );
                                    })();
                        }
                        break;
                    case "MSG":
                        {
                            for (const listener of this.listeners)
                                if (listener.title === data.listenerTitle)
                                    listener.callback(_data, session);
                        }
                        break;
                }
            });
            socket.on("close", () => {
                if (!session) return;
                session.connected = false;
                session.sessionCloseTimeout = setTimeout(() => {
                    SessionStorage.removeKey(session.uuid);
                    this.sessions =
                        this.sessions.filter((s) => s !== session) ?? [];
                    session = undefined;
                }, 30 * 60 * 1000);
            });
        });
    }

    /**
     * @param {WebSocket.WebSocket} socket
     */
    createSession(socket) {
        let uuid = v4();
        while (this.getSession(uuid)) uuid = v4();

        const session = {
            socket,
            uuid,
            connected: true,
            sessionCloseTimeout: null,
        };
        this.sessions.push(session);

        return session;
    }

    /**
     * @param {string} uuid
     * @returns {WebSocket.WebSocket | undefined}
     */
    getSession(uuid) {
        return this.sessions.find(({ uuid: _uuid }) => _uuid === uuid);
    }

    /**
     * @param {WebSocket.WebSocket} socket
     * @param {object} data
     * @param {string} id
     */
    sendResponse(socket, data, id) {
        try {
            socket.send(this.prepareResponse(data, id));
        } catch (error) {}
    }

    /**
     * @param {WebSocket.WebSocket} socket
     * @param {string} title
     * @param {object} data
     * @param {(data: object) => void} callback
     */
    sendRequest(socket, title, data, callback) {
        try {
            const uuid = v4();
            this.pendingRequests.push({ id: uuid, callback });
            socket.send(this.prepareRequest(title, data, uuid));
        } catch (error) {}
    }

    /**
     * @param {WebSocket.WebSocket} socket
     * @param {string} title
     * @param {object} data
     */
    sendMessage(socket, title, data) {
        try {
            socket.send(this.prepareMessage(title, data));
        } catch (error) {}
    }

    /**
     * @param {object} data
     * @param {string} id
     * @returns {string}
     */
    prepareResponse(data, id) {
        return JSON.stringify({ title: "RES", data, id });
    }

    /**
     * @param {string} title
     * @param {object} data
     * @param {string} id
     * @returns {string}
     */
    prepareRequest(title, data, id) {
        return JSON.stringify({ title: "REQ", listenerTitle: title, data, id });
    }

    /**
     * @param {string} title
     * @param {object} data
     * @returns {string}
     */
    prepareMessage(title, data) {
        return JSON.stringify({ title: "MSG", listenerTitle: title, data });
    }

    /**
     * @param {string} title
     * @param {(data: object, session: {socket: WebSocket.WebSocket[], uuid: string, connected: boolean, sessionCloseTimeout: NodeJS.Timeout | null}) => Promise<object> | object} callback
     */
    addListener(title, callback) {
        this.listeners.push({ title, callback });
    }
}

const websocketServer = new WebsocketServer(20000);

module.exports = websocketServer;
