import { useGetComparisonsQuery, useLazyGetComparisonsQuery } from "../../app/api/comparisonSlice"
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import { Link } from "react-router-dom";
import InstitutionImage from "../../components/utilities/InstitutionImage";
import MessageProp from "../../components/utilities/MessageProp";
import ModernComparisonChart from "../../components/comparison/ModernComparisonChart";


export default function Comparison() {

    const [selectedInstitution, setSelectedInstitution] = useState({});
    const [comparisonResult, setComparisonResult] = useState(null);

    const { data: optionsData } = useGetComparisonsQuery({})
    const [trigger, { isFetching }] = useLazyGetComparisonsQuery()

    const scoreObject = comparisonResult?.scoreObject || []
    const institutionsName = comparisonResult?.institutionsName || optionsData?.institutionsName || []

    const toScore = (value) => {
        const number = Number(value);
        return Number.isFinite(number) ? Math.round(number * 10) / 10 : 0;
    }

    let serviceArray = [];
    let experienceArray = [];
    let accessArray = [];
    let totalArray = [];
    let ratingArray =  [];
    let label = [];
    
    if(scoreObject){
        scoreObject.forEach((item) => {
            const servicePoint = toScore(item.service)
            const experiencePoint = toScore(item.experience);
            const accesPoint = toScore(item.access);
            const reviewPoint = toScore(item.review);
            serviceArray.push(servicePoint)
            experienceArray.push(experiencePoint)
            accessArray.push(accesPoint)
            ratingArray.push(reviewPoint)
            totalArray.push(servicePoint + experiencePoint + accesPoint + reviewPoint)
            label.push(item.institution.name)
        });
    }
    
    const [count, setCount] = useState(0);

    const handleInsititutionSelection = (event, newVal, iterVal) => {
        setSelectedInstitution((prevVal) => {
            return {
                ...prevVal,
                [iterVal]: newVal
            }
        })
    }

    //Message

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

    const checkValue = (val) => {
        return Object.values(val).every(item => item !== '' && item !== null);
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

    return(
        <main className="comparison-page">
            <MessageProp 
                stateValue={messagePop}
                destroy={destroyPopMessage}
                messageType={display.severity}
                message={display.message}
            />
            <section className="page-intro">
                <span className="eyebrow">Side-by-side comparison</span>
                <h1>Compare institutions by experience, service, accessibility, rating, and overall score.</h1>
                <p>Select two or three consultancies to generate a focused comparison with charts, score summaries, and practical strengths and limitations.</p>
                <div className="comparison-switcher">
                    <Link className="secondary-action" to="/comparison/college">Compare colleges</Link>
                    <Link className="secondary-action" to="/comparison/school">Compare schools</Link>
                </div>
            </section>
            <section className="compare-controls">
            <div className="compare-controls-head">
                <div>
                    <span>Build comparison</span>
                    <p>Select two institutions to start. Add one more when you need a broader shortlist.</p>
                </div>
            </div>
            <div className="compare-slot">
                <span>First institution</span>
                <Autocomplete
                    disablePortal
                    id="auto-completion"
                    className="select-comparison"
                    options={institutionsName}
                    value={selectedInstitution[1] || null}
                    onChange={(event, newVal) => handleInsititutionSelection (event, newVal, 1)}
                    renderInput={(params) => <TextField {...params} label="Institution" placeholder="Choose an institution"/>}
                />
            </div>
            <div className="compare-slot">
                <span>Second institution</span>
                <Autocomplete
                    disablePortal
                    id="auto-completion"
                    className="select-comparison"
                    options={institutionsName}
                    value={selectedInstitution[2] || null}
                    onChange={(event, newVal) => handleInsititutionSelection (event, newVal, 2)}
                    renderInput={(params) => <TextField {...params} label="Institution" placeholder="Choose an institution"/>}
                />
            </div>
            {
                count > 0 &&
                [...Array(count)].map((item, index) => (
                    <div className="compare-slot" key={index}>
                        <span>Optional institution</span>
                        <Autocomplete
                            disablePortal
                            id="auto-completion"
                            className="select-comparison"
                            options={institutionsName}
                            value={selectedInstitution[index + 3] || null}
                            onChange={(event, newVal) => handleInsititutionSelection (event, newVal, index + 3)}
                            renderInput={(params) => <TextField {...params} label="Institution" placeholder="Choose an institution"/>}
                        />
                    </div>
                ))
            }
            <div className="control-actions">
                <button onClick={addComparison}>Add institution</button>
                <button onClick={handleClickCompare} disabled={isFetching}>{isFetching ? "Comparing..." : "Compare"}</button>
            </div>
            </section>
            
            {
                scoreObject.length > 0 &&
                <section className="comparison-summary">
                    {scoreObject.map((item) => {
                        const total = toScore(item.service) + toScore(item.access) + toScore(item.experience) + toScore(item.review)
                        return (
                            <article className="summary-card" key={item.institution._id || item.institution.name}>
                                <strong>{item.institution.name}</strong>
                                <span>{toScore(total)} total points</span>
                                <p>Service {toScore(item.service)} / Experience {toScore(item.experience)} / Access {toScore(item.access)} / Rating {toScore(item.review)}</p>
                            </article>
                        )
                    })}
                </section>
            }

            {
                scoreObject.length > 0 &&
                <ModernComparisonChart
                    title="Consultancy score comparison"
                    metrics={[
                        { label: "Overall", help: "Combined service, experience, access, and rating", values: scoreObject.map((item, index) => ({ name: item.institution.name, value: totalArray[index] })) },
                        { label: "Service", help: "Countries, university reach, and specialization", values: scoreObject.map((item) => ({ name: item.institution.name, value: item.service })) },
                        { label: "Experience", help: "Experience and successful service history", values: scoreObject.map((item) => ({ name: item.institution.name, value: item.experience })) },
                        { label: "Accessibility", help: "Operating hours, online access, and platform reach", values: scoreObject.map((item) => ({ name: item.institution.name, value: item.access })) },
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
                                        <InstitutionImage name={item.institution.name} category="institution" className="comaparable-img" />
                                    </div>
                                    <div className="totalPoints">
                                        <h2>{item.institution.name}</h2>
                                        <div className="score-total">{toScore(item.service) + toScore(item.access) + toScore(item.experience) + toScore(item.review)}<span>total points</span></div>
                                        <div className="metric-row"><span>Service</span><strong>{toScore(item.service)}</strong><i style={{width: `${Math.min(toScore(item.service), 100)}%`}} /></div>
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
                                                    item.institution.universities !== "" || item.institution.universities > 10 ?
                                                    (
                                                        <li>There are {item.institution.universities} universities connected. </li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.experience !== "" || item.institution.experience > 6 ?
                                                    (
                                                        <li>It has the experience of {item.institution.experience} years.</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.countries.length > 2 ? 
                                                    (
                                                        <li>It has several number of countries that it is serving </li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.specialization.length > 0 ?
                                                    (
                                                        <li>It specializes in countries like {item.institution.specialization[0]}.</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.success !== "" || item.institution.success > 75 ?
                                                    (
                                                        <li>It has the graduates numbering to {item.institution.success}.</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.platform === "Global" ? 
                                                    (
                                                        <li>It has global offices aviable in different countries.</li>
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
                                                    item.institution.universities === "" || item.institution.universities < 10 ?
                                                    (
                                                        <li>There are less than 10 universities connected. </li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.experience === "" || item.institution.experience < 6 ?
                                                    (
                                                        <li>It has the experience of less than 5 years.</li>
                                                    ) : null
                                                } 
                                                {
                                                    item.institution.countries.length < 3 ? 
                                                    (
                                                        <li>It has small number countries that it is serving </li>
                                                    ) : null
                                                }
                                                {
                                                    !item.institution.specialization.length > 0 ?
                                                    (
                                                        <li>It has no country that it specializes in.</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.success === "" || item.institution.success < 75 ?
                                                    (
                                                        <li>It has the graduates numbering to less than 75.</li>
                                                    ) : null
                                                }
                                                {
                                                    item.institution.platform !== "Global" ? 
                                                    (
                                                        <li>It operates locally only.</li>
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
