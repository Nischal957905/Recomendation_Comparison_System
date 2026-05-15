/*
These are the imports that are required in the development of the system.
Various inclusion of imports containing react-icon imoprts as well as differet state imports exist
*/

import { useGetSchoolsQuery } from "../../app/api/appSlice"
import { appSlice } from "../../app/api/appSlice"
import React, { useEffect, useState } from "react"
import '../../index.css'
import Button from '@mui/material/Button'
import { MdExpandMore } from 'react-icons/md'
import { BiSearchAlt,BiSolidSortAlt } from 'react-icons/bi'
import { IoMdSettings } from 'react-icons/io'
import { RiArrowDropDownLine } from 'react-icons/ri'
import { GrFormNextLink } from 'react-icons/gr'
import { PiNumberOneBold as One,
        PiNumberTwoBold as Two,
        PiNumberThreeBold as Three,
        PiNumberFourBold as Four,
        PiNumberFiveBold as Five,
        PiNumberSixBold as Six,
        PiNumberSevenBold as Seven,
        PiNumberEightBold as Eight,
        PiNumberNineBold as Nine,
        PiNumberZeroBold as Zero } from 'react-icons/pi'
// import Institution from "./Institution"

import Filter from "../../components/filter/Filter"
import SchoolPop from "../../components/utilities/SchoolPop"
import { Link } from 'react-router-dom'
import Paginate from "../../components/pagination/Paginate"
import Search from "../../components/utilities/Search";
import InstitutionImage from "../../components/utilities/InstitutionImage";
import InstitutionCard from "../../components/utilities/InstitutionCard";



