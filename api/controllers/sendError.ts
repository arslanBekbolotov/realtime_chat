import { WebSocket } from "ws";

const sendError = (ws: WebSocket, type: string, error: unknown) => {
  ws.send(
    JSON.stringify({
      type,
      payload: {
        error: error,
      },
    }),
  );
};

export default sendError;
