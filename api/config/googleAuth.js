const { google } = require('googleapis');

// Hàm khởi tạo Google Auth client
const auth = new google.auth.GoogleAuth({
    keyFile: './gg-sheets-api-441108-f48f9f374902.json',  // Đường dẫn tới file JSON của Service Account
    scopes: ['https://www.googleapis.com/auth/spreadsheets']  // Phạm vi quyền truy cập
});

module.exports = auth;
