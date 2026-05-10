/*
These are the imports that are required in the development of the system.
Various inclusion of imports containing react-icon imoprts as well as differet state imports exist
*/
import Paginate from "../../components/pagination/Paginate";

import { useGetInstitutionsQuery, useGetInstitutionsOnFilterQuery, useGetInstitutionsOnAdditionalFilterQuery } from "../../app/api/appSlice"
import { appSlice } from "../../app/api/appSlice"
import React, { useEffect, useState } from "react"
import { useParams } from 'react-router-dom';
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
import PopUp from "../../components/utilities/PopUp"
import { Link } from 'react-router-dom'

import Search from "../../components/utilities/Search";
import InstitutionImage from "../../components/utilities/InstitutionImage";
//Function definintion to be exported.
export default function InstitutionList(){

    //Custom hook of rtk query being used to get the data from the rest api
    const [selectedValue, setSelectedValue] = useState({});

    const {
        data: institutionData,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetInstitutionsQuery(selectedValue)
 
    //mark
    const { institutions, countries, speciality} = institutionData ? institutionData : []

    let instituionsSorted = isSuccess ? institutions : []
    let awaitData = [...instituionsSorted]

    const [asecSort, setAsecSort] = useState(true)

    const handleSorting = () => {
        setAsecSort(prevVal => !prevVal)
    }   
    
    const eachInstitutionName = isSuccess && institutions.map(item => item.name)

    //React use state being setup to store the top ten insitutions in the database
    const [score, setScore] = useState([])

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        setCurrentPage(1)
    },[institutionData])

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    let displayedData = institutions && institutions.slice(startIndex, endIndex);
    let totalPages = Math.ceil(institutions && institutions.length / itemsPerPage);

    const [values, setValues] = useState()
    
    useEffect(() => {
        if(asecSort === false && isSuccess){
            setValues("Is Loading")
            awaitData.sort((item1,item2) => {
                let firstSorter = item1.name
                let secondSorter = item2.name
                if(firstSorter > secondSorter){
                    return -1
                }
                else if(secondSorter > firstSorter){
                    return 1
                }
                else{
                    return 0
                }
            })
            displayedData = institutions && awaitData.slice(startIndex, endIndex);
            setValues("Finished Loading")
        }
    },[asecSort])

    const handlePageChange = (event, newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    //Button handle for pop-up section
    const [popMenuOpen, setPopMenuOpen] = useState(false)

    const updateFilters = (field, values) => {
        setSelectedValue((prevVal, index) => {
            return {
                ...prevVal,
                [field]: values
            }
        })
    }

    const submitFilters = async (event) => {
        event.preventDefault()
    }

    const submitAdditionalFilters = async (event) => {
        event.preventDefault()
    }

    const [popUpFilterApplicants, setPopUpFilterApplicants] = useState({
        'opening-time' : '00:00:00',
        'closing-time' : '00:00:00',
        'online-service' : 'offline',
        'opening-days' : ['none'],
        'university-start': 0,
        'university-end': 0,
        'success-start': 0,
        'success-end': 0,
        'experience-start': 0,
        'experience-end': 0,
        'platform' : 'Local',
        'distance': 'Near',
        'rating': 'Medium',
    })

    const updatePopUpFilterApplicants = (field, values) => {
        setPopUpFilterApplicants((prevVal, index) => {
            return {
                ...prevVal,
                [field]: values
            }
        })
    }

    const delayApplier = () => {
        setPopMenuOpen(false)
        setSelectedValue((prevVal) => {
            return {
                ...prevVal,
                ...popUpFilterApplicants
            }
        })
    }

    //this effect calculates the point for the insitution and returns 10 insitutions 
    //ranked top. It runs only once per initial render.
    useEffect(() => {

        if(Array.isArray(institutions) && institutions.length > 0) {

            const dataCalculation = institutions.map((institution) => {
                const universityCount = Number.isInteger(institution.universities) 
                    ? institution.universities : parseInt(institution.universities)
                const experience = Number.isInteger(institution.experience)
                    ? institution.experience : parseInt(institution.experience)  
                const graduates = Number.isInteger(institution.success)
                    ? institution.success : parseInt(institution.success)  
            
                return {
                    name: institution.name,
                    experience: experience <= 5 && experience >= 2
                                    ? 3
                                    : experience <= 10
                                    ? 5
                                    : experience <= 15
                                    ? 7
                                    : experience <= 20
                                    ? 10
                                    : experience > 20
                                    ? 13
                                    :0,
                    success: graduates <= 100 && graduates >= 20
                                ? 3
                                : graduates <= 500
                                ? 6
                                : graduates <= 1000
                                ? 9
                                : graduates <= 5000
                                ? 13
                                : graduates > 5000
                                ? 16
                                : 0,
                    partners: universityCount <= 10 && universityCount >= 2
                                ? 3
                                : universityCount <= 25
                                ? 5
                                : universityCount <= 50
                                ? 7
                                : universityCount <= 100
                                ? 10
                                : universityCount > 100
                                ? 13
                                : 0
                }
            })

            const sumPerformancePoint = dataCalculation.map((data) => {
                    const totalPoint = data.partners + data.success + data.experience
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
    },[institutions])
    
    const popMenuOpenHandler = () => {
        setPopMenuOpen(true)
    }

    const popMenuCloseHandler = () => {
        setPopMenuOpen(false)
    }

    const popMenuClearHandler = () => {
        const value = {
            'opening-time' : '00:00:00',
            'closing-time' : '00:00:00',
            'online-service' : 'offline',
            'opening-days' : ['none'],
            'university-start': 0,
            'university-end': 0,
            'success-start': 0,
            'success-end': 0,
            'experience-start': 0,
            'experience-end': 0,
            'platform' : 'Local',
            'rating': 'Medium',
        }
        setPopUpFilterApplicants(value)
        setSelectedValue({})
    }

    //This code consists of codes to return necessary jsx for the each insitituoin
    //in the database system.

    const institutionName = Array.isArray(institutions)
        ? displayedData.map((institution, index) => {
            return (
                <div key={index} className="child-items">
                    <div key={index} className="img-holder">
                        <InstitutionImage name={institution.name} category="institution" className="logo-img" />
                    </div>
                    <div className="name-holder">
                        {institution.name}
                        <Link to={`/institution/${institution.name}`}>
                            <GrFormNextLink className="link-institution"/>
                        </Link>
                    </div>
                </div>
            )
        }) : null

        

    //this array holds different aliased component to render ranks per the ranks.
    const numberArray = {1: <One/>,2: <Two/>,3: <Three/>,4:<Four/>,5:<Five/>,6:<Six/>,7:<Seven/>,8:<Eight/>,9:<Nine/>};

    //function to determine ranking of the instituion and return the number they have.
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

    //This call back function returns require jsx syntaxes for the rendering purposes.
    const rankingInstitution = score ? score.map((ranking, index) => {
        return (
            <div key={index} className="ranking-performance">
                <div className="line-top"></div>
                <div key={index} className="info-top">
                    <InstitutionImage name={ranking.name} category="institution" className="logo-top" />
                    <div className="info-top-rated">
                        { returnNumber(index + 1) }
                        <p className="ranked-names">{ranking.name}</p>
                    </div>
                </div>
            </div>
        )
    }) : null

    //This vraiable consists of the jsx to be returned and rendered for the search div.


    //This is the return statement for the page and actually renders whatever is inside it.
    return (
        <>
        <section className="listing-intro">
            <span className="eyebrow">Consultancy listings</span>
            <h1>Explore education consultancies with fast search, practical filters, and ranked recommendations.</h1>
            <p>Use country, experience, specialization, online service, distance, and rating filters to narrow the options that fit your study-abroad plan.</p>
        </section>
        <div className="layout">
            <div className="left-div">
                    {
                        isSuccess &&
                        <Search 
                        iterable={eachInstitutionName}
                        category= "institution"
                    />
                    }
                <div>
                    <div className="filter-options">
                        <div className="filter-con">
                            <form onSubmit={submitFilters}>
                            <div className="filter-country"><Filter fieldName="country" update={updateFilters}  options={countries || []} values={selectedValue.country || [] }/></div>
                            <div className="filter-location"><Filter fieldName="experience" update={updateFilters} options={['High','Low','Moderate']} values={selectedValue.experience || [] }/></div>
                            <div className="filter-university"><Filter fieldName="speciality" update={updateFilters} options={speciality || []} values={selectedValue.speciality || [] }/></div>
                            <button>Apply</button>
                            </form>
                            <div className="filter-settings" onClick={popMenuOpenHandler}>
                                <p>Filter</p>
                                <IoMdSettings/>
                            </div>
                        </div>
                    </div>
                    <div className="result-counter">
                        <p>Institution Found: {institutions ? institutions.length : 0} </p>
                        <BiSolidSortAlt className="sort-icon" onClick={handleSorting}/>
                    </div>
                    <div className="item-container">
                        { institutionName }
                    </div>
                    <div></div>
                    <form onSubmit={submitAdditionalFilters}>
                        <PopUp 
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
                    { rankingInstitution}
                </div>
                
                <Paginate
                    count = {totalPages}
                    update = {handlePageChange}
                    pageCurrently={currentPage}
                />
            </div>
        </div>
        </>
    )
}
