const { assert } = require('chai');
const request = require('./request');
const { dropCollection } = require('./db');
const { checkOk } = request;

describe('Reviewer API', () => {

    beforeEach(() => dropCollection('reviewers'));

    let token;
    beforeEach(() => {
        return request
            .post('/api/auth/signup')
            .send({
                name: 'Tyrone Payton',
                company: 'Fermented Banana',

                email: 'tyrone@banana.com',
                password: 'abc123',
            })
            .then(checkOk)
            .then(({ body }) => {
                token = body.token;
            });
    });

    it('signs up a user', () => {
        assert.isDefined(token);
    });




    // old tests
    function save(reviewer) {
        return request
            .post('/api/reviewers')
            .set('Authorization', token)
            .send(reviewer)
            .then(checkOk)
            .then(({ body }) => body);
    }

    let tyrone;
    let chip;

    beforeEach(() => {
        return save({
            name: 'Tyrone Payton',
            company: 'Fermented Banana',

            email: 'tyrone@banana.com',
            password: 'abc123',
        })
            .then(data => tyrone = data);
    });

    beforeEach(() => {
        return save({
            name: 'Chip Ellsworth III',
            company: 'Fermented Banana',
            
            email: 'chip@banana.com',
            password: 'abc123',
            
        })
            .then(data => chip = data);
    });


    it('saves a reviewer', () => {
        assert.isOk(chip._id);
        assert.isOk(tyrone._id);
    });

    it('gets a reviewer by id', () => {
        return request
            .get(`/api/reviewers/${chip._id}`)
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, chip);
            });
    });

    it('gets all reviewers', () => {
        return request
            .get('/api/reviewers')
            .then(checkOk)
            .then(({ body }) => {
                assert.deepEqual(body, [tyrone, chip]);
            });
    });

    it('updates a reviewer', () => {
        tyrone.company = 'Very Bad Wizards';
        return request
            .put(`/api/reviewers/${tyrone._id}`)
            .send(tyrone)
            .then(checkOk)
            .then(() => {
                assert.equal(tyrone.company, 'Very Bad Wizards');
            });
    });
});