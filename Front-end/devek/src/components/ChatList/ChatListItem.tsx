import * as React from 'react';
import {ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Button, Stack, Badge} from '@mui/material';
import {useRoom} from '../../contexts/ChatRoomsContext';
import MailIcon from "@mui/icons-material/Mail";

interface ChatItemListProps {
    room: string;
    joined: boolean;
}



const ChatListItem: React.FC<ChatItemListProps> = ({room, joined,}) => {
    const description = `This is the ${room} group chat`;

    const {joinRoom, leaveRoom, lastMessage, getNotificationCount} = useRoom();

    console.log(getNotificationCount(room))


    const handleJoin = () => {
        joinRoom(room);
    }

    const handleLeave = () => {
        leaveRoom(room);
    }

    return (
        <ListItem alignItems="flex-start">
            <ListItemAvatar>
                <Avatar alt={room} src="random"/>
            </ListItemAvatar>
            <ListItemText
                primary={
                    <Typography
                        component="div"
                        variant="h5"
                        color="primary"
                        sx={{display: 'inline'}}
                    >
                        {room}
                    </Typography>
                }
                secondary={
                    <React.Fragment>
                        <Typography
                            component="span"
                            variant="subtitle1"
                            color="secondary"
                            sx={{display: 'inline'}}
                        >
                            {description}
                        </Typography>

                        <div>

                             {lastMessage(room)}
                        </div>


                    </React.Fragment>
                }
            />
            <Stack direction="column" spacing={2} alignItems="center">
                {!joined && <Button variant="contained" color="primary" onClick={handleJoin}>Join</Button>}
                {joined && <Button variant="contained" color="secondary" onClick={handleLeave}>Leave</Button>}
                <Badge badgeContent={getNotificationCount(room)} color="secondary">
                    <MailIcon color="action" />
                </Badge>
            </Stack>
        </ListItem>
    );
};

export default ChatListItem;
