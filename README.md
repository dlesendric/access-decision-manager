# Table of contents

1. [Installation](https://github.com/dlesendric/access-decision-manager#installation)
2. [Guide](https://github.com/dlesendric/access-decision-manager#examples)
3. [Use it with hook](https://github.com/dlesendric/access-decision-manager#hook)
4. [Use it with component](https://github.com/dlesendric/access-decision-manager#component)  
5. [Redux integration](https://github.com/dlesendric/access-decision-manager#redux-integration)

## Installation
`npm install @dlesendric/access-decision-manager` or with yarn:  `yarn install @dlesendric/access-decision-manager`

## Guide
Let's say we have a Project that can be edited by the user who created it.

1. Create a directory inside your source, we love to call it `security`
2. Create a ProjectVoter inside of `security` directory 
```ts
import { Voter } from "@dlesendric/access-decision-manager";

export class ProjectVoter extends Voter<User, Project, undefined> {
    static readonly attributes = [
        "edit",
        "delete",
        "invite"
    ];

    constructor() {
        super();
    }

    supports(attribute: string, subject: Project): boolean {
        if(!ProjectVoter.attributes.includes(attribute)){
            return false;
        }
        return subject.class === "Project"; // We're checking whether the passed subject is indeed of class Project, you can change this to fit your need
    }
    voteOnAttribute(attribute: string, subject: Project, user: User): boolean {
        switch (attribute){
            case "invite":
            case "delete":
            case "edit": {
                if(user.id === subject.created_by_id){
                    return true;
                }
                return false;
            }
        }
    }
}
```
2. In `security` directory create index.ts and add your ProjectVoter
example file ./security/index.ts
```ts
import { AccessDecisionManager } from "@dlesndric/access-decision-manager";
import { RootState } from "./reducers"; //example of global state type
import { ProjectVoter } from "./security";

// Instantiate a voter
const projectVoter = new ProjectVoter();

// Add it in array 
export const voters = [
    projectVoter
];

export default new AccessDecisionManager<User, RootState>(voters);
```

### Use it with Hook
First create hook
```ts

import Security from "./security";
export const useSecurity = (): ((attributes: string[], item?: IEntity) => boolean) => {
    return Security.decide;
};



const projects = [
    { id: 1, class: "Project", created_by_id: 1, name: "Project 1" },
    { id: 2, class: "Project", created_by_id: 1, name: "Project 2" },
    { id: 3, class: "Project", created_by_id: 2, name: "Project 3" }
]
export const ProjectLists: FC = () => {
 const can = useSecurity();
 const myUserId = 1;
 
 // Get projects only I can edit and delete ->
 const myProjects = projects.filter(p => {
    return can(['edit', 'delete'], p);
 });
 
 return (
     <>
         {myProjects.map(projects => <Projects data={myProjects} />)}
     </>
 )
}
```

### Redux integration
You can integrate global state management.  
Currently, we're setting logged user, so we can have all user's info in our voter.

```ts
import { AccessDecisionManager } from "@dlesndric/access-decision-manager";
import createStore from "./src/store";
import { getUser } from "./src/store/selectors";

const { store, persistor } = createStore();
//store must have method getState: () => State

AccessDecisionManager.setStore(store);
AccessDecisionManager.setUserResolver(state => getUser(state));

const App = () => {
  return (<div/>)
}
```

### Use it with Can component
```ts
import React from "react"

import React, { FC, PropsWithChildren, ReactElement, Fragment } from "react";
import { IEntity } from "../../types";
import { useSecurity } from "../../hooks";

interface Props {
    I: VoterAttributes;
    entity?: IEntity;
    not?: boolean;
}
const Can: FC<PropsWithChildren<Props>> = ({ children, I, entity, not }): ReactElement | null => {
    const can = useSecurity();

    if (not) {
        return entity && !can(I, entity) ? <Fragment>{children}</Fragment> : null;
    }
    return entity && can(I, entity) ? <Fragment>{children}</Fragment> : null;
};


const projects = [
    { id: 1, class: "Project", created_by_id: 1, name: "Project 1" },
    { id: 2, class: "Project", created_by_id: 1, name: "Project 2" },
    { id: 3, class: "Project", created_by_id: 2, name: "Project 3" }
]
// Only user who created the project can invite more people.
export const InvitePeopleOnProject = () => {
    return (
        <Can I={["invite"]} entity={project}>
            <button>Invite</button>
        </Can>
    )
}
```
