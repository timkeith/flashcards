import { GoogleSpreadsheet } from 'google-spreadsheet';
import credentials from '../credentials/flashcards-381115-ecf0e23c86bf.js';

const SPREADSHEET_ID = '1nNZpWrXzTVh1AAubhTG407PkaypnvmDFILcCVMWrQ4M';

const GetWords = async (callback) => {
  try {
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
    await doc.useServiceAccountAuth(credentials);
    await doc.loadInfo();
    var words = {};  // group -> deck -> list of words
    for (var id in doc.sheetsById) {
      const sheet = doc.sheetsById[id];
      const rows = await sheet.getRows();
      words[sheet.title] = GetWordsFromSheet(rows);
    }
    callback(words);
  } catch (e) {
    console.error('Error: ', e);
    return [];
  }
};

const GetWordsFromSheet = (rows) => {
  var words = {};
  var deck = 'unknown?';
  rows.map((row, i) => {
    const {Question, Answer} = row;
    if (Question === undefined) {
      // ignore
    } else if (Answer === undefined) {
      deck = Question;
      if (words[deck] === undefined) {
        words[deck] = [];
      }
    } else {
      words[deck].push(row.Question, row.Answer);
    }
  });
  return words;
};

export default GetWords;
