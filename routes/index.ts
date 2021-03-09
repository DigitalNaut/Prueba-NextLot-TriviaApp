import { Router } from 'express';

import sessions from "./user";
import facts from "./facts";

const router = Router();

/* GET home page. */
router.get('/',
  (req, res, next) => {
    res.render('index', { title: 'Express' });
  });

router.get('/session*', sessions);
router.get('/facts*', facts);

export default router;
