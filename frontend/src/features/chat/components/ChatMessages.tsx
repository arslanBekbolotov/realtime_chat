import React from 'react';
import {IMessage} from "../../../types";

interface Props {
    messages: IMessage[];
}

const ChatMessages:React.FC<Props> = ({messages}) => {
    return (
        <div>
            {messages.map(item=>(
                <div key={Math.random()}>
                    <h6>{item.user.displayName}</h6>
                    <span>{item.message}</span>
                </div>
            ))}
        </div>
    );
};

export default ChatMessages;