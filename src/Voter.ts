export enum Access {
  ACCESS_GRANTED = 1,
  ACCESS_ABSTAIN = 0,
  ACCESS_DENIED = -1,
}

export interface VoterInterface<U, S, P> {
  vote: (user: U, subject: S, attributes: string[], additional?: P) => Access;
}

export abstract class Voter<User, Subject, Params> implements VoterInterface<User, Subject, Params> {
  vote = (user: User, subject: Subject, attributes: string[], additional?: Params): Access => {
    // abstain vote by default in case none of the attributes are supported
    let vote = Access.ACCESS_ABSTAIN;

    for (const attribute of attributes) {
      if (!this.supports(attribute, subject)) {
        continue;
      }
      vote = Access.ACCESS_DENIED;
      if (user && this.voteOnAttribute(attribute, subject, user, additional)) {
        return Access.ACCESS_GRANTED;
      }
    }

    return vote;
  };

  abstract supports(attribute: string, subject: Subject): boolean;

  abstract voteOnAttribute(attribute: string, subject: Subject, user: User, additional?: Params): boolean;
}
