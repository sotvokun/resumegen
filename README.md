resumegen
----------
Manage your resume with the plaint text file, and managing its version with your favorites VCS.
`resumegen` is a deno/TypeScript to generate your resume with YAML, and converting it to HTML.
You can make your own template to make your resume looks different.

## Requirements
- Deno (https://deno.land)

## Write your resume
> See more in the example

WIP

## Convertingto PDF
The easiest way to convert HTML to PDF is using the web browser built-in print function, because
the default template is designed for A4 paper. If you used custom template, you may need adjuest
something to make it printable.

[`pandoc`](https://pandoc.org/) and [`wkkhtmltopdf`](https://wkhtmltopdf.org/) are two crossplatform
solutions, if your web browser cannot convert HTML page to PDF.
