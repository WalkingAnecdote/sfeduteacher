import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button } from '@mui/material';
import { Create, Add } from '@mui/icons-material';
import { BaseModal } from './Modal'


const initialModalData = {
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  password: '',
  rank: ''
}

const mapKeysToHumanWords = (key) => {
  switch (key) {
    case 'first_name':
      return 'Имя';
    case 'middle_name':
      return 'Фамилия';
    case 'last_name':
      return 'Отчество';
    case 'email':
      return 'Почта';
    case 'password':
      return 'Пароль';
    case 'rank':
      return 'Должность';
    default:
      return 'NULL';
  }
}

export const Users = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const teachersList = useSelector(state => state.users.teachersList)

    // Edit/create entity modal.
    const [open, setOpen] = React.useState(false)
    const [modalData, setModalData] = React.useState(initialModalData)
    const [modalMode, setModalMode] = React.useState('add')
    const onEditClick = (data) => () => {
      setModalMode('edit')
      setModalData(data)
      setOpen(true)
    }
    const onAddClick = () => {
      setModalMode('add')
      setModalData(initialModalData)
      setOpen(true)
    }

    const handleSubmit = React.useCallback((event) => {
      event.preventDefault();
      const formData = new FormData();
      for (let key in modalData) {
        let formKey;
        if (key === 'rank') {
          formKey = `profile[${key}]`
        } else {
          formKey = `user[${key}]`
        }
        formData.append(formKey, modalData[key])
      }
      if (modalMode === 'add') {
        dispatch.users.asyncCreateTeacher(formData)
      } else {
        console.log('UPDATE')
      }
      setOpen(false)
    }, [modalMode, modalData])
    // Fired on page render.
    React.useEffect(() => {
        if (teachersList === null) {
            dispatch.users.asyncGetTeachersList()
        }
    }, [dispatch.users, teachersList])

    return (
        <>
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Имя</TableCell>
                <TableCell align="center">Фамилия</TableCell>
                <TableCell align="center">Отчество</TableCell>
                <TableCell align="center">Почта</TableCell>
                <TableCell align="center">Верифицирован</TableCell>
                <TableCell align="center">Забанен</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachersList?.data?.map(({ user }) => (
                <TableRow
                  key={user.email}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {user.first_name}
                  </TableCell>
                  <TableCell align="center">{user.middle_name}</TableCell>
                  <TableCell align="center">{user.last_name}</TableCell>
                  <TableCell align="center">{user.email}</TableCell>
                  <TableCell align="center">{user.approved}</TableCell>
                  <TableCell align="center">{user.banned}</TableCell>
                  <TableCell align="center">
                  <IconButton aria-label="edit" onClick={onEditClick({first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name, rank: user.rank})}>
                    <Create />
                  </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
          <Fab color="primary" aria-label="add" onClick={onAddClick}>
            <Add />
          </Fab>
        </Box>
        <BaseModal open={open} setOpen={setOpen}>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            {Object.entries(modalData).map((entry) => (
              <TextField
                key={entry[0]}
                margin="normal"
                required
                fullWidth
                id={entry[0]}
                label={mapKeysToHumanWords(entry[0])}
                name={entry[0]}
                defaultValue={entry[1]}
                onChange={(event) => setModalData({...modalData, [entry[0]]: event.target.value})}
                autoFocus
              />
            ))}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {modalMode === 'add' ? 'Создать сущность' : 'Обновить сущность'}
            </Button>
          </Box>
        </BaseModal>
      </>
    )
}