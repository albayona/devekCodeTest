import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { useAuth } from "../contexts/UserContext";
import { Alert, Paper, TextField, FormControlLabel, Checkbox, Link } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_HOST } from '../hooks/UseFetch';

function Copyright(props: React.HTMLAttributes<HTMLElement>) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit">Andy</Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

interface LoginInput {
    email: string;
    password: string;
    role?: string;
}

export default function LogIn() {
    const [input, setInput] = useState<LoginInput>({ email: "", password: "", role: "" });
    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [authError, setAuthError] = useState("");
    const [loginEvent, setLoginEvent] = useState(false);

    const { loginAction } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loginEvent) {

            const formData = new FormData();
            formData.append("username", input.email);
            formData.append("password", input.password )


            fetch(`${API_HOST}/login/`, {
                method: 'POST',
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Invalid credentials');
                    }
                    return response.json();
                })
                .then(data => {
                    loginAction({
                        token: data.access_token,
                        user: { email: data.user, role: "admin" }
                    });
                    setPassError(false);
                    setEmailError(false);
                    setAuthError("");
                    setLoginEvent(false);
                    navigate("/home");
                })
                .catch(err => {
                    setAuthError(err.message);
                    setLoginEvent(false);
                });
        }
    }, [loginEvent, input.email, input.password, loginAction, navigate]);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const emailEmpty = input.email.trim() === "";
        const passwordEmpty = input.password.trim() === "";
        setEmailError(emailEmpty);
        setPassError(passwordEmpty);
        if (!emailEmpty && !passwordEmpty) {
            setLoginEvent(true);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmailError(false);
        setPassError(false);
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid
                size={{ xs: false, sm: 4, md: 7 }}
                sx={{
                    backgroundImage: 'url(bg.jpg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundColor: t => t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <Grid size={{ xs: 12, sm: 8, md: 5 }} component={Paper} elevation={6}>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Log in</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            error={emailError}
                            helperText={emailError ? "Email is required" : ""}
                            onChange={handleChange}
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            error={passError}
                            helperText={passError ? "Password is required" : ""}
                            onChange={handleChange}
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <FormControlLabel control={<Checkbox value="remember" color="primary" />} label="Remember me" />
                        {authError && <Alert severity="error">{authError}</Alert>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Log in</Button>
                        <Grid container>
                            <Grid size={{ xs: 6 }}>
                                <Link href="#" variant="body2">Recover password</Link>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                                <Link href="/signup" variant="body2">Sign up</Link>
                            </Grid>
                        </Grid>
                    </Box>
                    <Copyright />
                </Box>
            </Grid>
        </Grid>
    );
}
