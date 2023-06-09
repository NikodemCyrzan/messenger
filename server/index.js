const websocketServer = require("./websocketServer");
const SessionStorage = require("./sessionStorage");
const { v4 } = require("uuid");

const users = {}; // username, password, session, id

class Chat {
    messages = [];

    addMessage(message) {
        this.messages.push(message);
    }
}

class MessagesDatabase {
    static database = {};

    static addMessage(from, to, message) {
        let chat;
        if (!MessagesDatabase.chatExists(from, to))
            chat = MessagesDatabase.createChat(from, to);
        else chat = MessagesDatabase.getChat(from, to);

        chat.addMessage({
            sender: from,
            content: message,
        });
    }

    static createChat(from, to) {
        const chat = new Chat();

        if (MessagesDatabase.database[from] === undefined)
            MessagesDatabase.database[from] = {};
        MessagesDatabase.database[from][to] = chat;

        if (MessagesDatabase.database[to] === undefined)
            MessagesDatabase.database[to] = {};
        MessagesDatabase.database[to][from] = chat;

        return chat;
    }

    static chatExists(from, to) {
        return (
            MessagesDatabase.database[from] !== undefined &&
            MessagesDatabase.database[from][to] !== undefined &&
            MessagesDatabase.database[to] !== undefined &&
            MessagesDatabase.database[to][from] !== undefined
        );
    }

    static getChat(from, to) {
        if (!MessagesDatabase.chatExists(from, to)) return null;

        return MessagesDatabase.database[from][to];
    }

    static getMessages(from, to) {
        if (!MessagesDatabase.chatExists(from, to)) return [];

        return MessagesDatabase.database[from][to].messages;
    }
}

// register
websocketServer.addListener("REGISTER", async (data, session) => {
    const { username, password } = data;

    if (!username || !password) return { success: false };

    const user = Object.values(users).find((u) => u.username === username);
    if (user) return { success: false };

    const id = v4();
    users[id] = { username, password, session, id };
    SessionStorage.setData(session.uuid, { username, id });

    Object.values(users).forEach((u) => {
        if (u.session !== session)
            websocketServer.sendMessage(u.session.socket, "NEW_USER", {
                id,
                username,
                lastMessage: {
                    sender: id,
                    content: "",
                },
                readed: true,
            });
    });

    return { success: true };
});

// login
websocketServer.addListener("LOGIN", async (data, session) => {
    const { username, password } = data;

    if (!username || !password) return { success: false };

    const user = Object.values(users).find((u) => u.username === username);
    if (!user) return { success: false };

    if (user.password !== password) return { success: false };

    user.session = session;
    SessionStorage.setData(session.uuid, { username, id: user.id });

    return { success: true };
});

// logout
websocketServer.addListener("LOGOUT", async (_, session) => {
    SessionStorage.removeKey(session.uuid);

    return { success: true };
});

// send message
websocketServer.addListener("SEND_MESSAGE", async (data, session) => {
    const { message, to } = data;

    if (!message || !to) return { success: false };

    const user = Object.values(users).find((u) => u.id === to);
    if (!user) return { success: false };

    const from = Object.values(users).find((u) => u.session === session);
    if (!from) return { success: false };

    MessagesDatabase.addMessage(from.id, to, message);

    websocketServer.sendMessage(user.session.socket, "NEW_MESSAGE", {
        user: from.id,
        message,
    });

    return {
        success: true,
        message: {
            sender: from.id,
            content: message,
        },
    };
});

// get conversation
websocketServer.addListener("GET_CONVERSATION", async (data, session) => {
    const { with: withId } = data;

    if (!withId) return { success: false };

    const user = Object.values(users).find((u) => u.id === withId);
    if (!user) return { success: false };

    const from = Object.values(users).find((u) => u.session === session);
    if (!from) return { success: false };

    const messages = MessagesDatabase.getMessages(from.id, withId);

    return { success: true, messages };
});

// get users
websocketServer.addListener("GET_USERS", async (_, session) => {
    const usersList = Object.values(users)
        .filter((u) => u.session !== session)
        .map((u) => {
            let lastMessage;
            if (MessagesDatabase.chatExists(u.id, session.uuid))
                lastMessage = MessagesDatabase.getMessages(
                    u.id,
                    SessionStorage.getData(session.uuid).id
                ).at(-1);
            else
                lastMessage = {
                    sender: u.id,
                    content: "",
                };

            return {
                id: u.id,
                username: u.username,
                lastMessage,
                readed: true,
            };
        });

    return { success: true, users: usersList };
});

// get id
websocketServer.addListener("GET_ID", async (_, session) => {
    const user = Object.values(users).find((u) => u.session === session);
    if (!user) return { success: false };

    return { success: true, id: user.id };
});
