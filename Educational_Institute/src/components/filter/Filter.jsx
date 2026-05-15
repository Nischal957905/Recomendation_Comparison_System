import React, { useEffect, useRef, useState } from "react";
import { RiArrowDropDownLine } from 'react-icons/ri'

export default function Filter(props){

    const { 
        fieldName,
        values,
        update,
        options,
    } = props

    const [menuOpen, setMenuOpen] = useState(false)
    const menuRef = useRef();

    const filterLabel = fieldName
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

    const formatOptionLabel = (option) => String(option)
        .replace(/^\s*(✓|âœ“)\s*/, '')
        .replace(/\s+Institution\s*$/i, '')
        .trim()
    
    useEffect(() => {
        let handler = (e) => {
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown", handler)

        return () => {
            document.removeEventListener("mousedown",handler)
        }
    }, [])

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
            <div className="menu-showcase">
                <button className={`filter-trigger${values.length ? " is-active" : ""}${menuOpen ? " is-open" : ""}`} onClick={showMenuOptions}>
                    <span>{filterLabel}</span>
                    {values.length > 0 && <em>{values.length}</em>}
                    <RiArrowDropDownLine/>
                </button>
            </div>
            {
                menuOpen &&
                    <div className="menu-options">
                        <div className="menu-options-head">
                            <strong>{filterLabel}</strong>
                            <span>{values.length ? `${values.length} selected` : 'Any'}</span>
                        </div>
                        {
                            options.map((option,index) => (
                                <label key={index}>
                                    <input 
                                        key={index} 
                                        type="checkbox" 
                                        value={option}
                                        onChange={handleCheckboxChange}
                                        checked={values.includes(option)}/>
                                    {formatOptionLabel(option)}
                                </label>
                            ))
                        }
                    </div>
            }
        </div>
    )
}
