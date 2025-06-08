const mongoose = require('mongoose');

const visitLogSchema = new mongoose.Schema({
    ip: String,
    route: String,
    method: String,
    timestamp: {
        type: String,
        default:  () => {
            return new Date().toLocaleString('en-IN', {
                timeZone: 'Asia/Kolkata',
                hour12: true
            });

        }
    }
});

module.exports = mongoose.model('VisitLog', visitLogSchema);
