const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
    const token = req.header('x-auth-token')
    try {
        if (!token)
            return res.status(401).json({ msg: 'no authentication token, authorization denied' })
        //verify the token
        const verifiedToken = jwt.verify(token, process.env.JWT_TOKEN);
        if (!verifiedToken)
            return res
              .status(401)
                .json({ msg: "token verification failed, authorization denied" });
    
        req.user = verifiedToken.id;
        next()
            
    } catch(err){
        console.log(err);
        res.status(500).json({ error: err.message });
    }    
}

module.exports = auth