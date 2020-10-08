require("dotenv").config();
import { safeLoad } from "js-yaml";
import { readFileSync } from "fs";
import { Client } from "discord.js";
import { VoiceChannelObserver } from "@gluecode-it/discord-voice-channel-observer";
import { GoogleVM, VmHandler } from "@gluecode-it/google-cloud-vm-handler";
import {
  DiscordVoiceChannelServerHandler,
  DiscordMessagingHandler,
} from "@gluecode-it/discord-voice-channel-server-handler";
import { Webhook } from "discord-webhook-node";
import Ajv from "ajv";
import { ConfigEntry, ConfigRoot } from "./models";
import schema from "./jsonSchema";

const Compute = require("@google-cloud/compute");

async function start(configEntry: ConfigEntry) {
  const discordClient = new Client();
  await discordClient.login(configEntry.discord.token);

  const compute = new Compute();
  const zone = compute.zone(configEntry.googleCloud.zone);
  const vm = zone.vm(configEntry.googleCloud.instance) as GoogleVM;
  const vmHandler = new VmHandler(vm);

  const observer = new VoiceChannelObserver(
    discordClient,
    configEntry.discord.channelId
  );

  const messageHandler = new DiscordMessagingHandler(
    new Webhook({
      url: configEntry.discord.webhookUrl,
    })
  );

  const handler = new DiscordVoiceChannelServerHandler(
    observer,
    vmHandler,
    messageHandler,
    configEntry.handler.startupDelayMs,
    configEntry.handler.shutdownDelayMs,
    configEntry.handler.threshold
  );
  await handler.start();
  return configEntry;
}

(async () => {
  var ajv = new Ajv();
  const yamlContent = readFileSync(
    process.env.CONFIG_PATH || ".config.yml"
  ).toString();
  const config = safeLoad(yamlContent) as ConfigRoot;
  var valid = ajv.validate(schema, config);
  if (!valid) {
    console.log(ajv.errors);
    process.exit(1);
  }
  const handlersList: any[] = [];
  config.config.forEach(async (configEntry) => {
    handlersList.push(start(configEntry));
  });
  console.log(`starting ${config.config.length} observers`);
  const list = await Promise.all(handlersList);
  list.forEach((configEntry: ConfigEntry) => {
    console.log(`Observer started "${configEntry.name}"`);
  });
})();
