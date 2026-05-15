import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import BlockIcon from '@mui/icons-material/Block';
import { LiaCrownSolid } from 'react-icons/lia';


export default function AdminUserTable({props, deletion}) {

    const admin = '64e4c30593fb86fc6472fa18';

    return (
        <div className="admin-table-wrap">
            <div className="admin-table-toolbar">
                <div>
                    <strong>Users</strong>
                    <span>{props.length} accounts</span>
                </div>
            </div>
        <TableContainer className="admin-table-container" component={Paper}>
            <Table sx={{ minWidth: 620 }} size="small" aria-label="admin users table">
                <TableHead>
                    <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>Username</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Record ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        props.map((item) => {
                            return (
                                <TableRow
                                    key={item._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >   
                                    <TableCell className="admin-actions-cell">
                                        <Link className="admin-icon-action" aria-label={`View ${item.username}`} to={`/admin/edit/user/${item._id}`}><RemoveRedEyeIcon/></Link>
                                        {
                                            item.role_id !== admin &&
                                        <IconButton className="admin-icon-action danger" aria-label={`Block ${item.username}`} onClick={() => deletion(item._id)}><BlockIcon/>
                                        </IconButton>
                                        }
                                    </TableCell>
                                    <TableCell className="admin-record-name">{item.role_id === admin && <LiaCrownSolid className="admin-crown" />}{item.username}</TableCell>
                                    <TableCell><span className={item.status === 'Active' ? 'admin-status active' : 'admin-status'}>{item.status}</span></TableCell>
                                    <TableCell className="admin-record-id">{item._id}</TableCell>
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
