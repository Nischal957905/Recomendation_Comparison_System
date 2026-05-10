import Institution from '../models/Institution.js'
import College from '../models/College.js'
import School from '../models/School.js'
import Review from '../models/Review.js'
import handleAsync from 'express-async-handler'
import * as turf from '@turf/turf'

const toNumber = (value, fallback = 0) => {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : fallback
}

const safeDivide = (value, divisor) => divisor === 0 ? 0 : value / divisor

const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key)

const servicePointHandler = (university,country, speciality, totalUni, totalCountry, totalSpecial, count) => {
    const universityValue = toNumber(university)
    const countryValue = toNumber(country)
    const specialityValue = toNumber(speciality)
    const universityAverage = safeDivide(totalUni, count);
    const countryAverage = safeDivide(totalCountry, count);
    const specialAverage = safeDivide(totalSpecial, count);

    const percentUniversity = universityAverage * .45;
    const percentCountry = countryAverage * .35;
    const percentSpecial = specialAverage * .20;

    const points = safeDivide(percentCountry * countryValue, countryAverage) + 
        safeDivide(percentUniversity * universityValue, universityAverage) +
        safeDivide(percentSpecial * specialityValue, specialAverage)

    return points * 20;
}

const experiencePointHandler = (totalExp, totalSucess, exp, success, count) => {
    const expPoint = toNumber(exp)
    const successPoints = toNumber(success)

    const expAverage = safeDivide(totalExp, count);
    const successAverage = safeDivide(totalSucess, count);

    const percentExp = expAverage * .50;
    const percentSuccess = successAverage * .50;

    const points = safeDivide(percentExp * expPoint, expAverage) + safeDivide(percentSuccess * successPoints, successAverage)

    return points * 20;
}

const experienceCollegePointHandler = (totalExp, exp,count, ugc) => {
    const expPoint = toNumber(exp)
    const ugcPoint = ugc === " ✓ UGC Accredited" ? 13 : 3

    const expAverage = safeDivide(totalExp, count);

    const percentExp = expAverage * .70;
    const percentUgc = ugcPoint * .30;

    const points = safeDivide(percentExp * expPoint, expAverage) + (percentUgc)

    return points * 20;
}

const timeManipulator = (time) => {
    const safeTime = String(time || "9")
    if(safeTime.includes(":")){
        return parseInt(safeTime.split(":")[0])
    }
    else{
        return parseInt(safeTime)
    }
}

const accessPointHandler = (opTime, clTime, online, platform) => {


    let openingTime = timeManipulator(opTime);
    let closing_time = timeManipulator(clTime);
    if(closing_time < 10){
        closing_time = closing_time + 12;
    }
    const operatingHours = closing_time - openingTime;
    const operatingPoints = operatingHours * 5;

    if(platform !== "jirok") {

        const onlinePoints = online === true ? 5 : 2;
        const pointsOnline = onlinePoints * 2.5;
        const platformPoints = platform === 'Global' ? 5 : 2;
        const pointsPlatform = platformPoints * 2.5;
        return pointsOnline + operatingPoints + pointsPlatform;
    }

    else if(platform === "jirok"){

        const onlinePoints = online === " community Institution " ? 10 : 5;
        const pointsOnline = onlinePoints * 5;

        return pointsOnline + operatingPoints;
    }
    
}


