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
    console.log("Initializing Google Sheet...");
    await doc.loadInfo();
    console.log("Sheet Loaded:", doc.title);
    
    let sheet = doc.sheetsByTitle['UserData'];
    if (!sheet) {
      console.log("UserData sheet not found, creating one...");
      sheet = await doc.addSheet({ 
        title: 'UserData', 
        headerValues: ['userId', 'email', 'lockUntil', 'streak', 'partnerEmail'] 
      });
    } else {
      // Ensure headers exist if sheet is empty
      await sheet.loadHeaderRow();
      if (sheet.headerValues.length === 0) {
        await sheet.setHeaderRow(['userId', 'email', 'lockUntil', 'streak', 'partnerEmail']);
      }
    }
    return sheet;
  } catch (error: any) {
    console.error("Error in initSheet:", error.message);
    throw error;
  }
}
