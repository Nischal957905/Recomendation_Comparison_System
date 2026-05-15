import mongoose from 'mongoose'
import handleAsync from 'express-async-handler'
import Post from '../../models/Post.js'
import College from '../../models/College.js'
import School from '../../models/School.js'
import Review from '../../models/Review.js'
import Institution from '../../models/Institution.js'
import User from '../../models/User.js'
import Comment from '../../models/Comment.js'

const checkValues = (val) => {
    return Object.values(val).every(item => item !== '' && item !== null);
}

const deleteInstitution = handleAsync(async (req, res) => {
    if(req.query.delete !== '' && req.query.delete){
        const id = new mongoose.Types.ObjectId(req.query.delete)
        if(req.query.category === "consultancy"){
            //const review = await Review.findOneAndRemove({institution_code: id});
            //const data = await Institution.findByIdAndRemove({_id:id})
        }
        else if(req.query.category === "college"){
            //const data = await College.findByIdAndRemove({_id:id})
        }
        else if(req.query.category === "school"){
            //const data = await School.findByIdAndRemove({_id:id})
        }
    }
})

const getUserList = handleAsync(async (req,res) => {

    const getAllUsers = await User.find().select({_id:1, username:1, status: 1,role_id: 1}).lean();

    // const structuredData = []
    // for(let i=0; i<getAllUsers.length; i++){
    //     const posts = getAllUsers[i]._id;
    //     const getAllPosts = await Post.find({user_id: posts}).select({_id: 1, post: 1, date: 1}).lean()
    //     structuredData.push({
    //         'user' : getAllUsers[i],
    //         'posts' : getAllPosts
    //     })
    // }

    return res.json(getAllUsers)
}) 

const upload = handleAsync(async (req, res) => {
    if(!req.file){
        return res.status(400).json({ message: 'No image uploaded' })
    }

    return res.status(201).json({
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
    })
})

const editPost = handleAsync(async (req, res) => {

    const institution = req.params.institution;
    if (!mongoose.Types.ObjectId.isValid(institution)) {
        return res.status(400).json({ message: 'Invalid user id.' })
    }
    const data = await Post.find({user_id: institution}).select({date: 1, _id: 1, post: 1}).lean()

    return res.json(data)
})

const inactivateUser = handleAsync(async (req,res) => {
    
    if(req.query.user !== '' && req.query.user){
        const user = req.query.user;
        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ message: 'Invalid user id.' })
        }
        const id = new mongoose.Types.ObjectId(user)
        const data = await User.findOne({_id: id}).select({status: 1}).lean()
        const updateFil = {_id: id}
        const status = data.status === "Active" ? "Inactive" : "Active" 
        const updateData = {status: status}
        const update = await User.findOneAndUpdate(updateFil, updateData, {
            new: true,
        })
        const successData = "updated"
        if(update){
            return res.json(successData)
        }   
    }
})

const editCollege = handleAsync(async (req, res) => {
    const institution = req.params.institution
    const params = req.query
    const edit = params.edit === 'true' ? true : false
    if (!mongoose.Types.ObjectId.isValid(institution)) {
        return res.status(400).json({ message: 'Invalid college id.' })
    }
    const id = new mongoose.Types.ObjectId(institution)
    const initialArray = await College.findOne({_id: id}).select().lean();
 
    if(edit && params.latitude !== "" && params.latitude
    && params.name !== "" && params.name && params.address !== "" && params.address
    && params.email !== "" && params.email && params.longitude !== "" && params.longitude
    && params.experience !== "" && params.experience && params.phone !== "" && params.phone
    && params.website !== "" && params.website && params.accreditation !== "" && params.accreditation
    && params.ownership !== "" && params.ownership){
        const id = new mongoose.Types.ObjectId(req.query.id)

        const find = await College.findOne({name: params.name}).select({_id: 1}).lean();
        const condition = find && (id.equals(find._id)) 
        if(find === null && condition === null || find && condition ){
            const findValue = {_id: id}
            const updatedValues = {
                name: params.name,
                location: params.address,
                email: params.email,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                experience: parseInt(params.experience),
                phone: params.phone,
                website_url: params.website,
                ugc: params.accreditation === "Ugc" ? ' ✓ UGC Accredited' : "",
                ownership: params.ownership === "Private" ? " private Institution " : " community Institution ",
            }

            const updateInstitution = await College.findOneAndUpdate(findValue, updatedValues,{
                new: true, 
            })
            return res.json(updateInstitution)
        }
        else{
            return res.json(initialArray)
        }
        
    }
    return res.json(initialArray)
})

