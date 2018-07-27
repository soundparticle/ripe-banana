const { HttpError } = require('./errors');

module.exports = function createEnsureRole(role) {
    return ({ user }, res, next) =>  {
        if(!(user && user.roles && user.roles.includes(role))) {
            throw new HttpError({
                code:403,
                message: 'Must Be An Admin'
            });
        }
    };
};