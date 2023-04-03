Resumegen
----------
Manage your resume with the plain text file, and manage its version with your favorite VCS.
`Resumegen` is a Deno/TypeScript to generate your resume with YAML and convert it to HTML.
You can make your own template to make your resume looks different.

## Requirements
- Deno (https://deno.land)

## Usage
```
resumegen.ts [options] <yaml>

OPTIONS:
  --template, -t <path>           specify the template to generate resume
                                  (DEFAULT: default.eta)
  --output, -o <path>             specify the output file basename.
                                  (DEFAULT: same with the input yaml file)
```

To generate your resume with default template:

`> deno run -A ./index.ts <your_yaml_file>`

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
