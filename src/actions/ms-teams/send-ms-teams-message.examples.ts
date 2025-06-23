import { TemplateExample } from '@backstage/plugin-scaffolder-node';
import * as yaml from 'yaml';

export const examples: TemplateExample[] = [
  {
    description: 'Sends a simple message to Microsoft Teams using the configured webhook URL.',
    example: yaml.stringify({
      steps: [
        {
          id: 'send-message',
          name: 'Send a message to Teams',
          action: 'ms-teams:sendMessage',
          input: {
            message: 'Hello, Teams!',
          },
        },
      ],
    }),
  },
  {
    description: 'Sends a message to Microsoft Teams using a specific webhook URL provided in input.',
    example: yaml.stringify({
      steps: [
        {
          id: 'send-message',
          name: 'Send a message to Teams with explicit webhook',
          action: 'ms-teams:sendMessage',
          input: {
            message: 'Hello, Teams!',
            webhookUrl: 'https://example-teams-webhook.com',
          },
        },
      ],
    }),
  },
];
