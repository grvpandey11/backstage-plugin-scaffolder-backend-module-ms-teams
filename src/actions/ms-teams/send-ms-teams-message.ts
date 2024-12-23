import { createTemplateAction } from '@backstage/plugin-scaffolder-node';
import axios from 'axios';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { examples } from './send-ms-teams-message.examples';

/**
 * Creates a `msteams:sendMessage` Scaffolder action.
 *
 * @public
 */
export function createSendTeamsMessageViaWebhookAction(options: {
    config: Config;
  }) {
    const { config } = options;
  
    return createTemplateAction<{
      message: string;
      webhookUrl?: string;
    }>({
      id: 'ms-teams:sendMessage',
      description: 'Sends a Microsoft Teams message via a webhook',
      examples,
      schema: {
        input: {
          type: 'object',
          required: ['message'],
          properties: {
            message: {
              title: 'Message',
              description: 'The message to send via webhook',
              type: 'string',
            },
            webhookUrl: {
              title: 'Webhook URL',
              description:
                'The Microsoft Teams webhook URL to send the request to. The URL must either be specified here or in the Backstage config',
              type: 'string',
            },
          },
        },
      },
      async handler(ctx) {
        const webhookUrl =
          config.getOptionalString('ms-teams.webhookUrl') ?? ctx.input.webhookUrl;
  
        if (!webhookUrl) {
          throw new InputError(
            'Webhook URL is not specified in either the app-config or the action input. This must be specified in at least one place in order to send a message',
          );
        }
  
        const body = {
          text: ctx.input.message,
        };
  
        const result = await axios.post(webhookUrl, body);
  
        if (result.status !== 200) {
          ctx.logger.error(
            `Something went wrong while trying to send a request to the Teams webhook URL - StatusCode ${result.status}`,
          );
          ctx.logger.debug(`Response body: ${result.data}`);
          ctx.logger.debug(`Webhook URL: ${webhookUrl}`);
          ctx.logger.debug(`Input message: ${ctx.input.message}`);
          throw new Error(
            `Something went wrong while trying to send a request to the Teams webhook URL - StatusCode ${result.status}`,
          );
        }
      },
    });
  }
