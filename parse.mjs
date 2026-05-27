import fs from 'fs'
import path from 'path'

const csvPath = 'D:\\jobpaglu\\d2c_reviews_dataset.csv'
const jsonPath = path.join(process.cwd(), 'lib', 'data.json')

const csvText = fs.readFileSync(csvPath, 'utf8')
const lines = csvText.trim().split('\n')

// Basic CSV parser (handles quoted fields correctly for this dataset)
function parseCSVLine(line) {
  const result = []
  let inQuotes = false
  let currentVal = ''
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (char === '"') {
      if (inQuotes && line[i+1] === '"') {
        currentVal += '"'
        i++ // skip escaped quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      result.push(currentVal)
      currentVal = ''
    } else {
      currentVal += char
    }
  }
  result.push(currentVal)
  return result
}

const headers = parseCSVLine(lines[0])
const data = []

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue
  const row = parseCSVLine(lines[i])
  const obj = {}
  
  headers.forEach((header, index) => {
    let val = row[index]
    if (header === 'rating' || header === 'helpful_votes' || header === 'verified_purchase') {
      val = Number(val)
    }
    // ensure detected_unmet_needs is a valid string/array format based on CSV (it's already a JSON array string)
    obj[header] = val
  })
  data.push(obj)
}

fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2))
console.log('Successfully created data.json with ' + data.length + ' records.')
