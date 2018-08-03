module.exports = function(){
    return function(req,res,next){
        req.flash = function(type, message){
            if(req.session){
                req.session.messages = req.session.messages || [];
                req.session.messages.push({type: type, message: message});
            }
        };
        res.locals.flash = function(){
            var messages = req.session.messages || [];
            if(req.session && req.session.messages) delete req.session.messages;
            return messages;
        };
        next();
    };
};