export default function SchoolList(){

    
    const [selectedValue, setSelectedValue] = useState({});

    const {
        data: collegeData,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetSchoolsQuery(selectedValue)

    const { colleges } = collegeData ? collegeData : []
    const [score, setScore] = useState([])
    const [asecSort, setAsecSort] = useState(true)

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1)
    },[collegeData])

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let displayedData = colleges && colleges.slice(startIndex, endIndex);
    let totalPages = Math.ceil(colleges && colleges.length / itemsPerPage);

    if (Array.isArray(colleges)) {
        const sortedSchools = [...colleges].sort((first, second) => {
            return asecSort
                ? first.name.localeCompare(second.name)
                : second.name.localeCompare(first.name)
        })
        displayedData = sortedSchools.slice(startIndex, endIndex)
    }

    const handlePageChange = (event, newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleSorting = () => {
        setAsecSort(prevVal => !prevVal)
    }
    

    //Button handle for pop-up section
    const [popMenuOpen, setPopMenuOpen] = useState(false)
    
    const submitAdditionalFilters = async (event) => {
        event.preventDefault()
    }

    const [popUpFilterApplicants, setPopUpFilterApplicants] = useState({
        'opening-time' : '00:00:00',
        'closing-time' : '00:00:00',
        'experience-start': 0,
        'experience-end': 0,
        'distance': 'Near',
    })


    const updatePopUpFilterApplicants = (field, values) => {
        setPopUpFilterApplicants((prevVal, index) => {
            return {
                ...prevVal,
                [field]: values,
            }
        })
    }

    const [delayedValue, setDelayedValue] = useState();
    const delayApplier = () => {
        setPopMenuOpen(false)
        setSelectedValue((prevVal) => {
            return {
                ...prevVal,
                ...popUpFilterApplicants
            }
        })
        //setDelayedValue(popUpFilterApplicants)
    }

    const popMenuOpenHandler = () => {
        setPopMenuOpen(true)
    }

    const popMenuCloseHandler = () => {
        setPopMenuOpen(false)
    }

    const eachInstitutionName = isSuccess && colleges.map(item => item.name)

    const popMenuClearHandler = () => {
        const value = {
            'opening-time' : '00:00:00',
            'closing-time' : '00:00:00',
            'experience-start': 0,
            'experience-end': 0,
            'distance': 'Near',
            'filterAppliedOn': false,
        }
        setPopUpFilterApplicants(value)
        setSelectedValue({})
    }

    const clearMainFilters = () => {
        setSelectedValue({})
    }

    const activeFilters = Object.entries(selectedValue).flatMap(([key, value]) => {
        if (Array.isArray(value) && value.length > 0) {
            return value.map((item) => ({
                key,
                label: String(item).replace(/^\s*(✓|âœ“)\s*/, '').replace(/\s+Institution\s*$/i, '').trim()
            }))
        }
        return []
    })

 
    useEffect(() => {

        if(Array.isArray(colleges) && colleges.length > 0) {

            const dataCalculation = colleges.map((institution) => {
                const experience = Number.isInteger(institution.experience)
                    ? institution.experience : parseInt(institution.experience)   
            
                return {
                    name: institution.name,
                    experience: experience <= 10 && experience >= 2
                                    ? 3
                                    : experience <= 17
                                    ? 5
                                    : experience <= 20
                                    ? 7
                                    : experience <= 25
                                    ? 10
                                    : experience > 30
                                    ? 13
                                    :0,
                }
            })

            const sumPerformancePoint = dataCalculation.map((data) => {
                    const totalPoint = data.experience
                    return {
                        performance: totalPoint,
                        name: data.name
                    }
            })
            sumPerformancePoint.sort(
                (initial,trailing) => trailing.performance - initial.performance)
            const leadingInstitutions = sumPerformancePoint.slice(0,10)    
            setScore(leadingInstitutions)
        }
    },[colleges])

    
    const collegeName = Array.isArray(colleges)
        ? displayedData.map((college, index) => {
            return (
                <InstitutionCard
                    key={college._id || college.name || index}
                    item={college}
                    category="school"
                    to={`/school/${college.name}`}
                />
            )
    }) : null

    const numberArray = {1: <One/>,2: <Two/>,3: <Three/>,4:<Four/>,5:<Five/>,6:<Six/>,7:<Seven/>,8:<Eight/>,9:<Nine/>};

    const returnNumber = (number) => {

        const numbers = parseInt(number)
        let content;

        if(numbers === 10){
            content = (
                <div className="ranking-topten">
                    <One className="ranking-one"/>
                    <Zero className="ranking-ten"/>
                </div>
            )
        }

        else{
            content = (
                <div className="ranking-number">
                    {numberArray[numbers]}
                </div>
            )
        }
        return content
    }

    const submitFilters = async (event) => {
        event.preventDefault()
    }

    const updateFilters = (field, values) => {
        setSelectedValue((prevVal, index) => {
            return {
                ...prevVal,
                [field]: values
            }
        })
    }

    
    //This call back function returns require jsx syntaxes for the rendering purposes.
    const rankingCollege = score ? score.map((ranking, index) => {
        return (
            <div key={index} className="ranking-performance">
                <div className="line-top"></div>
                <div key={index} className="info-top">
                    <InstitutionImage name={ranking.name} category="school" className="logo-top" />
                    <div className="info-top-rated">
                        { returnNumber(index + 1) }
                        <p className="ranked-names">{ranking.name}</p>
                    </div>
                </div>
            </div>
        )
    }) : null

    //This vraiable consists of the jsx to be returned and rendered for the search div.
    const searchDiv = (
        <div className="search-holder">
            <div className="search-bar">
                <BiSearchAlt className="search-icon"/>
                <p>Search</p>
            </div>
        </div>
    )

    return(
        <>
        <section className="listing-intro">
            <span className="eyebrow">School listings</span>
            <h1>Review schools by academic board, ownership, experience, and distance.</h1>
            <p>Compare school profiles with clear filters and ranked picks before deciding which campuses to visit.</p>
        </section>
        <div className="layout">
            <div className="left-div">
                {   isSuccess &&
                    <Search 
                    iterable={eachInstitutionName}
                    category='school'
                    />   
                }
                <div>
                    <div className="filter-options">
                        <div className="filter-con">
                            <div className="filter-panel-header">
                                <div>
                                    <span>Refine results</span>
                                    <p>Choose one or more filters. Results update as you select.</p>
                                </div>
                                <button type="button" className="filter-clear" onClick={clearMainFilters}>Clear</button>
                            </div>
                            <form onSubmit={submitFilters}>
                                <div className="filter-ucg"><Filter fieldName="ugc" update={updateFilters}  options={['Cambridge GCE A Levels','National Examinations Board','Scottish Qualifications Authority','Tourism School Salzburg, Austria','CTEVT']} values={selectedValue.ugc || [] }/></div>
                                <div className="filter-experience"><Filter fieldName="experience" update={updateFilters} options={['High','Low','Moderate']} values={selectedValue.experience || [] }/></div>
                                <div className="filter-ownership"><Filter fieldName="ownership" update={updateFilters} options={[' community Institution ',' private Institution ']} values={selectedValue.ownership || [] }/></div>
                            </form>
                            <button type="button" className="filter-settings" onClick={popMenuOpenHandler}>
                                <p>Filter</p>
                                <IoMdSettings/>
                            </button>
                        </div>
                    </div>
                    <div className="result-counter">
                        <div>
                            <p>Results: {colleges ? colleges.length : 0}</p>
                            {activeFilters.length > 0 && (
                                <div className="active-filter-row">
                                    {activeFilters.map((filter, index) => (
                                        <span key={`${filter.key}-${index}`}>{filter.label}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <button type="button" className="sort-action" onClick={handleSorting}>
                            <BiSolidSortAlt />
                            <span>{asecSort ? 'Sort A-Z' : 'Sort Z-A'}</span>
                        </button>
                    </div>
                    <div className="item-container">
                        {collegeName?.length ? collegeName : <div className="empty-list-state">No schools match the selected filters. Clear filters and try again.</div>}
                    </div>
                    <Paginate
                        count={totalPages}
                        update={handlePageChange}
                        pageCurrently={currentPage}
                    />
                    <div></div>
                    <form onSubmit={submitAdditionalFilters}>
                        <SchoolPop 
                            openStatus ={popMenuOpen} 
                            popUpMenuOpenHandle={popMenuOpenHandler} 
                            popUpMenuCloseHandle ={popMenuCloseHandler}
                            popUpMenuOptions = {popUpFilterApplicants}
                            setPopUpMenuOptions = {updatePopUpFilterApplicants}
                            applyDelay = {delayApplier}
                            applyClear = {popMenuClearHandler}
                        />
                    </form>
                </div>
            </div>
            <div className="right-div">
                <div className="rating-menu">
                    <div className="top-holder">Top Rated</div>
                    <div className="top-rating">Rating</div>
                    <div className="top-performance">Performance</div>
                    <div className="top-rank">Rank</div>
                </div>
                <div className="top-rated">
                    { rankingCollege}
                </div>
            </div>
        </div>
        </>
    )
}
