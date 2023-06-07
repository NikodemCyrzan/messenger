export type MessageType = {
    sender: string;
    content: string;
};

export type UserType = {
    id: string;
    username: string;
    lastMessage: MessageType;
    readed: boolean;
};
