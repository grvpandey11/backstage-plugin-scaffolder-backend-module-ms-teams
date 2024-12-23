import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Send a simple message to Microsoft Teams',
    example: yaml.stringify({
      steps: [
        {
          id: 'ms-teams:sendMessage',
          action: 'ms-teams:sendMessage',
          name: 'Send a message to Teams',
          input: {
            message: 'Hello, Teams!',
          },
        },
      ],
    }),
  },
  {
    description: 'Send a message to Microsoft Teams with a specific webhook URL',
    example: yaml.stringify({
      steps: [
        {
          id: 'ms-teams:sendMessage',
          action: 'ms-teams:sendMessage',
          name: 'Send a message to Teams',
          input: {
            message: 'Hello, Teams!',
            webhookUrl: 'https://example-teams-webhook.com',
          },
        },
      ],
    }),
  },
];
