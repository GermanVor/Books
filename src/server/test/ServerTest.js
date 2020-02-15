import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';

chai.use(chatHttp);

const {expect} = chai;
const app = 'http://localhost:8080'
const uuid = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
  (value_x, r) => ('x' === value_x ? (r = Math.random() * 16 | 0) : (r & 0x3 | 0x8)).toString(16));

	describe('Database preparation ', ()=>{
		before(async function(){
			await chai.request(app)
				.get('/api/authors?limit=50&page=0')
				.set('Accept', 'application/json')
				.then( res => {
					res.body.data.forEach( async (el)=> {
						await chai.request(app)
						.del('/api/authors/'+el.id)
						.set('Accept', 'application/json')
					})
				});
				await chai.request(app)
				.get('/api/books?limit=50&page=0')
				.set('Accept', 'application/json')
				.then( res => {
					res.body.data.forEach( async (el)=>{
						await chai.request(app)
						.del('/api/books/'+el.id)
						.set('Accept', 'application/json')
					})
				});
		})
		it(' clear db and initial')
		let author_id, book_id ;

		after(async function() {
			let author = {
				name: 'William John Banville',
				description: 'Irish writer',
				books: [
					{title: 'The Book of Evidence', genre: 'Thriller', rating: 3,
					description: 'Many of the characters in The Book of Evidence appear in the 1993 sequel Ghosts'},
					{title: 'Ghosts ', genre: 'Novel', rating: 4,
					description: 'This novel features many of the same characters and relates to events of the previous novel'},
				]
			};
			await	chai.request(app)
				.post('/api/authors')
				.set('Accept', 'application/json')
				.send(author)
				.then((res) => {
					author_id = res.body.data.id;
				});

			let book = {
				title: 'Confessions of a Young Man ', genre: 'Roman', rating: 5,
				description: 'The book is notable as being one of the first English writings which named important emerging French Impressionists',
				authors: [
					{id: author_id},
					{ name: 'George Augustus Moore', description: 'Was an Irish novelist'},
					{ name: 'Joanne Harris', description: 'is an English author especially known for her award-winning novel Chocolat (1999) which was adapted the following year for the film Chocolat'},
				]
			}
			await	chai.request(app)
				.post('/api/books')
				.set('Accept', 'application/json')
				.send(book)
				.then((res) => {
					book_id = res.body.data.id
				});
			
			author = {
				name: 'Chuck Palahniuk',
				description: 'He is an American novelist and freelance journalist',
				books: [
					{title: 'Fight Club', genre: 'Novel', rating: 5,
					description: 'It follows the experiences of an unnamed protagonist struggling with'+
					' insomnia. Inspired by his doctors exasperated remark that insomnia is not suffering,'+
					' the protagonist finds relief by impersonating a seriously ill person in several support groups.'},
					{id: book_id}
				]
			};
			await	chai.request(app)
				.post('/api/authors')
				.set('Accept', 'application/json')
				.send(author)
				.then((res) => {
					author_id = res.body.data.id;
				});
		});
	})

