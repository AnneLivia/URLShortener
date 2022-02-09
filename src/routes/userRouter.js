import userController from '../controller/userController.js';
import {Router} from 'express';

const router = Router();

router.get('/user', userController.index);
router.get('/user/:id', userController.getOne);
router.post('/user', userController.store);
router.delete('/user/:id', userController.remove);
router.put('/user/:id', userController.update);

export default router;