'use strict';
const fs = require('fs');
const obj = require('./list.json');
const year = 2018;
let content = `# ${year} Web Development Conferences
A list of ${year} web development conferences.
A list of [${year - 1} conferences](https://github.com/ryanburgess/${year - 1}-conferences).

_**You can also add all conferences directly into your calendar by importing the \`.ics\` file into Google Calendar etc.**_
`;
// create contributing instructions
const contribute =  `
## Contributing
1. Fork it
2. Add your conference to \`list.json\`
3. Run \`node index\` to update \`README.md\` with your changes
4. Run \`node generate-ical\` to update the \`.ics\` file with your changes
5. Create your feature branch (\`git checkout -b my-new-feature\`)
6. Commit your changes (\`git commit -am "Add some feature"\`)
7. Push to the branch (\`git push origin my-new-feature\`)
8. Create new Pull Request
`;

// messages
const messages = {
  'success': {
    'updated': 'Updated conference list'
  },
  'fail': {
    'char': 'Must contain 5 characters. Format: mm-dd',
  }
}

// month names for date function
const monthNames = [
  "January", "February", "March",
  "April", "May", "June", "July",
  "August", "September", "October",
  "November", "December"
];

// human readable date function
let humanDate = ( from, to ) => {
  // to mm-dd
  let dayMonthTo = '', dayTo, toMonthName;
  if( to ) {
    let toArr = to.split('-');
    let eventTo = new Date( year, ( toArr[0] - 1 ), toArr[1] );
    let toMonthIndex = eventTo.getMonth();
    dayTo = eventTo.getDate();
    toMonthName = monthNames[toMonthIndex];
    dayMonthTo = ` - ${dayTo} ${toMonthName}`;
  }

  // from mm-dd
  let fromArr = from.split('-');
  let eventFrom = new Date( year, ( fromArr[0] - 1 ), fromArr[1] );
  let fromDay = eventFrom.getDate();
  let fromMonthIndex = eventFrom.getMonth();
  let fromMonthName = monthNames[fromMonthIndex];

  // default return
  const defaultReturn = `${fromDay} ${fromMonthName}${dayMonthTo}, ${year}`;

  // if same month, use single month name
  if( to ) {
    if( fromMonthName === toMonthName ) {
      return `${fromDay} - ${dayTo} ${fromMonthName}, ${year}`;
    } else {
      return defaultReturn;
    }
  } else {
    return defaultReturn;
  }

}

// sort object by dateFrom
obj.sort(function(a, b) {
  let aFromArr = a.dateFrom.split('-');
  let bFromArr = b.dateFrom.split('-');
  a = aFromArr[0] + aFromArr[1];
  b = bFromArr[0] + bFromArr[1];
  return a - b;
});

// create heading for conference list
content += `
# Conference List
`;

// create list of conferences
for (const conference of obj) {
  if( conference.dateFrom.length !== 5 ) process.exit( console.log(`${conference.title} - dateFrom: ${messages.fail.char}`) );
  if( conference.dateTo.length !== 0 && conference.dateTo.length !== 5 ) process.exit( console.log(`${conference.title} - dateTo: ${messages.fail.char}`) );
  let humanReadableDate = humanDate( `${conference.dateFrom}`, `${conference.dateTo}` );
  // create content for readme
  content += (    `
## [${conference.title}](${conference.url})
**Where:** ${conference.where}

**When:** ${humanReadableDate}
    `
  );
}

// add contribute information after list of conferences
content += contribute;

// create README with the list of conferences
fs.writeFile('./README.md', content, function (err) {
  if (err) throw err;
  console.log( messages.success.updated );
});
