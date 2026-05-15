import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


export default function PostsTable({props}) {

    return (
        <div className="admin-table-wrap">
            <div className="admin-table-toolbar">
                <div>
                    <strong>User posts</strong>
                    <span>{props.length} posts</span>
                </div>
            </div>
        <TableContainer className="admin-table-container" component={Paper}>
            <Table sx={{ minWidth: 620 }} size="small" aria-label="admin user posts table">
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Post</TableCell>
                        <TableCell>Date</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.map((item,index) => {
                            return (
                                <TableRow
                                    key={item._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >   
                                    <TableCell className="admin-record-id">{index + 1}</TableCell>
                                    <TableCell className="admin-record-name">{item.post}</TableCell>
                                    <TableCell>{item.date}</TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
        </TableContainer>
        </div>
    )
}
