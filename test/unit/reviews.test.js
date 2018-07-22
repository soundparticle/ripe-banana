const { assert } = require('chai');
const { Types } = require('mongoose');
const { getErrors } = require('./helpers');
const Review = require('../../lib/models/review');

describe('Review model', () => {

    it('validates a good model', () => {
        const data = {
            rating: 4,
            reviewer: Types.ObjectId(),
            review: 'I haven\'t seen this movie',
            film: Types.ObjectId(),
        };
        const review = new Review(data);

        const json = review.toJSON();
        delete json._id;
        assert.isUndefined(review.validateSync());
        assert.deepEqual(json, data);
    });

    it()
});