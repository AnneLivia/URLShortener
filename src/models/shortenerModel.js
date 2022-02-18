import mongoose from 'mongoose';

const ShortenerSchema = mongoose.Schema( { 
    name: String,
    link: {type: String, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'users'},
    expired: {type: Boolean, default: false},
    expiredDate: Date,
    hits: {type: Number, min: 0, default: 0},
    metadata: [mongoose.Schema.Types.Mixed],
    hash: {type: String, required: true},
}, 
{
    timestamps: true,
})

const ShortenerModel = mongoose.model('shortener', ShortenerSchema);

export default ShortenerModel;