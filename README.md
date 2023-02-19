resumegen
----------
Manage your resume with the plaint text file, and managing its version with your favorites VCS.
`resumegen` is a deno/TypeScript to generate your resume with YAML, and converting it to HTML.
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

**NOTE:** There is no result if the generation is success.

## Write your resume
> See more in the example

WIP

## Custom Template
resumegen use `eta` as its template engine. Learn more about it in https://eta.js.org/.

## Convertingto PDF
The easiest way to convert HTML to PDF is using the web browser built-in print function, because
the default template is designed for A4 paper. If you used custom template, you may need adjuest
something to make it printable.

[`pandoc`](https://pandoc.org/) and [`wkkhtmltopdf`](https://wkhtmltopdf.org/) are two crossplatform
solutions, if your web browser cannot convert HTML page to PDF.
