import { Candidate } from './candidate.model';


export class FindMatchRequest {
    constructor(
        public candidate: Candidate,
    ) {}
}
