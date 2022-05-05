import { AccessDecisionManager } from "../src/AccessDecisionManager";
import { Voter } from "../src/Voter";

interface Entity {
  id: number;
  class: string;
}

interface User {
  id: number;
  class: string;
  roles: string[];
  email: string;
}

class TestVoter extends Voter<User, Entity> {
  public supportsCall = 0;
  public voteOnAttributesCall = 0;

  supports(attribute: string, subject: Entity): boolean {
    this.supportsCall++;
    return attribute.includes("test") && subject.class === "Test";
  }

  voteOnAttribute(attribute: string, subject: Entity, user: User): boolean {
    this.voteOnAttributesCall++;
    return user.class === "User" && user.roles.includes("ROLE_ADMIN");
  }
}

describe("AccessDecisionManager", () => {
  it(`should handle decide`, () => {
    const voterOne = new TestVoter();
    const voterTwo = new TestVoter();
    const voters = [voterOne, voterTwo];
    const manager = new AccessDecisionManager(voters);
    const user: User = {
      id: 1,
      class: "User",
      roles: ["ROLE_ADMIN"],
      email: "owner@activecollab.com",
    };

    const entity = {
      id: 1,
      class: "Test",
    };

    manager.setUserResolver(() => user);

    expect(manager.decide(["something"], entity)).toBeFalsy();
    expect(voterOne.supportsCall).toEqual(1);
    expect(voterTwo.supportsCall).toEqual(1);
    expect(voterOne.voteOnAttributesCall).toEqual(0);
    expect(voterTwo.voteOnAttributesCall).toEqual(0);
    expect(manager.decide(["test"], entity)).toBeTruthy();
    expect(voterOne.supportsCall).toEqual(2);
    expect(voterOne.voteOnAttributesCall).toEqual(1);
    user.class = "Something";
    expect(manager.decide(["test", "something"], entity)).toBeFalsy();
    expect(voterOne.supportsCall).toEqual(4);
    expect(voterTwo.supportsCall).toEqual(3);
    expect(voterTwo.voteOnAttributesCall).toEqual(1);
  });

  it(`should  handle setState and decide`, () => {
    const voterOne = new TestVoter();
    const voterTwo = new TestVoter();
    const voters = [voterOne, voterTwo];
    const manager = new AccessDecisionManager(voters);
    const user: User = {
      id: 1,
      class: "User",
      roles: ["ROLE_ADMIN"],
      email: "owner@activecollab.com",
    };

    const store = {
      getState: () => {
        return {
          user: user,
        }
      }
    }

    const selector = (rootState) => rootState.user;

    const entity = {
      id: 1,
      class: "Test",
    };

    manager.setStore(store);
    manager.setUserResolver(selector);

    expect(manager.decide(["something"], entity)).toBeFalsy();
    expect(voterOne.supportsCall).toEqual(1);
    expect(voterTwo.supportsCall).toEqual(1);
    expect(voterOne.voteOnAttributesCall).toEqual(0);
    expect(voterTwo.voteOnAttributesCall).toEqual(0);
    expect(manager.decide(["test"], entity)).toBeTruthy();
    expect(voterOne.supportsCall).toEqual(2);
    expect(voterOne.voteOnAttributesCall).toEqual(1);
  })
});
