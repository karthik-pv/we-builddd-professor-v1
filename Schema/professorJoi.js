const Joi = require('joi');

const professorRegisterJoi =  Joi.object({

    email: Joi.string().email().required(),

    name: Joi.string().pattern(/^[a-zA-Z\s]+$/).required(),

    password: Joi.string().min(7).max(25).required(),

    subjects: Joi.array(),

    secretKey : Joi.string().required()
})

const professorEditJoi = Joi.object({

    email: Joi.string().email(),

    name: Joi.string().pattern(/^[a-zA-Z\s]+$/),

    password: Joi.string().min(7).max(25),

    subjects: Joi.array()

})

module.exports={ professorEditJoi , professorRegisterJoi };