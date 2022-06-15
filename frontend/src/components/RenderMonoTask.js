import * as React from 'react'
import { TextField, Typography } from '@mui/material'

export const RenderMonoTask = ({id, text, value}) => {
    return (
        <div>
            <Typography><b>Вопрос: </b>{text} <b>({value} балл(а/ов))</b></Typography>
            <TextField
                margin="normal"
                required
                fullWidth
                label='Введите ваш ответ'
                name={`task_id=${id}`}
                autoFocus
            />
        </div>
    )
}