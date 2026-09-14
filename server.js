const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Membuka folder public agar bisa diakses browser
app.use(express.static(path.join(__dirname, 'public')));

// Simulasi database sementara
let currentData = { status: "Sistem Normal", lastUpdatedBy: "System" };

io.on('connection', (socket) => {
  // Kirim data saat user/admin baru pertama kali membuka web
  socket.emit('init_data', currentData);

  // Tangkap event perubahan dari admin
  socket.on('admin_update_data', (newData) => {
    currentData = newData;
    // Broadcast data terbaru ke seluruh User & Admin yang sedang membuka web
    io.emit('data_updated', currentData);
  });
});

// Menggunakan PORT dari Render (atau port 3000 jika di komputer lokal)
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});