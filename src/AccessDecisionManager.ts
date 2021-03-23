import { Access, VoterInterface } from "./Voter";
export class AccessDecisionManager<User, Entity, Params> {
  private user: User | null;

  constructor(
    private voters: VoterInterface<User, Entity, Params>[] = [],
    private allowIfAllAbstainDecisions: boolean = false,
  ) {
    this.user = null;
  }

  setUser(user: User | null): void {
    this.user = user;
  }

  decide = (attributes: string[] = [], object: Entity, additional?: Params): boolean => {
    let deny = 0;
    if (this.user) {
      for (const voter of this.voters) {
        const result = voter.vote(this.user, object, attributes, additional);
        if (result === Access.ACCESS_GRANTED) {
          return true;
        }
        if (result === Access.ACCESS_DENIED) {
          ++deny;
        }
      }
    }

    if (deny > 0) {
      return false;
    }

    return this.allowIfAllAbstainDecisions;
  };
}
