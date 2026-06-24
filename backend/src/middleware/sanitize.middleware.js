function sanitizeObject(obj){

    if(!obj || typeof obj !== 'object'){
        return obj;
    }

    for(const key in obj){

        if(key.includes('$') || key.includes('.')){
            delete obj[key];
            continue;
        }

        if(typeof obj[key] === 'object'){
            sanitizeObject(obj[key]);
        }
    }

    return obj;
}

function sanitizeMiddleware(req, res, next){

    sanitizeObject(req.body);

    sanitizeObject(req.params);

    sanitizeObject(req.query);

    next();
}

module.exports = sanitizeMiddleware;