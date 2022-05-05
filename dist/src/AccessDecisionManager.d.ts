import { VoterInterface } from "./Voter";
interface Store<S> {
    getState: () => S;
}
export declare class AccessDecisionManager<User, State> {
    private voters;
    private allowIfAllAbstainDecisions;
    private store;
    private user;
    private userResolver;
    constructor(voters?: VoterInterface<any, any>[], allowIfAllAbstainDecisions?: boolean);
    setStore(store: Store<State>): void;
    setUserResolver: (fn?: (store: State) => User | null | undefined) => void;
    decide: <Entity>(attributes: string[], object: Entity) => boolean;
}
export {};
