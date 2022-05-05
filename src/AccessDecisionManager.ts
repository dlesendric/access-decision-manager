import { Access, VoterInterface } from "./Voter";

interface Store<S> {
  getState: () => S;
}

export class AccessDecisionManager<User, State> {
  private store: Store<State>;
  private user: User | null | undefined;
  private userResolver: (store: State) => User | null | undefined;

  constructor(private voters: VoterInterface<any, any>[] = [], private allowIfAllAbstainDecisions: boolean = false) {
    this.user = null;
    this.userResolver = () => null;
  }

  setStore(store: Store<State>): void {
    this.store = store;
  }

  public setUserResolver = (fn: (store: State) => User | null | undefined = () => null) => {
    this.userResolver = fn;
  };

  decide = <Entity>(attributes: string[] = [], object: Entity): boolean => {
    let deny = 0;
    const user = this.userResolver(this.store?.getState());
    if (user && object) {
      for (const voter of this.voters) {
        if (this.store) {
          voter.setState(this.store.getState());
        }
        const result = voter.vote(user, object, attributes);
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
