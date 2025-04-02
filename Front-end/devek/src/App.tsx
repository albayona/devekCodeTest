import './App.css';
import React from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {ThemeProvider} from '@mui/material';
import {CustomThemeOptions} from './styles/CustomTheme';
import MainPage from './pages/MainPage';
import UserProvider from './contexts/UserContext';
import LogInPage from './pages/LogInPage';
import NotFoundPage from './pages/NotFoundPage';
import DashboardLayout from './layouts/dashboard/Layout';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import Bar from './layouts/Bar';
import StartPage from './pages/StartPage';
import {SocketProvider} from './contexts/ChatRoomsContext';
import SignUpPage from './pages/SignUp';
import PrivateRoute from "./components/utils/PrivateRoute";

const App: React.FC = () => {
    return (
        <Router>
            <UserProvider>
                <ThemeProvider theme={CustomThemeOptions}>
                    <SocketProvider>
                        <div className="App">
                            <Bar/>
                            <div className="content">
                                <Routes>

                                    <Route path="/login" element={<LogInPage/>}/>
                                    <Route path="/signup" element={<SignUpPage/>}/>

                                    <Route element={<DashboardLayout/>}>

                                        <Route element={<PrivateRoute/>}>
                                            <Route path="/user" element={<NotFoundPage/>}/>

                                            <Route path="/support" element={<NotFoundPage/>}/>
                                            <Route path="/home" element={<MainPage/>}/>

                                        </Route>
                                    </Route>

                                    <Route path="/unauthorized" element={<NotAuthorizedPage/>}/>
                                    <Route path="/" element={<StartPage/>}/>

                                </Routes>
                            </div>
                        </div>
                    </SocketProvider>
                </ThemeProvider>
            </UserProvider>
        </Router>
    );
};

export default App;
