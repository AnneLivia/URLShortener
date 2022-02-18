import ShotenerController from '../controller/ShortenerController.js';
import {Router}  from 'express';

const shotenerController = new ShotenerController();

const router = Router();

router.get('/:hash', shotenerController.redirect);
router.get('/api/shorteners', shotenerController.index);
router.get('/api/shorteners/:id', shotenerController.getOne)
router.post('/api/shorteners', shotenerController.store)
router.put('/api/shorteners/:id', shotenerController.update)
router.delete('/api/shorteners/:id', shotenerController.remove)



export default router;