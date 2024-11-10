const { google } = require('googleapis');
const auth = require('../config/googleAuth');

// Khởi tạo Sheets API client
const sheets = google.sheets({ version: 'v4', auth });

// Hàm ghi dữ liệu vào Google Sheets
const writeToSheet = async (spreadsheetId, range, values) => {
    try {
        // Lấy thông tin sheet để xác định số dòng hiện tại trong phạm vi cần ghi
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range: `Sheet1!A:A`,  // Lấy cột A để xác định số dòng hiện tại
        });

        const rows = response.data.values || [];
        const nextRow = rows.length + 1;  // Dòng kế tiếp sẽ là số lượng dòng hiện tại + 1

        // Xác định phạm vi mới để ghi dữ liệu, ví dụ: A3, B3, C3
        const newRange = `${range}${nextRow}:${String.fromCharCode(64 + values[0].length)}${nextRow}`;

        // Tạo tài nguyên dữ liệu cần ghi
        const resource = { values };

        // Ghi vào Google Sheets
        const result = await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: newRange,
            valueInputOption: 'USER_ENTERED',
            resource,
        });

        return result;
    } catch (error) {
        console.error('Error writing to sheet:', error);
        throw error;
    }
};

// Hàm đọc dữ liệu từ Google Sheets
const readSheet = async (spreadsheetId, range) => {
    const auth = await authorize();  // Hãy đảm bảo bạn đã có chức năng authorize() để xác thực với Google API
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId,
            range,
            auth,
        });
        return response.data.values;  // Trả về dữ liệu từ Sheets
    } catch (error) {
        console.error('Error reading data from sheet:', error);
        throw error;  // Ném lỗi để xử lý ở nơi khác
    }
};

// Hàm ủy quyền OAuth
const authorize = async () => {
    // Đây là nơi bạn cung cấp credentials để có quyền truy cập Google Sheets.
    // Bạn có thể sử dụng service account hoặc OAuth2.0 để xác thực.
};

module.exports = { writeToSheet, readSheet };
