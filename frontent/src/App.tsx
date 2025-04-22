import { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { ToastContainer } from 'react-toastify';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const App = () => {
    const getInitialTheme = () => localStorage.getItem("theme") || "light";
    const [themeMode, setThemeMode] = useState(getInitialTheme());
    const theme = createTheme({
        palette: {
            mode: themeMode as 'light' | 'dark',
        },
    });
    useEffect(() => {
        const handleStorageChange = () => {
            const newTheme = localStorage.getItem("theme") || "light";
            setThemeMode(newTheme);
        };
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(() => {
            const current = localStorage.getItem("theme") || "light";
            if (current !== themeMode) {
                setThemeMode(current);
            }
        }, 500);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [themeMode]);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={themeMode === 'dark' ? 'dark' : 'light'}
            />
            <RouterProvider router={router} />
        </ThemeProvider>
    );
};

export default App;
