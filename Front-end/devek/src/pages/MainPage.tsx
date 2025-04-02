import * as React from 'react';
import {Box, Grid, TextField} from "@mui/material";
import {useAuth} from "../contexts/UserContext";
import {styled} from "@mui/material/styles";
import ChatRoom from '../components/Chat/ChatRoom';
import {useRoom} from '../contexts/ChatRoomsContext';
import ChatList from '../components/ChatList/ChatList';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

import GroupsIcon from '@mui/icons-material/Groups';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

export const CustomTextField = styled(TextField)(({ theme }) => {
  return {

    '& input': {
      color: 'white',
    },
    '& label.Mui-focused': {
      color: 'white',
    },
    '& .MuiInput-underline:after': {
      color: 'white',
      borderBottomColor: 'white',
    },
    '& .MuiInputLabel-root': {
      color: 'white',
    },
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        color: 'white',
        borderColor: 'white',
      },
      '&:hover fieldset': {
        color: 'white',
        borderColor: 'white',
      },
      '&.Mui-focused fieldset': {
        color: 'white',
        borderColor: 'white',
      },
    },
  }
});

export default function MainPage() {
  const { token } = useAuth();
  const { joinedRooms, availableRooms } = useRoom();
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [selectedIndexOther, setSelectedIndexOther] = React.useState<number | null>(null);


  const [open, setOpen] = React.useState(true);

  const [openOther, setOpenOther] = React.useState(true);

  const handleClickJoined = () => {
    setOpen(!open);
  };


  const handleClickOther = () => {
    setOpenOther(!openOther);
  };


  return (
    <React.Fragment>
      <Grid container spacing={2}>

        <Grid size={{ xs: 12, sm: 3 }} >

      
        <Box sx={{maxHeight: "700px", overflowY: 'auto'}}>
          <ListItemButton onClick={handleClickJoined} sx={{p:3}}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="Your joined rooms" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={open} timeout="auto" >

            <ChatList chatRoomIds={joinedRooms} setSelect={setSelectedIndex} joined={true} />

          </Collapse>



          <ListItemButton onClick={handleClickOther} sx={{p:3}} >
            <ListItemIcon>
              <GroupAddIcon />
            </ListItemIcon>
            <ListItemText primary="Available rooms" color="primary"/>
            {openOther ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openOther} timeout="auto" >

            <ChatList chatRoomIds={availableRooms} setSelect={setSelectedIndexOther} joined={false} />

          </Collapse>
        
          </Box>

        </Grid>

        <Grid size={{ xs: 12, sm: 9 }}>
          {selectedIndex !== null && <ChatRoom room={joinedRooms[selectedIndex]} />}
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
