import { useGetComparisonSchoolQuery, useLazyGetComparisonSchoolQuery } from "../../app/api/comparisonSlice"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { Link } from "react-router-dom";
import InstitutionImage from "../../components/utilities/InstitutionImage";

import MessageProp from "../../components/utilities/MessageProp";
import ModernComparisonChart from "../../components/comparison/ModernComparisonChart";


export default function ComparisonSchool() {

    const [selectedInstitution, setSelectedInstitution] = useState({});
    const [comparisonResult, setComparisonResult] = useState(null);
    const { data: optionsData } = useGetComparisonSchoolQuery({})
    const [trigger, { data }] = useLazyGetComparisonSchoolQuery()

    const scoreObject = comparisonResult?.scoreObject || []

    const toScore = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0;
    }

    let experienceArray = [];
    let accessArray = [];
    let totalArray = [];
    let ratingArray =  [];
    let label = [];

    if(scoreObject){
        scoreObject.forEach((item,index) => {

            const experiencePoint = item.experience !== null ? item.experience : 10;
            const accesPoint = item.access !== null ? item.access : 10;
            const reviewPoint = item.review !== null ? item.review : 0;
            experienceArray.push(experiencePoint)
            accessArray.push(accesPoint)
            ratingArray.push(item.review)
            totalArray.push(experiencePoint + accesPoint + reviewPoint)
            label.push(item.institution.name)
        });
    }

    const institutionsName  = comparisonResult?.institutionsName || data?.institutionsName || optionsData?.institutionsName || [];
    
    const [count, setCount] = useState(0);

    const handleInsititutionSelection = (event, newVal, iterVal) => {
        setSelectedInstitution((prevVal) => {
            return {
                ...prevVal,
                [iterVal]: newVal
            }
        })
    }

    const [messagePop, setMessagePop] = useState(false)
    const [display, setDisplay] = useState({
        message: '',
        severity: '',
    })
    const destroyPopMessage = (event,reason) => {
        if(reason === 'clickaway'){
            return;
        }
        setMessagePop(false)
    }

    const showPopMessage = () => {
        setMessagePop(true)
    }

    const handleMessageType = (value, severity) => {
        setDisplay({
            message: value,
            severity: severity
        })
    }

    const addComparison = () => {
        if(count == 1){
            handleMessageType('Can not exceed the 3 institutions', 'error')
            showPopMessage()
        }
        if(count < 1) {
            setCount((prevVal) => {
                return prevVal + 1
            })
        }
    }

    const handleClickCompare = async () => {
        if(Object.keys(selectedInstitution).length > 1 && Object.keys(selectedInstitution).length < 4){
            const check = checkValue(selectedInstitution)
            if(check){
                try {
                    const result = await trigger(selectedInstitution).unwrap()
                    const comparedItems = result?.scoreObject || []
                    setComparisonResult(result)
                    if(comparedItems.length > 0){
                        handleMessageType('Comparison results loaded.','success')
                        showPopMessage()
                    }
                    else {
                        handleMessageType('No comparison data was returned for those selections.','error')
                        showPopMessage()
                    }
                } catch (err) {
                    handleMessageType('Error occurred','error')
                    showPopMessage()
                }
            }
            else{
                handleMessageType('Empty Values are not allowed','error')
                showPopMessage()
            }
        }
        else {
            handleMessageType('Select at least two institutions to compare.','error')
            showPopMessage()
        }
    }

    const checkValue = (val) => {
        return Object.values(val).every(item => item !== '' && item !== null);
    }
    
    return(
        <main className="comparison-page">
            <MessageProp 
                stateValue={messagePop}
                destroy={destroyPopMessage}
                messageType={display.severity}
                message={display.message}
            />
            <section className="page-intro">
                <span className="eyebrow">School comparison</span>
                <h1>Compare schools by experience, accessibility, rating, and total score.</h1>
                <p>Select two or three schools to review academic profile signals, ownership details, distance, and score differences.</p>
                <div className="comparison-switcher">
                    <Link className="secondary-action" to="/comparison">Compare consultancies</Link>
                    <Link className="secondary-action" to="/comparison/college">Compare colleges</Link>
                </div>
            </section>
            <section className="compare-controls">
            <div>
                <Autocomplete
                    disablePortal
                    id="auto-completion"
                    className="select-comparison"
                    options={institutionsName}
                    value={selectedInstitution[1] || null}
                    onChange={(event, newVal) => handleInsititutionSelection (event, newVal, 1)}
                    renderInput={(params) => <TextField {...params} label="Institution"/>}
                />
            </div>
            <div>
                <Autocomplete
                    disablePortal
                    id="auto-completion"
                    className="select-comparison"
                    options={institutionsName}
                    value={selectedInstitution[2] || null}
                    onChange={(event, newVal) => handleInsititutionSelection (event, newVal, 2)}
                    renderInput={(params) => <TextField {...params} label="Institution"/>}
                />
            </div>
            {
                count > 0 &&
                [...Array(count)].map((item, index) => (
                    <div key={index}>
                        <Autocomplete
                            disablePortal
                            id="auto-completion"
                            className="select-comparison"
                            options={institutionsName}
                            value={selectedInstitution[index + 3] || null}
                            onChange={(event, newVal) => handleInsititutionSelection (event, newVal, index + 3)}
                            renderInput={(params) => <TextField {...params} label="Institution"/>}
                        />
                    </div>
                ))
            }
            <div className="control-actions">
                <button onClick={addComparison}>Add institution</button>
                <button onClick={handleClickCompare}>Compare</button>
            </div>
            </section>
            
            {
                scoreObject.length > 0 &&
                <section className="comparison-summary">
                    {scoreObject.map((item) => {
                        const total = toScore(item.access) + toScore(item.experience) + toScore(item.review)
                        return (
                            <article className="summary-card" key={item.institution._id || item.institution.name}>
                                <strong>{item.institution.name}</strong>
                                <span>{toScore(total)} total points</span>
                                <p>Experience {toScore(item.experience)} / Access {toScore(item.access)} / Rating {toScore(item.review)}</p>
                            </article>
                        )
                    })}
                </section>
            }

            {
                scoreObject.length > 0 &&
                <ModernComparisonChart
                    title="School score comparison"
                    metrics={[
                        { label: "Overall", help: "Combined experience, access, and rating", values: scoreObject.map((item, index) => ({ name: item.institution.name, value: totalArray[index] })) },
                        { label: "Experience", help: "Institution history and experience score", values: scoreObject.map((item) => ({ name: item.institution.name, value: item.experience })) },
                        { label: "Accessibility", help: "Operating hours and distance signal", values: scoreObject.map((item) => ({ name: item.institution.name, value: item.access })) },
                        { label: "Rating", help: "Review-based score", values: scoreObject.map((item) => ({ name: item.institution.name, value: item.review })) },
                    ]}
                />
            }
            {
                
                scoreObject.length > 0 &&
                <section className="comparable-item-box">
                    {
                        scoreObject.map((item,index) => {
                            return(
                                <div className="comparable-items" key={index}>
                                    <div>
                                        <InstitutionImage name={item.institution.name} category="school" className="comaparable-img" />
                                    </div>
                                    <div className="totalPoints">
                                        <h2>{item.institution.name}</h2>
                                        <div className="score-total">{toScore(item.access) + toScore(item.experience) + toScore(item.review)}<span>total points</span></div>
                                        <div className="metric-row"><span>Experience</span><strong>{toScore(item.experience)}</strong><i style={{width: `${Math.min(toScore(item.experience), 100)}%`}} /></div>
                                        <div className="metric-row"><span>Accessibility</span><strong>{toScore(item.access)}</strong><i style={{width: `${Math.min(toScore(item.access), 100)}%`}} /></div>
                                        <div className="metric-row"><span>Rating</span><strong>{toScore(item.review)}</strong><i style={{width: `${Math.min(toScore(item.review), 100)}%`}} /></div>
                                    </div>
                                    <div className="features-comparison">
                                        <div>
                                            <h3>Pros</h3>
                                            <ul>
                                                {item.institution.online && 
                                                    <li>{item.institution.name} has online classes.</li>
                                                }
                                                {
                                                    item.institution.experience !== "" || item.institution.experience > 6 ?
                                                    (
                                                        <li>It has the experience of {item.institution.experience} years.</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.ugc === " ✓ UGC Accredited" ?
                                                    (
                                                        <li>It is {item.institution.ugc}</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.ownership === " community Institution" ? 
                                                    (
                                                        <li>It is a community owned college</li>
                                                    ) : null
                                                }
                                                {
                                                    item.distanceMetre && item.distanceMetre < 500 ?
                                                    (
                                                        <li>It has a very minimal distance of {Math.ceil(item.distanceMetre)} metres.</li>
                                                    ) : null
                                                }
                                            </ul>
                                        </div>
                                        <div>
                                            <h3>Cons</h3>
                                            <ul>
                                                {!item.institution.online && 
                                                    <li>{item.institution.name} has no online classes.</li>
                                                }
                                                {
                                                    item.institution.experience === "" || item.institution.experience < 6 ?
                                                    (
                                                        <li>It has the experience of less than 5 years.</li>
                                                    ) : null
                                                } 
                                                {
                                                    !item.institution.ugc === " ✓ UGC Accredited" ?
                                                    (
                                                        <li>It has not UGC Accredited</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.platform !== " community Institution" ? 
                                                    (
                                                        <li>It is owned by a private party</li>
                                                    ) : null
                                                }
                                                {
                                                    item.distanceMetre && item.distanceMetre > 499 ?
                                                    (
                                                        <li>It has a very quite a  distance of {Math.ceil(item.distanceMetre)} metres.</li>
                                                    ) : null
                                                }
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </section>
            }
        </main>
    )
}
