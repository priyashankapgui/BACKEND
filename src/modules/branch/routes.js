import express from 'express';
import { getBranches, getBranch, updateBranch, createNewBranch, deleteBranch, getBranchesWeb } from './controller.js';

const Branchrouter = express.Router();

Branchrouter.get('/branches', getBranches);
Branchrouter.get('/branchesWeb', getBranchesWeb);
Branchrouter.get('/branches/:branchId', getBranch);
Branchrouter.post('/branches', createNewBranch);
Branchrouter.put('/branches/:branchId', updateBranch);
Branchrouter.delete('/branches/:branchId', deleteBranch);

export default Branchrouter; 