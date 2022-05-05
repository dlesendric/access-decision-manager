export declare enum Access {
    ACCESS_GRANTED = 1,
    ACCESS_ABSTAIN = 0,
    ACCESS_DENIED = -1
}
export interface VoterInterface<U, S> {
    vote: (user: U, subject: S, attributes: string[]) => Access;
    setState: (state: any) => void;
}
export declare abstract class Voter<User, Subject> implements VoterInterface<User, Subject> {
    protected state: any;
    vote: (user: User, subject: Subject, attributes: string[]) => Access;
    abstract supports(attribute: string, subject: Subject): boolean;
    abstract voteOnAttribute(attribute: string, subject: Subject, user: User): boolean;
    setState: <State>(state: State) => void;
}
