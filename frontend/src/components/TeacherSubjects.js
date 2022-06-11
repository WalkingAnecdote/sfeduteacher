import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button,MenuItem  } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { BaseModal } from './Modal'


export const TeacherSubjects = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
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

    return (
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
                  <TableCell component="th" scope="row">
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
    )
}