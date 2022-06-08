import * as React from 'react';
import {
    Typography, TextField, Paper
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

export const UserProfile = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const group = useSelector(state => state.groups.group)
    const isTeacher = React.useMemo(() => {
        return user?.roles.includes('teacher')
    }, [user?.roles])
    const isStudent = React.useMemo(() => {
        return user?.roles.includes('student')
    }, [user?.roles])
    const title = React.useMemo(() => {
        if (isTeacher) {
            return 'Профиль преподавателя'
        } else if (isStudent) {
            return 'Профиль студента'
        } else {
            return 'Ваш профиль'
        }
    }, [isStudent, isTeacher])
    React.useEffect(() => {
        if (isStudent && group === null) {
            dispatch.groups.asyncGetGroupById(user?.profile?.group_id)
        }
    }, [dispatch.groups, group, isStudent, user?.profile?.group_id])
    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>{title}</Typography>
            <Paper style={{ padding: '30px 20px' }}>
                <TextField label="Фамилия" defaultValue={user?.middle_name} style={{ marginBottom: '20px'}} disabled fullWidth/>
                <TextField label="Имя" defaultValue={user?.first_name} style={{ marginBottom: '20px'}} disabled fullWidth/>
                <TextField label="Отчество" defaultValue={user?.last_name} style={{ marginBottom: '20px'}} disabled fullWidth/>
                <TextField label="Почта" defaultValue={user?.email} disabled style={{ marginBottom: '20px'}} fullWidth/>
                {isTeacher && <TextField label="Дожность"  defaultValue={user?.profile?.rank || 'Должность не задана'} disabled fullWidth/>}
                {isStudent && <TextField label="Группа" defaultValue={group.name} disabled fullWidth/>}
            </Paper>
        </>
    )
}