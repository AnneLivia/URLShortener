import ShotenerController from '../controller/ShortenerController.js';
import {Router}  from 'express';

const shotenerController = new ShotenerController();

const router = Router();

router.get('/:hash', shotenerController.redirect);
router.get('/api/shortener', shotenerController.index);
router.get('/api/shortener/:id', shotenerController.getOne)
router.post('/api/shortener', shotenerController.store)
router.put('/api/shortener/:id', shotenerController.update)
router.delete('/api/shortener/:id', shotenerController.remove)



export default router;