import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Paper, Grid, Divider, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Avatar, Fab } from '@mui/material';
import { Send as SendIcon } from '@mui/icons-material';

export const Chat = () => {
    const dispatch = useDispatch()
    const teachersList = useSelector(state => state.users.teachersList)
    const studentsList = useSelector(state => state.users.studentsList)
    const [filter, setFilter] = React.useState('')
    const users = React.useMemo(() => {
        return [...teachersList?.data || [], ...studentsList?.data || []]
    }, [studentsList?.data, teachersList?.data])

    React.useEffect(() => {
        if (teachersList === null) {
            dispatch.users.asyncGetTeachersList()
        }
    }, [teachersList])

    React.useEffect(() => {
      if (studentsList === null) {
          dispatch.users.asyncGetStudentsList()
      }
    }, [studentsList])

    const onButtonClick = (user_id) => () => {
        console.log(user_id)
    }

    return (
        <div>
            <Grid container>
                <Grid item xs={12} >
                    <Typography variant="h5" className="header-message">Chat</Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper}>
                <Grid item xs={3}>
                    <Grid item xs={12} style={{padding: '10px'}}>
                        <TextField id="outlined-basic-email" label="Search" variant="outlined" fullWidth value={filter} onChange={({target}) => setFilter(target.value)} />
                    </Grid>
                    <Divider />
                    <List>
                        {users?.filter(user => `${user.user.middle_name} ${user.user.first_name} ${user.user.last_name}`.toLowerCase().includes(filter.toLowerCase()))?.map(user => (
                            <ListItem button key={user.user.id} onClick={onButtonClick(user.user.id)}>
                                <ListItemIcon>
                                    <Avatar />
                                </ListItemIcon>
                                <ListItemText>{`${user.user.middle_name} ${user.user.first_name} ${user.user.last_name}`}</ListItemText>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <Typography>KEK</Typography>
                    <Divider />
                    <List>
                        <ListItem key="1">
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="right" primary="Hey man, What's up ?"></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="right" secondary="09:30"></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem key="2">
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="left" primary="Hey, Iam Good! What about you ?"></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="left" secondary="09:31"></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <ListItem key="3">
                            <Grid container>
                                <Grid item xs={12}>
                                    <ListItemText align="right" primary="Cool. i am good, let's catch up!"></ListItemText>
                                </Grid>
                                <Grid item xs={12}>
                                    <ListItemText align="right" secondary="10:30"></ListItemText>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                    <Divider />
                    <Grid container style={{padding: '20px'}}>
                        <Grid item xs={11}>
                            <TextField id="outlined-basic-email" label="Type Something" fullWidth />
                        </Grid>
                        <Grid xs={1} align="right">
                            <Fab color="primary" aria-label="add"><SendIcon /></Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}
