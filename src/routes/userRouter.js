import userController from '../controller/userController.js';
import {Router} from 'express';

const router = Router();

router.get('/users', userController.index);
router.get('/users/:id', userController.getOne);
router.post('/users', userController.store);
router.delete('/users/:id', userController.remove);
router.put('/users/:id', userController.update);

export default router;