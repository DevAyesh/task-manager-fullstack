import { Router } from 'express';
import { requireAuth } from '../middleware/auth.middleware';
import * as taskController from '../controllers/task.controller';

const router = Router();

// Every task route requires a logged-in user.
router.use(requireAuth);

// NOTE: /stats must be registered before the /:id route, otherwise Express
// would treat "stats" as a task id.
router.get('/stats', taskController.getStats);
router.get('/', taskController.listTasks);
router.get('/:id', taskController.getTask);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;
