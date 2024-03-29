import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, ListItem, ListItemButton, ListItemText, Box, Button, Fab, Typography, OutlinedInput, InputAdornment, IconButton, TextField, MenuItem } from '@mui/material'
import { Close, ArrowBack, Add, Delete, Edit } from '@mui/icons-material'
import { BaseModal } from './Modal'

export const Rating = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const semestersBySubject = useSelector(state => state.semesters.semestersBySubject)
    const lessonsBySemester = useSelector(state => state.lessons.lessonsBySemester)
    const activitiesByLesson = useSelector(state => state.activities.activitiesByLesson)
    const activityWithMarks = useSelector(state => state.activities.activityWithMarks)
    const studentsByGroup = useSelector(state => state.users.studentsByGroup)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [selectedSemester, setSelectedSemester] = React.useState(null)
    const [selectedLesson, setSelectedLesson] = React.useState(null)
    const [selectedActivity, setSelectedActivity] = React.useState(null)
    const [edittingEntityId, setEdittingEntityId] = React.useState(null)
    const [selectedStudent, setSelectedStudent] = React.useState(null)
    const [selectedMark, setSelectedMark] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [modalMode, setModalMode] = React.useState('add')

    const handleSubmit = React.useCallback((event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (selectedLesson !== null && modalMode === 'add') {
            formData.append('lesson_id', selectedLesson?.id)
            dispatch.activities.asyncCreateActivityForLesson(formData)
        } else if (selectedLesson !== null && modalMode === 'edit') {
          const params = {
            description: formData.get('description')
          }
          dispatch.activities.asyncUpdateActivity({
            lessonId: selectedLesson?.id,
            activityId: edittingEntityId,
            params
          })
        }
        setOpen(false)
    }, [dispatch.activities, edittingEntityId, modalMode, selectedLesson])

    const handleSubmitMark = React.useCallback((event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (selectedLesson !== null && selectedActivity !== null && selectedStudent !== null) {
            const value = formData.get('value')
            if (value > selectedActivity?.max_mark) {
                formData.delete('value')
                formData.append('value', selectedActivity?.max_mark)
            }
            if (modalMode === 'add') {
                dispatch.activities.asyncAddMarkForActivity({
                    activityId: selectedActivity.id,
                    studentId: selectedStudent.id,
                    lessonId: selectedLesson.id,
                    formData
                })
            } else if (modalMode === 'edit') {
              const params = {
                value: formData.get('value')
              }
              dispatch.activities.asyncUpdateMarkForActivity({
                activityId: selectedActivity.id,
                studentId: selectedStudent.id,
                lessonId: selectedLesson.id,
                params
              })
            }
        }
        setOpen(false)
        setSelectedStudent(null)
        setSelectedMark(null)
    }, [dispatch.activities, modalMode, selectedActivity, selectedLesson, selectedStudent])

    const deleteActivity = (activityId) => () => {
        if (selectedLesson !== null) {
            dispatch.activities.asyncDeleteActivity({
                lessonId: selectedLesson?.id,
                activityId
            })
        }
    }

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

    React.useEffect(() => {
        if (selectedLesson !== null) {
            dispatch.activities.asyncGetActivitiesByLesson(selectedLesson.id)
        }
    }, [dispatch.activities, selectedLesson])

    React.useEffect(() => {
        if (selectedActivity !== null) {
            dispatch.activities.asyncGetActivityWithMarks(selectedActivity.id)
        }
    }, [dispatch.activities, selectedActivity])

    React.useEffect(() => {
        if (selectedActivity !== null && selectedSemester !== null) {
            dispatch.users.asyncGetStudentsByGroup(selectedSemester?.group?.id)
        }
    }, [dispatch.users, selectedActivity, selectedSemester])

    const findStudentById = (studentId) => {
        const student = studentsByGroup?.find(student => student?.id === studentId)
        return `${student.user.middle_name} ${student.user.first_name} ${student.user.last_name}`
    }

    const studentsWithoutMark = React.useMemo(() => {
        if (studentsByGroup !== null) {
            if (activityWithMarks?.marks) {
                const markedStudentsIds = activityWithMarks.marks.map(mark => mark.student_id)
                return studentsByGroup.filter(student => !markedStudentsIds.includes(student.id))
            }
            return studentsByGroup
        }
        return []
    }, [activityWithMarks?.marks, studentsByGroup])

    const breadScumsTitle = React.useMemo(() => {
        const subjectPart = selectedSubject ? selectedSubject.name + ' / ' : ''
        const semesterPart = selectedSemester?.number ? selectedSemester.number + ' / ' : ''
        const groupPart = selectedSemester?.group?.name ? selectedSemester.group.name + ' / ' : ''
        const lessonPart = selectedLesson?.theme ? selectedLesson.theme + ' / ' : ''
        const activityPart = selectedActivity?.description ? selectedActivity.description : ''
        return subjectPart + semesterPart + groupPart + lessonPart + activityPart
    }, [selectedActivity?.description, selectedLesson?.theme, selectedSemester?.group?.name, selectedSemester?.number, selectedSubject])

    return (
        <>
            {(selectedSubject !== null || selectedSemester !== null) && (
                <OutlinedInput
                    type='text'
                    value={breadScumsTitle}
                    fullWidth
                    endAdornment={
                    <>
                        {(selectedLesson !== null || selectedSemester !== null || selectedSubject !== null) && (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        if (selectedActivity !== null) {
                                            setSelectedActivity(null)
                                        } else if (selectedLesson !== null) {
                                            setSelectedLesson(null)
                                        } else if (selectedSemester !== null) {
                                            setSelectedSemester(null)
                                        } else if (selectedSubject !== null) {
                                            setSelectedSubject(null)
                                        }
                                    }}
                                >
                                    <ArrowBack />
                                </IconButton>
                            </InputAdornment>
                        )}
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={() => {
                                    setSelectedSubject(null)
                                    setSelectedSemester(null)
                                    setSelectedLesson(null)
                                }}
                            >
                                <Close />
                            </IconButton>
                        </InputAdornment>
                    </>
                    }
                />
            )}
            {selectedSubject === null && (
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label='Предмет'
                    select
                    value={selectedSubject?.name}
                    onChange={({target}) => setSelectedSubject(target.value)}
                    autoFocus
                >
                    {teacherSubjects?.map(subj => (
                        <MenuItem key={`${subj.name}${subj.id}`} value={subj}>
                            {subj.name}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            {selectedSubject !== null && selectedSemester === null && (
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label='Семестр'
                    select
                    value={`${selectedSemester?.number} ${selectedSemester?.group?.name}`}
                    onChange={({target}) => setSelectedSemester(target.value)}
                    autoFocus
                >
                    {semestersBySubject?.map(semester => (
                        <MenuItem key={`${semester.number}${semester.id}`} value={semester}>
                            {semester.number} {semester?.group?.name}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            {selectedSemester !== null && selectedSubject !== null && lessonsBySemester !== null && selectedLesson === null && (
                lessonsBySemester?.length ? (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label='Занятие'
                        select
                        value={selectedLesson?.theme}
                        onChange={({target}) => setSelectedLesson(target.value)}
                        autoFocus
                    >
                        {lessonsBySemester?.map(lessons => (
                            <MenuItem key={`${lessons?.theme}${lessons.id}`} value={lessons}>
                                {lessons.theme}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <Typography textAlign="center">Нет занятий</Typography>
                )
            )}
            {selectedLesson !== null && selectedActivity === null && activitiesByLesson !== null && (
                <>
                    {activitiesByLesson.length ? (
                        <List sx={{ bgcolor: 'background.paper' }}>
                            {activitiesByLesson.map(activity => (
                                <ListItem
                                    key={`${activity.id}${activity.description}`}
                                    secondaryAction={
                                        <>
                                            <IconButton
                                                aria-label="edit"
                                                onClick={() => {
                                                    setModalMode('edit')
                                                    setEdittingEntityId(activity?.id)
                                                    setOpen(true)
                                                }}
                                            >
                                                <Edit />
                                            </IconButton>
                                            <IconButton aria-label="delete" onClick={deleteActivity(activity?.id)}>
                                                <Delete />
                                            </IconButton>
                                        </>
                                      }
                                >
                                    <ListItemButton onClick={() => setSelectedActivity(activity)}>
                                        <ListItemText primary={activity.description} />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography textAlign="center">Нет активностей</Typography>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', m: 1 }}>
                        <Fab
                            color="primary"
                            aria-label="add"
                            onClick={() => {
                                setModalMode('add')
                                setOpen(true)
                            }}
                        >
                            <Add />
                        </Fab>
                    </Box>
                    <BaseModal open={open} setOpen={setOpen}>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            {modalMode === 'add' &&
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Описание'
                                        name='description'
                                        autoFocus
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Максимальный балл'
                                        name='max_mark'
                                        type='number'
                                        autoFocus
                                    />
                                </>
                            }
                            {modalMode === 'edit' && 
                                <>
                                    <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    defaultValue={activitiesByLesson?.find(ent => ent.id === edittingEntityId)?.description}
                                    label='Описание'
                                    name='description'
                                    autoFocus
                                    />
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
            {selectedActivity !== null && activityWithMarks !== null && studentsByGroup !== null && (
                <>
                {activityWithMarks?.marks?.length ? (
                    <>
                        <Typography textAlign="center">Студенты с оценкой:</Typography>
                        {activityWithMarks?.marks?.map(mark => (
                            <ListItem
                                key={`${mark?.id}${mark?.activity_id}`}
                                secondaryAction={
                                    <>
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => {
                                                setSelectedMark(mark)
                                                setSelectedStudent({id: mark?.student_id})
                                                setModalMode('edit')
                                                setOpen(true)
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        {/* <IconButton
                                            aria-label="delete"
                                            // onClick={deleteActivity(activity?.id)}
                                        >
                                            <Delete />
                                        </IconButton> */}
                                    </>
                                    }
                            >
                                <ListItemText primary={`${findStudentById(mark?.student_id)}, оценка: ${mark?.value}`} />
                            </ListItem>
                        ))}
                    </>
                ) : null}
                {activityWithMarks?.marks?.length < studentsByGroup?.length && (
                    <>
                        <Typography textAlign="center">Студенты без оценки:</Typography>
                        {studentsWithoutMark.map(student => (
                            <ListItem
                                key={`${student?.id}${student?.user?.id}`}
                                secondaryAction={
                                    <>
                                        <IconButton
                                            aria-label="add"
                                            onClick={() => {
                                                setSelectedStudent(student)
                                                setModalMode('add')
                                                setOpen(true)
                                            }}
                                        >
                                            <Add />
                                        </IconButton>
                                    </>
                                    }
                            >
                                <ListItemText primary={`${student?.user?.middle_name} ${student?.user?.first_name} ${student?.user?.last_name}`} />
                            </ListItem>
                        ))}
                    </>
                )}
                <BaseModal open={open} setOpen={setOpen}>
                    <Box component="form" onSubmit={handleSubmitMark} noValidate sx={{ mt: 1 }}>
                        {modalMode === 'add' &&
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label='Балл'
                                    name='value'
                                    autoFocus
                                    type='number'
                                    inputProps={{ min: 0, max: selectedActivity?.max_mark || 1, step: 1 }}
                                />
                            </>
                        }
                        {modalMode === 'edit' && 
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    defaultValue={selectedMark?.value}
                                    type='number'
                                    inputProps={{ min: 0, max: selectedActivity?.max_mark || 1, step: 1 }}
                                    label='Балл'
                                    name='value'
                                    autoFocus
                                />
                            </>
                        }
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            >
                            {modalMode === 'add' ? 'Создать оценку' : 'Обновить оценку'}
                        </Button>
                    </Box>
                </BaseModal>
                </>
            )}
        </>
    )
}