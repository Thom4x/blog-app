import React from 'react'
import { useUserList } from '../hooks/useStore'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {
    Typography
} from '@mui/material';
import DetailUser from './DetailUser';

const Users = () => {
    const userList = useUserList()

    const createData = (name, username, blogs) => {
        return { name, username, blogs };
    }

    const rows = userList?.map(user => createData(user.name, user.username, user.blogs.length));
    const columns = ['Name', 'Username', 'Blogs Created'];

    return (
        <div>
            <Typography variant="h5">Users</Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column}>{column}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <TableRow key={row.username}>
                                <TableCell component="th" scope="row">
                                    <DetailUser user={userList.find((u) => u.username === row.username)} />
                                </TableCell>
                                <TableCell>{row.username}</TableCell>
                                <TableCell>{row.blogs}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </div>
    )
}

export default Users
