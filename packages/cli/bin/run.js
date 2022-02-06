#!/usr/bin/env node

import signale from 'signale';
import { run } from '../dist/index.js';

run().catch((error) => {
  signale.error('Failed to initialize.', error);
});
