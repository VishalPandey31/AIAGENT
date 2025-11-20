import projectModel from '../models/project.model'
import projectService from '../services/project.service'
import {validationResult} from 'express-validator';

export const createProject= async (req,res)=>{
 const errors=validationResult(req);

 if(!errors.isEmpty()){
    return res.status(400).json({errors:errors.array()});
 }
}