import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom'
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IconButton from '@mui/material/IconButton';

export default function TableProp({institutionList, link, deletion, category, editLink}) {

    return (
        <div className="admin-table-wrap">
            <div className="admin-table-toolbar">
                <div>
                    <strong>{category === 'consultancy' ? 'Consultancies' : `${category.charAt(0).toUpperCase()}${category.slice(1)}s`}</strong>
                    <span>{institutionList.length} records</span>
                </div>
                <Link className="admin-create-link" to={link}>
                    <AddBoxIcon />
                    <span>Create new</span>
                </Link>
            </div>
        <TableContainer className="admin-table-container" component={Paper}>
            <Table sx={{ minWidth: 620 }} size="small" aria-label="admin records table">
                <TableHead>
                    <TableRow>
                        <TableCell>Actions</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Record ID</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        institutionList.map((item) => {
                            return (
                                <TableRow
                                    key={item.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >   
                                    <TableCell className="admin-actions-cell">
                                        <Link className="admin-icon-action" aria-label={`Edit ${item.name}`} to={`${editLink}${item._id}`}><EditIcon/></Link>
                                        <IconButton className="admin-icon-action danger" aria-label={`Delete ${item.name}`} onClick={() => deletion(category,item._id)}><DeleteSweepIcon/></IconButton>
                                    </TableCell>
                                    <TableCell className="admin-record-name">{item.name}</TableCell>
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
