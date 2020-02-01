import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../server-dev';
import {waterfall} from 'async';

chai.use(chatHttp);

const {expect} = chai;

const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
	(value_x, r) => ('x' === value_x ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));

describe('Run testing:', () => {
	it('It should get api:', cb => {
		chai.request(app)
			.get('/api')
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('message').eql('Welcome to this API!');
				cb();
			});
	});
});

describe('Testing the Author endpoints:', () => {
	let author_id;

	it('It should get all authors (null)', cb => {
		chai.request(app)
			.get('/api/author')
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('status').eql('success');
				res.body.should.have.property('message').eql('No Author found');
				cb();
			});
	});

	it('It should create an author', cb => {
		const data = {name: 'James Hadley Chase', description: 'An English writer'};
		chai.request(app)
			.post('/api/author')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(201);
				expect(res.body.data).to.include({name: data.name});
				author_id = res.body.data.author_id;
				cb();
			});
	});

	it('It should not create a author with incomplete parameters', cb => {
		const data = {name: 'James Hadley Chase', descriptions: ''};
		chai.request(app)
			.post('/api/author')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Incomplete information');
				cb();
			});
	});

	it('It should not create a author with missing parameters', cb => {
		const data = {name: 'James Hadley Chase'};
		chai.request(app)
			.post('/api/author')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Incomplete information');
				cb();
			});
	});

	it('It should get all authors', cb => {
		chai.request(app)
			.get('/api/author')
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('status').eql('success');
				res.body.should.have.property('message').eql('Authors Received');
				expect(res.body.data).to.not.have.lengthOf(0);
				cb();
			});
	});

	it('It should get a particular author', cb => {
		chai.request(app)
			.get(`/api/author/${author_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('message').eql('Author Found');
				res.body.data.should.have.property('name');
				cb();
			});
	});

	it('It should not get a particular author with invalid id', cb => {
		let random_id = uuid();
		chai.request(app)
			.get(`/api/author/${random_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(404);
				res.body.should.have.property('message')
					.eql(`Author with the id ${random_id} cannot be found`);
				cb();
			});
	});

	it('It should not get a particular author with non-uuid', cb => {
		const uuid = 'invalid_uuid';
		chai.request(app)
			.get(`/api/author/${uuid}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});

	it('It should update a author', cb => {
		const updatedData = {description: 'An English writer. Novelist.'};
		chai.request(app)
			.put(`/api/author/${author_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body.data.description).equal(updatedData.description);
				cb();
			});
	});

	it('It should not update a author with invalid id', cb => {
		let random_uuid = uuid();
		const updatedData = {description: 'An English writer. Novelist.'};
		chai.request(app)
			.put(`/api/author/${random_uuid}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(404);
				res.body.should.have.property('message')
					.eql(`Author with the id ${random_uuid} cannot be found`);
				cb();
			});
	});

	it('It should not update a author with non-id', cb => {
		const uuid = 'invalid_uuid';
		const updatedData = {description: 'An English writer. Novelist.'};
		chai.request(app)
			.put(`/api/author/${uuid}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});

	it('It should delete a author', cb => {
		chai.request(app)
			.delete(`/api/author/${author_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body.data).to.include({});
				cb();
			});
	});

	it('It should not delete a author with invalid id', cb => {
		let random_id = uuid();
		chai.request(app)
			.delete(`/api/author/${random_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(404);
				res.body.should.have.property('message')
					.eql(`Author with the id ${random_id} cannot be found`);
				cb();
			});
	});

	it('It should not delete a author with non-uuid', cb => {
		const uuid = 'invalid_uuid';
		chai.request(app)
			.delete(`/api/author/${uuid}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});
});

describe('Testing the Book endpoints:', () => {
	let author_id, book_id;

	it('It should get all books (null)', cb => {
		chai.request(app)
			.get('/api/book')
			.set('Accept', 'book/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('status').eql('success');
				res.body.should.have.property('message').eql('No Book found');
				cb();
			});
	});

	it('It should create an book', cb => {
		const author = {name: 'James Hadley Chase', description: 'An English writer'};
		const book = {
			title: 'The World in My Pocket', genre: 'Thriller', rating: 4,
			description: 'The World in My Pocket is a 1959 thriller novel by the British writer James Hadley Chase'
		};
		chai.request(app)
			.post('/api/author')
			.set('Accept', 'application/json')
			.send(author)
			.end((err, res) => {
				author_id = res.body.data.author_id;
				book.author_id = author_id;
				chai.request(app)
					.post('/api/book')
					.set('Accept', 'application/json')
					.send(book)
					.end((err, res) => {
						expect(res.status).to.equal(201);
						expect(res.body.data).to.include({title: book.title});
						expect(res.body.data).to.include({genre: book.genre});
						expect(res.body.data).to.include({description: book.description});
						expect(res.body.data).to.include({author_id: book.author_id});
						expect(res.body.data).to.include({rating: book.rating});
						book_id = res.body.data.book_id;
						cb();
					});

			});
	});

	it('It should not create a author with incomplete parameters', cb => {
		const data = {title: 'The Soft Centre', genre: 'Crime novel', rate: 3, descriptions: 'test', author_id};
		chai.request(app)
			.post('/api/book')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Incomplete information');
				cb();
			});
	});

	it('It should not create a author with missing parameters', cb => {
		const data = {title: 'You\'re Dead Without Money', author_id};
		chai.request(app)
			.post('/api/book')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Incomplete information');
				cb();
			});
	});

	it('It should not create a book with wrong author id', cb => {
		const data = {
			title: 'The World in My Pocket', genre: 'Thriller', rating: 4,
			description: 'The World in My Pocket is a 1959 thriller novel by the British writer James Hadley Chase',
			author_id: 'invalid'
		};
		chai.request(app)
			.post('/api/book')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid author UUID');
				cb();
			});
	});

	it('It should not create a book with wrong rating', cb => {
		const data = {
			title: 'The World in My Pocket', genre: 'Thriller', rating: 'not int', author_id,
			description: 'The World in My Pocket is a 1959 thriller novel by the British writer James Hadley Chase'
		};
		chai.request(app)
			.post('/api/book')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid rating value');
				cb();
			});
	});

	it('It should get all books', cb => {
		chai.request(app)
			.get('/api/book')
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('status').eql('success');
				res.body.should.have.property('message').eql('Books Received');
				expect(res.body.data).to.not.have.lengthOf(0);
				cb();
			});
	});

	it('It should get a particular book', cb => {
		chai.request(app)
			.get(`/api/book/${book_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				res.body.should.have.property('message').eql('Book Found');
				res.body.data.should.have.property('title');
				res.body.data.should.have.property('genre');
				res.body.data.should.have.property('description');
				res.body.data.should.have.property('rating');
				res.body.data.should.have.property('author_id');
				cb();
			});
	});

	it('It should not get a particular book with invalid id', cb => {
		let random_id = uuid();
		chai.request(app)
			.get(`/api/book/${random_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(404);
				res.body.should.have.property('message')
					.eql(`Book with the id ${random_id} cannot be found`);
				cb();
			});
	});

	it('It should not get a particular book with non-uuid', cb => {
		const uuid = 'invalid_uuid';
		chai.request(app)
			.get(`/api/book/${uuid}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});

	it('It should update a book', cb => {
		const updatedData = {description: 'Publication date - 1959'};
		chai.request(app)
			.put(`/api/book/${book_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body.data.description).equal(updatedData.description);
				cb();
			});
	});

	it('It should not update a book with invalid id', cb => {
		let random_uuid = uuid();
		const updatedData = {description: 'Publication date - 1959'};
		chai.request(app)
			.put(`/api/book/${random_uuid}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(404);
				res.body.should.have.property('message')
					.eql(`Book with the id ${random_uuid} cannot be found`);
				cb();
			});
	});

	it('It should not update a book with non-id', cb => {
		const uuid = 'invalid_uuid';
		const updatedData = {description: 'Publication date - 1959'};
		chai.request(app)
			.put(`/api/book/${uuid}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});

	it('It should not update a book with wrong author id', cb => {
		const updatedData = {author_id: 'wrong uuid'};
		chai.request(app)
			.put(`/api/book/${book_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid author UUID');
				cb();
			});
	});

	it('It should not update a book with wrong rating', cb => {
		const updatedData = {rating: 'wrong rating'};
		chai.request(app)
			.put(`/api/book/${book_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid rating value');
				cb();
			});
	});

	it('It should delete a book', cb => {
		chai.request(app)
			.delete(`/api/book/${book_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body.data).to.include({});
				chai.request(app)
					.delete(`/api/author/${author_id}`)
					.set('Accept', 'application/json')
					.end(cb);
			});
	});

	it('It should not delete a book with invalid id', cb => {
		let random_id = uuid();
		chai.request(app)
			.delete(`/api/book/${random_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(404);
				res.body.should.have.property('message')
					.eql(`Book with the id ${random_id} cannot be found`);
				cb();
			});
	});

	it('It should not delete a book with non-uuid', cb => {
		const uuid = 'invalid_uuid';
		chai.request(app)
			.delete(`/api/book/${uuid}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});
});