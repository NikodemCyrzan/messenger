export type MessageType = {
    sender: string;
    content: string;
    readed: boolean;
};

export type UserType = {
    id: string;
    nickname: string;
    lastMessage: MessageType;
};
