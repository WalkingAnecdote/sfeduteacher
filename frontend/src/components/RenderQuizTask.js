import * as React from 'react'
import { Typography, FormControl, RadioGroup, FormControlLabel, Radio } from '@mui/material'

export const RenderQuizTask = ({id, question, value}) => {
    return (
        <div>
            <Typography><b>Вопрос: </b>{question.text} <b>({value} балл(а/ов))</b></Typography>
            <FormControl>
                <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="female"
                    name={`task_id=${id}`}
                >
                {question.answers.map(answer => (
                    <FormControlLabel
                        key={`${id}${answer.id}`}
                        value={`answer_id=${answer.id};text=${answer.text}`}
                        control={<Radio />}
                        label={answer.text}
                    />
                ))}
                </RadioGroup>
            </FormControl>
        </div>
    )
}