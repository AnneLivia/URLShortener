import ShortenerModel from '../models/ShortenerModel.js';

export default class Controller {
    async index(req, res) {
        const shorteners = await ShortenerModel.find().lean();
        res.json({shorteners});
    }

    getOne(req, res) {}

    async store(req, res) {
        
        const shortener = await ShortenerModel.create(req.body);

        res.json({shortener});
    }

    update(req, res) {}

    remove(req, res) {}
}

