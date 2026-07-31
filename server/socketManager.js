const socketSessions = new Map();
const tokenSockets = new Map();

let ioInstance = null;

const setIoInstance = (io) => {
  ioInstance = io;
};

const registerSocketSession = (socket, token) => {
  socketSessions.set(socket.id, { token });

  if (!tokenSockets.has(token)) {
    tokenSockets.set(token, new Set());
  }

  tokenSockets.get(token).add(socket.id);
};

const removeSocketSession = (socketId) => {
  const session = socketSessions.get(socketId);

  if (!session) {
    return;
  }

  socketSessions.delete(socketId);

  const connectedSocketIds = tokenSockets.get(session.token);
  if (connectedSocketIds) {
    connectedSocketIds.delete(socketId);

    if (connectedSocketIds.size === 0) {
      tokenSockets.delete(session.token);
    }
  }
};

const emitForceLogoutToUser = (token, message) => {
  const connectedSocketIds = tokenSockets.get(token);

  if (!connectedSocketIds || !ioInstance) {
    return;
  }

  for (const socketId of Array.from(connectedSocketIds)) {
    const socket = ioInstance.sockets.sockets.get(socketId);
    if (socket) {
      socket.emit('force-logout', { message });
    }
  }
};

module.exports = {
  setIoInstance,
  registerSocketSession,
  removeSocketSession,
  emitForceLogoutToUser,
};
