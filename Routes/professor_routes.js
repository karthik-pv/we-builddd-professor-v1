const express = require('express');
var router = express.Router();

const {register , login , remove ,info , edit} = require('../Controllers/professors');

router.post('/register',register);
router.post('/login' ,login);
router.delete('/remove:id',remove);
router.get('/info:id',info);
router.patch('/edit:id',edit)

module.exports=router;