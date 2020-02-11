import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';

chai.use(chatHttp);

const {expect} = chai;
const app = 'http://localhost:8080'
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
  (value_x, r) => ('x' === value_x ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));

let author_id, book_id;

  it('It should create an author', cb => {
		const data = {name: 'James Hadley Chase', description: 'An English writer'};
		chai.request(app)
			.post('/api/authors')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(201);
				expect(res.body.data).to.include({name: data.name});
				author_id = res.body.data.id;
				cb();
			});
	});

  it('It should not create a author with incomplete parameters', cb => {
		const data = {name: 'James Hadley Chase', descriptions: ''};
		chai.request(app)
			.post('/api/authors')
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
			.post('/api/authors')
			.set('Accept', 'application/json')
			.send(data)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Incomplete information');
				cb();
			});
	});

	it('It should return the previously added author', cb => {
		chai.request(app)
			.get('/api/authors?limit=50&page=0')
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
			.get(`/api/authors/${author_id}`)
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
			.get(`/api/authors/${random_id}`)
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
			.get(`/api/authors/${uuid}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});

	it('It should update author`s description', cb => {
		const updatedData = {description: 'An English writer. Novelist.'};
		chai.request(app)
			.put(`/api/authors/${author_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body.data.description).equal(updatedData.description);
				cb();
			});
	});
describe('Testing the Author update requests', ()=>{
	const updatedData = {
		description: 'An English writer. Novelist. The Man',
		books: [{ title : 'Нет орхидей для мисс Блэндиш', rating: 4, genre: 'Роман', description: 'роман английского писателя Джеймса Хедли Чейза, написанный в 1939 году'}]
	};

	it('It should update author books using correct book information - part 1', cb => {
		chai.request(app)
			.put(`/api/authors/${author_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(200);
				cb();
			})
	});

	it('It should update author books using correct book information - part 2', cb => {
		chai.request(app)
			.get(`/api/books/books-by-author-id/${author_id}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(200);
				expect(res.body.data).to.have.lengthOf(1);
				expect(res.body.data[0].title).equal(updatedData.books[0].title);
				expect(res.body.data[0].description).equal(updatedData.books[0].description);
				cb();
			})
	})
	
	it('It should not update a author with invalid id', cb => {
		let random_uuid = uuid();
		const updatedData = {description: 'An English writer. Novelist.'};
		chai.request(app)
			.put(`/api/authors/${random_uuid}`)
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
			.put(`/api/authors/${uuid}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});


})
	
	it('It should not delete a author with non-uuid', cb => {
		const uuid = 'invalid_uuid';
		chai.request(app)
			.delete(`/api/authors/${uuid}`)
			.set('Accept', 'application/json')
			.end((err, res) => {
				expect(res.status).to.equal(400);
				res.body.should.have.property('message').eql('Invalid UUID');
				cb();
			});
	});

	describe('Testing the Book endpoints:', () => {

		// it('It should get all only one book - "Нет орхидей для мисс Блэндиш"', cb => {
		// 	chai.request(app)
		// 		.get('/api/books?limit=50&page=0')
		// 		.set('Accept', 'book/json')
		// 		.end((err, res) => {
		// 			expect(res.status).to.equal(200);
		// 			res.body.should.have.property('status').eql('success');
		// 			expect(res.body.data).to.have.lengthOf(1);
		// 			expect(res.body.data[0].title).equal("Нет орхидей для мисс Блэндиш");
		// 			cb();
		// 		});
		// });
		
		const author = {name: 'Chuck Palahniuk', description: 'An American writer'};
		const book = {
			title: 'Choke', genre: 'Black humor', rating: 4,
			description: 'The story focuses on Victor, a sex addict, who must find work in order to afford the care that his mother is receiving in her nursing home',
			authors : [ 
				{name: 'Chuck Palahniuk 1', description: 'An American writer'},
				{name: '', description: 'An American writer'},
				{name: 'Chuck Palahniuk 1', description: ''},
				{id: 'invalid_uuid'},
				{id: uuid()},
				{id: author_id}
		 ]
		};

		it('It should create a book using the id from the previous step and the finished form object - part 1', (done)=>{
			chai.request(app)
			.post('/api/books')
			.set('Content-Type', 'application/json')
			.send(book)
			.end((err, res) => {
				console.log(  author_id.trim() )
				expect(res.status).to.equal(201);
				expect(res.body.data).to.include({title: book.title});
				expect(res.body.data).to.include({genre: book.genre});
				expect(res.body.data).to.include({description: book.description});
				expect(res.body.data).to.include({rating: book.rating});
				book_id = res.body.data.id;
				done()
			})
		})
		
		// it('There should be only two authors, false data should not have been taken into account - part 3', cb => {
		// 	chai.request(app)
		// 	.get('/api/books/authors-by-book-id/'+book_id)
		// 	.set('Content-Type', 'application/json')
		// 	.end((err, res) => {
		// 		console.log('/api/books/authors-by-book-id/'+book_id )
		// 		expect(res.body.data).to.have.lengthOf(2);
		// 		cb();
		// 	});
		// });
		

	})

