import { DiscordConfig } from "./discordConfig";
import { GoogleCloudConfig } from "./googleCloudConfig";
import { HandlerConfig } from "./handlerConfig";

export interface ConfigEntry {
  name: string;
  discord: DiscordConfig;
  googleCloud: GoogleCloudConfig;
  handler: HandlerConfig;
}
