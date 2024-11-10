const express = require('express');
const path = require('path');
const { writeToSheet, readSheet } = require('./services/sheetService');
const cors = require('cors');
require('dotenv').config();

const app = express();
const spreadsheetId = process.env.SPREADSHEET_ID;

// Middleware
app.use(express.json());  // Để xử lý JSON request body
app.use(express.urlencoded({ extended: true }));  // Để xử lý URL-encoded request body
app.use(cors());  // Để cho phép frontend truy cập API từ domain khác (CORS)


app.post('/submit-form', async (req, res) => {
    const { name, age, location } = req.body;
    const data = [
        [name, age, location]  // Tạo mảng dữ liệu cần ghi vào Sheets
    ];

    try {
        // Ghi dữ liệu vào Google Sheets (ID sheet và range có thể thay đổi tùy nhu cầu)
        await writeToSheet(spreadsheetId, 'Sheet1!A2', data);  // Ghi từ A2 (bỏ A1 vì nó có thể là header)
        res.send('Dữ liệu đã được ghi vào Google Sheets!');
    } catch (error) {
        console.error('Error writing to sheet:', error);  // Log lỗi ra console
        res.status(500).send('Có lỗi khi ghi dữ liệu vào Sheets');
    }
});

app.get('/list-data', async (req, res) => {
    try {
        // Đọc dữ liệu từ Google Sheets (có thể thay đổi phạm vi theo nhu cầu)
        const rows = await readSheet(spreadsheetId, 'Sheet1!A1:C');
        
        // Lọc các hàng thực tế, bỏ qua tiêu đề (hàng đầu tiên)
        const filteredRows = rows.filter((row, index) => index > 0); // Bỏ qua hàng đầu tiên (tiêu đề)

        // Trả về dữ liệu dưới dạng JSON
        res.json(filteredRows);
    } catch (error) {
        console.error('Error:', error);  // Log lỗi ra console
        res.status(500).send('Có lỗi khi lấy dữ liệu từ Sheets');
    }
});


// Khởi động server trên cổng 5000
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
