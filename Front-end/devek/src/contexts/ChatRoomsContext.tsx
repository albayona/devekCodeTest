import React, {createContext, useContext, useEffect, useState, useCallback} from "react";
import {io, Socket} from "socket.io-client";
import {useAuth} from "./UserContext";
import {API_HOST} from "../hooks/UseFetch";
import {FetchRequest} from "../hooks/UseFetch";
import {useFetch} from "../hooks/UseFetch";
import {fetchAPI} from "../components/utils/fetch";

// Define Message type
interface Message {
    sender: string;
    date: string;
    read: boolean;
    received: boolean;
    text: string;
}

export interface MessageDTO {
    group: string;
    name: string | null;
    email: string | null;
    text: string;

}

// Define Messages Dictionary Type
interface MessagesDictionary {
    [roomId: string]: Message[];
}




interface SocketContextType {
    socket: Socket | null;
    sendMessage: (data: MessageDTO) => void;
    getMessagesByRoom: (roomId: string) => Message[];
    joinedRooms: string[];
    availableRooms: string[];
    joinRoom: (groupchatId: string) => void
    leaveRoom: (groupchatId: string) => void
    lastMessage: (groupchatId: string) => string,
    getNotificationCount: (room: string) => number;
    readMessages: (room: string) => void;
}

// Create the context
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Socket.IO server URL
const SOCKET_SERVER_URL = "http://localhost:3000"; // Change this to your backend URL


type Request = {
    updateTrigger: boolean;
    setUpdateTrigger: (value: boolean) => void;
    setData: (data: string[]) => void;
    token: string;
    user: string | null;
    endpoint: string;
    queryParams: string;
};


export const socket = io(SOCKET_SERVER_URL, {
    autoConnect: false
});

