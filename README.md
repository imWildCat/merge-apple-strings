# merge-apple-strings

A CLI tool to merge Apple `.strings` files.

## Installation

```shell
npm install -g merge-apple-strings

# or yarn

yarn global add merge-apple-strings
```

## Usage

```
merge-apple-strings --input <path> --input <path> --output <path> [--charset <charset>]
```

Details can be found by running `merge-apple-strings --help`:

```
Options:
      --help     Show help                                             [boolean]
      --version  Show version number                                   [boolean]
  -i, --input    Input file(s)                                           [array]
  -o, --output   Output file                                            [string]
  -c, --charset  Charset, default is UTF-16         [string] [default: "UTF-16"]
      --comment  read and merge comments, default is true
                                                       [boolean] [default: true]
```

## LICENSE

MIT
