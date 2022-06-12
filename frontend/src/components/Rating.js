import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, OutlinedInput, InputAdornment, IconButton, TextField, MenuItem } from '@mui/material'
import { Close } from '@mui/icons-material'

export const Rating = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const semestersBySubject = useSelector(state => state.semesters.semestersBySubject)
    const lessonsBySemester = useSelector(state => state.lessons.lessonsBySemester)
    const [selectedSubject, setSelectedSubject] = React.useState(null)
    const [selectedSemester, setSelectedSemester] = React.useState(null)

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

    const breadScumsTitle = React.useMemo(() => {
        const subjectPart = selectedSubject ? selectedSubject.name + ' / ' : ''
        const semesterPart = selectedSemester?.number ? selectedSemester.number + ' / ' : ''
        const groupPart = selectedSemester?.group?.name ? selectedSemester.group.name : ''
        return subjectPart + semesterPart + groupPart
    }, [selectedSemester?.group?.name, selectedSemester?.number, selectedSubject])

    return (
        <>
            {(selectedSubject !== null || selectedSemester !== null) && (
                <OutlinedInput
                    type='text'
                    value={breadScumsTitle}
                    fullWidth
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => {
                                setSelectedSubject(null)
                                setSelectedSemester(null)
                            }}
                        >
                            <Close />
                        </IconButton>
                    </InputAdornment>
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
                    name='teacher_id'
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
                    name='teacher_id'
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
            {selectedSemester !== null && selectedSubject !== null && lessonsBySemester !== null && (
                lessonsBySemester?.length ? (
                    <Typography textAlign="center">Есть занятия</Typography>
                ) : (
                    <Typography textAlign="center">Нет занятий</Typography>
                )
            )}
        </>
    )
}