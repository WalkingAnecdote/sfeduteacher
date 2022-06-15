import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Typography, TextField, MenuItem, OutlinedInput, InputAdornment, IconButton, Card, CardContent, CardActions, Button, Box } from '@mui/material'
import { ArrowBack, Close } from '@mui/icons-material'
import { BaseModal } from './Modal'
import { RenderMonoTask } from './RenderMonoTask'
import { RenderQuizTask } from './RenderQuizTask'


export const StudentsTests = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const semestersList = useSelector(state => state.semesters.semestersList)
    const subjectsBySemester = useSelector(state => state.semesters.subjectsBySemester)
    const lessonsBySemester = useSelector(state => state.lessons.lessonsBySemester)
    const activitiesByLesson = useSelector(state => state.activities.activitiesByLesson)
    const tests = useSelector(state => state.tests.tests)
    const test = useSelector(state => state.tests.test)
    const [selectedSemester, setSelectedSemester] = React.useState(null)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [selectedLesson, setSelectedLesson] = React.useState(null)
    const [selectedActivity, setSelectedActivity] = React.useState(null)
    const [selectedTest, setSelectedTest] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [startTime, setStartTime] = React.useState(false)

    React.useEffect(() => {
        if (user?.profile?.group_id) {
            dispatch.semesters.asyncGetSemestersList(user?.profile?.group_id)
        }
    }, [dispatch.semesters, user?.profile?.group_id])

    React.useEffect(() => {
        if (selectedSemester !== null) {
            dispatch.semesters.asyncGetSubjectsBySemester(selectedSemester.id)
        }
    }, [dispatch.semesters, selectedSemester])

    React.useEffect(() => {
        if (selectedSemester !== null && selectedSubject !== null) {
            dispatch.lessons.asyncGetLessonsBySemester({
                semesterId: selectedSemester.id,
                subjectId: selectedSubject.id
            })
        }
    }, [dispatch.lessons, selectedSemester, selectedSubject])

    React.useEffect(() => {
        if (selectedLesson !== null) {
            dispatch.activities.asyncGetActivitiesByLesson(selectedLesson.id)
        }
    }, [dispatch.activities, selectedLesson])
    
    React.useEffect(() => {
        if (selectedActivity !== null) {
            dispatch.tests.asyncGetTestsByActivity(selectedActivity.id)
        }
    }, [dispatch.tests, selectedActivity])

    React.useEffect(() => {
        if (selectedTest !== null) {
            dispatch.tests.asyncGetTest(selectedTest.id)
        }
    }, [dispatch.tests, selectedTest])

    React.useEffect(() => {
        if (test !== null) {
            setOpen(true)
            setStartTime(new Date())
        }
    }, [test])

    const handleSubmitTest = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.append('start_time', format(startTime, 'yyyy-MM-dd HH:mm:ss'))
        formData.append('end_time', format(new Date(), 'yyyy-MM-dd HH:mm:ss'))
        // append results to the form and send
        dispatch.tests.asyncCreateStudentAnswersAndSubmitTest({
            testId: selectedTest.id,
            studentId: user.profile.id,
            formData
        })
        setOpen(false)
        setSelectedTest(null)
        setStartTime(null)
    }

    const breadScumsTitle = React.useMemo(() => {
        const subjectPart = selectedSubject ? selectedSubject.name + ' / ' : ''
        const semesterPart = selectedSemester?.number ? selectedSemester.number + ' / ' : ''
        const lessonPart = selectedLesson?.theme ? selectedLesson.theme + ' / ' : ''
        const activityPart = selectedActivity?.description ? selectedActivity.description + '/' : ''
        return semesterPart + subjectPart + lessonPart + activityPart
    }, [selectedSubject, selectedSemester?.number, selectedLesson?.theme, selectedActivity?.description])

    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>Тесты</Typography>
            {(selectedSemester !== null) && (
                <OutlinedInput
                    type='text'
                    value={breadScumsTitle}
                    fullWidth
                    endAdornment={
                    <>
                        {selectedSemester !== null && (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {
                                        if (selectedActivity !== null) {
                                            setSelectedActivity(null)
                                        } else if (selectedLesson !== null) {
                                            setSelectedLesson(null)
                                        } else if (selectedSubject !== null) {
                                            setSelectedSubject(null)
                                        } else if (selectedSemester !== null) {
                                            setSelectedSemester(null)
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
                                    setSelectedSemester(null)
                                    setSelectedSubject(null)
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
            {selectedSemester === null && (
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
                    {semestersList?.sort((a, b) => a.number - b.number)?.map(semester => (
                        <MenuItem key={`${semester.number}${semester.id}`} value={semester}>
                            {semester.number} {semester?.group?.name}
                        </MenuItem>
                    ))}
                </TextField>
            )}
            {selectedSemester !== null && selectedSubject === null  && (
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label='Семестр'
                    select
                    value={selectedSubject?.name}
                    onChange={({target}) => setSelectedSubject(target.value)}
                    autoFocus
                >
                    {subjectsBySemester?.map(subject => (
                        <MenuItem key={subject.name + subject.id} value={subject}>
                            {subject.name}
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
            {selectedActivity !== null && tests?.length ? (
                tests.map(test => (
                    <Card key={`${test.id}test`} sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                {test.title}
                            </Typography>
                            <Typography variant="body2">
                                <b>Описание теста:</b>
                            </Typography>
                            <Typography variant="body2">{test.description}</Typography>
                            <Typography variant="body2">
                                <b>Продолжительность теста:</b> {test.duration} мин.
                            </Typography>
                            <Typography variant="body2">
                                <b>Максимум баллов:</b> {test.max_value}
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={() => setSelectedTest(test)}>Начать тестирование</Button>
                        </CardActions>
                    </Card>
                ))
                ) : (
                    <Typography textAlign="center">Нет тестов</Typography>
                )
            }
            {selectedTest !== null && test !== null && (
                <BaseModal open={open} setOpen={setOpen} outerStyle={{ width: '70%', height: '70%' }}>
                    <Box component="form" onSubmit={handleSubmitTest} noValidate sx={{ mt: 1 }}>
                        <Typography>Время начала теста: {startTime.toString()}</Typography>
                        <Typography>Времени осталось: </Typography>
                        {test.tasks?.map((task => {
                            if (task.type === 'mono') {
                                return <RenderMonoTask key={task.id} {...task} />
                            } else if (task.type === 'quiz') {
                                return <RenderQuizTask key={task.id} {...task} />
                            } else {
                                return null
                            }
                        }))}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            >
                            Отправить ответы
                        </Button>
                    </Box>
                </BaseModal>
            )}
        </>
    )
}