import * as React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { format } from 'date-fns'
import { Typography, TextField, MenuItem, OutlinedInput, InputAdornment, IconButton, Card, CardContent, CardActions, Button, Box } from '@mui/material'
import { ArrowBack, Close } from '@mui/icons-material'
import { BaseModal } from './Modal'

export const News = () => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)

    return (
        <>
            KEK
        </>
    )
}