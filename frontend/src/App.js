import {HubConnectionBuilder} from "@microsoft/signalr";
import {useState} from "react";
import {Chat} from "./Components/Chat";
import {WaitingRoom} from "./Components/WaitingRoom";

function App() {
    const [connection, setConnection] = useState(null);
    const [chatRoom, setChatRoom] = useState("");
    const [messages, setMessages] = useState([]);

    const joinChat = async (userName, chatRoom) => {
        const newConnection = new HubConnectionBuilder()
            .withUrl("http://localhost:5262/chat") // Проверьте правильность этого URL
            .withAutomaticReconnect()
            .build()

        newConnection.on("ReceiveMessage", (userName, message) => {
            setMessages((messages) => [...messages, {userName, message}])
        });

        try {
            await newConnection.start();
            await newConnection.invoke("JoinChat", {userName, chatRoom});

            setConnection(newConnection);
            setChatRoom(chatRoom);
        } catch (error) {
            console.log(error);
        }
    }

    const sendMessage = (message) => {
        if (connection) {
            connection.invoke("SendMessage", message); // Проверка наличия соединения
        }
    };

    const closeChat = async () => {
        if (connection) {
            await connection.stop();
            setConnection(null);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {connection ? (
                <Chat
                    messages={messages}
                    sendMessage={sendMessage}
                    closeChat={closeChat}
                    chatRoom={chatRoom}
                />
            ) : (
                <WaitingRoom joinChat={joinChat}/>
            )}
        </div>
    );
}

export default App;
