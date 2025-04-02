// ChatRoom.tsx
import React, {useEffect, useRef, useState} from 'react';
import {Box, TextField, Container, Typography, Grid, Divider, Button, Stack} from '@mui/material';
import Message from './Message';
import {API_HOST} from '../../hooks/UseFetch';
import {useAuth} from "../../contexts/UserContext";
import {FetchRequest, useFetch} from "../../hooks/UseFetch";
import {useRoom} from '../../contexts/ChatRoomsContext';
import ChatInputBar from './ChatInputBar';;

interface ChatRoomProps {
    room: string;
}

interface ChatMessage {
    sender: string;
    text: string;
    timestamp: string;
}

type Request = {
    updateTrigger: boolean;
    setUpdateTrigger: (value: boolean) => void;
    setData: (data: ChatMessage[]) => void;
    token: string;
    user: string | null;
    endpoint: string;
    queryParams: string;
};


const ChatRoom: React.FC<ChatRoomProps> = ({room}) => {

    const [oldMessages, setOldMessages] = useState<ChatMessage[]>([]);
    const {getMessagesByRoom} = useRoom();
    const [updateTrigger, setUpdateTrigger] = useState<boolean>(false);
    const newMessages = getMessagesByRoom(room);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth",  block: 'end',
           });
    };


    console.log(newMessages);

    const {token} = useAuth();
    const {user} = useAuth();

    const oldMessagesParams: Request = {
        updateTrigger,
        setUpdateTrigger,
        setData: setOldMessages,
        token,
        user,
        endpoint: `groupchats/${room}/messages/`,
        queryParams: ""
    };


    const req: FetchRequest = generateRequest(oldMessagesParams);
    const [error, isLoading] = useFetch(req);

    useEffect(() => {
        scrollToBottom();
    }, [newMessages]);


    function loadOlderMessages() {
        setUpdateTrigger(true);
    }

    return (
        <Container>
            <Box sx={{my: 2, height: "600px"}}>
                <Typography variant="h4" gutterBottom color = "primary">
                    {room}
                </Typography>
                <Divider/>
                <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
                    <Button variant="contained" color="primary" onClick={loadOlderMessages}>
                        Load Older Messages
                    </Button>
                </Box>



                <Box sx={{ maxHeight: "520px", overflowY: "auto", mb: 2, display: "flex", flexDirection: "column" }}>
                    {oldMessages.map((msg, index) => (
                        <Stack
                            key={`old-${index}`}
                            direction="row"
                            sx={{ ml: msg.sender === user ? 10 : 0 }}
                        >
                            <Message sender={msg.sender} text={msg.text} timestamp={msg.timestamp} />
                        </Stack>
                    ))}

                    {newMessages.map((msg, index) => (
                        <Stack
                            key={`new-${index}`}
                            direction="row"
                            sx={{ ml: msg.sender === user ? 10 : 0 }}
                        >
                            <Message sender={msg.sender} text={msg.text} timestamp={msg.date} />
                        </Stack>
                    ))}

                    <Divider />
                    <div ref={messagesEndRef}></div>
                </Box>



            </Box>
            <ChatInputBar room={room} />
        </Container>

    );
};


export default ChatRoom;


export function generateRequest({
                                    updateTrigger,
                                    setUpdateTrigger,
                                    setData,
                                    token,
                                    user,
                                    endpoint,
                                    queryParams,
                                }: Request) {
    return {
        triggerRequest: updateTrigger,
        setTriggerRequest: setUpdateTrigger,
        callback: (data: any) => {
            setUpdateTrigger(false);
            setData(data["messages"]);
        },
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "X-Consumer-Custom-Id": String(user),
        },

        endpoint: `${API_HOST}/${endpoint}?${queryParams}`,
        payload: null,
    };
}

