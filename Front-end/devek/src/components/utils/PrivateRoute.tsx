import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "../../contexts/UserContext";
import React from "react";


const PrivateRoute: React.FC = () => {
    const { user } = useAuth()

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
