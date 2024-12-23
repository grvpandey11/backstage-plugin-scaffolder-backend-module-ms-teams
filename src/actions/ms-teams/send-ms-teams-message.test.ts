import { PassThrough } from 'stream';
import { createSendTeamsMessageViaWebhookAction } from './send-ms-teams-message';
import * as winston from 'winston';
import { Config } from '@backstage/config';
import axios from 'axios';

jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

const defaultHandlerOptions = {
  workspacePath: '/tmp',
  logStream: new PassThrough(),
  output: jest.fn(),
  createTemporaryDirectory() {
    throw new Error('Not implemented');
  },
  checkpoint: jest.fn(),
  getInitiatorCredentials: jest.fn(),
};

describe('ms-teams:sendMessage', () => {
  beforeEach(() => {});

  it('should throw error if webhookUrl is not defined', async () => {
    const action = createSendTeamsMessageViaWebhookAction({
      config: {
        getOptionalString: (_key: string): string | undefined => undefined,
      } as Config,
    });

    const logger = {} as winston.Logger;

    try {
      await action.handler({
        ...defaultHandlerOptions,
        input: {
          message: 'Hello, Teams!',
        },
        logger,
      });
      throw new Error('This should not succeed');
    } catch (err: any) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.message).toContain(
        'Webhook URL is not specified in either the app-config or the action input. This must be specified in at least one place in order to send a message',
      );
    }
  });

  it('should send to config webhook URL if provided', async () => {
    const action = createSendTeamsMessageViaWebhookAction({
      config: {
        getOptionalString: (_key: string): string | undefined =>
          'https://example-teams.com',
      } as Config,
    });

    mockedAxios.post.mockResolvedValue({ status: 200 });

    const logger = {} as winston.Logger;

    await action.handler({
      ...defaultHandlerOptions,
      input: {
        message: 'Hello, Teams!',
      },
      logger,
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://example-teams.com',
      expect.anything(),
    );
  });

  it('should prefer webhook url from config if provided in input', async () => {
    const action = createSendTeamsMessageViaWebhookAction({
      config: {
        getOptionalString: (_key: string): string | undefined =>
          'https://example-teams.com',
      } as Config,
    });

    mockedAxios.post.mockResolvedValue({ status: 200 });

    const logger = {} as winston.Logger;

    await action.handler({
      ...defaultHandlerOptions,
      input: {
        message: 'Hello, Teams!',
        webhookUrl: 'https://dontusethis-teams.com',
      },
      logger,
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://example-teams.com',
      expect.anything(),
    );
  });

  it('should use the webhook url on input if config value is not present', async () => {
    const action = createSendTeamsMessageViaWebhookAction({
      config: {
        getOptionalString: (_key: string): string | undefined => undefined,
      } as Config,
    });

    mockedAxios.post.mockResolvedValue({ status: 200 });

    const logger = {} as winston.Logger;

    await action.handler({
      ...defaultHandlerOptions,
      input: {
        message: 'Hello, Teams!',
        webhookUrl: 'https://nevergonnagiveyouup-teams.com',
      },
      logger,
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://nevergonnagiveyouup-teams.com',
      expect.anything(),
    );
  });

  it('should send message in proper format to webhook URL', async () => {
    const action = createSendTeamsMessageViaWebhookAction({
      config: {
        getOptionalString: (_key: string): string | undefined =>
          'https://example-teams.com',
      } as Config,
    });

    mockedAxios.post.mockResolvedValue({ status: 200 });

    const logger = {} as winston.Logger;

    await action.handler({
      ...defaultHandlerOptions,
      input: {
        message: 'Hello, Teams!',
        webhookUrl: 'https://dontusethis-teams.com',
      },
      logger,
    });

    expect(axios.post).toHaveBeenCalledWith(
      'https://example-teams.com',
      expect.objectContaining({ text: 'Hello, Teams!' }),
    );
  });

  it('should throw an error if result.status is not 200', async () => {
    const action = createSendTeamsMessageViaWebhookAction({
      config: {
        getOptionalString: (_key: string): string | undefined =>
          'https://example-teams.com',
      } as Config,
    });

    mockedAxios.post.mockResolvedValue({ status: 400 });
    const logger = jest.fn() as unknown as winston.Logger;
    logger.error = jest.fn();
    logger.debug = jest.fn();

    try {
      await action.handler({
        ...defaultHandlerOptions,
        input: {
          message: 'Hello, Teams!',
          webhookUrl: 'https://dontusethis-teams.com',
        },
        logger,
      });
      expect(true).toBeFalsy();
    } catch (err: any) {
      // eslint-disable-next-line jest/no-conditional-expect
      expect(err.message).toContain(
        `Something went wrong while trying to send a request to the Teams webhook URL - StatusCode 400`,
      );
    }
  });
});