const editConsultancy = handleAsync(async (req, res) => {
    const institution = req.params.institution
    const params = req.query
    if (!mongoose.Types.ObjectId.isValid(institution)) {
        return res.status(400).json({ message: 'Invalid institution id.' })
    }
    const id = new mongoose.Types.ObjectId(institution)
    const initialArray = await Institution.findOne({_id: id}).select().lean();

    if(req.query.edit  && params.latitude !== "" && params.latitude
    && params.name !== "" && params.name && params.address !== "" && params.address
    && params.email !== "" && params.email && params.longitude !== "" && params.longitude
    && params.experience !== "" && params.experience && params.phone !== "" && params.phone
    && params.website !== "" && params.website && params.university && params.university !== ""
    && params.success !== "" && params.success  && params.platform !== "" && params.platform 
    && params.online !== "" && params.online){
        const id = new mongoose.Types.ObjectId(req.query.id)

        const find = await Institution.findOne({name: params.name}).select({_id: 1}).lean();
        const condition = find && (id.equals(find._id)) 
        if(find === null && condition === null || find && condition ){
            const findValue = {_id: id}
            const updatedValues = {
                name: params.name,
                address: params.address,
                email: params.email,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                experience: parseInt(params.experience),
                phone: params.phone,
                website: params.website,
                platform: params.platform,
                success: parseInt(params.success),
                universities: parseInt(params.university),
                online: params.online === "Online" ? true : false
            }
            const updateInstitution = await Institution.findOneAndUpdate(findValue, updatedValues,{
                new: true, 
            })
            return res.json(updateInstitution)
        }
        else{
            return res.json(initialArray)
        }
    }
    return res.json(initialArray)
})

const editSchool = handleAsync(async (req, res) => {
    const institution = req.params.institution
    const params = req.query
    if (!mongoose.Types.ObjectId.isValid(institution)) {
        return res.status(400).json({ message: 'Invalid school id.' })
    }
    const id = new mongoose.Types.ObjectId(institution)
    const initialArray = await School.findOne({_id: id}).select().lean();

    if(req.query.edit && params.latitude !== "" && params.latitude
    && params.name !== "" && params.name && params.address !== "" && params.address
    && params.email !== "" && params.email && params.longitude !== "" && params.longitude
    && params.experience !== "" && params.experience && params.phone !== "" && params.phone
    && params.website !== "" && params.website && params.accreditation !== "" && params.accreditation
    && params.ownership !== "" && params.ownership){
        const id = new mongoose.Types.ObjectId(req.query.id)
        const find = await School.findOne({name: params.name}).select({_id: 1}).lean();
        const condition = find && (id.equals(find._id)) 
        if(find === null && condition === null || find && condition ){
            const findValue = {_id: id}
            const updatedValues = {
                name: params.name,
                location: params.address,
                email: params.email,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                experience: parseInt(params.experience),
                phone: params.phone,
                website_url: params.website,
                opening_time: params.opening,
                closing_time: params.closing,
                accreditation: params.accreditation,
                ownership: params.ownership === "Private" ? " private Institution " : " community Institution ",
            }
            const updateInstitution = await School.findOneAndUpdate(findValue, updatedValues,{
                new: true, 
            })
            return res.json(updateInstitution)
        }
        else{
            return res.json(initialArray)
        }
    }
    return res.json(initialArray)
})

const getAdminShowCase = handleAsync(async (req, res) => {

    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const pageSize = 20
    const [institutionData, collegeData, schoolData] = await Promise.all([
        Institution.find().select({name: 1, _id:1}).sort({name: 1}).lean(),
        College.find().select({name: 1, _id: 1}).sort({name: 1}).lean(),
        School.find().select({name: 1, _id: 1}).sort({name: 1}).lean(),
    ]);

    const begining = (page - 1) * pageSize;
    const ending = page * pageSize;

    const structuredInstitution = institutionData.slice(begining, ending)
    const structuredCollege = collegeData.slice(begining, ending)
    const structuredSchool = schoolData.slice(begining, ending)
    const maxValue = Math.max(institutionData.length, collegeData.length, schoolData.length)
    const totalPage =  Math.max(Math.ceil(maxValue / pageSize), 1);

    return res.json({structuredInstitution, structuredCollege, structuredSchool, totalPage})
})

