import {useEffect, useRef, useState} from "react";
import {IError, IMember, IMessage, IncomingMessage} from "../../types";
import ChatMembers from "./components/ChatMembers.tsx";
import ChatMessages from "./components/ChatMessages.tsx";
import ChatForm from "./components/ChatForm.tsx";

const Chat = () => {
    const ws = useRef<WebSocket | null>(null);
    const [members,setMembers] = useState<IMember[]>([]);
    const [messages,setMessages] = useState<IMessage[]>([]);
    const [errors,setErrors] = useState<IError[]>([]);

    useEffect(() => {
        ws.current = new WebSocket("ws://localhost:8000/chat");

        ws.current.onclose = () => console.log("ws closed");

        ws.current.onopen = () => {
            ws.current?.send(
                JSON.stringify({
                    type: "GET_ALL_MEMBERS",
                    payload:{
                        token:'adfsadsga3234213132',
                    }
                }),
            );

            ws.current?.send(
                JSON.stringify({
                    type: "PREVIOUS_MESSAGES",
                    payload:{
                        token:'adfsadsga3234213132',
                    }
                }),
            );
        };

        ws.current.onmessage = (event) => {
            const decodedMessage = JSON.parse(event.data) as IncomingMessage;

            switch (decodedMessage.type){
                case 'ALL_MEMBERS':
                    setMembers(prevState => [...prevState,...decodedMessage.payload as IMember[]])
                    break;
                case 'NEW_MESSAGE':
                    setMessages(prevState => [
                        ...prevState,
                        decodedMessage.payload as IMessage
                    ]);
                    break;
                case 'PREVIOUS_MESSAGES':
                    setMessages(decodedMessage.payload as IMessage[])
                    break;
                case 'NEW_ERROR':
                    setErrors(prevState => [
                        ...prevState,
                        decodedMessage.payload as IError
                    ]);
                    break;
                default:
                    console.error('Unknown message type:', decodedMessage.type);
                    break;

            }
        }
    }, []);

    errors.map(item=>alert(item.error))

    return (
        <div style={{display:"grid",gridTemplateColumns:"200px 1fr"}}>
            <div>
                <ChatMembers members={members}/>
            </div>
            <div>
                <ChatMessages messages={messages}/>
                {ws.current && <ChatForm ws={ws.current}/>}
            </div>
        </div>
    );
};

export default Chat;