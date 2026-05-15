import { usePostUserDiscussionsQuery, useDeleteUserDiscussionsQuery } from '../../app/api/discussionSlice'
import PopUpForm from '../../components/utilities/PopUpForm';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { useEffect, useState } from "react";

export default function UserPosts(){

    const username = localStorage.getItem('username')


    const [formData, setFormData] = useState({
        'username': username
    })

    const [formState, setFormState] = useState(false)

    const [delayedData, setDelayedData] = useState({
        'username': username,
    })

    const [deleteValue, setDeleteValue] = useState()

    const {
        data,
        isSuccess,
        refetch
    } = usePostUserDiscussionsQuery(delayedData)

    useEffect(() => {
        refetch()
    },[data])

    const {
        data: isData,
        isSuccess: success
    } = useDeleteUserDiscussionsQuery(deleteValue)

    const formHandler = (event) => {
        event.preventDefault()
        setFormState(false)
        if(formData.post !== '' && formData.tag !== ''){
            setDelayedData(formData)
        }
    }

    const changeStateValues = (event) => {
        const {name, value} = event.target;
        setFormData((prevVal) => {
            return {
                ...prevVal,
                [name]: value
            }
        })
    }

    const handlePopUpForm = (values) => {
        setFormData({
            'username': username,
            'post' : values.post,
            'tag' : values.tag,
            'id' : values._id,
        })
        setFormState(true)
    }

    const closePopUp = () => {
        setFormData({
            'username': username
        })
        setFormState(false)
    }
    
    const deletePost = (values) => {
        setDeleteValue({
            'deleteVal': values
        })
    }

    useEffect(() => {
        if(success){
            refetch()
        }
    },[isData])

    return(
        <div>
            {
                isSuccess &&
                data.map((item) => {
                    return (
                        <div key={item._id}>
                            <div>{item.tag}</div>
                            <div>{item.post}</div>
                            <div>--------------</div>
                            <IconButton color='primary' onClick={() => handlePopUpForm(item)}><EditIcon/></IconButton>
                            <IconButton color='secondary' onClick={() => deletePost(item._id)}><DeleteSweepIcon/></IconButton>
                        </div>
                    )
                })
            }
            <PopUpForm 
                formPopStatus={formState}
                formSubmit={formHandler}
                formValueChange={changeStateValues}
                formValue={formData}
                closeForm={closePopUp}
            />
        </div>
    )
}
