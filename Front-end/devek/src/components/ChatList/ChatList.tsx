import {List} from "@mui/material";
import React from "react";
import {FC, useState} from "react";
import ChatListItem from "./ChatListItem";
import ListItemButton from '@mui/material/ListItemButton';
import {useRoom} from "../../contexts/ChatRoomsContext";
type ChatItemListProps = {

    chatRoomIds: string[];
    setSelect: (index: number) => void;
    joined: boolean;
};



const ChatList: FC<ChatItemListProps> = ({chatRoomIds, setSelect, joined}) => {

    const {readMessages} = useRoom();

    const handleClick = (roomIndex: number) => {
        setSelect(roomIndex);
        readMessages(chatRoomIds[roomIndex]);
    };


    return (
        <React.Fragment>
            {
                chatRoomIds.map((r: string, index: number) => (

                    <ListItemButton   key={r} 
                    onClick={() => handleClick(index)}  sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}>
                        <ChatListItem room={r} joined={joined}></ChatListItem>
                    </ListItemButton>
                ))

            }


        </React.Fragment>)

}


export default ChatList;