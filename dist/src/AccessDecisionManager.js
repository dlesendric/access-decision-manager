"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessDecisionManager = void 0;
const Voter_1 = require("./Voter");
class AccessDecisionManager {
    constructor(voters = [], allowIfAllAbstainDecisions = false) {
        this.voters = voters;
        this.allowIfAllAbstainDecisions = allowIfAllAbstainDecisions;
        this.setUserResolver = (fn = () => null) => {
            this.userResolver = fn;
        };
        this.decide = (attributes = [], object) => {
            var _a;
            let deny = 0;
            const user = this.userResolver((_a = this.store) === null || _a === void 0 ? void 0 : _a.getState());
            if (user && object) {
                for (const voter of this.voters) {
                    if (this.store) {
                        voter.setState(this.store.getState());
                    }
                    const result = voter.vote(user, object, attributes);
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
        this.userResolver = () => null;
    }
    setStore(store) {
        this.store = store;
    }
}
exports.AccessDecisionManager = AccessDecisionManager;
//# sourceMappingURL=AccessDecisionManager.js.map