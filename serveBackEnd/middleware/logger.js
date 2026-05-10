import { format } from 'date-fns';
import { v4 as uuid } from 'uuid';

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { promises as fsPromises, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const eventLogs = async (message, logFileName) => {
  const formatDate = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
  const dateLogs = `${formatDate}\t${uuid()}\t${message}\n`;

  try {
    const logsDir = join(__dirname, '..', 'logs');
    if (!existsSync(logsDir)) {
      await fsPromises.mkdir(logsDir, { recursive: true });
    }
    await fsPromises.appendFile(join(logsDir, logFileName), dateLogs);
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  eventLogs(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
  console.log(`${req.method} ${req.path}`);
  next();
};

export { logger, eventLogs };
