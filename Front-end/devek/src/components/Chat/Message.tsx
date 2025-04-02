import React from 'react';
import { Box, Typography, Paper, Divider, Stack, styled } from '@mui/material';
import {useAuth} from "../../contexts/UserContext";

interface MessageProps {
  sender: string;
  text: string;
  timestamp: string; 
}


const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoString));
};


const getSenderColor = (name: string) => {
  const colors = ['#E57373', '#81C784', '#64B5F6', '#FFD54F', '#BA68C8', '#FF8A65'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};


const StyledPaper = styled(Paper, {
  shouldForwardProp: (prop) => prop !== "isFromUser",
})<{ isFromUser: boolean }>(({ theme, isFromUser }) => ({
  padding: theme.spacing(2),
  backgroundColor: isFromUser ? theme.palette.secondary.main : theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  maxWidth: "70%",
  display: "inline-block",
}));


const Message: React.FC<MessageProps> = ({ sender, text, timestamp }) => {
  const senderColor = getSenderColor(sender);
  const {user} = useAuth();

  return (
    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
      <StyledPaper isFromUser={sender === user}>
        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 'bold', color: senderColor }}>
            {sender}
          </Typography>
          <Typography variant="caption" color="inherit">
            {formatDate(timestamp)}
          </Typography>
        </Stack>
        <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
          {text}
        </Typography>
      </StyledPaper>
      <Divider sx={{ mt: 1 }} />
    </Box>
  );
};

export default Message;
