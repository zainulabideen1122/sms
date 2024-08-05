const jwt = require('jsonwebtoken')
const verifyRoles = (...allowedRoles)=>{
    return (req, res, next)=>
    {
        const allowed = [...allowedRoles]
        const decoded = jwt.verify(req.headers['token'], process.env.SECRET_KEY)
        if(decoded)
        {
            const result = allowed.includes(decoded.role)
            console.log('verify roles middleware : ----------------- ',result, allowed, decoded.role)
            if(!result)
            {
                return res.status(403).send('Unauthorized!')
            }
        }
        else{
            return res.status(400).send('Unauthorized!')
        }
        
        next()
    }
}


module.exports = verifyRoles