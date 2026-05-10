import  { useParams } from 'react-router-dom'
import { useGetSingleCollegeQuery,  usePostReviewQuery } from "../../app/api/appSlice"
import GoogleMap from '../../components/utilities/GoogleMap';
import { useState, useEffect } from 'react';
import Rating from "@mui/material/Rating";
import InstitutionImage from "../../components/utilities/InstitutionImage";

export default function InstitutionPage() {

    const { college } = useParams();

    const institution = college;
    const username = localStorage.getItem('username')
    const [delayedData, setDelayedData] = useState({})
    
    const {
        data,
        isLoading,
        isSuccess,
        isError,
        error,
        refetch
    } = useGetSingleCollegeQuery(college);
 
    const [reviewData, setReviewData] = useState({
        'username' : username,
        'rating': 0,
        'review': '',
        'institution': null
    })

    const {
        data: dataReview,
        isLoading: loaded,
        isSuccess: success,
        isError: errors,
    } = usePostReviewQuery({institution, delayedData})
    
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

    useEffect(() => {
        if(success){
            refetch()
        }
    },[dataReview])

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
    return(
        <main className="detail-page">
            <section className="detail-hero">
                <div className='img-back-logo-holder'>
                    <InstitutionImage name={data?.institutionData.name || college} category="college" className="back-logo-img" loading="eager" />
                </div>
                <div className='fields-holder'>
                    <div className="detail-title">
                        <span className="eyebrow">College profile</span>
                        <h1>{data?.institutionData.name || college}</h1>
                        <p>Evaluate accreditation, ownership, establishment history, experience, location, and student feedback in one place.</p>
                    </div>
                    <div>
                        Accreditation: {data && data?.institutionData.accreditation}
                    </div>
                    <div>
                        Established: {data && data?.institutionData.established !== '' ? data?.institutionData.established : "Not shown" }    
                    </div>
                    <div>
                        Experience: {data && data?.institutionData.experience !== '' ? `${data?.institutionData.experience} years` : "Not shown"}    
                    </div>
                </div>
            </section>
            <section className="detail-content">
                <div className="info-panel">
                    <h2>About</h2>
                    <p>{data?.institutionData.name || "This college"} is presented with practical comparison details so students can understand the institution before applying or visiting.</p>
                </div>
                <div className='feature-holder-in info-panel'>
                    <h2>Highlights</h2>
                    <ul>
                        {
                            data && data?.institutionData.ownership && data?.institutionData.ownership === 'private Institution' ? (
                                <li>This institution is a privately owned institution</li>
                            ) : <li>This institution is a ppublicly owned institution</li>}
                        {
                            data && data?.institutionData.established && data?.institutionData.established !== '' ? (
                            <li>It was established at {data?.institutionData.established}</li>
                            ) : null}
                        {
                            data && data?.institutionData.experience !== '' ? (
                                <li>This college has the experience of {data?.institutionData.experience} years</li>
                            ) : null
                        } 
                    
                    </ul>
                </div>
            </section>
            {
                data && data?.institutionData.latitude && data?.institutionData.latitude !== '' &&
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
