import { Candidate } from './candidate.model';


export class FindMatchRequest {
    constructor(
        public id: string,
        public candidate: Candidate,
    ) {}
}
