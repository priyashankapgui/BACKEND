import express from 'express';
import { getBranches, getBranch, updateBranch, createNewBranch, deleteBranch } from './controller.js';

const Branchrouter = express.Router();

Branchrouter.get('/branches', getBranches);
Branchrouter.get('/branches/:branchId', getBranch);
Branchrouter.post('/branches', createNewBranch);
Branchrouter.put('/branches/:branchId', updateBranch);
Branchrouter.delete('/branches/:branchId', deleteBranch);

export default Branchrouter; 