#!/usr/bin/env node

/* tslint:disable:no-console */

import axios from 'axios';
import * as commander from 'commander';
import * as csvParse from 'csv-parse/lib/sync';
import * as csvStringify from 'csv-stringify/lib/sync';
import * as fs from 'fs';

import SnapClient from './snapClient';

const snapClient = new SnapClient();

commander
    .command('user:provision <csv>')
    .description('provision users for the accounts in the specified CSV')
    .option('-u, --username <column>', 'username column index', parseInt)
    .option('-e, --email <column>', 'email column index', parseInt)
    .option('-p, --password <column>', 'password column index', parseInt)
    .option('--no-header', 'denotes a header row does not exist')
    .option('-o, --output <csv>', 'output file')
    .action(((input, options) => {
        for (const option of ['username', 'email', 'output']) {
            if ('undefined' === typeof options[option]) {
                throw new Error(`missing required option: ${option}`);
            }
        }

        const csv = csvParse(fs.readFileSync(input, { encoding: 'utf-8' }));
        const output = options.output;

        createUser(csv, options.header ? 1 : 0, options).then(() => {
            writeCsv(csv, output);
        }).catch((error) => {
            writeCsv(csv, output);
            process.exit(1);
        });
    }));

function createUser(csv: any[], index: number, options): Promise<any> {
    const row = csv[index];
    const username = row[options.username];
    const logPrefix = `[${index}:${username}]`;

    console.log(`${logPrefix} Creating user`);

    let password = null;
    let passwordColumn = row.length;

    if ('undefined' !== typeof options.password) {
        passwordColumn = options.password;
        password = row[passwordColumn];
    }

    if (!password) {
        password = Math.random().toString(36).slice(-6);
    }

    return snapClient.createUser(username, row[options.email], password).then(() => {
        row[passwordColumn] = password;

        if (++index < csv.length) {
            return createUser(csv, index, options);
        }
    }).catch((error) => {
        console.log(`${logPrefix} Error creating user: ${JSON.stringify(error.response.data)}`);

        return Promise.reject(error);
    });
}

function writeCsv(csv, file) {
    console.log('Writing output CSV');
    fs.writeFileSync(file, csvStringify(csv));
}

commander.parse(process.argv);
