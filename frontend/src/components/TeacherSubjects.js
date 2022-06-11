import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { List, ListItem, ListItemButton, ListItemText, OutlinedInput, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button,MenuItem, Typography  } from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';
import { BaseModal } from './Modal'


export const TeacherSubjects = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const semestersBySubject = useSelector(state => state.semesters.semestersBySubject)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    // Edit/create entity modal.
    const [open, setOpen] = React.useState(false)
    const [entityID, setEntityID] = React.useState(null)
    const [modalMode, setModalMode] = React.useState('add')
    const onEditClick = (id) => () => {
      setModalMode('edit')
      setEntityID(id)
      setOpen(true)
    }
    const onAddClick = () => {
      setModalMode('add')
      setOpen(true)
    }
    const handleDelete = (subjectId) => () => {
      dispatch.subjects.asyncDeleteSubjectFromTeacher({subjectId, teacherId: user?.profile?.id})
    }
    const handleSubmit = React.useCallback((event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      if (modalMode === 'add') {
        dispatch.subjects.asyncCreateSubjectFromTeacher({teacherId: user?.profile?.id, formData: formData})
      } else {
        const params = {
          name: formData.get('name')
        }
        dispatch.subjects.asyncUpdateSubjectFromTeacher({subjectId: entityID, teacherId: user?.profile?.id, params})
      }
      setOpen(false)
    }, [modalMode, dispatch.subjects, user?.profile?.id, entityID])
    // Fired on page render.
    React.useEffect(() => {
        if (teacherSubjects === null && user !== null) {
            dispatch.subjects.asyncGetSubjectsByTeacher(user?.profile?.id)
        }
    }, [dispatch.subjects, teacherSubjects, user])

    React.useEffect(() => {
      if (selectedSubject !== null) {
        dispatch.semesters.asyncGetSemestersBySubject(selectedSubject.id)
      }
    }, [dispatch.semesters, selectedSubject])

    return (
        <>
          {selectedSubject !== null ? (
            <OutlinedInput
              type='text'
              value={`Выбранный предмет: ${selectedSubject.name}`}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setSelectedSubject(null)}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
          <>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {teacherSubjects?.map((subj) => (
                    <TableRow
                      key={subj.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row" onClick={() => setSelectedSubject(subj)}>
                        {subj.name}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="edit" onClick={onEditClick(subj.id)}>
                          <Edit />
                        </IconButton>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton aria-label="delete" onClick={handleDelete(subj.id)}>
                          <Delete />
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
                {
                  modalMode === 'add' ?
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label='Название'
                      name='name'
                      autoFocus
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      label='Преподаватель'
                      select
                      name='teacher_id'
                      defaultValue={user?.profile?.id}
                      autoFocus
                    >
                      <MenuItem value={user?.profile?.id}>
                        {`${user?.middle_name} ${user?.first_name} ${user?.last_name}`}
                      </MenuItem>
                    </TextField>
                  </>
                  :
                  <>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      defaultValue={teacherSubjects?.find(ent => ent.id === entityID)?.name}
                      label='Название'
                      name='name'
                      autoFocus
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label='Преподаватель'
                        select
                        name='teacher_id'
                        defaultValue={user?.profile?.id}
                        autoFocus
                      >
                        <MenuItem value={user?.profile?.id}>
                          {`${user?.middle_name} ${user?.first_name} ${user?.last_name}`}
                        </MenuItem>
                      </TextField>
                    </>
                }
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
        {selectedSubject !== null && (
          semestersBySubject?.length ? (
          <>
            <List sx={{ bgcolor: 'background.paper' }}>
              {semestersBySubject.sort((a, b) => a?.number - b?.number).sort((a, b) => a?.group?.id - b?.group?.id).map(semester => (
                <ListItem
                  key={`${semester?.id} ${semester?.group?.id}`}
                >
                  <ListItemButton onClick={() => false}>
                    <ListItemText primary={`Семестр № ${semester?.number}, группа ${semester?.group?.name}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
          ) : (
          <>
            Нет семестров, привязанных к предмету.
          </>
          )
        )}
      </>
    )
}