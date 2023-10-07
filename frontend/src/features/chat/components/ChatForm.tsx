import React, {useState} from 'react';
interface Props{
    ws:WebSocket;
}

const ChatForm:React.FC<Props> = ({ws}) => {
    const [message,setMessage] = useState("");

    const sendMessage = (e:React.FormEvent) =>{
        e.preventDefault();
        ws.send(JSON.stringify({
            type:'SEND_MESSAGE',
            payload:{
                message,
                token:'adfsadsga3234213132',
            }
        }))
    }

    const onChange = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setMessage(e.target.value);
    }

    return (
        <form onSubmit={sendMessage}>
            <input
                type="text"
                onChange={onChange}
                value={message}
            />
            <button type='submit'>send</button>
        </form>
    );
};

export default ChatForm;