// Provider Component
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [joinedRooms, setJoinedRooms] = useState<string[]>([]);
    const [availableRooms, setAvailableRooms] = useState<string[]>([]);
    const [messages, setMessages] = useState<MessagesDictionary>({});
    const [notificationCount, setNotificationCount] = useState<Record<string, number>>({});

    console.log(messages);

    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const [updateTriggerJoined, setUpdateTriggerJoined] = useState<boolean>(true);
    const [updateTriggerAvailable, setUpdateTriggerAvailable] = useState<boolean>(true);

    const {user, logOut, token} = useAuth();


    const paramsJoined: Request = {
        updateTrigger: updateTriggerJoined,
        setUpdateTrigger: setUpdateTriggerJoined,
        setData: setJoinedRooms,
        token,
        user,
        endpoint: "groupchats/joined/",
        queryParams: ""
    };
    const paramsAvailable: Request = {
        updateTrigger: updateTriggerAvailable,
        setUpdateTrigger: setUpdateTriggerAvailable,
        setData: setAvailableRooms,
        token,
        user,
        endpoint: "groupchats/available/",
        queryParams: ""
    };

    const [error, isLoading] = useFetch(generateRequestJoined(paramsJoined, setNotificationCount));
    const [errorA, isLoadingA] = useFetch(generateRequestAvailable(paramsAvailable));



    useEffect(() => {

        socket.connect();

        function onConnect() {
            socket.emit("join", {"user": user});
            setIsConnected(true);
            console.log("Connected to socket:", socket.id);
        }

        socket.on("connect", () => {
            onConnect();
        });

        function onDisconnect() {
            setIsConnected(false);
            console.log("Disconnected from socket");
        }

        socket.on("disconnect", () => {
            onDisconnect();


        });

        // Listen for incoming messages and update the state
        const onMessage = (data: { group: string, name: string; email: string, text: string }) => {
            console.log(data);

            const newMessage: Message = {
                sender: data.email,
                date: new Date().toISOString(),
                read: false,
                received: true,
                text: data.text,
            };

            setMessages((prevMessages) => ({
                ...prevMessages,
                [data.group]: [...(prevMessages[data.group] || []), newMessage],
            }));

            setNotificationCount((prev) => ({
                ...prev, // Ensure previous state is spread properly
                [data.group]: prev[data.group] + 1, // Reset count for the specified room
            }));
        };

        socket.on("message", onMessage);


        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("message", onMessage);
            socket.disconnect();
        };
    }, []);


    useSocketReconnect(socket, isConnected);


    const joinRoom = async (groupchatId: string) => {
        try {

            await fetchAPI(token, user, null, logOut, `${API_HOST}/groupchats/join/${groupchatId}`, 'POST');

            setJoinedRooms((prev) => [...prev, groupchatId]);
            setAvailableRooms((prev) => prev.filter((room) => room !== groupchatId));

            socket.emit("join_chat", groupchatId);
        } catch (error) {
            console.error("Error joining room:", error);
        }
    };

    const leaveRoom = async (groupchatId: string) => {
        try {
            await fetchAPI(token, user, null, logOut, `${API_HOST}/groupchats/leave/${groupchatId}`, 'POST');

            setJoinedRooms((prev) => prev.filter((room) => room !== groupchatId)); // Remove from joined rooms
            setAvailableRooms((prev) => [...prev, groupchatId]); // Add back to available rooms

            socket.emit("leave_chat", groupchatId);
        } catch (error) {
            console.error("Error leaving room:", error);
        }
    };

    const lastMessage = (room: string) => {
        return messages[room]?.length ? messages[room][messages[room].length - 1].text : "";
    };

    const readMessages = (room: string) => {
        setNotificationCount((prev) => ({
            ...prev, // Ensure previous state is spread properly
            [room]: 0, // Reset count for the specified room
        }));
    };
    const getNotificationCount = (room: string) => {
        return notificationCount[room] || 0;
    }



    // Emit function to send messages
    const sendMessage = useCallback((data: MessageDTO) => {
        if (socket) {
            socket.emit("message", data);

            const u: string = String(user);
            console.log(user);

            const newMessage: Message = {
                sender: u,
                date: new Date().toISOString(),
                read: false,
                received: true,
                text: data.text,
            };

            setMessages((prevMessages) => ({
                ...prevMessages,
                [data.group]: [...(prevMessages[data.group] || []), newMessage],
            }));
        }
    }, [socket]);

    // Function to retrieve messages by room
    const getMessagesByRoom = (roomID: string): Message[] => {

        return messages[roomID] || [];
    };

    return (
        <SocketContext.Provider value={{socket, sendMessage, getMessagesByRoom, joinedRooms, availableRooms, joinRoom, leaveRoom, lastMessage, getNotificationCount, readMessages}}>
            {children}
        </SocketContext.Provider>
    );
};

// Custom hook to use the Socket Context
export const useRoom = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return context;
};


function generateRequestJoined({
                                 updateTrigger,
                                 setUpdateTrigger,
                                 setData,
                                 token,
                                 user,
                                 endpoint,
                                 queryParams,
                               }: Request, setNotificationCount: (data: Record<string, number>) => void) {
  return {
    triggerRequest: updateTrigger && user !== null,
    setTriggerRequest: setUpdateTrigger,
    callback: (data: any) => {
      setUpdateTrigger(false);
      setData(data['joined_groupchats']);
      setNotificationCount(Object.fromEntries(data['joined_groupchats'].map( (item: string) => [item, 0])));



      for (const g of data['joined_groupchats']) {
        socket.emit("join_group", {"group": g});
      }

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


function generateRequestAvailable({
                                    updateTrigger,
                                    setUpdateTrigger,
                                    setData,
                                    token,
                                    user,
                                    endpoint,
                                    queryParams,
                                  }: Request) {
  return {
    triggerRequest: updateTrigger && user !== null,
    setTriggerRequest: setUpdateTrigger,
    callback: (data: any) => {
      setUpdateTrigger(false);
      console.log(data);
      setData(data['available_groupchats']);
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


const useSocketReconnect = (socket: any, isConnected: boolean) => {
  useEffect(() => {
    if (!isConnected && navigator.onLine) {
      console.log("Socket disconnected. Attempting to reconnect...");
      socket.connect();
    }

    // Listen for when internet connection is restored
    const handleOnline = () => {
      if (!isConnected) {
        console.log("Internet restored, reconnecting socket...");
        socket.connect();
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [isConnected, socket]);
};