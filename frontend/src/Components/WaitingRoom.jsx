import {Button, Heading, Input, Text} from "@chakra-ui/react";
import {useState} from "react";


export const WaitingRoom = ({joinChat}) => {
    const [userName, setUserName] = useState();
    const [chatRoom, setChatRoom] = useState();

    const onSubmit = (e) => {
        e.preventDefault();
        console.log("Joining chat with userName:", userName, "chatRoom:", chatRoom);
        joinChat(userName, chatRoom);
    };

    return (
        <form
            onSubmit={onSubmit}
            className="max-w-sm w-full bg-white p-8 rounded shadow-lg"
        >
            <Heading size="lg">Онлайн чат</Heading>
            <div className="mb-4">
                <Text fontSize={"sm"}>Имя пользователя</Text>
                <Input
                    name="username"
                    placeholder="Enter your name"
                    onChange={(e) => setUserName(e.target.value)}
                />
            </div>
            <div className="mb-6">
                <Text fontSize={"sm"}>Название чата</Text>
                <Input
                    name="chatname"
                    placeholder="Enter a chat name"
                    onChange={(e) => setChatRoom(e.target.value)}
                />
            </div>
            <Button type="submit" colorScheme="blue">
                Присоединиться
            </Button>
        </form>
    );
};