import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Alert, Paper, TextField, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
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

interface SignUpInput {
    name: string;
    email: string;
    password: string;
}

export default function SignUpPage() {
    const [input, setInput] = useState<SignUpInput>({ name: '', email: '', password: '' });
    const [nameError, setNameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passError, setPassError] = useState(false);
    const [authError, setAuthError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nameEmpty = input.name.trim() === '';
        const emailEmpty = input.email.trim() === '';
        const passwordEmpty = input.password.trim() === '';
        setNameError(nameEmpty);
        setEmailError(emailEmpty);
        setPassError(passwordEmpty);

        if (!nameEmpty && !emailEmpty && !passwordEmpty) {
            fetch(`${API_HOST}/signup/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(input),
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Sign-up failed');
                    }
                    return response.json();
                })
                .then(() => navigate('/login'))
                .catch(err => setAuthError(err.message));
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <Grid container component="main" sx={{ height: '100vh' }}>
            <Grid size={{ xs: 12, sm: 8, md: 5 }} component={Paper} elevation={6}>
                <Box sx={{ my: 8, mx: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">Sign Up</Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            error={nameError}
                            helperText={nameError ? "Name is required" : ""}
                            onChange={handleChange}
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoFocus
                        />
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
                            autoComplete="new-password"
                        />
                        {authError && <Alert severity="error">{authError}</Alert>}
                        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Sign Up</Button>
                        <Grid container>
                            <Grid size={{ xs: 6 }}>
                                <Link href="/login" variant="body2">Already have an account? Log in</Link>
                            </Grid>
                        </Grid>
                    </Box>
                    <Copyright />
                </Box>
            </Grid>
        </Grid>
    );
}
