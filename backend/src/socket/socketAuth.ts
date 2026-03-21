import { Socket } from "socket.io";
import { verifyAccessToken } from "../common/middlewares/verifyJwt";

export const socketAuthMiddleware = (socket: Socket, next: any) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Unauthorized"));
    }

    const payload = verifyAccessToken(token);

    // attach user to socket
    socket.data.userId = payload.sub;
    socket.data.role = payload.role;

    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
};