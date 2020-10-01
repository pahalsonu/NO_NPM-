const crypto = require('crypto');
const config = {};

config.hash = (str) => {




    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac('sha256', "HardTo_Crack").update(str).digest('hex');
        return hash;
    } else {
        return false;
    }

}

module.exports = config 