resumegen
----------
Manage your resume with the plain text file, and manage its version with your favorite VCS.
`resumegen` is a NodeJS script to generate your resume with YAML and convert it to HTML.
You can make your own template to make your resume looks different.

## Requirements
- NodeJS (>20)

## Installation
```
npm install -g resumegen
```

## Usage
```
Usage: resumegen <yaml> [options]

Options:
  -o, --output <path>               Output file
                                    (DEFAULT: the same as the input file with .html extension)
  -t, --template <path>             Template file
                                    (DEFAULT: the built-in default template)

  --template-component-dir <name>   Directory for the template components
                                    (DEFAULT: partials)
  --template-extension <ext>        File extension for the template files
                                    (DEFAULT: .eta)

  -h, --help                        Show this message
  --dry                             Print the build result without writing to file
```

To generate your resume with default template:

`> resumegen <your_yaml_file>`

**NOTE:** There is no result if the generation is successful.

## Write your resume
> See more in the example

WIP

## Custom Template
Resumegen use `eta` as its template engine. Learn more about it at https://eta.js.org/.

## Converting to PDF
The easiest way to convert HTML to PDF is using the web browser's built-in print function because
the default template is designed for A4 paper. If you used the custom template, you may need to adjust
something to make it printable.

[`Pandoc`](https://pandoc.org/) and [`wkkhtmltopdf`](https://wkhtmltopdf.org/) are two cross-platform
solutions if your web browser cannot convert HTML pages to PDF.
