import {Router} from 'express';
import BookController from '../controllers/BookController';

const router = Router();

/**
 * Book API routes
 */
router.get('/', BookController.getAll);
router.post('/', BookController.add);
router.get('/:id', BookController.get);
router.put('/:id', BookController.update);
router.delete('/:id', BookController.remove);

export default router;