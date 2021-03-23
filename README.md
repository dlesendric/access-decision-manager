#Access Decision Manager

Similar to Symfony's and Spring but for now only "affirmative" strategy.

How this can help you in React or React native? Check out some example how we use it in ActiveCollab:

```ts
// first you need to identity somehow Entities and User
// we at ActiveCollab always have serialized class name exp:
// { id: 1, class: "Project" }
interface Project {
  id: number,
  class: "string"
  members: [1, 2]
};

import { Voter } from "@dlesendric/access-decision-manager";

export class ProjectVoter extends Voter<User, Project, undefined> {
  static readonly attributes = [
    "view",
    "delete",
  ];

  constructor() {
    super();
  }
  
  supports(attribute: string, subject: Project): boolean {
    if(!ProjectVoter.attributes.includes(attribute)){
      return false;
    }
    return subject.class === "Project";
  }

  voteOnAttribute(attribute: string, subject: Project, user: User): boolean {
    switch (attribute){
      case "view": {
        if(user.id === subject.created_by_id){
          return true;
        }
        if(subject.members.includes(user.id)){
          return true;
        }
        return false;
      }
      case "delete": {
        if (user.roles.includes("ROLE_SUPER_ADMIN")) {
          //THE SUPER POWER
          return true;
        }
        return user.id === subject.created_by_id;
      }
    }
  }
}
```

### HOW TO INJECT USER?
Let assume you are using some kind of redux , see example:
```tsx
import AccessDecisionManager from "./src/security";
import createStore from "./src/store";

const { store, persistor } = createStore();

let currentAuth: User | null;

store.subscribe(() => {
  const prevAuth = currentAuth;
  currentAuth = store.getState().user;
  if (prevAuth !== currentAuth) {
    AccessDecisionManager.setUser(currentAuth);
  }
});

const App = () => {
  return (<div/>)
}
```


### How to create super complicate Security Voters?

```tsx
# src/security/index.ts
import { AccessDecisionManager } from "@dlesndric/access-decision-manager";

import { ProjectVoter, TaskVoter, FileVoter } from "./voters";

const projectVoter = new ProjectVoter();
const taskVoter = new TaskVoter();
const postVoter = new PostVoter();
// ....
const fileVoter = new FileVoter();
export const voters = [
  projectVoter,
  taskVoter,
  //....
  fileVoter,
];

//pls help with those 2 types any, any
export default new AccessDecisionManager<User, any, any>(voters);
```


```tsx
//#src/hooks
//example how to create useSecurityHook
import AccessDecisionManager from "../security"; //this is your instance of ADM, not mine
import { useMemo } from "react";

export const useSecurity = (): ((attributes: string[], item: IEntity, additional?: IEntity) => boolean) => {
  return useMemo(() => {
    return (attributes: string[], item: IEntity, additional?: IEntity): boolean => {
      return AccessDecisionManager.decide(attributes, item, additional);
    };
  }, []);
};



// somewhere in some component
export const MySecuredComponent = () => {
  const can = useSecurity();
  const additional = { global_projects_disabled: false };
  const projects = useSelector(getProjects);
  
  const data = projects.filter(p => can(["view"], p, additional));
  
  return <div>{data.map(p => p.id + ",")}</div>
}

```


## How to create Can component


```tsx
interface Props {
  I: VoterAttributes;
  entity?: IEntity;
  additional?: IEntity;
  not?: boolean;
}
export const Can: FC<PropsWithChildren<Props>> = ({ children, I, entity, additional, not }): ReactElement | null => {
  const can = useSecurity();

  if (not) {
    return entity && !can(I, entity, additional) ? <Fragment>{children}</Fragment> : null;
  }
  return entity && can(I, entity, additional) ? <Fragment>{children}</Fragment> : null;
};


// somewhere in some component

<Can I={["invite_project_member"]} entity={project}>
  <Pressable
    onPress={() => handleAddMember(item.id)}
  >
    <Text>Invite</Text>
  </Pressable>
</Can>
```

