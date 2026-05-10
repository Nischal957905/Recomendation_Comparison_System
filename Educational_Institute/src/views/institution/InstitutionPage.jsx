import  { useParams } from 'react-router-dom'
import { useGetSingleInstitutionQuery, usePostReviewQuery } from "../../app/api/appSlice"
import GoogleMap from '../../components/utilities/GoogleMap';
import { useState, useEffect } from 'react';
import Rating from "@mui/material/Rating";
import useAuthentication from '../../components/hooks/useAuthentication';
import InstitutionImage from "../../components/utilities/InstitutionImage";

export default function InstitutionPage() {

    const { institution } = useParams();
    const { valueForAuth } = useAuthentication()
    const [delayedData, setDelayedData] = useState({})
    
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetSingleInstitutionQuery(institution);

    const [reviewData, setReviewData] = useState({
        'username' : valueForAuth.username,
        'rating': 0,
        'review': '',
        'institution': null
    })

    useEffect(() => {
        if(isSuccess){
            setReviewData((prevVal) => {
                return {
                    ...prevVal,
                    'institution' : data.institutionData._id
                }
            })
        }
    }, [isSuccess])

    const {
        data: dataReview,
        isLoading: loaded,
        isSuccess: success,
        isError: errors,
    } = usePostReviewQuery({institution, delayedData})
    //console.log(reveiwData.positiveReview)

    useEffect(() => {
        if(success){
            refetch()
        }
    },[dataReview])

    
    const renderPositiveReview = success && dataReview.status && dataReview?.positiveReview.length > 0 ?
            dataReview?.positiveReview.map((item,index) => {
                return (
                    <div className='each-review' key={index}>
                        <div>{item.review}</div>
                        <div>{item.username}</div>
                        <div>{item.rating}</div>
                    </div>
                )
            })
        : isSuccess && data?.positiveReview.length > 0 ? 
            data.positiveReview.map((item,index) => {
                return (
                    <div className='each-review' key={index}>
                        <div>{item.review}</div>
                        <div>{item.username}</div>
                        <div>{item.rating}</div>
                    </div>
                )
        }): null

    const renderNegativeReview = success && dataReview.status && dataReview?.negativeReview.length > 0 ?
        dataReview?.negativeReview.map((item,index) => {
            return (
                <div className='each-review' key={index}>
                    <div>{item.review}</div>
                    <div>{item.username}</div>
                    <div>{item.rating}</div>
                </div>
            )
        })
    : isSuccess && data?.negativeReview.length > 0 ? 
        data.negativeReview.map((item,index) => {
            return (
                <div className='each-review' key={index}>
                    <div>{item.review}</div>
                    <div>{item.username}</div>
                    <div>{item.rating}</div>
                </div>
            )
    }): null


    const handleOnSubmit = (event) => {
        event.preventDefault()
        if(reviewData.review && reviewData.review !== ''){
            setDelayedData(reviewData)
        }
    }

    const ratingHandleChange = (event,newValue) => {
        setReviewData((prevVal) => {
            return {
                ...prevVal,
                'rating' : newValue,
            }
        })
    }

    const handleOnChange = (event) => {
        const {name, value} = event.target;
        setReviewData((prevVal) => {
            return {
                ...prevVal,
                [name] : value,
            }
        })
    }

    let hasJapan;
    let hasKorea;
    let hasAustralia;
    let hasUSA;
    let hasUK;

    if(data){
        hasKorea = data.institutionData.countries.includes('South Korea');
        hasJapan = data.institutionData.countries.includes('Japan');
        hasAustralia = data.institutionData.countries.includes('Australia');
        hasUSA = data.institutionData.countries.includes('USA');
        hasUK = data.institutionData.countries.includes('UK');
    }

    const renderFeatureClasses = () => {
        let array = [];
        if(hasKorea){
            array.push('TOPIK','KLPT')
        }
        if(hasJapan){
            array.push('JLPT,Japanese Proficiency Tests')
        }
        if(hasAustralia || hasUK || hasUSA){
            array.push('IELTS','PTE','TOEFL','Doulingo Tests','GRE','GMAT')
        }
        else{
            array.push('IELTS','PTE','TOEFL','And other preparaotory classes')
        }
        return array
    }

    let featureArray; 
    if(data && data.institutionData.countries.length !== ''){
        featureArray = data && renderFeatureClasses();
    }

    return(
        <main className="detail-page">
            <section className="detail-hero">
                <div className='img-back-logo-holder'>
                    <InstitutionImage name={data?.institutionData.name || institution} category="institution" className="back-logo-img" loading="eager" />
                </div>
                <div className='fields-holder'>
                    <div className="detail-title">
                        <span className="eyebrow">Consultancy profile</span>
                        <h1>{data?.institutionData.name || institution}</h1>
                        <p>Review destinations, partner reach, experience, outcomes, classes, location, and student feedback before shortlisting this consultancy.</p>
                    </div>
                    <div>
                        Countries served: {data && data.institutionData.countries.length}
                    </div>
                    <div>
                        University partners: {data && data.institutionData.universities !== '' ? data.institutionData.universities : "Not shown" }    
                    </div>
                    <div>
                        Experience: {data && data.institutionData.experience !== '' ? `${data.institutionData.experience} years` : "Not shown"}    
                    </div>
                    <div>
                        Successful services: {data && data.institutionData.success !== '' ? data.institutionData.success : "Not shown"}    
                    </div>
                </div>
            </section>
            <section className="detail-content">
                <div className="info-panel">
                    <h2>About</h2>
                    <p>
                        {data?.institutionData.name || "This consultancy"} is listed with measurable profile data so students can evaluate service reach, preparation support, and credibility before contacting the institution.
                    </p>
                    {renderNegativeReview}
                    {renderPositiveReview}
                </div>
                <div className='feature-holder-in info-panel'>
                    <h2>Highlights</h2>
                    <ul>
                        {
                            data && data.institutionData.countries.length > 0 ? (
                                <li>This institution serves {data.institutionData.countries.length} countries.</li>
                            ) : null}
                        {
                            data && data.institutionData.countries.length > 0 ? (
                            <li>It serves countries like {data.institutionData.countries.join(', ')} etc.</li>
                            ) : null}
                        {
                            data && data.institutionData.experience !== '' ? (
                                <li>This institution has the experience of {data.institutionData.experience} years</li>
                            ) : null
                        } 
                        {
                            data && data.institutionData.success !== '' ? (
                                <li>Till now it has accumulated {data.institutionData.success} successful services</li>
                            ) : null
                        } 
                        {
                            featureArray && 
                            <li>It provides different classes like {featureArray.join(', ')} etc.</li>
                        }

                    </ul>
                </div>
            </section>
            {
                data && data?.institutionData.latitude !== '' && data?.institutionData.latitude &&
                <section className="map-section">
                <GoogleMap 
                    lat={data.institutionData.latitude}
                    long = {data.institutionData.longitude}
                />
                </section>
            }
            <section className='post-review'>
                <h2>Share a review</h2>
                <form onSubmit={handleOnSubmit}>
                    <div className='review'>
                        <label>Review</label>
                        <input
                            name='review'
                            value={reviewData.review}
                            type='text'
                            onChange={handleOnChange}
                        />
                    </div>
                    <div className='rating'>
                        <Rating
                            precision={0.5}
                            name='rating'
                            value={reviewData.rating}
                            onChange={ratingHandleChange}
                        />
                    </div>
                    <button>Submit Review</button>
                </form> 
            </section>
            <section className="review-grid">
            <div className="info-panel">
                {
                    data && data?.positiveReview.length > 0 && <h2>Positive Reviews</h2> }
                {
                    data && data?.positiveReview.length > 0 &&
                    data.positiveReview.map((item,index) => {
                        return(
                            <div key={index}>
                                <p>{item.review}</p>
                                <p>By {item.username}</p>
                                <p>{item.rating} star</p>
                            </div>
                        )
                    })
                }
            </div>
            <div className="info-panel">
                {
                    data && data?.negativeReview.length > 0 && <h2>Negative Reviews</h2> }
                {
                    data && data?.negativeReview.length > 0 &&
                    data.negativeReview.map((item,index) => {
                        return(
                            <div key={index}>
                                <p>{item.review}</p>
                                <p>By {item.username}</p>
                                <p>{item.rating} star</p>
                            </div>
                        )
                    })
                }
            </div>
            </section>

        </main>
    )
}
