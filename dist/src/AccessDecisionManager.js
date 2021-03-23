"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDecisionManager = void 0;
const Voter_1 = require("./Voter");
class AccessDecisionManager {
    constructor(voters = [], allowIfAllAbstainDecisions = false) {
        this.voters = voters;
        this.allowIfAllAbstainDecisions = allowIfAllAbstainDecisions;
        this.decide = (attributes = [], object, additional) => {
            let deny = 0;
            if (this.user) {
                for (const voter of this.voters) {
                    const result = voter.vote(this.user, object, attributes, additional);
                    if (result === Voter_1.Access.ACCESS_GRANTED) {
                        return true;
                    }
                    if (result === Voter_1.Access.ACCESS_DENIED) {
                        ++deny;
                    }
                }
            }
            if (deny > 0) {
                return false;
            }
            return this.allowIfAllAbstainDecisions;
        };
        this.user = null;
    }
    setUser(user) {
        this.user = user;
    }
}
exports.AccessDecisionManager = AccessDecisionManager;
//# sourceMappingURL=AccessDecisionManager.js.map