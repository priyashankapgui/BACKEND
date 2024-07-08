import express from 'express';
import { getBranches, getBranch, updateBranch, createNewBranch, deleteBranch, getBranchesWeb } from './controller.js';
import validator from './validator.js';
import { authenticateTokenWithPermission } from '../../middleware/authenticationMiddleware.js';

const Branchrouter = express.Router();

Branchrouter.get('/branches',getBranches);
Branchrouter.get('/branchesWeb', getBranchesWeb);
Branchrouter.get('/branches/:branchId', authenticateTokenWithPermission('adjust-branch'),getBranch);
Branchrouter.post('/branches',validator.create, createNewBranch);
Branchrouter.put('/branches/:branchId',authenticateTokenWithPermission('adjust-branch'),validator.update, updateBranch);
Branchrouter.delete('/branches/:branchId', authenticateTokenWithPermission('adjust-branch'),deleteBranch);

export default Branchrouter; 
