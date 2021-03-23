export declare enum Access {
    ACCESS_GRANTED = 1,
    ACCESS_ABSTAIN = 0,
    ACCESS_DENIED = -1
}
export interface VoterInterface<U, S, P> {
    vote: (user: U, subject: S, attributes: string[], additional?: P) => Access;
}
export declare abstract class Voter<User, Subject, Params> implements VoterInterface<User, Subject, Params> {
    vote: (user: User, subject: Subject, attributes: string[], additional?: Params) => Access;
    abstract supports(attribute: string, subject: Subject): boolean;
    abstract voteOnAttribute(attribute: string, subject: Subject, user: User, additional?: Params): boolean;
}
