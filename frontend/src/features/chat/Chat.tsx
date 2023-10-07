import {useEffect, useRef, useState} from "react";
import {IMember, IncomingMessage} from "../../types";
import ChatMembers from "./components/ChatMembers.tsx";
import ChatMessages from "./components/ChatMessages.tsx";

const Chat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [members,setMembers] = useState<IMember[]>([]);
    // const [messages,setMessages] = useState<IMessage[]>([]);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/chat");

        ws.current.onclose = () => console.log("ws closed");

        ws.current.onopen = () => {
            ws.current?.send(
                JSON.stringify({
                    type: "GET_ALL_MEMBERS",
                }),
            );
        };

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            switch (decodedMessage.type){
                case 'ALL_MEMBERS':
                    setMembers(decodedMessage.payload)
                    break;
            }
        }
    }, []);

    return (
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr"}}>
            <div>
                <ChatMembers members={members}/>
            </div>
            <div>
                <ChatMessages/>
            </div>
        </div>
    );
};

export default Chat;