describe('Testing the Author ', ()=>{
	const updatedData = {
		description: 'An English writer. Novelist. The Man',
		books: [{ title : 'No orchids for Miss Blendish', rating: 4, genre: 'Novel', description: 'A novel by the English writer James Hadley Chase, written in 1939'}]
	};
	let author_id, book_id;

	before(async function() {
		const data = {name: 'James Hadley Chase', description: 'An English writer'};
		await chai.request(app)
			.post('/api/authors')
			.set('Accept', 'application/json')
			.send(data)
			.then((res) => {
				expect(res.status).to.equal(201);
				expect(res.body.data).to.include({name: data.name});
				author_id = res.body.data.id;
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
	it('It should update author books using correct book information', async()=>{
		chai.request(app)
			.put(`/api/authors/${author_id}`)
			.set('Accept', 'application/json')
			.send(updatedData)
			.then((res) => {
				expect(res.status).to.equal(200);
			})
			.then( () => {
				chai.request(app)
				.get(`/api/books/books-by-author-id/${author_id}`)
				.set('Accept', 'application/json')
				.then((res) => {
					expect(res.status).to.equal(200);
					expect(res.body.data).to.have.lengthOf(1);
					expect(res.body.data[0].title).equal(updatedData.books[0].title);
					expect(res.body.data[0].description).equal(updatedData.books[0].description);
				})
			})
		
	});
	
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
})
	
	describe('Testing the Book endpoints:', () => {
		let author_id, book_id;

		before(async function() {
			const author = {name: 'James Hadley Chase', description: 'An English writer'};
			const book = {
				title: 'The World in My Pocket', genre: 'Thriller', rating: 4,
				description: 'The World in My Pocket is a 1959 thriller novel by the British writer James Hadley Chase',
				authors: []
			};
			await	chai.request(app)
				.post('/api/authors')
				.set('Accept', 'application/json')
				.send(author)
				.then((res) => {
					author_id = res.body.data.id;
					book.authors.push({ id: author_id })
					chai.request(app)
						.post('/api/books')
						.set('Accept', 'application/json')
						.send(book)
						.end((err, res) => {
							expect(res.status).to.equal(201);
							expect(res.body.data).to.include({title: book.title});
							expect(res.body.data).to.include({genre: book.genre});
							expect(res.body.data).to.include({description: book.description});
							expect(res.body.data).to.include({rating: book.rating});
							book_id = res.body.data.id;
						});
				});
		});
	
		it('It should not create a author with incomplete parameters', cb => {
			const data = {title: 'The Soft Centre', genre: 'Crime novel', rateERROR: 3, descriptions: 'test' };
			chai.request(app)
				.post('/api/books')
				.set('Accept', 'application/json')
				.send(data)
				.end((err, res) => {
					expect(res.status).to.equal(400);
					res.body.should.have.property('message').eql('Incomplete information');
					cb();
				});
		});
	
		it('It should not create a author with missing parameters', cb => {
			const data = {title: 'You\'re Dead Without Money'};
			chai.request(app)
				.post('/api/books')
				.set('Accept', 'application/json')
				.send(data)
				.end((err, res) => {
					expect(res.status).to.equal(400);
					res.body.should.have.property('message').eql('Incomplete information');
					cb();
				});
		});
	
		it('It should not create a book with wrong rating', cb => {
			const data = {
				title: 'The World in My Pocket', genre: 'Thriller', rating: 'not int', author_id,
				description: 'The World in My Pocket is a 1959 thriller novel by the British writer James Hadley Chase',
				authors: [ {name: 'A', description: 'b'} ]
			};
			chai.request(app)
				.post('/api/books')
				.set('Accept', 'application/json')
				.send(data)
				.end((err, res) => {
					expect(res.status).to.equal(400);
					res.body.should.have.property('message').eql('Incomplete information');
					cb();
				});
		});
	
		it('It should get a particular book', cb => {
			chai.request(app)
				.get(`/api/books/${book_id}`)
				.set('Accept', 'application/json')
				.end((err, res) => {
					expect(res.status).to.equal(200);
					res.body.should.have.property('message').eql('Book Found');
					res.body.data.should.have.property('title');
					res.body.data.should.have.property('genre');
					res.body.data.should.have.property('description');
					res.body.data.should.have.property('rating');
					cb();
				});
		});
	
		it('It should not get a particular book with invalid id', cb => {
			let random_id = uuid();
			chai.request(app)
				.get(`/api/books/${random_id}`)
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
				.get(`/api/books/${uuid}`)
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
				.put(`/api/books/${book_id}`)
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
				.put(`/api/books/${random_uuid}`)
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
				.put(`/api/books/${uuid}`)
				.set('Accept', 'application/json')
				.send(updatedData)
				.end((err, res) => {
					expect(res.status).to.equal(400);
					res.body.should.have.property('message').eql('Invalid UUID');
					cb();
				});
		});
	
		it('It should not delete a book with invalid id', cb => {
			let random_id = uuid();
			chai.request(app)
				.delete(`/api/books/${random_id}`)
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
				.delete(`/api/books/${uuid}`)
				.set('Accept', 'application/json')
				.end((err, res) => {
					expect(res.status).to.equal(400);
					res.body.should.have.property('message').eql('Invalid UUID');
					cb();
				});
		});
	});

	// describe('Create db', ()=>{
	// 	let author_id, book_id;

	// 	before(async function() {
	// 		let author = {
	// 			name: 'William John Banville',
	// 			description: 'Irish writer',
	// 			books: [
	// 				{title: 'The Book of Evidence', genre: 'Thriller', rating: 3,
	// 				description: 'Many of the characters in The Book of Evidence appear in the 1993 sequel Ghosts'},
	// 				{title: 'Ghosts ', genre: 'Novel', rating: 4,
	// 				description: 'This novel features many of the same characters and relates to events of the previous novel'},
	// 			]
	// 		};
	// 		await	chai.request(app)
	// 			.post('/api/authors')
	// 			.set('Accept', 'application/json')
	// 			.send(author)
	// 			.then((res) => {
	// 				author_id = res.body.data.id;
	// 			});

	// 		let book = {
	// 			title: 'Confessions of a Young Man ', genre: 'Roman', rating: 5,
	// 			description: 'The book is notable as being one of the first English writings which named important emerging French Impressionists',
	// 			authors: [
	// 				{id: author_id},
	// 				{ name: 'George Augustus Moore', description: 'Was an Irish novelist'}
	// 			]
	// 		}
	// 		await	chai.request(app)
	// 			.post('/api/books')
	// 			.set('Accept', 'application/json')
	// 			.send(book)
	// 			.then((res) => {book_id = res.body.data.id});
	// 	});
	// 	it('data for database',)
	// })