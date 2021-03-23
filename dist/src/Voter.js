"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voter = exports.Access = void 0;
var Access;
(function (Access) {
    Access[Access["ACCESS_GRANTED"] = 1] = "ACCESS_GRANTED";
    Access[Access["ACCESS_ABSTAIN"] = 0] = "ACCESS_ABSTAIN";
    Access[Access["ACCESS_DENIED"] = -1] = "ACCESS_DENIED";
})(Access = exports.Access || (exports.Access = {}));
class Voter {
    constructor() {
        this.vote = (user, subject, attributes, additional) => {
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
    }
}
exports.Voter = Voter;
//# sourceMappingURL=Voter.js.map