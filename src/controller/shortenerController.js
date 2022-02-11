import ShortenerModel from '../models/ShortenerModel.js';
import crypto from 'crypto';
import userAgent from 'user-agent';

export default class Controller {
    async index(req, res) {
        const shorteners = await ShortenerModel.find().lean();
        res.json({shorteners});
    }

    async getOne(req, res) {
        const {id} = req.params;

        try {
            const shortener = await ShortenerModel.findById(id);

            if (shortener) {
                return res.json({shortener});
            }

            res.status(404).json({message: "Shortener not found!"});

        } catch (err) {

            console.error(err.message);

            res.status(400).json({message: "Unexpected error!"});

        }
    }

    async store(req, res) {
        
        const {link, expiredDate, name} = req.body;

        const [hash] = crypto.randomUUID().split('-');

        const shortener = await ShortenerModel.create( {hash, link, expiredDate, name} );

        res.json({shortener});
    }

    async update(req, res) {

        const {id} = req.params;
        const {link, name, expiredDate} = req.body;

        try {
            const shortener = await ShortenerModel.findByIdAndUpdate(id, {
                link, name, expiredDate,
            }, {new: true});

            if (shortener) {
                return res.json({shortener});
            }

            res.status(404).json({nessage: "Shortener not found!"});

        } catch (err) {

            console.error(err.message);

            res.status(400).json({message: "Unexpected error!"});

        }
    }

    async remove(req, res) {

        const {id} = req.params;

        try {
            const shortener = await ShortenerModel.findById(id);

            if (shortener) {
                await shortener.remove();

                return res.json({message: "Shortener removed!"});
            }

            res.status(404).json({message: "Shotener not found!"});

        } catch (err) {

            console.error(err.message);

            res.status(400).json({message: "Unexpected error!"});

        }
    }


    async redirect(req, res) {

        const {hash} = req.params;
        
        try {

            const shortener = await ShortenerModel.findOne({hash: hash}); // hash: hash

            if (shortener) {
                
                if (shortener.expired) {
                    return res.json({message: "Shortener expired!"});
                }
                const userAgentDetail = userAgent.parse(req.headers['user-agent'])
                
                const metadata = {
                    ip: req.ip,
                    userAgent: req.headers['user-agent'],
                    language: req.headers['accept-language'],
                    userAgentDetail,
                }  

                shortener.hits++;
                shortener.metadata.push(metadata);
                await shortener.save();

                return res.redirect(shortener.link);

            }

            res.status(404).json({message: "Shortener not found!"});

        } catch (err) {

            console.error(err.message);

            res.status(400).json({message: "Unexpected error!"});
        }

    }
}

