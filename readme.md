[![npm version](https://badge.fury.io/js/snap-cli.svg)](https://www.npmjs.com/package/snap-cli)

# snap-cli

Command-line utilities for [Snap<em>!</em>](https://snap.berkeley.edu/)

## Installation

```
npm i -g snap-cli
```

## Usage

```
snap <command>
```

## Commands

### `user:provision [options] <csv>`

Provision users for the accounts in the specified CSV.

#### Options

| option | required | description |
| --- | --- | --- |
| `-u --username <column>` | yes | username column index |
| `-e, --email <column>` | yes | email column index |
| `-o, --output <csv>` | yes | output file |
| `-p, --password <column>` | no | password column index |
| `--no-header` | no | denotes a header row does not exist |

#### Example

Given `input.csv`:

| username | email |
| --- | --- |
| jsmith | jsmith@example.com |
| jdoe | jdoe@example.com |

```
$ snap user:provision input.csv -u 0 -e 1 -o output.csv
[1:jsmith] Creating user
[2:jdoe] Creating user
Writing output CSV
```

`output.csv`:

| username | email | |
| --- | --- | --- |
| jsmith | jsmith@example.com | abc123 |
| jdoe | jdoe@example.com | def456 |
