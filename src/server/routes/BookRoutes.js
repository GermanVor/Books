import {Router} from 'express';
import BookController from '../controllers/BookController';

const router = Router();

/**
 * Book API routes
 */
router.get('/books-by-author-id/:id', BookController.getByAuthor)
router.get('/info', BookController.getInfo);
router.get('/', BookController.getParty);
router.get('/authors-by-book-id/:id', BookController.getAuthors);
router.get('/searchInfo', BookController.getSearchInfo);
router.post('/', BookController.add);
router.get('/:id', BookController.get);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.remove);

export default router;