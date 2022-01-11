resumegen.rkt
---
Manage your resume with the plain text file, update it with git. `resumegen.rkt` is a Racket script to describe the resume and convert it to HTML. You can write your own stylesheet to make your resume looks different.

## Requirements
- [Racket](https://racket-lang.org/)

## Write resume
### Preparations
Because the `resumegen.rkt` is use the macro to define a resume. So write a resume we also need use racket script. Create a file name it with extension ".rkt".

Add the following code to the head of your file.
```racket
#lang racket/base
(require "resumegen.rkt")
```

### The structure of resume
The S-Expression is easy to describe structured content. A minimal resume must contain your name and contacts.
```racket
(resume <yourname>
  (contacts '(<method> <address>)))
```

To add more contact method:
```racket
(resume <yourname>
  (contacts '(<method1> <address1>)
            '(<method2> <address2>)))
```

The most resumes have the following contents:
1. Education (type: `education`)
2. Work experiences (type: `work`)
3. Skills (type: `skill`)
4. Personal Projects (type: `project`)
5. Other things (type: `other`)

You also can define them in your resume, the syntax is easy.
```racket
(<type>
  [<attribute> <value>])
```

#### Attributes
##### `name`
The name of company that you working/-ed for, or the college/university name.

#### `content`
The description of your project, or other things you want to show.

#### `url` **only for project**
The link to your project homepage.

#### `span` **only for education and work experience**
The time span of your education or job. usage: `[span <start_date> <end_date>]`.

#### `role` **only for work**
The title of your job and the description of the things that you working for. usage: `[role <title> <contents>]`.

#### Organizations
To make your resume clear, you should organize the contents of it. You can use the `block` the put the same type content into a block.

```racket
(block <blockname>
  (<type> [<attribute> <value>])
  (<type> [<attribute> <value>]))
```

So many words to make your resume professional, like the differences between "Employment History" and "Professional Experience". For a block you should type its name, and the name will be shown in result.

```racket
(rlist <item>
       <item>
       <item>)
```

Use `rlist` to organize your text.

```
(html-link <url> <text>)
```

Use `html-link` to create a hyperlink.

### Example
You can read the `example.rkt` to get more detail. The output result and default stylesheet in the `example` folder.

## Generate resume
When you finished, you can use the command line to generate your resume to HTML file.
```
> racket youfile.rkt > yourfile.html
```

**IMPORTANT: If you are using Microsoft Windows, the encoding of generated file is UTF16, most browser cannot parse it correctly, the stylesheet may not be loaded. You may convert the encoding to UTF8 manually.**

## Converting to PDF
There have so many ways you can convert a web page to PDF. If you are using Microsoft Windows 10/11, "Print to PDF" is good choice, but the link will be changed to unclickable.

[`pandoc`](https://pandoc.org/) and [`wkhtmltopdf`](https://wkhtmltopdf.org/) are two crossplatform solutions. They can hold the clickable hyperlink, to make your resume more usful.