const createCollege = handleAsync(async (req, res) => {

    const params = req.query;

    if(params.address !== "" && params.address && params.name !== "" && params.name
    && params.email !== "" && params.email  && params.latitude !== "" && params.latitude
    && params.longitude !== "" && params.longitude  && params.phone !== "" && params.phone
    && params.experience !== "" && params.experience  && params.website !== "" && params.website
    && params.opening !== "" && params.opening  && params.closing !== "" && params.closing
    && params.established !== "" && params.established){

        const find = await College.findOne({name: params.name}).select().lean()
        if(!find){
            const newInstitution = await College.create({

                name: params.name,
                location: params.address,
                email: params.email,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                experience: parseInt(params.experience),
                phone: params.phone,
                website_url: params.website,
                opening_time: params.opening,
                closing_time: params.closing,
                ugc : params.accreditation === "Ugc" ? ' ✓ UGC Accredited' : "",
                ownership: params.ownership === "Private" ? " private Institution " : " community Institution ",
                established: params.established
            })
        }
        else{
            res.status(409).json({ error: 'Already Exists' });
        }
        
    }
    else{
        
    }
})

const createSchool = handleAsync(async (req, res) => {

    const params = req.query;
    
    if(params.address !== "" && params.address && params.name !== "" && params.name
    && params.email !== "" && params.email  && params.latitude !== "" && params.latitude
    && params.longitude !== "" && params.longitude  && params.phone !== "" && params.phone
    && params.experience !== "" && params.experience  && params.website !== "" && params.website
    && params.opening !== "" && params.opening  && params.closing !== "" && params.closing
    && params.established !== "" && params.established ){

        const findInstitution = await School.findOne({name: params.name}).select().lean()
        if(!findInstitution){
            const newInstitution = await School.create({
                name: params.name,
                location: params.address,
                email: params.email,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                experience: parseInt(params.experience),
                phone: params.phone,
                website_url: params.website,
                opening_time: params.opening,
                closing_time: params.closing,
                accreditation: params.accreditation,
                ownership: params.ownership === "Private" ? " private Institution " : " community Institution ",
                established: params.established
    
            })
        }
        else{
            res.status(409).json({ error: 'Already Exists' });
        }
    }
    else{
        
    }
})

const formatCapital =(word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}
  
const createConsultancy = handleAsync(async (req, res) => {

    const params = req.query;

    if(params.address !== "" && params.address && params.name !== "" && params.name
    && params.email !== "" && params.email  && params.latitude !== "" && params.latitude
    && params.longitude !== "" && params.longitude  && params.phone !== "" && params.phone
    && params.experience !== "" && params.experience  && params.website !== "" && params.website
    && params.opening !== "" && params.opening  && params.closing !== "" && params.closing
    && params.platform !== "" && params.platform && params.specialization !== "" && params.specialization
     && params.country !== "" && params.country
    && params.success !== "" && params.success && params.holidays !== "" && params.holidays
    && params.university !== "" && params.university){

        const find = await Institution.findOne({name: params.name}).select().lean()
        if(!find){
            const specialValue = params.specialization.split(',')
            const countryValue = params.country.split(',')
            const holiday = params.holidays.split(',')
            const holidaySet = holiday.map((item) =>  formatCapital(item))
            const countrySet = countryValue.map((item) => formatCapital(item))
            const newInstitution = await Institution.create({
                name: params.name,
                address: params.address,
                email: params.email,
                latitude: parseFloat(params.latitude),
                longitude: parseFloat(params.longitude),
                experience: parseInt(params.experience),
                phone: params.phone,
                website: params.website,
                opening_time: params.opening,
                closing_time: params.closing,
                platform: params.platform,
                specialization: specialValue,
                countries: countrySet,
                success: parseInt(params.success),
                universities: parseInt(params.university),
                holidays: holidaySet,
                online: params.online === "Online" ? true : false
            })
        }
        else{
            res.status(409).json({ error: 'Already Exists' });
        }
    }
    else{
       
    }
})

export default { createCollege, 
    createSchool, createConsultancy, getAdminShowCase,
    deleteInstitution, editCollege, editConsultancy, 
    editSchool, getUserList, editPost, inactivateUser, upload };
