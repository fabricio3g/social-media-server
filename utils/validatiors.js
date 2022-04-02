module.exports.validateRegisterInput = (
  username,
  email,
  password,
  comfirmPassword
) => {
    const errors = {}
    if(username.trim() === ''){
        errors.username = "Username must no be empty"
    }
    if(email.trim() === ''){
        errors.username = "Username must no be empty"
    }else{
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = "Must be a valid email address"
        }
    }
    if(password === ''){
        errors.password = 'Password must not be empty'
    }else if(password !== comfirmPassword){
        errors.comfirmPassword = 'Password must match'
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    } 
};



module.exports.validateLoginInput = (username, password) => {
    const errors = {}
    if(username.trim() === ''){
        errors.username = "Username must no be empty"
    }
    if(password.trim() === ''){
        errors.username = "Password must no be empty"
    }
    return {
        errors,
        valid: Object.keys(errors).length < 1
    } 
}