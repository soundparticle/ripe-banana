const { assert } = require('chai');

const getErrors = (validation, numberExpected) => {
    assert.isDefined(validation);
    const errors = validation.errors;
    assert.equal(Object.keys(errors).length, numberExpected);
    console.log('**** Object.keys ****', Object.keys(errors));
    return errors;
};



module.exports = {
    getErrors
};