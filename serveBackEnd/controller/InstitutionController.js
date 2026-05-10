import Institution from '../models/Institution.js'
import Review from '../models/Review.js'
import handleAsync from 'express-async-handler'
import * as turf from '@turf/turf'

// @desc get all institution
// @route GET/institution
// @private
//This is the controller function that is responsible for providing the required data of the insittuion 
//to the frontend

const parseTimeString = timeString => {
    const parts = timeString.split(':');
    const hours = parseInt(parts[0]);
    const minutes = parts.length > 1 ? parseInt(parts[1]) : 0;
    const date = new Date(2000, 1, 2, hours, minutes);
    return date;
};

const applyRangeFilter = (item, start, end) => {
    
    const translateStart = parseInt(start)
    const translateEnd = parseInt(end)
    let filter = true;

    if(item === ''){
        filter = false
    }
    else{
        const translateItem = parseInt(item)
        if(translateItem > translateEnd){
            filter = false
        }
        else if(translateItem < translateStart){
            filter = false
        }
    }
    return filter;
}

const applyTimeFilter = (itemStart, itemEnd, start, end) => {
    const timeStart = parseTimeString(itemStart)
    const timeEnd = parseTimeString(itemEnd)
    const startTime = parseTimeString(start)
    const endTime = parseTimeString(end)
    let filter = true;

    if(startTime > timeStart){
        filter = false
    }
    if(endTime <  timeEnd){
        filter = false
    }
    return filter
}

const applyDistanceFilter = (filter,useLat,useLong,lat,long) => {
    
    let returnValue = false;

    if(lat !== '' && long !== ''){
        let distanceOne = turf.point([useLat,useLong])
        let distanceTwo = turf.point([lat,long])
        let options = {units: 'metres'};
        let distance = turf.distance(distanceOne, distanceTwo, options)
        if(filter === "Near" && distance < 200){
            returnValue = true;
        }
        else if(filter === "Distant" && distance > 2000){
            returnValue = true;
        } 
        else if(filter === "Moderate" && distance > 200 && distance < 2001){
            returnValue = true;
        }
    }
    
    return returnValue
    
}

const applyFilter = (params, data) => {
    return data.filter(item => {
        let filters = true;
        
        const fil = applyTimeFilter(item.opening_time,item.closing_time,params['opening-time'], params['closing-time'])
        if(!fil)
            return false

        // //filter for success
        const filterVal = applyRangeFilter(item.success, params['success-start'],params['success-end'])
        if(!filterVal)
            return false

        // // //filter for experience
        const expVal = applyRangeFilter(item.experience, params['experience-start'],params['experience-end'])
        if(!expVal)
            return false

        // // //filter for university
        const uniVal = applyRangeFilter(item.universities, params['university-start'], params['university-end'])
        if(!uniVal)
            return false

        // // //Filter for online services.
        const online = params['online-service'] === "online" ? true : false
        if(online !== item.online){
            return false
        }

        // // //filter for platform
        const platform = params['platform'] === 'Global' ? 'Global' : ''
        if(platform !== item.platform){
            return false
        }

        ////filter for distance
        const distance = params['distance'];
        const userLat = 27.6948534;
        const userLong = 85.3049344;
        const realDistance = applyDistanceFilter(params['distance'],userLat,userLong,item.latitude,item.longitude)
        if(!realDistance){
            return false
        }
        

        // //filter for days
        const openingDays = params['opening-days'].split(',');
        const itemOpening = item.holidays;

        if(itemOpening.length > 0) {
            let newVal = false;

            for(let i = 0; i<itemOpening.length; i++){

                let incr = false;

                for(let j=0; j<openingDays.length; j++){
                    if(itemOpening[i] === openingDays[j]){
                        incr = true;
                        break;
                    }
                }
                if(incr){
                    newVal = incr
                    break;
                }
            }
            if(newVal){
                return false
            }
        }
        
        return filters
    })
}

const applyQuickFilter = (data, params) => {
    return data.filter(item => {
        let filters = true;

        if(params.experience && item.experience === ''){
            return false
        }
        if(params.experience && item.experience !== ''){
            const arrayExperience = params.experience.split(',');
            let itemIdentification;

            if(item.experience < 6){
                itemIdentification = 'Low'
            }
            else if(item.experience > 20){
                itemIdentification = 'High'
            }
            else if(item.experience < 21 && item.experience > 5){
                itemIdentification = 'Moderate'
            }
            if(!arrayExperience.includes(itemIdentification)){
                return false
            }
        }

        return filters
    })
}

const reviewTotaling = (data) => {
    let value = 0;
    if(!data.length > 0){
        return 0;
    }
    data.forEach(element => {
        value += element.rating  
    });

    return value
}

