import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, OutlinedInput, InputAdornment, Box, Fab, Typography, List, ListItem, ListItemText, ListItemButton, TextField, Button, MenuItem } from '@mui/material';
import { Close, Add, Delete } from '@mui/icons-material';
import { BaseModal } from './Modal'


export const Semesters = () => {
    const dispatch = useDispatch()
    const groupsList = useSelector(state => state.groups.groupsList)
    const semestersList = useSelector(state => state.semesters.semestersList)
    const subjectsBySemester = useSelector(state => state.semesters.subjectsBySemester)
    const subjectsList = useSelector(state => state.subjects.subjectsList)
    const [selectedGroup, setSelectedGroup] = React.useState(null)
    const [semesterModal, setSemesterModal] = React.useState(false)
    const [selectedSemester, setSelectedSemester] = React.useState(null)
    const [subjectModal, setSubjectModal] = React.useState(false)
    console.log(subjectsBySemester)
    const handleSubmitSemester = (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      dispatch.semesters.asyncCreateSemester({groupId: selectedGroup.id, formData })

      setSemesterModal(false)
    }
    const handleSubmitSubject = (event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);

      dispatch.semesters.asyncAppendSubjectToSemester({
        semesterId: selectedSemester.id,
        formData
      })

      setSubjectModal(false)
    }

    const handleDetachSubject = (subjectId) => () => {
      const formData = new FormData();

      formData.append('subjects', subjectId)

      dispatch.semesters.asyncDetachSubjectFromSemester({
        semesterId: selectedSemester.id,
        formData
      })
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

    React.useEffect(() => {
      if (selectedSemester !== null && Number.isInteger(selectedSemester.id)) {
            dispatch.semesters.asyncGetSubjectsBySemester(selectedSemester.id)
          }
    }, [dispatch.semesters, selectedSemester])

    React.useEffect(() => {
      if (subjectsList === null) {
            dispatch.subjects.asyncGetSubjectsList()
          }
    }, [dispatch.subjects, subjectsList])

    return (
        <>
          {selectedGroup !== null ? (
            <OutlinedInput
              type='text'
              value={`Выбранная группа: ${selectedGroup.name}`}
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
            {selectedGroup !== null && (selectedSemester !== null ? (
                <OutlinedInput
                  type='text'
                  value={`Выбранный семестр: ${selectedSemester.number}`}
                  fullWidth
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setSelectedSemester(null)}
                      >
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  }
                />
              ) : (
                <>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 1 }}>
                    Семестры группы: 
                    <Fab color="primary" aria-label="add" onClick={() => setSemesterModal(true)}>
                      <Add />
                    </Fab>
                  </Box>
                  {semestersList?.data?.length ? (
                    <List sx={{ bgcolor: 'background.paper' }}>
                      {semestersList?.data.sort((a, b) => a.number - b.number).map((semester) => (
                        <ListItem
                          key={semester.number}
                          secondaryAction={
                            <IconButton aria-label="delete" onClick={() => dispatch.semesters.asyncDeleteSemester({groupId: selectedGroup.id, semesterId: semester.id})}>
                              <Delete />
                            </IconButton>
                          }
                        >
                          <ListItemButton onClick={() => setSelectedSemester(semester)}>
                            <ListItemText primary={`Семестр номер ${semester.number}`} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Typography textAlign="center">Семестры для группы пока не созданы.</Typography>
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
            ))}
        </>
        {selectedGroup !== null && selectedSemester !== null && (
          <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', m: 1 }}>
            Предметы в семестре: 
            <Fab color="primary" aria-label="add" onClick={() => setSubjectModal(true)}>
              <Add />
            </Fab>
          </Box>
            {subjectsBySemester?.data?.length ? (
              <List sx={{ bgcolor: 'background.paper' }}>
                {subjectsBySemester?.data?.map((subject) => (
                  <ListItem
                    key={subject.name + subject.id}
                    secondaryAction={
                      <IconButton aria-label="delete" onClick={handleDetachSubject(subject.id)}>
                        <Delete />
                      </IconButton>
                    }
                  >
                    <ListItemButton>
                      <ListItemText primary={subject.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography textAlign='center'>К выбранному семестру пока не прикреплены предметы.</Typography>
            )}
            <BaseModal open={subjectModal} setOpen={setSubjectModal}>
              <Box component="form" onSubmit={handleSubmitSubject} noValidate sx={{ mt: 1 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label='Группа'
                  name='subjects'
                  select
                  autoFocus
                >
                  {subjectsList?.data?.filter(subject => !subjectsBySemester?.data?.map(subj => subj.id).includes(subject.id)).map(subject => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.name}
                      </MenuItem>
                  ))}
                </TextField>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Добавить предмет к семестру
                </Button>
              </Box>
            </BaseModal>
          </>
        )}
      </>
    )
}
