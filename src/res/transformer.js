import {getData} from './content.js';

class BaseEntity {
    constructor(data) {
        Object.assign(this, data);
    }
}

class DataTransformer {
    constructor(jsonData) {
        this.sheets = {};
        this.processSheets(jsonData);
    }

    processSheets(jsonData) {
        jsonData.sheets.forEach(sheet => {
            const className = this.capitalize(sheet.name);
            this.sheets[sheet.name] = this.createClass(className, sheet.columns);
        });
    }

    createClass(className, columns) {
        return class extends BaseEntity {
            constructor(data) {
                super(data);
            }

            static getColumns() {
                return columns.map(col => col.name);
            }
        };
    }

    transform() {
        const transformedData = {};
        Object.keys(this.sheets).forEach(sheetName => {
            transformedData[sheetName] = jsonData.sheets
                .find(sheet => sheet.name === sheetName)
                .lines.map(line => new this.sheets[sheetName](line));
        });
        return transformedData;
    }

    capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}

// Example Usage
const jsonData = getData();
const transformer = new DataTransformer(jsonData);
const transformedData = transformer.transform();

console.log(transformedData);
