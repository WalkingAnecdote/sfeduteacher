import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import {
    CssBaseline, Drawer, Box, AppBar, Toolbar, List,
    Typography, Divider, IconButton, Container,
    ListItemButton, ListItemIcon, ListItemText, Button
} from '@mui/material';
import {
    ChevronLeft, People, Chat as ChatIcon, Menu
} from '@mui/icons-material';
import { Copyright, Chat } from '../components';
import { useSelector, useDispatch } from 'react-redux';

export const UserProfile = () => {
    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>Ваш профиль</Typography>
        </>
    )
}