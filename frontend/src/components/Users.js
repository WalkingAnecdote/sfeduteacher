import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button, Tabs, Tab, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { Create, Add, Delete } from '@mui/icons-material';
import { BaseModal } from './Modal'


const userFields = [
  {
    type: 'text',
    name: 'user[first_name]',
    label: 'first_name'
  },
  {
    type: 'text',
    name: 'user[middle_name]',
    label: 'middle_name'
  },
  {
    type: 'text',
    name: 'user[last_name]',
    label: 'last_name'
  },
  {
    type: 'text',
    name: 'user[email]',
    label: 'email'
  },
  {
    type: 'text',
    name: 'user[password]',
    label: 'password'
  },
  {
    type: 'checkbox',
    name: 'user[approved]',
    label: 'approved'
  },
  {
    type: 'checkbox',
    name: 'user[banned]',
    label: 'banned'
  }
]

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
    case 'approved':
      return 'Верифицирован';
    case 'banned':
      return 'Забанен';
    case 'rank':
      return 'Должность';
    case 'group_id':
      return 'Группа';
    default:
      return 'NULL';
  }
}

export const Users = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const teachersList = useSelector(state => state.users.teachersList)
    const studentsList = useSelector(state => state.users.studentsList)
    const groupsList = useSelector(state => state.groups.groupsList)
    // Edit/create entity modal.
    const [open, setOpen] = React.useState(false)
    const [entityID, setEntityID] = React.useState(null)
    const [modalMode, setModalMode] = React.useState('add')
    const onEditClick = (id) => () => {
      setModalMode('edit')
      setEntityID(id)
      setOpen(true)
    }
    const onAddClick = () => () => {
      setModalMode('add')
      setEntityID(null)
      setOpen(true)
    }
    const handleSubmit = React.useCallback((event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      if (modalMode === 'add') {
        if (value === 0) {
          dispatch.users.asyncCreateTeacher(formData)
        } else if (value === 1) {
          dispatch.users.asyncCreateStudent(formData)
        }
      } else {
        const currentEntity = value === 0
          ? teachersList?.data?.find(ent => ent.id === entityID)
          : studentsList?.data?.find(ent => ent.id === entityID)
        const checkboxKeys = ['user[approved]', 'user[banned]']
        checkboxKeys.forEach((key) => {
          const val = formData.get(key)
          if (val === null || val === undefined) {
            formData.append(key, 0)
          }
        })
        const keysToRemove = []
        formData.forEach((value, key) => {
          if (key === 'user[password]' && !value) {
            keysToRemove.push(key)
          } else if (key === 'user[email]' && currentEntity.user.email === value) {
            keysToRemove.push(key)
          }
        })
        keysToRemove.forEach(key => {
          formData.delete(key)
        })
        if (value === 0) {
          dispatch.users.asyncUpdateTeacher({id: entityID, formData})
        } else if (value === 1) {
          dispatch.users.asyncUpdateStudent({id: entityID, formData})
        }
      }
      setOpen(false)
    }, [modalMode, entityID])
    // Fired on page render.
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
  
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    console.log(studentsList?.data?.find(ent => ent.id === entityID))

    return (
        <>
          <Tabs value={value} onChange={handleChange} aria-label="disabled tabs example">
            <Tab label="Преподаватели" />
            <Tab label="Студенты" />
          </Tabs>
          {value === 0 && (
            <>
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Фамилия</TableCell>
                    <TableCell align="center">Имя</TableCell>
                    <TableCell align="center">Отчество</TableCell>
                    <TableCell align="center">Почта</TableCell>
                    <TableCell align="center">Должность</TableCell>
                    <TableCell align="center">Верифицирован</TableCell>
                    <TableCell align="center">Забанен</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teachersList?.data?.map((profile) => (
                    <TableRow
                      key={profile.user.email}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {profile.user.middle_name}
                      </TableCell>
                      <TableCell align="center">{profile.user.first_name}</TableCell>
                      <TableCell align="center">{profile.user.last_name}</TableCell>
                      <TableCell align="center">{profile.user.email}</TableCell>
                      <TableCell align="center">{profile.rank}</TableCell>
                      <TableCell align="center">{profile.user.approved}</TableCell>
                      <TableCell align="center">{profile.user.banned}</TableCell>
                      <TableCell align="center">
                      <IconButton aria-label="edit" onClick={onEditClick(profile.id)}>
                        <Create />
                      </IconButton>
                      {/* <IconButton aria-label="delete" onClick={onDeleteClick(profile.id)}>
                        <Delete />
                      </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
              <Fab color="primary" aria-label="add" onClick={onAddClick()}>
                <Add />
              </Fab>
            </Box>
            <BaseModal open={open} setOpen={setOpen}>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                {userFields.map((field) => {
                  const isCheckbox = field.type === 'checkbox'
                  const valueFromList = teachersList?.data?.find(ent => ent.id === entityID)?.user?.[field.label]
                  return isCheckbox
                    ? (
                      <FormControlLabel
                        key={field.name}
                        name={field.name}
                        control={
                          <Checkbox
                            value={1}
                            defaultChecked={valueFromList}
                          />}
                        label={mapKeysToHumanWords(field.label)}
                      >
                      </FormControlLabel>
                    ) :(
                      <TextField
                        key={field.name}
                        margin="normal"
                        required
                        fullWidth
                        type={field.type}
                        label={mapKeysToHumanWords(field.label)}
                        name={field.name}
                        defaultValue={isCheckbox ? undefined : teachersList?.data?.find(ent => ent.id === entityID)?.user?.[field.label]}
                        autoFocus
                      />
                    )
                })}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label='Должность'
                  name='profile[rank]'
                  defaultValue={teachersList?.data?.find(ent => ent.id === entityID)?.rank}
                  autoFocus
                />
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
          )}
          {value === 1 && (
              <>
              <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Фамилия</TableCell>
                    <TableCell align="center">Имя</TableCell>
                    <TableCell align="center">Отчество</TableCell>
                    <TableCell align="center">Почта</TableCell>
                    <TableCell align="center">Группа</TableCell>
                    <TableCell align="center">Верифицирован</TableCell>
                    <TableCell align="center">Забанен</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentsList?.data?.map((profile) => (
                    <TableRow
                      key={profile.user.email}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">
                        {profile.user.middle_name}
                      </TableCell>
                      <TableCell align="center">{profile.user.first_name}</TableCell>
                      <TableCell align="center">{profile.user.last_name}</TableCell>
                      <TableCell align="center">{profile.user.email}</TableCell>
                      <TableCell align="center">{profile.group?.name}</TableCell>
                      <TableCell align="center">{profile.user.approved}</TableCell>
                      <TableCell align="center">{profile.user.banned}</TableCell>
                      <TableCell align="center">
                      <IconButton aria-label="edit" onClick={onEditClick(profile.id)}>
                        <Create />
                      </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
              <Fab color="primary" aria-label="add" onClick={onAddClick()}>
                <Add />
              </Fab>
            </Box>
            <BaseModal open={open} setOpen={setOpen}>
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              {userFields.map((field) => {
                  const isCheckbox = field.type === 'checkbox'
                  const valueFromList = studentsList?.data?.find(ent => ent.id === entityID)?.user?.[field.label]
                  return isCheckbox
                    ? (
                      <FormControlLabel
                        key={field.name}
                        name={field.name}
                        control={
                          <Checkbox
                            value={1}
                            defaultChecked={valueFromList}
                          />}
                        label={mapKeysToHumanWords(field.label)}
                      >
                      </FormControlLabel>
                    ) :(
                      <TextField
                        key={field.name}
                        margin="normal"
                        required
                        fullWidth
                        type={field.type}
                        label={mapKeysToHumanWords(field.label)}
                        name={field.name}
                        defaultValue={isCheckbox ? undefined : studentsList?.data?.find(ent => ent.id === entityID)?.user?.[field.label]}
                        autoFocus
                      />
                    )
                })}
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label='Группа'
                  name='profile[group_id]'
                  select
                  defaultValue={studentsList?.data?.find(ent => ent.id === entityID)?.group?.id}
                  autoFocus
                >
                {groupsList?.data?.map(group => (
                    <MenuItem key={group.id} value={group.id}>
                      {group.name}
                    </MenuItem>
                ))}
                </TextField>
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
          )}
      </>
    )
}