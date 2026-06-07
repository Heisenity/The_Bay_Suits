import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";
import { DatabaseService } from "../infrastructure/database.service";
import { ChatSupportService } from "./chat-support.service";

@WebSocketGateway({ cors: { origin: "*" } })
export class ChatGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly database: DatabaseService,
    private readonly support: ChatSupportService
  ) {}

  handleConnection(client: Socket) {
    client.emit("status", { connected: true });
  }

  @SubscribeMessage("join")
  join(@ConnectedSocket() client: Socket, @MessageBody() body: { conversationId: string }) {
    void client.join(body.conversationId);
    return { joined: body.conversationId };
  }

  @SubscribeMessage("message")
  async message(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: { id?: string; conversationId: string; author: string; text: string; createdAt?: string }
  ) {
    const message = await this.database.createMessage(body);
    client.to(body.conversationId).emit("message", message);
    if (body.conversationId === "website-lobby") {
      client.emit("assistant:typing", { active: true });

      const reply = this.support.reply(body.text);
      const assistantMessage = await this.database.createMessage({
        conversationId: body.conversationId,
        author: "team",
        text: reply.text
      });

      setTimeout(() => {
        client.emit("assistant:typing", { active: false });
        client.emit("message", { ...assistantMessage, suggestions: reply.suggestions });
      }, 650);
    }

    return { delivered: true };
  }
}
