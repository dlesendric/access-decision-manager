export enum Access {
  ACCESS_GRANTED = 1,
  ACCESS_ABSTAIN = 0,
  ACCESS_DENIED = -1,
}

export interface VoterInterface<U, S> {
  vote: (user: U, subject: S, attributes: string[]) => Access;
  setState: (state: any) => void;
}

export abstract class Voter<User, Subject> implements VoterInterface<User, Subject> {
  protected state: any = {};
  vote = (user: User, subject: Subject, attributes: string[]): Access => {
    // abstain vote by default in case none of the attributes are supported
    let vote = Access.ACCESS_ABSTAIN;

    for (const attribute of attributes) {
      if (!this.supports(attribute, subject)) {
        continue;
      }
      vote = Access.ACCESS_DENIED;
      if (user && this.voteOnAttribute(attribute, subject, user)) {
        return Access.ACCESS_GRANTED;
      }
    }

    return vote;
  };

  abstract supports(attribute: string, subject: Subject): boolean;

  abstract voteOnAttribute(attribute: string, subject: Subject, user: User): boolean;

  setState = <State>(state: State): void => {
    this.state = state;
  };
}
