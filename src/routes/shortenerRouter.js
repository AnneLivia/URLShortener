import ShotenerController from '../controller/ShortenerController.js';
import {Router}  from 'express';

const shotenerController = new ShotenerController();

const router = Router();

router.get('/shortener', shotenerController.index);
router.get('/shortener/:id', shotenerController.getOne)
router.post('/shortener', shotenerController.store)
router.put('/shortener/:id', shotenerController.update)
router.delete('/shortener/:id', shotenerController.remove)


export default router;