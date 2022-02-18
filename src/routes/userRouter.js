import UserController from '../controller/userController.js';
import {Router} from 'express';

const router = Router();

const userController = new UserController();

router.post('/login', userController.login.bind(userController));
router.get('/users', userController.index.bind(userController));
router.get('/users/:id', userController.getOne.bind(userController));
router.post('/users', userController.store.bind(userController));
router.delete('/users/:id', userController.remove.bind(userController));
router.put('/users/:id', userController.update.bind(userController));

export default router;