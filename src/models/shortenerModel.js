import mongoose from 'mongoose';

const ShortenerSchema = mongoose.Schema( { 
    name: String,
})

const ShortenerModel = mongoose.model('shortener', ShortenerSchema);

export default ShortenerModel;