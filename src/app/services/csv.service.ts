import { Injectable } from '@angular/core';
import { readFile } from '../util/FileUtil';
import { unquote } from '../util/string';

export type CsvParseResult = SuccessParseResult | FailedParseResult;

export type SuccessParseResult = {
  headers: string[];
  success: true;
  data: { [key: string]: any }[];
}

export type FailedParseResult = {
  success: false;
  error: Error;
}

export type CsvDelimiter = ";" | "," | "|";

@Injectable({
  providedIn: 'root'
})
export class CsvService {

  public async parseCsv(content: string, delimiter: CsvDelimiter): Promise<CsvParseResult> {
    const lines = content.split(/[\r\n]+/);
    if (!lines || lines.length === 0) {
      return {
        success: false,
        error: new Error("Empty csv file")
      };
    }

    const headers = lines[0].split(delimiter).map(unquote);
    const dataLines = lines.slice(1);
    const data = dataLines.reduce((acc, line) => {
      const entries = line.split(delimiter);
      const row: {[key: string]: any} = {};
      for (let i = 0; i < entries.length; i++) {
        row[headers[i]] = entries[i];
      }
      acc.push(row);
      return acc;
    }, [] as { [key: string]: any }[])

    return {
      success: true,
      headers: headers,
      data: data,
    }
  }

  public async parseCsvFile(file: File, delimiter: CsvDelimiter): Promise<CsvParseResult> {
    const content = await readFile(file);
    return this.parseCsv(content, delimiter);
  }
}
