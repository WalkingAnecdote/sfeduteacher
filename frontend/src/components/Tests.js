import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { OutlinedInput, InputAdornment, IconButton, Typography, TextField, MenuItem } from '@mui/material'
import { ArrowBack, Close } from '@mui/icons-material'

export const Tests = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const tests = useSelector(state => state.tests.tests)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const semestersBySubject = useSelector(state => state.semesters.semestersBySubject)
    const lessonsBySemester = useSelector(state => state.lessons.lessonsBySemester)
    const activitiesByLesson = useSelector(state => state.activities.activitiesByLesson)
    // const activityWithMarks = useSelector(state => state.activities.activityWithMarks)
    // const studentsByGroup = useSelector(state => state.users.studentsByGroup)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [selectedSemester, setSelectedSemester] = React.useState(null)
    const [selectedLesson, setSelectedLesson] = React.useState(null)
    const [selectedActivity, setSelectedActivity] = React.useState(null)

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

    React.useEffect(() => {
        if (selectedActivity !== null) {
            dispatch.tests.asyncGetTestsByActivity(selectedActivity.id)
        }
    }, [dispatch.tests, selectedActivity])

    const breadScumsTitle = React.useMemo(() => {
        const subjectPart = selectedSubject ? selectedSubject.name + ' / ' : ''
        const semesterPart = selectedSemester?.number ? selectedSemester.number + ' / ' : ''
        const groupPart = selectedSemester?.group?.name ? selectedSemester.group.name + ' / ' : ''
        const lessonPart = selectedLesson?.theme ? selectedLesson.theme + ' / ' : ''
        const activityPart = selectedActivity?.description ? selectedActivity.description : ''
        return subjectPart + semesterPart + groupPart + lessonPart + activityPart
    }, [selectedActivity?.description, selectedLesson?.theme, selectedSemester?.group?.name, selectedSemester?.number, selectedSubject])
    
    console.log(tests)
    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>{tests?.length ? 'Список тестов' : "Нет тестов"}</Typography>
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
            {selectedSemester !== null && selectedSubject !== null && lessonsBySemester !== null && selectedLesson !== null && selectedActivity === null && (
                activitiesByLesson?.length ? (
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label='Активность'
                        select
                        value={selectedActivity?.description}
                        onChange={({target}) => setSelectedActivity(target.value)}
                        autoFocus
                    >
                        {activitiesByLesson?.map(activity => (
                            <MenuItem key={`${activity?.id}`} value={activity}>
                                {activity?.description}
                            </MenuItem>
                        ))}
                    </TextField>
                ) : (
                    <Typography textAlign="center">Нет активностей</Typography>
                )
            )}
            {tests?.length ? (
                tests.map(test => (
                    <></>
                ))
            ) : (
                <Typography textAlign="center">Нет тестов</Typography>
            )}
        </>
    )
}
