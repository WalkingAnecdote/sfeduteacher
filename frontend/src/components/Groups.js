import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button,MenuItem  } from '@mui/material';
import { Create, Delete, Add } from '@mui/icons-material';
import { BaseModal } from './Modal'


const initialModalData = {
  name: '',
  type: '',
  recruitment_date: ''
}

const types = [
  {
    value: 'master',
    label: 'магистры',
  },
  {
    value: 'bachelor',
    label: 'бакалавры',
  }
];

export const Groups = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const groupsList = useSelector(state => state.groups.groupsList)
    // Edit/create entity modal.
    const [open, setOpen] = React.useState(false)
    const [modalData, setModalData] = React.useState(initialModalData)
    const [entityID, setEntityID] = React.useState(null)
    const [modalMode, setModalMode] = React.useState('add')
    const onEditClick = (id) => () => {
      setModalMode('edit')
      setEntityID(id)
      setOpen(true)
    }
    const onAddClick = () => {
      setModalMode('add')
      setModalData(initialModalData)
      setOpen(true)
    }
    const onDelete = (id) => () => {
      dispatch.groups.asyncDeleteGroup(id)
    }

    const handleSubmit = React.useCallback((event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      if (modalMode === 'add') {
        dispatch.groups.asyncCreateGroup(formData)
      } else {
        const data = {}
        formData.forEach((value, key) => {
          data[key] = value
        })
        dispatch.groups.asyncUpdateGroup({id: entityID, params: data})
      }
      setOpen(false)
    }, [modalMode, entityID])
    // Fired on page render.
    React.useEffect(() => {
        if (groupsList === null) {
            dispatch.groups.asyncGetGroupsList()
        }
    }, [dispatch.groups, groupsList])

    return (
        <>
          <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell align="center">Тип</TableCell>
                <TableCell align="center">Дата набора</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {groupsList?.map((group) => (
                <TableRow
                  key={group.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {group.name}
                  </TableCell>
                  <TableCell align="center">{group.type}</TableCell>
                  <TableCell align="center">{group.recruitment_date}</TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="edit" onClick={onEditClick(group.id)}>
                      <Create />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton aria-label="delete" onClick={onDelete(group.id)}>
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
            <TextField
              margin="normal"
              required
              fullWidth
              label='Название'
              defaultValue={modalMode === 'add' ? '' : groupsList?.find(ent => ent.id === entityID)?.name }
              name='name'
              autoFocus
            />
            {modalMode === 'add' &&
              <TextField
                margin="normal"
                required
                fullWidth
                label='Тип'
                select
                defaultValue={modalMode === 'add' ? '' : groupsList?.find(ent => ent.id === entityID)?.type }
                name='type'
                autoFocus
              >
                {types.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            }
            <TextField
              id="date"
              label="Дата набора"
              type="date"
              name='recruitment_date'
              defaultValue={modalMode === 'add' ? '' : groupsList?.find(ent => ent.id === entityID)?.recruitment_date }
              sx={{ width: 220 }}
              InputLabelProps={{
                shrink: true,
              }}
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
    )
}