import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { List, ListItem, ListItemText, ListItemButton, OutlinedInput, InputAdornment, IconButton, Typography, TextField, MenuItem, Box, Button, Fab } from '@mui/material'
import { ArrowBack, Close, Add, Delete, Edit } from '@mui/icons-material'
import { BaseModal } from './Modal'

const mapTaskType = (type) => {
    switch (type) {
        case 'mono':
            return 'Задача';
        case 'quiz':
            return 'Вопрос с вариантами';
        default:
            return 'Ошибка, у задачи нет типа!';
    }
}

export const Tests = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const tests = useSelector(state => state.tests.tests)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const semestersBySubject = useSelector(state => state.semesters.semestersBySubject)
    const lessonsBySemester = useSelector(state => state.lessons.lessonsBySemester)
    const activitiesByLesson = useSelector(state => state.activities.activitiesByLesson)
    const tasksByTest = useSelector(state => state.tests.tasksByTest)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [selectedSemester, setSelectedSemester] = React.useState(null)
    const [selectedLesson, setSelectedLesson] = React.useState(null)
    const [selectedActivity, setSelectedActivity] = React.useState(null)
    const [selectedTest, setSelectedTest] = React.useState(null)
    const [open, setOpen] = React.useState(false)
    const [modalMode, setModalMode] = React.useState('add')
    const [edittingEntity, setEdittingEntity] = React.useState(null)
    const [taskType, setTaskType] = React.useState('mono')

    const handleSubmitTest = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (selectedActivity !== null && modalMode === 'add') {
            formData.append('activity_id', selectedActivity.id)
            dispatch.tests.asyncCreateTest({
                activityId: selectedActivity?.id,
                formData
            })
        } else if (selectedActivity !== null && edittingEntity !== null && modalMode === 'edit') {
          const params = {
            title: formData.get('title'),
            description: formData.get('description'),
            duration: formData.get('duration'),
            max_value: formData.get('max_value')
          }
          dispatch.tests.asyncUpdateTest({
            testId: edittingEntity?.id,
            activityId: selectedActivity?.id,
            params
          })
        }
        setEdittingEntity(null)
        setOpen(false)
    }

    const handleSubmitTask = (event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (selectedTest !== null && modalMode === 'add') {
            formData.append('test_id', selectedTest.id)
            if (taskType === 'mono') {
                const correctAnswerText = formData.get('correct_answer')
                const answerFormData = new FormData()
                answerFormData.append('text', correctAnswerText)
                formData.delete('correct_answer')
                dispatch.tests.asyncCreateTaskMono({
                    testId: selectedTest.id,
                    answerFormData,
                    formData
                })
            } else if (taskType === 'quiz') {
                // create question form:
                console.log(formData.get('test_id'))
                const questionForm = new FormData()
                questionForm.append('text', formData.get('question_text'))
                // create correct answer form
                const correctAnswerForm = new FormData()
                correctAnswerForm.append('text', formData.get('answer_text_correct'))
                // create answer_0 form:
                const answerForm_0 = new FormData()
                answerForm_0.append('text', formData.get('answer_text_0'))
                // create answer_1 form:
                const answerForm_1 = new FormData()
                answerForm_1.append('text', formData.get('answer_text_1'))
                // create answer_2 form:
                const answerForm_2 = new FormData()
                answerForm_2.append('text', formData.get('answer_text_2'))
                dispatch.tests.asyncCreateTaskQuiz({
                    taskForm: formData,
                    questionForm,
                    correctAnswerForm,
                    answerForm_0,
                    answerForm_1,
                    answerForm_2,
                    testId: selectedTest.id,
                })

            }
        } else if (selectedActivity !== null && edittingEntity !== null && modalMode === 'edit') {
        //   const params = {
        //     title: formData.get('title'),
        //     description: formData.get('description'),
        //     duration: formData.get('duration'),
        //     max_value: formData.get('max_value')
        //   }
        //   dispatch.tests.asyncUpdateTest({
        //     testId: edittingEntity?.id,
        //     activityId: selectedActivity?.id,
        //     params
        //   })
        }
        setEdittingEntity(null)
        setOpen(false)
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

    React.useEffect(() => {
        if (selectedActivity !== null) {
            dispatch.tests.asyncGetTestsByActivity(selectedActivity.id)
        }
    }, [dispatch.tests, selectedActivity])

    React.useEffect(() => {
        if (selectedTest !== null) {
            dispatch.tests.asyncGetTasksByTests(selectedTest.id)
        }
    }, [dispatch.tests, selectedTest])

    const breadScumsTitle = React.useMemo(() => {
        const subjectPart = selectedSubject ? selectedSubject.name + ' / ' : ''
        const semesterPart = selectedSemester?.number ? selectedSemester.number + ' / ' : ''
        const groupPart = selectedSemester?.group?.name ? selectedSemester.group.name + ' / ' : ''
        const lessonPart = selectedLesson?.theme ? selectedLesson.theme + ' / ' : ''
        const activityPart = selectedActivity?.description ? selectedActivity.description + '/' : ''
        const testPart = selectedTest?.title ? selectedTest.title : ''
        return subjectPart + semesterPart + groupPart + lessonPart + activityPart + testPart
    }, [selectedTest?.title, selectedActivity?.description, selectedLesson?.theme, selectedSemester?.group?.name, selectedSemester?.number, selectedSubject])
    
    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>Тесты</Typography>
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
                                        if (selectedTest !== null) {
                                            setSelectedTest(null)
                                        } else if (selectedActivity !== null) {
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
                                    setSelectedActivity(null)
                                    setSelectedTest(null)
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
            {selectedActivity !== null && tests !== null && selectedTest === null && (
                <>
                    {tests?.length ? (
                        <List sx={{ bgcolor: 'background.paper' }}>
                        {tests.map(test => (
                            <ListItem
                                key={`${test.id}test`}
                                secondaryAction={
                                    <>
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => {
                                                setModalMode('edit')
                                                setEdittingEntity(test)
                                                setOpen(true)
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton aria-label="delete" onClick={() => dispatch.tests.asyncDeleteTest(test.id)}>
                                            <Delete />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemButton onClick={() => setSelectedTest(test)}>
                                    <ListItemText primary={test.title} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        </List>
                    ) : (
                        <Typography textAlign="center">Нет тестов</Typography>
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
                        <Box component="form" onSubmit={handleSubmitTest} noValidate sx={{ mt: 1 }}>
                            {modalMode === 'add' &&
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Название'
                                        name='title'
                                        autoFocus
                                    />
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
                                        label='Продолжительность (мин)'
                                        name='duration'
                                        autoFocus
                                        type='number'
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Максимум баллов'
                                        name='max_value'
                                        autoFocus
                                        type='number'
                                    />
                                </>
                            }
                            {modalMode === 'edit' && 
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Название'
                                        name='title'
                                        autoFocus
                                        defaultValue={edittingEntity?.title}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Описание'
                                        name='description'
                                        autoFocus
                                        defaultValue={edittingEntity?.description}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Продолжительность (мин)'
                                        name='duration'
                                        autoFocus
                                        type='number'
                                        defaultValue={edittingEntity?.duration}
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Максимум баллов'
                                        name='max_value'
                                        autoFocus
                                        type='number'
                                        defaultValue={edittingEntity?.max_value}
                                    />
                                </>
                            }
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                {modalMode === 'add' ? 'Создать тест' : 'Обновить тест'}
                            </Button>
                        </Box>
                    </BaseModal>
                </>
            )}
            {selectedTest !== null && tasksByTest !== null && (
                <>
                    {tasksByTest?.length ? (
                        <List sx={{ bgcolor: 'background.paper' }}>
                        {tasksByTest.map(task => (
                            <ListItem
                                key={`${task.id}task`}
                                secondaryAction={
                                    <>
                                        <IconButton
                                            aria-label="edit"
                                            onClick={() => {
                                                setModalMode('edit')
                                                setEdittingEntity(task)
                                                setOpen(true)
                                            }}
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            aria-label="delete"
                                            onClick={() => dispatch.tests.asyncDeleteTaskById({
                                                taskId: task.id,
                                                testId: selectedTest.id
                                            })}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </>
                                }
                            >
                                <ListItemButton onClick={() => false}>
                                    <ListItemText primary={`${mapTaskType(task?.type)}, Текст вопроса: ${task?.text}`} />
                                </ListItemButton>
                            </ListItem>
                        ))}
                        </List>
                    ) : (
                        <Typography textAlign="center">Нет задач в тесте</Typography>
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
                        <Box component="form" onSubmit={handleSubmitTask} noValidate sx={{ mt: 1 }}>
                            {modalMode === 'add' &&
                                <>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Тип'
                                        name='type'
                                        value={taskType}
                                        onChange={({target}) => setTaskType(target.value)}
                                        autoFocus
                                        select
                                    >
                                        <MenuItem value='mono'>
                                            Задача (вписать ответ самому)
                                        </MenuItem>
                                        <MenuItem value='quiz'>
                                            Выбор из вариантов
                                        </MenuItem>
                                    </TextField>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Текст вопроса'
                                        name='text'
                                        autoFocus
                                    />
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label='Баллы'
                                        name='value'
                                        type='number'
                                        autoFocus
                                    />
                                    {taskType === 'mono' && (
                                        <>
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                required
                                                label='Верный ответ'
                                                name='correct_answer'
                                                autoFocus
                                            />
                                        </>
                                    )}
                                    {taskType === 'quiz' && (
                                        <>
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                required
                                                label='Вопрос'
                                                name='question_text'
                                                autoFocus
                                            />
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                required
                                                label='Верный ответ'
                                                name='answer_text_correct'
                                                autoFocus
                                            />
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                required
                                                label='Неверный ответ'
                                                name='answer_text_0'
                                                autoFocus
                                            />
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                required
                                                label='Неверный ответ'
                                                name='answer_text_1'
                                                autoFocus
                                            />
                                            <TextField
                                                margin="normal"
                                                fullWidth
                                                required
                                                label='Неверный ответ'
                                                name='answer_text_2'
                                                autoFocus
                                            />
                                        </>
                                    )}
                                </>
                            }
                            {modalMode === 'edit' && 
                                <>
                                    <Typography>Редактирование в разработке</Typography>
                                </>
                            }
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                >
                                {modalMode === 'add' ? 'Создать тест' : 'Обновить тест'}
                            </Button>
                        </Box>
                    </BaseModal>
                </>
            )}
        </>
    )
}
