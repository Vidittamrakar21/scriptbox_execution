import express from 'express';

const router = express.Router();


import {firstapi , files , filecontent , startplayground, stopplayground , clearplayground} from '../controller/app.js'

 
router.route('/first').get(firstapi); 
router.route('/files').get(files);   
router.route('/filecontent').get(filecontent);   
router.route('/startpg').post(startplayground);   
router.route('/clearpg').post(clearplayground);   
router.route('/stop').post(stopplayground);   



export default router;