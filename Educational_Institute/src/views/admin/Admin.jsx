import { useGetAdminShowListQuery, useDeletePostAdminQuery } from "../../app/api/adminSlice"
import Paginate from "../../components/pagination/Paginate"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

//Tabs
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//table
import TableProp from "../../components/utilities/TableProp";

export default function Admin() {

    const [pageValue, setPageValue] = useState({
        page: 1,
    })

    const {
        data,
        isSuccess,
        isLoading,
        isError,
        error,
        refetch,
    } = useGetAdminShowListQuery(pageValue)

    const {
        structuredInstitution = [],
        structuredCollege = [],
        structuredSchool = [],
        totalPage = 1,
    } = data || {}
    
    const handleMovePage = (event, newPage) => {
        if (newPage >= 1 && newPage <= totalPage) {
            setPageValue({
                page: newPage
            })
        }
    }

    const [tabValue, setTabValue] = useState("1")
    const tabSwappingHandler = (event, newVal) => {
        setTabValue(newVal)
    }

    const statusMessage = isLoading
        ? 'Loading admin records...'
        : isError
            ? error?.status === 401 || error?.status === 403
                ? 'Your admin session expired. Log in again to load records.'
                : 'Unable to load admin records right now.'
            : null

    const [deleteValue, setDeleteValue] = useState()

    const {
        isSuccess: success
    } = useDeletePostAdminQuery(deleteValue, {
        skip: !deleteValue,
    })

    useEffect(() => {
        if(success){
            refetch()
        }
    }, [success, refetch])

    const handleDelete = (category, deletion) => {
        setDeleteValue({
            delete: deletion,
            category: category,
        })
    }

    return (
        <main className="admin-page">
            <section className="admin-page-head">
                <div>
                    <span className="eyebrow">Admin workspace</span>
                    <h1>Manage listings</h1>
                    <p>Create, edit, and remove consultancy, college, and school records from one workspace.</p>
                </div>
            </section>
            <section className="admin-panel">
                <Box>
                    <TabContext value={tabValue}>
                        <Box className="admin-tabs">
                            <TabList onChange={tabSwappingHandler}>
                                <Tab value="1" label={`Consultancies (${structuredInstitution?.length || 0})`}/>
                                <Tab value="2" label={`Colleges (${structuredCollege?.length || 0})`}/>
                                <Tab value="3" label={`Schools (${structuredSchool?.length || 0})`}/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            {
                                isSuccess && structuredInstitution.length > 0 ? (
                                    <TableProp
                                        institutionList={structuredInstitution} 
                                        link='new/consultancy'
                                        deletion = {handleDelete}
                                        category = "consultancy"
                                        editLink = "/admin/edit/institution/"
                                    />
                                ) : (
                                    <div className="admin-empty">
                                        {statusMessage || 'No consultancy records to show.'}
                                        {isError && <Link className="admin-inline-link" to="/auth/login">Login</Link>}
                                    </div>
                                )
                            }
                        </TabPanel>
                        <TabPanel value="2">
                            {
                                isSuccess && structuredCollege.length > 0 ? (
                                    <TableProp
                                        institutionList={structuredCollege} 
                                        link='new/college'
                                        deletion = {handleDelete}
                                        category = "college"
                                        editLink = "/admin/edit/college/"
                                    />
                                ) : (
                                    <div className="admin-empty">
                                        {statusMessage || 'No college records to show.'}
                                        {isError && <Link className="admin-inline-link" to="/auth/login">Login</Link>}
                                    </div>
                                )
                            }
                        </TabPanel>
                        <TabPanel value="3">
                            {
                                isSuccess && structuredSchool.length > 0 ? (
                                    <TableProp
                                        institutionList={structuredSchool} 
                                        link='new/school'
                                        deletion = {handleDelete}
                                        category = "school"
                                        editLink = "/admin/edit/school/"
                                    />
                                ) : (
                                    <div className="admin-empty">
                                        {statusMessage || 'No school records to show.'}
                                        {isError && <Link className="admin-inline-link" to="/auth/login">Login</Link>}
                                    </div>
                                )
                            }
                        </TabPanel>
                    </TabContext>
                </Box>
            </section>
            { isSuccess &&
                <Paginate
                    count = {totalPage}
                    update = {handleMovePage}
                    pageCurrently={pageValue.page}
                />
            }
        </main>
    )
}
