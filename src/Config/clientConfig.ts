import { Config } from "../Types/config";

export const clientConfig: Config = {
  "intents": [
    "Guilds",
    "DirectMessages",
    "GuildVoiceStates"
  ],
  "deployCommands": true,
  "presence": {
    "status": "online",
    "activities": [
      {
        "type": 0,
        "name": "with my friends"
      }
    ]
  }
}