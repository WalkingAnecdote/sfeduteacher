import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Typography, TextField, MenuItem, IconButton, Fab, Button, Box } from '@mui/material'
import { Edit, Add, Delete } from '@mui/icons-material'
import { BaseModal } from './Modal'

export const News = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const posts = useSelector(state => state.posts.posts)
    const teacherSubjects = useSelector(state => state.subjects.teacherSubjects)
    const [open, setOpen] = React.useState(false)
    const [entityID, setEntityID] = React.useState(null)
    const [modalMode, setModalMode] = React.useState('add')

    const isTeacher = React.useMemo(() => {
        return user?.roles?.includes('teacher')
    }, [user?.roles])

    const onEditClick = (id) => () => {
        setModalMode('edit')
        setEntityID(id)
        setOpen(true)
      }
      const onAddClick = () => {
        setModalMode('add')
        setOpen(true)
      }

    const handleSubmit = React.useCallback((event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        if (modalMode === 'add') {
            dispatch.posts.asyncCreatePost(formData)
        } else {
            const params = {
                title: formData.get('title'),
                text: formData.get('text')
            }
            dispatch.posts.asyncUpdatePost({postId: entityID, params})
        }
        setOpen(false)
    }, [dispatch.posts, entityID, modalMode])

    React.useEffect(() => {
        if (isTeacher) {
            dispatch.subjects.asyncGetSubjectsByTeacher(user?.profile?.id)
        }
    }, [dispatch.subjects, isTeacher, user?.profile?.id])

    React.useEffect(() => {
        dispatch.posts.asyncGetPosts()
    }, [dispatch.posts])

    return (
        <>
            <Typography variant='h4' textAlign='center' style={{ marginBottom: '30px' }}>Новости</Typography>
            {posts?.length ? (
                posts.map((post) => (
                    <Box id={post.id}>
                        <Typography variant='h5'>
                            {post.title}
                            {isTeacher && (
                                <>
                                    <IconButton onClick={onEditClick(post.id)}>
                                        <Edit />
                                    </IconButton>
                                    <IconButton onClick={() => dispatch.posts.asyncDeletePost(post.id)}>
                                        <Delete />
                                    </IconButton>
                                </>
                            )}
                        </Typography>
                        <Typography variant='subtitle2'>{post.subject.name}</Typography>
                        <Typography variant='body'>{post.text}</Typography>
                    </Box>
                ))
            ) : (
                <Typography variant='h6' textAlign='center' style={{ marginBottom: '30px' }}>Новостей пока нет.</Typography>
            )}
            {isTeacher && (
                <>
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
                                    label='Предмет'
                                    name='subject_id'
                                    select
                                    autoFocus
                                >
                                {teacherSubjects?.map(subj => (
                                    <MenuItem key={`${subj.name}${subj.id}`} value={subj.id}>
                                        {subj.name}
                                    </MenuItem>
                                ))}
                                </TextField>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label='Заголовок'
                                    name='title'
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label='Текст'
                                    name='text'
                                    autoFocus
                                    multiline
                                    maxRows={5}
                                />
                            </>
                                :
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label='Заголовок'
                                    defaultValue={posts?.find(post => post.id === entityID)?.title}
                                    name='title'
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    label='Текст'
                                    name='text'
                                    defaultValue={posts?.find(post => post.id === entityID)?.text}
                                    autoFocus
                                    multiline
                                    maxRows={5}
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
        </>
    )
}