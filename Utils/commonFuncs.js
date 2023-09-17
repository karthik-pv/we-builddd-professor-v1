function serverError(res,error){
    res.status(500).json({
        message: 'Something went wrong'
    })
    console.log(error)
    return;
};

function joiError(res,error){
    const { details } = error
        if (details) {
            let errorArray=[];
            for (errMsg of details) {
                errorArray.push(errMsg.message);
            }
            return res.status(400).json({
                errorArray});
    }
}


module.exports = {serverError,joiError};