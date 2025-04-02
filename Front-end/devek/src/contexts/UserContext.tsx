import { useContext, createContext, useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  email: string;
  role: string;
}

interface AuthData {
  token: string;
  user: User;
}

interface UserContextType {
  token: string;
  user: string | null;
  role: string | null;
  loginAction: (data: AuthData) => void;
  logOut: () => void;
}

// Create context with default undefined value
const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>(localStorage.getItem("user"));
  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));
  const [token, setToken] = useState<string>(localStorage.getItem("site") || "");
  console.log(user);

  const navigate = useNavigate();

  const loginAction = (data: AuthData) => {
    try {
      if (data) {
        setUser(data.user.email);
        setToken(data.token);
        setRole(data.user.role);
        localStorage.setItem("site", data.token);
        localStorage.setItem("user", data.user.email);
        localStorage.setItem("role", data.user.role);
        navigate("/home");
        return;
      }
      throw new Error("Invalid login data");
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    setToken("");
    setRole(null);
    localStorage.removeItem("site");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <UserContext.Provider value={{ token, user, role, loginAction, logOut }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;

// Custom hook for consuming the context
export const useAuth = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useAuth must be used within a UserProvider");
  }
  return context;
};
