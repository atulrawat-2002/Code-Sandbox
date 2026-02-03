import express from 'express'
import { createPostController, getProjectTree } from '../../controllers/projectController.js'

const router = express.Router()

router.post('/', createPostController)

router.get('/:projectId/tree', getProjectTree);

export default router;