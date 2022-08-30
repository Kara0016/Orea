import { BaseEvent } from "../../Classes/Event";
import { ExtendedClient } from "../../Classes/ExtendedClient";

export default class ManagerReadyEvent extends BaseEvent {
  constructor(client: ExtendedClient) {
    super(client);
  }

  run(): void {
      console.log('Music deployed !')
  }
}