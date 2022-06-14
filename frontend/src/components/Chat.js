import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

const getUserFullName = (user) => {
    return `${user?.user?.middle_name} ${user?.user?.first_name} ${user?.user?.last_name}`
}

export const Chat = () => {
    const dispatch = useDispatch()
    const sessionUserId = useSelector(state => state.user.id)
    const teachersList = useSelector(state => state.users.teachersList)
    const studentsList = useSelector(state => state.users.studentsList)
    const chats = useSelector(state => state.chats)
    const currentChat = useSelector(state => state.chats.currentChat)
    const [selectedUserId, setSelectedUserId] = React.useState(null)
    const [message, setMessage] = React.useState('')
    const [filter, setFilter] = React.useState('')

    const users = React.useMemo(() => {
        return [...teachersList?.data || [], ...studentsList || []].filter(user => user?.user?.id !== sessionUserId)
    }, [sessionUserId, studentsList, teachersList?.data])

    React.useEffect(() => {
        if (teachersList === null) {
            dispatch.users.asyncGetTeachersList()
        }
    }, [dispatch.users, teachersList])

    React.useEffect(() => {
      if (studentsList === null) {
          dispatch.users.asyncGetStudentsList()
      }
    }, [dispatch.users, studentsList])

    React.useEffect(() => {
        if (chats?.chats === null) {
            dispatch.chats.asyncGetAllChats()
        }
      }, [chats?.chats, dispatch.chats])

    const onButtonClick = (user_id) => () => {
        setSelectedUserId(user_id)
        dispatch.chats.getCurrentChatByUSerId(user_id)
    }

    const sendMessage = () => {
        dispatch.chats.asyncSendMessage({to_user_id: selectedUserId, message})
        setMessage('')
    }

    React.useEffect(() => {
        const intervalId = setInterval(
            () => dispatch.chats.getCurrentChatByUSerId(selectedUserId),
            5000)
        return () => {
            clearInterval(intervalId)
        }
    }, [dispatch.chats, selectedUserId])

    return (
        <div>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>Чат</Typography>
            <Grid container component={Paper}>
                <Grid item xs={3}>
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth value={filter} onChange={({target}) => setFilter(target.value)} />
                    </Grid>
                    <Divider />
                    <List>
                        {users?.filter(user => `${user?.user?.middle_name} ${user?.user?.first_name} ${user?.user?.last_name}`.toLowerCase().includes(filter.toLowerCase()))?.map(user => (
                            <ListItem selected={user?.user?.id === selectedUserId} button key={user?.user?.id} onClick={onButtonClick(user?.user?.id)}>
                                <ListItemIcon>
                                    <Avatar />
                                </ListItemIcon>
                                <ListItemText>{`${user?.user?.middle_name} ${user?.user?.first_name} ${user?.user?.last_name}`}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={9}>
                    {selectedUserId ? (
                        <>
                            <Typography variant='h5' textAlign='center' style={{margin: '30px 0 30px 0' }}>{getUserFullName(users.filter(user => user?.user?.id === selectedUserId)[0])}</Typography>
                            <Divider />
                            <List>
                                {currentChat?.messages?.map(msg => {
                                    const align = msg.from_user_id === sessionUserId ? 'right' : 'left'
                                    return (
                                        <ListItem key={msg.id}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <ListItemText align={align} primary={msg.message}></ListItemText>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    )
                                })}
                            </List>
                            <Divider />
                            <Grid container style={{padding: '20px'}}>
                                <Grid item xs={10}>
                                    <TextField id="outlined-basic-email" label="Type Something" value={message} onChange={({target}) => setMessage(target.value)} fullWidth />
                                </Grid>
                                <Grid xs={2} align="right">
                                    <Fab color="primary" aria-label="add" onClick={sendMessage}><SendIcon /></Fab>
                                </Grid>
                            </Grid>
                        </>
                        ) : (
                            <Typography variant='h6' textAlign='center' style={{margin: '40px 0 40px 0' }}>Выберите пользователя чтобы открыть чат.</Typography>
                        )}
                </Grid>
            </Grid>
        </div>
    );
}
