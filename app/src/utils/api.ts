import { UserType } from "./types";

const apiUrl = "https://";

export const getUsers: () => Promise<UserType[]> = async () => {
    // const response = await fetch(`${apiUrl}/users`);
    // return (await response.json()) as UserType[];
    return [
        {
            id: "1",
            nickname: "John",
            lastMessage: {
                sender: "1",
                content: "Hello",
                readed: true,
            },
        },
        {
            id: "2",
            nickname: "Jane",
            lastMessage: {
                sender: "2",
                content: "Hi",
                readed: false,
            },
        },
    ];
};
