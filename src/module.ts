import { createBackendModule, coreServices } from "@backstage/backend-plugin-api";
import { scaffolderActionsExtensionPoint  } from '@backstage/plugin-scaffolder-node/alpha';
import { createSendTeamsMessageViaWebhookAction } from "./actions/ms-teams/send-ms-teams-message";

/**
 * A backend module that registers the action into the scaffolder
 */
export const scaffolderModuleSendTeamsMessage = createBackendModule({
  moduleId: 'ms-teams:sendMessage',
  pluginId: 'scaffolder',
  register({ registerInit }) {
    registerInit({
      deps: {
        scaffolderActions: scaffolderActionsExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ scaffolderActions, config }) {
        scaffolderActions.addActions(createSendTeamsMessageViaWebhookAction({ config }));
      }
    });
  },
})
