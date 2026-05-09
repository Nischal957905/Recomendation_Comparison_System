import { BiSearchAlt,BiSolidSortAlt } from 'react-icons/bi'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Search({iterable,category}){

    const [insitution, setInstitution] = useState()
    const navigate = useNavigate()

    const handleInsititutionSelection = (event, newVal) => {
        setInstitution(newVal)
    }

    const handleSearch = ()=>{
        if(insitution && insitution !== ''){
            navigate(`/${category}/${insitution}`)
        }
    }

    // const searchDiv = (
    //     <div className="search-holder">
    //         <div className="search-bar">
    //             <BiSearchAlt className="search-icon"/>
    //             <p>Search</p>
    //         </div>
    //     </div>
    // )

    return (
        <>
            <Autocomplete
                disablePortal
                id="search-completion"
                className="search-bars"
                options={iterable}
                value={insitution}
                onChange={(event, newVal) => handleInsititutionSelection (event, newVal)}
                renderInput={(params) => <div className='dsa'>
                        <TextField {...params} label="Institution"/>
                        
                </div>}
            />
            <div className='dasdsa'>
                <BiSearchAlt className="search-query" onClick={handleSearch}/>
            </div>
        </>
    )

}