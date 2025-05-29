import crypto from 'crypto';
crypto.timingSafeEqual(Buffer.from(input), Buffer.from(actualPassword));
