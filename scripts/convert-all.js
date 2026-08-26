const fs = require('fs');
const path = require('path');

// Target only your specific data entities
const files = ['players', 'teams', 'coaches', 'matches', 'programs', 'products', 'news'];
// Updated to look inside the lib/ folder instead of data/
const dataDir = path.join(__dirname, '../lib');

// Helper to escape values for CSV safety
const escapeCSV = (val) => {
  if (val === null || val === undefined) return '""';
  if (typeof val === 'object') val = JSON.stringify(val);
  const str = String(val).replace(/"/g, '""');
  return `"${str}"`;
};

console.log('--- Starting JSON to CSV Conversion ---');

files.forEach((file) => {
  const jsonPath = path.join(dataDir, `${file}.json`);
  const csvPath = path.join(dataDir, `${file}.csv`);

  if (!fs.existsSync(jsonPath)) {
    console.log(`Skipped: ${file}.json (File not found in lib/ folder)`);
    return;
  }

  try {
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(rawData);

    if (!Array.isArray(data) || data.length === 0) {
      console.log(`Skipped: ${file}.json (Empty or not an array)`);
      return;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.map(escapeCSV).join(',')];

    for (const row of data) {
      const values = headers.map((header) => escapeCSV(row[header]));
      csvRows.push(values.join(','));
    }

    fs.writeFileSync(csvPath, csvRows.join('\n'), 'utf-8');
    console.log(`Converted: lib/${file}.json -> lib/${file}.csv`);
  } catch (err) {
    console.error(`Error processing ${file}.json:`, err.message);
  }
});

console.log('--- Conversion Complete ---');