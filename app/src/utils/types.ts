export type MessageType = {
    sender: string;
    content: string;
};

export type UserType = {
    id: string;
    nickname: string;
    lastMessage: MessageType;
    readed: boolean;
};
