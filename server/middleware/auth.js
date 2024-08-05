const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next)=>{
    const token = req.headers['token']
    if(token)
    {
        jwt.verify(token, process.env.SECRET_KEY, function(err, decoded){
            if(decoded == undefined)
            {
                return res.status(403).json({message:"You are not authorized to access this stuff"})
            }
            else next()
        })
    }
    else{
        return res.status(403).json({message:"You are not authorized to access this stuff"})
    }
    
}

module.exports = authMiddleware