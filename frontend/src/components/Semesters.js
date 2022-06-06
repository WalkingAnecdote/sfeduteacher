import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, OutlinedInput, InputAdornment, Box, Fab, Typography, List, ListItem, ListItemText, TextField, Button } from '@mui/material';
import { Close, Add, Delete } from '@mui/icons-material';
import { BaseModal } from './Modal'


export const Semesters = () => {
    const dispatch = useDispatch()
    const groupsList = useSelector(state => state.groups.groupsList)
    const semestersList = useSelector(state => state.semesters.semestersList)
    const [selectedGroup, setSelectedGroup] = React.useState(null)
    const [semesterModal, setSemesterModal] = React.useState(false)

    const handleSubmitSemester = (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      dispatch.semesters.asyncCreateSemester({groupId: selectedGroup.id, formData })

      setSemesterModal(false)
    }

    React.useEffect(() => {
      if (groupsList === null) {
            dispatch.groups.asyncGetGroupsList()
          }
    }, [dispatch.groups, groupsList])

    React.useEffect(() => {
      if (selectedGroup !== null && Number.isInteger(selectedGroup.id)) {
            dispatch.semesters.asyncGetSemestersList(selectedGroup.id)
          }
    }, [dispatch.semesters, selectedGroup])

    return (
        <>
          {selectedGroup !== null ? (
            <OutlinedInput
              type='text'
              value={selectedGroup.name}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setSelectedGroup(null)}
                  >
                    <Close />
                  </IconButton>
                </InputAdornment>
              }
            />
          ) : (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell align="center">Тип</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {groupsList?.data?.map((group) => (
                    <TableRow
                      key={group.id}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedGroup(group)}
                    >
                      <TableCell component="th" scope="row">
                        {group.name}
                      </TableCell>
                      <TableCell align="center">{group.type}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          <>
            {selectedGroup !== null && (
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 1 }}>
                  Семестры группы: 
                  <Fab color="primary" aria-label="add" onClick={() => setSemesterModal(true)}>
                    <Add />
                  </Fab>
                </Box>
                {semestersList?.data?.length ? (
                  <List sx={{ bgcolor: 'background.paper' }}>
                    {semestersList?.data.map((semester) => (
                      <ListItem
                        key={semester.number}
                        secondaryAction={
                          <IconButton aria-label="delete" onClick={() => dispatch.semesters.asyncDeleteSemester({groupId: selectedGroup.id, semesterId: semester.id})}>
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={`Семестр номер ${semester.number}`} />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography>Семестры для группы пока не созданы.</Typography>
                )}
                <BaseModal open={semesterModal} setOpen={setSemesterModal}>
                  <Box component="form" onSubmit={handleSubmitSemester} noValidate sx={{ mt: 1 }}>
                      <TextField
                        margin="normal"
                        required
                        fullWidth
                        name='number'
                        type='number'
                        label='Номер семестра'
                        autoFocus
                      />
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{ mt: 3, mb: 2 }}
                    >
                      Создать сущность
                    </Button>
                  </Box>
                </BaseModal>
              </>
            )}
        </>
      </>
    )
}
