const { default: mongoose } = require('mongoose');
const professorModel = require('../Models/professor_model');
const {professorEditJoi , professorRegisterJoi} = require('../Schema/professorJoi');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {serverError,joiError} = require('../Utils/commonFuncs');

// to register a professor 
module.exports.register = async( req , res ) => {
    try {

        // validate elements in request body 
        const {email , name , password , subject , secretKey} = await professorRegisterJoi.validateAsync(req.body,{abortEarly : false});
        

         // check if professor already exsist
         const savedProfessor = await professorModel.findOne({ name });
         if (savedProfessor !== null) {
 
             return res.status(403).json({
                 message: `Professor with name ${name} already exist.`
             })
         }

        if(secretKey === process.env.PROFESSOR_REGISTER_SECRET){
        // hash given password
        const hashedPassword = await bcrypt.hash(password, Number(process.env.BCRYPT_SALT_ROUNDS));
        //create new object for professor
        const professor = new professorModel({email , name , password : hashedPassword , subject});
        // update with database
        await professor.save()
        // return success msg 
        res.status(201).json({message:'ok'});
        }
        else{
            res.status(400).json({message : 'professor register secret key does not match'});
        }
    }
    catch(error){
        // sending joi validation error messages
        if(joiError(res,error))
            return;
        //unhandled server errors
        serverError(res,error);
    }
}

// to login a professor 

module.exports.login = async ( req,res) => {
    try{
        const { name , password } = req.body ;
        const savedProfessor = await professorModel.findOne({name});
        if (savedProfessor === null){
            res.status(404).json({
                message : `professor with name ${name} not found.`
            })
        }
        else{
            if(await bcrypt.compare(password,savedProfessor.password)){

            const { JWT_SECRET, JWT_EXPIRY } = process.env
                const payload = { _id: savedProfessor._id }
                const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY })
                res.status(201).json({ token })
            }
            else{
                 return res.status(401).json({
                    message: 'Wrong password.'
                })
            }
        }
    }
    catch(error){
        serverError(res,error);
    }
}

module.exports.remove = async (req, res) => {
    try {
        const { id } = req.params

        // check if valid id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid ObjectId'
            })
        }

        // deleting professor
        const deletedProfessor = await professorModel.findByIdAndDelete(id)

        // if professor not present
        if (deletedProfessor === null) {
            return res.status(404).json({
                message: `Professor with id ${id} not found.`
            })
        }

        res.status(200).json({
            message: 'ok'
        })
    } catch (error) {

        // server error
        serverError(res,error);
    }
}

module.exports.info = async (req, res) => {
    try {
        const { id } = req.params

        // check if valid id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid ObjectId'
            })
        }

        // getting professor information
        const professor = await professorModel.findOne({ _id: id });

        // if professor not found
        if (professor === null) {
            return res.status(404).json({
                message: `Professor with id ${id} not found.`
            })
        }

        res.status(200).json(professor)
    } catch (error) {

        // server error
        serverError(res,error);
    }
}

module.exports.edit = async (req, res) => {
    try {
        const { id } = req.params
        const { email, name , subjects } = await professorEditJoi.validateAsync(req.body)

        // check if valid id
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                message: 'Invalid ObjectId'
            })
        }

        // updating professor
        const updatedProfessor = await professorModel.findByIdAndUpdate(id, { email, name, subjects }, { new: true });

        if (updatedProfessor === null) {
            return res.status(404).json({
                message: `Professor with id ${id} not found.`
            })
        }

        res.status(200).json({
            message: 'ok'
        })
    } catch (error) {

        // sending joi validation error messages
        if(joiError(res,error))
            return;
        // server error
        serverError(res,error);
    }
}
