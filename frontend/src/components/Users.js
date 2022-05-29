import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux'
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';

export const Users = () => {
    const dispatch = useDispatch()
    const teachersList = useSelector(state => state.users.teachersList)
    React.useEffect(() => {
        if (teachersList === null) {
            dispatch.users.asyncGetTeachersList()
        }
    }, [dispatch.users, teachersList])

    return (
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Имя</TableCell>
              <TableCell align="center">Фамилия</TableCell>
              <TableCell align="center">Отчество</TableCell>
              <TableCell align="center">Почта</TableCell>
              <TableCell align="center">Верифицирован</TableCell>
              <TableCell align="center">Забанен</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachersList?.map(({ user }) => (
              <TableRow
                key={user.email}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {user.first_name}
                </TableCell>
                <TableCell align="center">{user.middle_name}</TableCell>
                <TableCell align="center">{user.last_name}</TableCell>
                <TableCell align="center">{user.email}</TableCell>
                <TableCell align="center">{user.approved}</TableCell>
                <TableCell align="center">{user.banned}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
}