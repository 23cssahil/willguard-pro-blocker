import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export async function initSheet() {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !clientEmail || !privateKey) {
    throw new Error(`Missing environment variables: ${!sheetId ? 'GOOGLE_SHEET_ID ' : ''}${!clientEmail ? 'GOOGLE_SERVICE_ACCOUNT_EMAIL ' : ''}${!privateKey ? 'GOOGLE_PRIVATE_KEY' : ''}`);
  }

  const jwt = new JWT({
    email: clientEmail,
    key: privateKey.replace(/\\n/g, '\n'),
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(sheetId, jwt);

  try {
    console.log(`Initialising Google Sheet: ${sheetId.substring(0, 5)}...`);
    await doc.loadInfo();
    console.log("Sheet Loaded Successfully:", doc.title);
    
    let sheet = doc.sheetsByTitle['UserData'];
    if (!sheet) {
      console.log("UserData tab not found. Available tabs:", Object.keys(doc.sheetsByTitle).join(', '));
      console.log("Creating UserData tab...");
      sheet = await doc.addSheet({ 
        title: 'UserData', 
        headerValues: ['userId', 'email', 'lockUntil', 'streak', 'partnerEmail'] 
      });
    } else {
      await sheet.loadHeaderRow();
      if (sheet.headerValues.length === 0) {
        console.log("Sheet is empty, setting headers...");
        await sheet.setHeaderRow(['userId', 'email', 'lockUntil', 'streak', 'partnerEmail']);
      }
    }
    return sheet;
  } catch (error: any) {
    console.error("FATAL: Google Sheets Connection Failed.");
    console.error("Error Message:", error.message);
    if (error.message.includes('403')) {
      throw new Error(`Permission Denied: Please share your sheet with ${clientEmail} as an EDITOR.`);
    }
    if (error.message.includes('404')) {
      throw new Error(`Sheet Not Found: Check if GOOGLE_SHEET_ID is correct.`);
    }
    throw error;
  }
}
