import userModel from '../models/user.model.js';


export const createuser= async({
    email,password
})=>{
    if(!email || !password){
        throw new Error('Email and password are required');
    }

const hashedpassword=await userModel.hashedpassword(password);

const user=await userModel.create({
    email,
    password:hashedpassword
})

return user;
}