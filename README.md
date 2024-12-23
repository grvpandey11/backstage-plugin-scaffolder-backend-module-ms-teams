# backstage-plugin-scaffolder-backend-module-ms-teams

This is a `ms-teams` actions plugin for the `scaffolder-backend` in Backstage.

This contains a collection of actions for using to send Microsoft Teams messages.

## Prerequisites

- Node must be installed in the environment

- You must have a Microsoft Teams webhook URL available to send messages to

## Getting Started

In the root directory of your Backstage project:

```shell
yarn add --cwd packages/backend @grvpandey11/backstage-plugin-scaffolder-backend-module-ms-teams
```

Add the actions you'd like to the scaffolder:

```typescript
// packages/backend/src/index.ts

...

backend.add(import('@grvpandey11/backstage-plugin-scaffolder-backend-module-ms-teams'));
```

Add a ms-teams configuration section to your app-config.yaml.

> You can omit this by providing a webhook URL in the input of the step in your scaffolder template, but it must be present in one place or the other.

```yaml
# app-config.yaml

ms-teams:
  webhookUrl: "https://your-url.com"
```

## Example of using the send message action in a template

```yaml
apiVersion: scaffolder.backstage.io/v1beta3
kind: Template
metadata:
  name: ms-teams-demo
  title: Microsoft Teams message demo
  description: Send a message via MS Teams
spec:
  owner: user:grvpandey11
  type: service

  steps:
    - id: send-ms-teams-message
      name: Send message
      action: ms-teams:sendMessage
      input:
        message: "Hello, world!"
        webhookUrl: "https://your-url.com" # optional if the URL is supplied in the app-config.yaml
```
