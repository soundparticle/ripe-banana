const { assert } = require('chai');
const { getErrors } = require('./helpers');
const Reviewer = require('../../lib/models/reviewer');

describe('Reviewer model', () => {

    it('validates good model', () => {
        const data = {
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana'
        };
        const chip = new Reviewer(data);

        const json = chip.toJSON();
        delete json._id;
        assert.deepEqual(json, data);
        assert.isUndefined(chip.validateSync());
    });

    it('name and company are required', () => {
        const tyrone = new Reviewer({});
        const errors = getErrors(tyrone.validateSync(), 2);
        assert.equal(errors.name.kind, 'required');
        assert.equal(errors.company.kind, 'required');
    });
});