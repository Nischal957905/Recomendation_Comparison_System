import React, { useEffect, useRef, useState } from "react";
import FormControl from '@mui/material/FormControl';
import { RiArrowDropDownLine } from 'react-icons/ri'
import { Checkbox, Select, InputLabel, OutlinedInput, MenuItem, ListItemText } from "@mui/material";

export default function Filter(props){

    const { 
        fieldName,
        values,
        update,
        options,
    } = props

    const [selectedValue, setSelectedValue] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef();
    
    useEffect(() => {
        let handler = (e) => {
            if(!menuRef.current.contains(e.target)){
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)

        return () => {
            document.removeEventListener("mousedown",handler)
        }
    })

    function showMenuOptions(event){
        event.preventDefault()
        setMenuOpen(prevVal => {
            return !prevVal
        })
    }

    const handleCheckboxChange = (event) => {
        const { value, checked} = event.target
        if (checked) {
            update(fieldName, [...values, value])
          } else {
            update(fieldName, values.filter((institutions) => institutions !== value))
          }
    }

    return (
        <div className="filter-showcase" ref={menuRef}>
            <div className="menu-showcase"><button onClick={showMenuOptions}>{fieldName}<RiArrowDropDownLine/></button></div>
            {
                menuOpen &&
                    <div className="menu-options">
                        {
                            options.map((option,index) => (
                                <label key={index}>
                                    <input 
                                        key={index} 
                                        type="checkbox" 
                                        value={option}
                                        onChange={handleCheckboxChange}
                                        checked={values.includes(option)}/>
                                    {option}
                                </label>
                            ))
                        }
                    </div>
            }
        </div>
    )
}
