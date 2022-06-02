import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button,MenuItem  } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { BaseModal } from './Modal'


const initialModalData = {
  name: '',
  type: '',
  recruitment_date: ''
}

export const Subjects = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const subjectsList = useSelector(state => state.subjects.subjectsList)
    const teachersList = useSelector(state => state.users.teachersList)
    // Edit/create entity modal.
    const [open, setOpen] = React.useState(false)
    const [entityID, setEntityID] = React.useState(null)
    const [modalMode, setModalMode] = React.useState('add')
    const onEditClick = (id, data) => () => {
      setModalMode('edit')
      setEntityID(id)
      setOpen(true)
    }
    const onAddClick = () => {
      setModalMode('add')
      setOpen(true)
    }
    const handleDelete = (id) => () => {
      dispatch.subjects.asyncDeleteGroup(id)
    }
    const handleSubmit = React.useCallback((event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      if (modalMode === 'add') {
        dispatch.subjects.asyncCreateSubject(formData)
      } else {
        const data = {}
        formData.forEach((value, key) => {
          data[key] = value
        })
        dispatch.subjects.asyncUpdateSubject({id: entityID, params: data})
      }
      setOpen(false)
    }, [modalMode, entityID])
    // Fired on page render.
    React.useEffect(() => {
        if (subjectsList === null) {
            dispatch.subjects.asyncGetSubjectsList()
        }
    }, [subjectsList])

    return (
        <>
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell align="center">Преподаватель</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjectsList?.data?.map((subj) => (
                <TableRow
                  key={subj.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {subj.name}
                  </TableCell>
                  <TableCell align="center">
                      {`${subj?.teacher?.user?.first_name} ${subj?.teacher?.user?.middle_name} ${subj?.teacher?.user?.last_name}`}
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
                  autoFocus
                >
                  {teachersList?.data?.map((teacehr) => (
                    <MenuItem key={teacehr.user.email} value={teacehr.id}>
                      {`${teacehr.user.first_name} ${teacehr.user.middle_name} ${teacehr.user.last_name}`}
                    </MenuItem>
                  ))}
                </TextField>
              </>
              :
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  defaultValue={subjectsList?.data?.find(ent => ent.id === entityID)?.name}
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
                    defaultValue={subjectsList?.data?.find(ent => ent.id === entityID)?.teacher.id}
                    autoFocus
                  >
                    {teachersList?.data?.map((teacehr) => (
                      <MenuItem key={teacehr.user.email} value={teacehr.id}>
                        {`${teacehr.user.first_name} ${teacehr.user.middle_name} ${teacehr.user.last_name}`}
                      </MenuItem>
                    ))}
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