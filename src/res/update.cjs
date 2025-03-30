#!/usr/bin/env node

'use strict';

console.log(`Listenig for modifications...`);
const fs = require('node:fs');

function run()
{

    let buffer = '';
    buffer += "export function getData():string{return `";
    buffer += JSON.stringify(JSON.parse(fs.readFileSync("res/data.cdb")));
    buffer += "`;}";

    fs.writeFileSync(`src/content.ts`, buffer, {flag: 'w+'});
};

// First run
run();

// run on file change
fs.watch('res/data.cdb',() => {
    run();
    console.log(`databse ubdated`);
});