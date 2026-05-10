import College from '../models/College.js'
import Review from '../models/Review.js'
import handleAsync from 'express-async-handler'
import * as turf from '@turf/turf'

const getSingleCollege = handleAsync(async (req, res) => {
    try {
        const college = req.params.college
        if(college){
            const institutionData = await College.findOne({name: college}).lean()

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

    if(lat === undefined){
        return false;
    }
    if(long === undefined){
        return false;
    }
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

const applyQuickFilter = (data, params) => {
    return data.filter(item => {
        let filters = true;

        if(params.ugc && item.ugc !== ''){
            const arrayUgc = params.ugc.split(',');
            if(!arrayUgc.includes(item.ugc)){
                return false; 
            }
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
            else{
                itemIdentification = 'Moderate'
            }
            if(!arrayExperience.includes(itemIdentification)){
                return false
            }
        }
        if(params.ownership && item.ownership !== ''){
            const arrayOwner = params.ownership.split(',');
            if(!arrayOwner.includes(item.ownership)){
                return false
            }
        }
        return filters
    })
}

const applyFilter = (params, data) => {
    return data.filter(item => {
        let filters = true;
        
        const fil = applyTimeFilter(item.opening_time,item.closing_time,params['opening-time'], params['closing-time'])
        if(!fil)
            return false

        //filter for experience
        const expVal = applyRangeFilter(item.experience, params['experience-start'],params['experience-end'])
        if(!expVal)
            return false

        ////filter for distance
        const userLat = 27.6948534;
        const userLong = 85.3049344;
        const realDistance = applyDistanceFilter(params['distance'],userLat,userLong,item.latitude,item.longitude)
        if(!realDistance){
            return false
        }
        return filters
    })
}

const getCollegeList = handleAsync(async (req, res) => {
    const filter = req.query
    console.log(filter)

    let colleges;
    let additionalStatus = false;
    colleges = await College.find().select().lean();

    if(filter['opening-time']){
        const hap = applyFilter(filter,colleges)
        colleges = hap;
        additionalStatus = true;
    }
    else if(!filter['opening-time']) {
        additionalStatus = false;
    }

    if(Object.keys(filter).length !== 0){
        colleges = applyQuickFilter(colleges, filter)
    }

    return res.json({colleges, additionalStatus})
})

export default { getSingleCollege, getCollegeList};
