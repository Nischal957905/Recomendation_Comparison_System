import express  from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//routing paths here.
router.get(['/', '/index', '/index.html'], (req, res) => {
  const viewPath = join(__dirname, '..', 'view', 'index.html');
  res.sendFile(viewPath);
});

export default router;
