import branches from './branch';
import branchRouter from './routes';
import {getBranches} from './controller';
import {get_Branches} from './service';


module.exports = {
    BranchConstants: constants,
    BranchService: get_Branches,
    BranchController: getBranches,
    BranchRoutes: branchRouter,
    Branch: branches,
}