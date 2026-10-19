import { Router } from 'express';
import  login  from './login.route.js'
import estudiantes from './estudiante.js'
const router = Router();

router.use('/login', login);
router.use('/estudiantes', estudiantes)

export default router;