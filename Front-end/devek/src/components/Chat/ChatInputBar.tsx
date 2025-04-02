import React, {useState} from "react";
import {Box, TextField, IconButton} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import {useRoom} from "../../contexts/ChatRoomsContext";
import {MessageDTO} from "../../contexts/ChatRoomsContext";
import {useAuth} from "../../contexts/UserContext";
import {API_HOST} from "../../hooks/UseFetch";
import {fetchAPI} from "../utils/fetch";


interface ChatInputBarProps {
    room: string,
}



const ChatInputBar: React.FC<ChatInputBarProps> = ({room}) => {
    const [message, setMessage] = useState("");
    const {sendMessage} = useRoom();
    const {user, token, logOut} = useAuth();

    const handleSend = async () => {
        if (message.trim() !== "") {

            const data: MessageDTO = {group: room, name: user, email: user, text: message}
            sendMessage(data);

            setMessage("");


            const payload = {
                text: message,
                date: new Date().toISOString(),
            };


            return await fetchAPI(token, user, payload, logOut, `${API_HOST}/groupchats/${room}/message/`, 'POST');


        }


    };


    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1, // Spacing between elements
                padding: 1,
                backgroundColor: "background.paper",
                borderTop: "1px solid",
                borderColor: "divider",
            }}
        >
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <IconButton color="primary" onClick={handleSend}>
                <SendIcon/>
            </IconButton>
        </Box>
    );
};

export default ChatInputBar;
