// const { assert } = require('chai');
// const request = require('./request');
// const { dropCollection } = require('./db');
// const { Types } = require('mongoose');

// const { checkOk } = request;

// describe('Reviews API', () => {

//     beforeEach(() => dropCollection('reviews'));

//     function save(review) {
//         return request
//             .post('/api/reviews')
//             .send(review)
//             // .then(() => console.log('***review***', review))
//             .then(checkOk)
//             .then(({ body }) => body);
//     }

//     let amazing;
//     let horrible;

//     beforeEach(() => {
//         return save({
//             rating: 5,
//             reviewer: Types.ObjectId,
//             review: 'This is amazing',
//             film: Types.ObjectId
//         })
//             .then(data =>  amazing = data);
//     });

//     beforeEach(() => {
//         return save({
//             rating: 1,
//             reviewer: Types.ObjectId,
//             review: 'This is horrible',
//             film: Types.ObjectId
//         })
//             .then(data => {
//                 horrible = data;
//             });
//     });

//     it('saves a review', () => {
//         assert.isOk(amazing._id);
//     });
// });