import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

export default function Paginate({count, update, pageCurrently}){
    if (!count || count <= 1) {
        return null
    }

    return (
        <Stack className="pagination-shell" spacing={2}>
            <Pagination
                count={count}
                color="primary"
                onChange={update}
                page={pageCurrently}
                shape="rounded"
                siblingCount={1}
                boundaryCount={1}
            />
        </Stack>
    )
}
