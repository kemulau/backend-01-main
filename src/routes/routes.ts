import { Router } from 'express';

import * as ApiController from '../controllers/apiController';

const router = Router();

router.get('/kemulau', ApiController.ping)

router


export default router;
