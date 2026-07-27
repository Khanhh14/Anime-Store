// src/ultis/socket.js
const { Server } = require('socket.io');

let activeUsers = {};
let chatHistory = {};

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Thay bằng domain FE nếu cần bảo mật
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {

    // 0. ADMIN YÊU CẦU LẤY DANH SÁCH KHÁCH HÀNG
    socket.on('get_user_list', () => {
      socket.emit('update_user_list', Object.values(activeUsers));
    });

    // 1. KHÁCH HÀNG GỬI TIN NHẮN
    socket.on('send_message', (data) => {
      const userId = socket.id;
      const timeNow = data.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const clientName = data.userName || activeUsers[userId]?.userName || `Khách #${userId.slice(0, 5)}`;

      activeUsers[userId] = {
        id: userId,
        userName: clientName,
        lastMessage: data.text,
        time: timeNow
      };

      socket.join(userId);

      const msgObj = {
        id: Date.now(),
        userId: userId,
        userName: clientName,
        text: data.text,
        sender: 'user',
        time: timeNow
      };

      if (!chatHistory[userId]) {
        chatHistory[userId] = [];
      }
      chatHistory[userId].push(msgObj);

      io.emit('update_user_list', Object.values(activeUsers));
      io.to(userId).emit('receive_message', msgObj);
    });

    // 2. ADMIN NỐI VÀO ROOM KHÁCH HÀNG & LẤY LỊCH SỬ CHAT
    socket.on('admin_join_room', (userId) => {
      socket.join(userId);
      
      const history = chatHistory[userId] || [];
      socket.emit('load_chat_history', {
        userId: userId,
        messages: history
      });
    });

    // 3. ADMIN TRẢ LỜI TIN NHẮN
    socket.on('admin_send_message', (data) => {
      const { userId, text, time } = data;
      const timeNow = time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      const msgObj = {
        id: Date.now(),
        userId: userId,
        userName: activeUsers[userId]?.userName || 'Khách hàng',
        text: text,
        sender: 'admin',
        time: timeNow
      };

      if (!chatHistory[userId]) {
        chatHistory[userId] = [];
      }
      chatHistory[userId].push(msgObj);

      if (activeUsers[userId]) {
        activeUsers[userId].lastMessage = `Admin: ${text}`;
        activeUsers[userId].time = timeNow;
        io.emit('update_user_list', Object.values(activeUsers));
      }

      io.to(userId).emit('receive_message', msgObj);
    });

    // 4. KHÁCH NGẮT KẾT NỐI
    socket.on('disconnect', () => {
      if (activeUsers[socket.id]) {
        delete activeUsers[socket.id];
        delete chatHistory[socket.id];
        io.emit('update_user_list', Object.values(activeUsers));
      }
    });
  });

  return io;
};

module.exports = initSocket;