const getCompany = handleAsync(async (req, res) => {
    try {
      const companyId = req.params.id
      console.log(companyId)
      return res.json("hello")
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });

const getComparison = handleAsync(async (req, res) => {
    try {
        
    } catch (error) {
        res.status(404).json({error: 'Page not found'});
    }
})

const applyDistanceFilter = (useLat,useLong,lat,long) => {

    if(lat !== '' && long !== ''){
        let distanceOne = turf.point([useLat,useLong])
        let distanceTwo = turf.point([lat,long])
        let options = {units: 'metres'};
        let distance = turf.distance(distanceOne, distanceTwo, options)  
        return distance;
    }
    else{
        return "";
    }
}

const reviewPointHandler = (reviews) => {

    let totalReviews = reviews.length;
    if(totalReviews === 0){
        return 0;
    }
    let ratingPointsTotal = 0;
    reviews.forEach(element => {
        const rating = element.rating;
        ratingPointsTotal += rating;
    });
    
    let points = (ratingPointsTotal /totalReviews ) + totalReviews
    return points * 10;
}

const getComparisonList = handleAsync(async (req, res) => {

    const insObject = req.query
    console.log(insObject)
    let fullObject = [];
    let scoreObject = [];
    let fullReviews = [];
    //Service Oriented
    let totalUniPoint = 0;
    let totalCountryCount = 0;
    let totalSpecialCount = 0;

    //Experience Oriented
    let totalExpPoint = 0;
    let totalSucessPoint = 0;

    let checkValue = true;

    if(Object.keys(insObject).length !== 0){
        checkValue = checkValues(insObject)
    }

    if(!checkValue){
        return res.status(405).json({ error: 'Empty Value not accepted.' });
    }

    if(Object.keys(insObject).length !== 0 && checkValue){
        for(let iterator in insObject){
            if(hasOwn(insObject, iterator)){
                const comparisonInstitution = await Institution.find(
                    {name: insObject[iterator]}).select().lean()
                if(!comparisonInstitution[0]){
                    return res.status(404).json({ error: `Institution not found: ${insObject[iterator]}` })
                }
                fullObject.push(comparisonInstitution[0])

                const reviews = await Review.find({
                    institution_code: comparisonInstitution[0]._id
                }).select().lean()
                fullReviews.push(reviews)
            }
        }
    }  

    if(fullObject.length > 0 && checkValue){
        fullObject.forEach((item,index) => {
            
            totalUniPoint += toNumber(item.universities)
            totalCountryCount += Array.isArray(item.countries) ? item.countries.length : 0
            totalSpecialCount += Array.isArray(item.specialization) ? item.specialization.length : 0
            totalExpPoint += toNumber(item.experience)
            totalSucessPoint += toNumber(item.success)
        });
    }
    
    if(fullObject.length > 0 && checkValue){
        fullObject.forEach((item,index) => {
            const reviews = fullReviews[index]

            const reviewPoint = reviewPointHandler(
                reviews
            )
            const servicePoint = servicePointHandler(
                item.universities, 
                Array.isArray(item.countries) ? item.countries.length : 0, 
                Array.isArray(item.specialization) ? item.specialization.length : 0, 
                totalUniPoint,
                totalCountryCount,
                totalSpecialCount,
                fullObject.length
            );
            
            const expPoint = experiencePointHandler(
                totalExpPoint,
                totalSucessPoint,
                item.experience,
                item.success,
                fullObject.length,
            )

            const accessPoint = accessPointHandler(
                item.opening_time,
                item.closing_time,
                item.online,
                item.platform,
            )

            const userLat = 27.6948534;
            const userLong = 85.3049344;
            const distance = applyDistanceFilter(
                userLat,
                userLong,
                item.latitude,
                item.longitude,
            )

            scoreObject.push({
                index: index + 1,
                service: servicePoint,
                experience: expPoint,
                access: accessPoint,
                institution: item,
                distanceMetre: distance,
                review: reviewPoint,
            })
        });
    }

    const institutions = await Institution.find().select().lean();
    const institutionsName = await Institution.distinct('name').lean();

    if(fullObject.length > 0 && checkValue){
        return res.json({institutions, institutionsName,scoreObject})
    }
    return res.json({institutions, institutionsName})
})

const checkValues = (val) => {
    return Object.values(val).every(item => item !== '' && item !== null);
}

const getCollegeComparisonList = handleAsync(async (req, res) => {

    const insObject = req.query
    let fullObject = [];
    let scoreObject = [];
    let fullReviews = [];

    //Experience Oriented
    let totalExpPoint = 0;
    let checkValue = true;

    if(Object.keys(insObject).length !== 0){
        checkValue = checkValues(insObject)
    }

    if(!checkValue){
        return res.status(405).json({ error: 'Empty Value not accepted.' });
    }

    if(Object.keys(insObject).length !== 0 && checkValue){
        for(let iterator in insObject){
            if(hasOwn(insObject, iterator)){
                const comparisonInstitution = await College.find(
                    {name: insObject[iterator]}).select().lean()
                if(!comparisonInstitution[0]){
                    return res.status(404).json({ error: `College not found: ${insObject[iterator]}` })
                }
                fullObject.push(comparisonInstitution[0])

                const reviews = await Review.find({
                    institution_code: comparisonInstitution[0]._id
                }).select().lean()
                fullReviews.push(reviews)
            }
        }
    }  
    
    if(fullObject.length > 0 && checkValue){
        fullObject.forEach(item => {
            totalExpPoint += toNumber(item.experience)
        });
    }
    
    if(fullObject.length > 0 && checkValue){
        fullObject.forEach((item,index) => {

            const reviews = fullReviews[index]

            const reviewPoint = reviewPointHandler(
                reviews
            )
            
            const expPoint = experienceCollegePointHandler(
                totalExpPoint,
                item.experience,
                fullObject.length,
                item.ugc,
            )

            const accessPoint = accessPointHandler(
                item.opening_time,
                item.closing_time,
                item.ownership,
                "jirok"
            )

            const userLat = 27.6948534;
            const userLong = 85.3049344;
            const distance = applyDistanceFilter(
                userLat,
                userLong,
                item.latitude,
                item.longitude,
            )

            scoreObject.push({
                index: index + 1,
                experience: expPoint,
                access: accessPoint,
                institution: item,
                distanceMetre: distance,
                review: reviewPoint,
            })
        });
    }

    const institutions = await College.find().select().lean();
    const institutionsName = await College.distinct('name').lean();

    if(fullObject.length > 0 && checkValue){
        return res.json({institutions, institutionsName,scoreObject})
    }
    return res.json({institutions, institutionsName})
})

const getSchoolComparisonList = handleAsync(async (req, res) => {

    const insObject = req.query
    let fullObject = [];
    let scoreObject = [];
    let fullReviews = [];

    //Experience Oriented
    let totalExpPoint = 0;

    let checkValue = true;

    if(Object.keys(insObject).length !== 0){
        checkValue = checkValues(insObject)
    }

    if(!checkValue){
        return res.status(405).json({ error: 'Empty Value not accepted.' });
    }

    if(Object.keys(insObject).length !== 0 && checkValue){
        for(let iterator in insObject){
            if(hasOwn(insObject, iterator)){
                const comparisonInstitution = await School.find(
                    {name: insObject[iterator]}).select().lean()
                if(!comparisonInstitution[0]){
                    return res.status(404).json({ error: `School not found: ${insObject[iterator]}` })
                }
                fullObject.push(comparisonInstitution[0])

                const reviews = await Review.find({
                    institution_code: comparisonInstitution[0]._id
                }).select().lean()
                fullReviews.push(reviews)
            }
        }
    }  
    
    if(fullObject.length > 0 && checkValue){
        fullObject.forEach(item => {
            totalExpPoint += toNumber(item.experience)
        });
    }
    
    if(fullObject.length > 0 && checkValue){
        fullObject.forEach((item,index) => {

            const reviews = fullReviews[index]

            const reviewPoint = reviewPointHandler(
                reviews
            )
            
            const expPoint = experienceCollegePointHandler(
                totalExpPoint,
                item.experience,
                fullObject.length,
                item.ugc,
            )

            const accessPoint = accessPointHandler(
                item.opening_time,
                item.closing_time,
                item.ownership,
                "jirok"
            )

            const userLat = 27.6948534;
            const userLong = 85.3049344;
            const distance = applyDistanceFilter(
                userLat,
                userLong,
                item.latitude,
                item.longitude,
            )

            scoreObject.push({
                index: index + 1,
                experience: expPoint,
                access: accessPoint,
                institution: item,
                distanceMetre: distance,
                review: reviewPoint,
            })
        });
    }

    const institutions = await School.find().select().lean();
    const institutionsName = await School.distinct('name').lean();

    if(fullObject.length > 0 && checkValue){
        return res.json({institutions, institutionsName,scoreObject})
    }
    return res.json({institutions, institutionsName})
})


export default {getComparisonList, getCompany, getComparison, getCollegeComparisonList, getSchoolComparisonList};
