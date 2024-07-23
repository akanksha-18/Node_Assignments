const JWT= require('jsonwebtoken');

const secret ='$uperMan@123';
function createTokenForUser(user){
    const payload={
        _id:user._id,
        email:user.email,
        profilephoto:user.profilephoto,
        role:user.role,
    };
    const token=JWT.sign(payload,secret);
    console.log(token);
    return token;
}

function validateToken(token){
    const payload=JWT.verify(token,secret);
    return payload;
}

module.exports={
    createTokenForUser,
    validateToken
}
