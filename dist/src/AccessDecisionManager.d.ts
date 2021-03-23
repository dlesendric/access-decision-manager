import { VoterInterface } from "./Voter";
export declare class AccessDecisionManager<User, Entity, Params> {
    private voters;
    private allowIfAllAbstainDecisions;
    private user;
    constructor(voters?: VoterInterface<User, Entity, Params>[], allowIfAllAbstainDecisions?: boolean);
    setUser(user: User | null): void;
    decide: (attributes: string[], object: Entity, additional?: Params) => boolean;
}
