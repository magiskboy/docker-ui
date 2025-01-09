import { v4 as uuid } from 'uuid';


export class Message<T> {
  private requestId: string;
  protected type: string;
  protected data: T;

  constructor(data: T) {
    this.requestId = uuid().toString();
    this.data = data;
    this.type = this.constructor.name;
  }

  get Data() {
    return this.data;
  }

  get Type() {
    return this.type;
  }

  get RequestId() {
    return this.requestId;
  }

  toString() {
    return JSON.stringify({
      requestId: this.requestId,
      type: this.type,
      data: this.data
    });
  }

  static fromString(message: string) {
    const data = JSON.parse(message);

    if (data.type === StartTerminalMessage.name) {
      return new StartTerminalMessage(data.data);
    }

    if (data.type === ResizeTerminalMessage.name) {
      return new ResizeTerminalMessage(data.data);
    }

    if (data.type === StdinStreamTerminalMessage.name) {
      return new StdinStreamTerminalMessage(data.data);
    }

    if (data.type === StdoutStreamTerminalMessage.name) {
      return new StdoutStreamTerminalMessage(data.data);
    }

    if (data.type === ErrorTerminalMessage.name) {
      return new ErrorTerminalMessage(data.data);
    }

    return new Message(data.data);
  }
}


export class StartTerminalMessage extends Message<{
  cmd: string[];
  containerName: string;
  workingDir?: string;
  consoleSize?: [number, number];

}> {}


export class ResizeTerminalMessage extends Message<{
  consoleSize: [number, number];
}> {}


export class StdinStreamTerminalMessage extends Message<{
  data: string;
}> {}

export class StdoutStreamTerminalMessage extends Message <{
  data: string;
}> {}


export class ErrorTerminalMessage extends Message<{
  message: string;
}> {}

