import { BiSearchAlt } from 'react-icons/bi'
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
        <div className="search-shell">
            <div className="search-meta">
                <span>Search listings</span>
                <p>Find a known institution quickly.</p>
            </div>
            <div className="search-control-row">
                <Autocomplete
                    disablePortal
                    id="search-completion"
                    className="search-bars"
                    options={iterable}
                    value={insitution}
                    onChange={(event, newVal) => handleInsititutionSelection (event, newVal)}
                    renderInput={(params) => <div className='search-field'>
                            <TextField {...params} label="Institution name" placeholder="Type a college, school, or consultancy"/>
                    </div>}
                />
                <button type="button" className='search-submit' onClick={handleSearch}>
                    <BiSearchAlt className="search-query" />
                    <span>Search</span>
                </button>
            </div>
        </div>
    )

}
