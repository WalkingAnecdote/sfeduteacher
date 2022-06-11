import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { List, ListItem, ListItemButton, ListItemText, OutlinedInput, InputAdornment, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Fab, Box, TextField, Button,MenuItem, Typography  } from '@mui/material';
import { Edit, Delete, Add, Close } from '@mui/icons-material';
import { BaseModal } from './Modal'

const mapTypesToLocales = (type) => {
  switch (type) {
    case 'practice':
      return 'практика';
    case 'lecture':
      return 'лекция';
    default:
      return '';
  }
}

export const TeacherSubjects = () => {
    // Get data from the store.
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const semestersBySubject = useSelector(state => state.semesters.semestersBySubject)
    const lessonsBySemester = useSelector(state => state.lessons.lessonsBySemester)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [selectedSemester, setSelectedSemester] = React.useState(null)
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
    const handleDeleteLesson = (lessonId) => () => {
      dispatch.lessons.asyncDeleteLesson({
        semesterId: selectedSemester?.id,
        subjectId: selectedSubject?.id,
        lessonId
      })
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
    const handleSubmitLesson = React.useCallback((event) => {
      event.preventDefault();
      const formData = new FormData(event.currentTarget);
      formData.append('teacher_id', user?.profile?.id)
      formData.append('semester_id', selectedSemester?.id)
      formData.append('subject_id', selectedSubject?.id)
      const date = format(new Date(formData.get('date')), 'yyyy-MM-dd H:mm:ss')
      formData.delete('date')
      formData.append('date', date)
      if (modalMode === 'add') {
        dispatch.lessons.asyncCreateLesson(formData)
      } else {
        const params = {
          theme: formData.get('theme'),
          date: formData.get('date'),
          type: formData.get('type')
        }
        dispatch.lessons.asyncUpdateLesson({
          lessonId: entityID,
          semesterId: selectedSemester?.id,
          subjectId: selectedSubject?.id,
          params
        })
      }
      setOpen(false)
    }, [dispatch.lessons, entityID, modalMode, selectedSemester?.id, selectedSubject?.id, user?.profile?.id])
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

    React.useEffect(() => {
      if (selectedSemester !== null && selectedSubject !== null) {
        dispatch.lessons.asyncGetLessonsBySemester({semesterId: selectedSemester?.id, subjectId: selectedSubject?.id})
      }
    }, [dispatch.lessons, selectedSemester, selectedSubject])

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
        {selectedSubject !== null && selectedSemester === null && (
          semestersBySubject?.length ? (
          <>
            <List sx={{ bgcolor: 'background.paper' }}>
              {semestersBySubject.sort((a, b) => a?.number - b?.number).sort((a, b) => a?.group?.id - b?.group?.id).map(semester => (
                <ListItem
                  key={`${semester?.id} ${semester?.group?.id}`}
                >
                  <ListItemButton onClick={() => setSelectedSemester(semester)}>
                    <ListItemText primary={`Семестр № ${semester?.number}, группа ${semester?.group?.name}`} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </>
          ) : (
            <Typography textAlign="center">Нет семестров, привязанных к предмету.</Typography>
          )
        )}
        {selectedSemester !== null && (
          <OutlinedInput
            type='text'
            value={`Семестр № ${selectedSemester?.number}, группа ${selectedSemester?.group?.name}`}
            fullWidth
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setSelectedSemester(null)}
                >
                  <Close />
                </IconButton>
              </InputAdornment>
            }
          />
        )}
        {selectedSemester !== null && selectedSubject !== null && lessonsBySemester !== null && (
          <>
            {lessonsBySemester.length ? (
              <>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Тема</TableCell>
                        <TableCell>Тип</TableCell>
                        <TableCell>Дата</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {lessonsBySemester?.map((lesson) => (
                        <TableRow
                          key={lesson.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {lesson.theme}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {mapTypesToLocales(lesson.type)}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {new Date(lesson.date).toLocaleString('ru')}
                          </TableCell>
                          <TableCell align="center">
                            <IconButton aria-label="edit" onClick={onEditClick(lesson.id)}>
                              <Edit />
                            </IconButton>
                          </TableCell>
                          <TableCell align="center">
                            <IconButton aria-label="delete" onClick={handleDeleteLesson(lesson.id)}>
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </>
            ) : (
              <Typography textAlign="center">Нет занятий в семестре.</Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
              <Fab color="primary" aria-label="add" onClick={onAddClick}>
                <Add />
              </Fab>
            </Box>
            <BaseModal open={open} setOpen={setOpen}>
              <Box component="form" onSubmit={handleSubmitLesson} noValidate sx={{ mt: 1 }}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label='Тема'
                    name='theme'
                    defaultValue={modalMode === 'edit' ? lessonsBySemester?.find(lesson => lesson?.id === entityID)?.theme : undefined}
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label='Тип'
                    defaultValue={modalMode === 'edit' ? lessonsBySemester?.find(lesson => lesson?.id === entityID)?.type : undefined}
                    select
                    name='type'
                    autoFocus
                  >
                    <MenuItem value='practice'>
                      Практика
                    </MenuItem>
                    <MenuItem value='lecture'>
                      Лекция
                    </MenuItem>
                  </TextField>
                  <TextField
                    id="date"
                    label="Дата проведения"
                    type="datetime-local"
                    name='date'
                    sx={{ width: 220 }}
                    defaultValue={modalMode === 'edit' ? format(new Date((lessonsBySemester?.find(lesson => lesson?.id === entityID)?.date)), "yyyy-MM-dd'T'HH:mm") : undefined}
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
                  {modalMode === 'add' ? 'Создать занятие' : 'Обновить занятие'}
                </Button>
              </Box>
            </BaseModal>
        </>)}
      </>
    )
}