const getInstitutionList = handleAsync(async (req, res) => {
    const filter = req.query
  
    let institutions;
    let totalReview = [];
    let reviews = [];
    institutions = await Institution.find().select().sort({name: 1}).lean();
    const countryValid = await Institution.distinct('countries').lean(); 
    const countries = countryValid.filter((country) => country !== "");
    const speciality = await Institution.distinct('specialization').lean(); 

    let status = false
    let additionalStatus = false

    if(Object.keys(filter).length !== 0){

        if((filter.country && filter.country !== "") && (filter.speciality && filter.speciality !== "")){
            const arrayCountry = filter.country;
            const seperateString = arrayCountry.split(',');
            const arraySpecial = filter.speciality;
            const seperateSpecial = arraySpecial.split(',');
            institutions = await Institution.find({
                countries: {$in: seperateString},
                specialization: {$in: seperateSpecial}
            }).select({name: 1, _id: 1}).sort({name: 1}).lean();
            status = true
            additionalStatus = false
        }
    
        else if(filter.speciality && filter.speciality !== ""){
            const arraySpecial = filter.speciality;
            const seperateString = arraySpecial.split(',');
            institutions = await Institution.find({
                specialization: {$in: seperateString}
            }).select({name: 1, _id: 1}).sort({name: 1}).lean();
            status = true
            additionalStatus = false
        }
    
        else if(filter.country && filter.country !== ""){
            const arraySpecial = filter.country;
            const seperateString = arraySpecial.split(',');
            institutions = await Institution.find({
                countries: {$in: seperateString}
            }).select({name: 1, _id: 1}).sort({name: 1}).lean();
            status = true
        }
        
        if(filter.experience && filter.experience !== ""){
            institutions = applyQuickFilter(institutions, filter)
            status = true
        }

        if(filter['opening-time']){
            const hap = applyFilter(filter,institutions)
            institutions = hap;
            additionalStatus = true;
            status = false;
        }
    }

    // for(let i = 0; i<institutions.length; i++){
    //     const review = await Review.find({
    //         institution_code: institutions[i]._id
    //     }).select().lean()
    //     const totalPoints = reviewTotaling(review);
    //     totalReview.push(totalPoints);
    // }

    //console.log(totalReview)
    return res.json({institutions, countries, status, speciality, additionalStatus, filter})
})

const getSingleInstitution = handleAsync(async (req, res) => {
    try {
        const institution = req.params.institution
        if(institution){
            const institutionData = await Institution.findOne({name: institution}).lean()

            const positiveReview = await Review.find({
                institution_code: institutionData._id,
                rating_classification: "Positive"
            }).select().lean().limit(5)
    
            const negativeReview = await Review.find({
                institution_code: institutionData._id,
                rating_classification: "Negative"
            }).select().lean().limit(5)

            return res.json({institutionData, positiveReview, negativeReview})
        }
        else{
            return res.status(404).json({error: 'Page not Found'});
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
})

const createReviewRating = handleAsync(async (req,res) => {

    const review = req.query;
    const reviewComment = review.review
    const user = review.username;

    const institution = review.institution;

    const rating = review.rating && parseFloat(review.rating)
    const review_class = rating > 3.5 ? "Positive" : rating > 2 && rating < 4 ? "Neutral" : "Negative"

    //check review
    const existence = await Review.findOne({
        username: user,
        institution_code: institution
    }).select().lean()

    let status = false;

    if(existence && review.review && review.username){
        const data = {username: user, institution_code: institution}
        const update = {review: reviewComment, rating: rating, rating_classification: review_class}
        const up = await Review.findOneAndUpdate(data, update,{
            new: true
        })
        status = true
    }
    
    if(!existence && review.review && review.username){
        const newReview = await Review.create({
            'username': user,
            'institution_code': institution,
            'review': reviewComment,
            'rating_classification': review_class,
            'rating': rating
        })
        
        status = true;
    }

    const positiveReview = await Review.find({
        institution_code: institution,
        rating_classification: "Positive"
    }).select().lean().limit(5)

    const negativeReview = await Review.find({
        institution_code: institution,
        rating_classification: "Negative"
    }).select().lean().limit(5)

    return res.json({positiveReview, negativeReview, status})
})

// @desc create new institution
// @route POST/institution
// @private
const createInstitution = handleAsync(async (req, res) => {

})

// @desc update institution
// @route PATCH/institution
// @private
const updateInstitution = handleAsync(async (req, res) => {

})


// @desc  delete institution
// @route DElETE/institution
// @private
const deleteInstitution = handleAsync(async (req, res) => {

})

export default { getInstitutionList, createInstitution,createReviewRating, updateInstitution, deleteInstitution, getSingleInstitution};
