import * as React from 'react';
import {
    Typography, TextField, Paper
} from '@mui/material';
import { useSelector } from 'react-redux';

export const UserProfile = () => {
    const user = useSelector(state => state.user)
    const title = React.useMemo(() => {
        if (user?.roles.includes('teacher')) {
            return 'Профиль преподавателя'
        } else if (user?.roles.includes('student')) {
            return 'Профиль студента'
        } else {
            return 'Ваш профиль'
        }
    }, [user?.roles])
    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>{title}</Typography>
            <Paper style={{ padding: '30px 20px' }}>
                <TextField label="Фамилия" defaultValue={user?.middle_name} style={{ marginBottom: '20px'}} disabled fullWidth/>
                <TextField label="Имя" defaultValue={user?.first_name} style={{ marginBottom: '20px'}} disabled fullWidth/>
                <TextField label="Отчество" defaultValue={user?.last_name} style={{ marginBottom: '20px'}} disabled fullWidth/>
                <TextField label="Почта" defaultValue={user?.email} disabled fullWidth/>
            </Paper>
        </>
    )
}