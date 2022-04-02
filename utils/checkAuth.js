const { AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const {SECRET_KEY} = require('../config')


module.exports = (context)=>{
    const authHeader = context.req.headers.authorization
    if(authHeader){
        const token = authHeader.split('Bearer')[1].trim()
        if(token){
            try{
                console.log(token)
                const user = jwt.verify(token, SECRET_KEY)
                return user
            }
            catch(err){
                throw new AuthenticationError('Ivalid/Expired token')
            }
        }
        throw new Error('Authentication token must be \'Bearer [token]')
    }
    throw new Error('Authorization must be provide')
}