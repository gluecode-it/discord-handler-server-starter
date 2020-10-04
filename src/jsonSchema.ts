export default {
  type: "object",
  properties: {
    config: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: {
            type: "string",
          },
          discord: {
            type: "object",
            properties: {
              channelId: {
                type: "string",
              },
              webhookUrl: {
                type: "string",
              },
              token: {
                type: "string",
              },
            },
            required: ["channelId", "webhookUrl", "token"],
          },
          googleCloud: {
            properties: {
              zone: {
                type: "string",
              },
              instance: {
                type: "string",
              },
              credentialsFile: {
                type: "string",
              },
            },
            required: ["zone", "instance", "credentialsFile"],
          },
          handler: {
            properties: {
              threshold: {
                type: "number",
              },
              startupDelayMs: {
                type: "number",
              },
              shutdownDelayMs: {
                type: "number",
              },
            },
            required: ["threshold", "startupDelayMs", "shutdownDelayMs"],
          },
        },
        required: ["name", "discord", "googleCloud", "handler"],
      },
      minItems: 1,
    },
  },
  required: ["config"],
  additionalProperies: false,
};
