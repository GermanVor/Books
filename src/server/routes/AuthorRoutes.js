import {Router} from 'express';
import AuthorController from '../controllers/AuthorController';

const router = Router();
/**
 * Author API routes
 */
// router.get('/', AuthorController.getAll);

router.get('/', AuthorController.getParty);
router.get('/info', AuthorController.getInfo);
router.get('/searchInfo', AuthorController.getSearchInfo);
router.get('/PagginInfo', AuthorController.getPagginInfo );
router.post('/', AuthorController.add);
router.get('/:id', AuthorController.get);
router.put('/:id', AuthorController.update);
router.delete('/:id', AuthorController.remove);

export default router;