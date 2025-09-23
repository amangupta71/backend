const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = (req, res,next) => {
    //fist check if authorization header is present
    if(!req.headers.authorization){
        return res.status(401).json({error: 'Unauthorized: No token provided'});
    }

    //extract the jwt token from req header
    const token = req.headers.authorization.split(' ')[1]; // assuming Bearer <token>
    if(!token){
        return res.status(401).json({error: 'Unauthorized: No token provided'});
    }

    try {
        //verify the Jwt token
       const decodedd =  jwt.verify(token,process.env.JWT_SECRET);

       //attach the decoded payload to req.user for further use
       req.user = decodedd;
       next(); // proceed to the next middleware or route handler
        
    } catch (error) {
        console.error(error);
        return res.status(401).json({error: 'Unauthorized: Invalid token'});
    }
}

//fuction to generate jwt token
const generateToken = (userData) => {
    return jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:'12h'});
}

module.exports = {
    jwtAuthMiddleware,
    generateToken
}