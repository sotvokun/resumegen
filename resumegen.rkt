#lang racket/base

#|-----------|#
#| Utilities |#
#|-----------|#

(define _list->proc->string
  (lambda (list proc str)
    (if (null? list)
      str
      (_list->proc->string 
        (cdr list) 
        proc
        (string-append
          str
          (proc (car list)))))))

(define list->proc->string
  (lambda (list proc)
    (_list->proc->string list proc "")))

#|----------------|#
#| HTML Converter |#
#|----------------|#

; prop - ((name value)...)
(define html-prop
  (lambda (prop)
    (list->proc->string
      prop
      (lambda (x)
        (string-append " "
                       (symbol->string (car x))
                       "=\""
                       (if (string? (cadr x))
                         (cadr x)
                         (symbol->string (cadr x)))
                       "\"")))))

(define html-tag
  (lambda (tag prop content)
    (string-append "<" tag (html-prop prop) ">"
                   (cond ((string? content) content)
                         ((list? content) (list->proc->string content (lambda (x) x))))
                   "</" tag ">")))

(define html-list-item
  (lambda (list)
    (list->proc->string
      list
      (lambda (x)
        (html-tag "li"
                  '()
                  (if (string? x)
                    x
                    (symbol->string x)))))))


(define html-list-unordered
  (lambda (list)
    (html-tag "ul" '() (html-list-item list))))

(define html-link
  (lambda (link text)
    (if (null? link)
      (html-tag "a" '((href "#")) text)
      (html-tag "a" `((href ,link)) text ))))

(define div-helper
  (lambda (name content)
    (html-tag "div" `([class ,name]) content)))

(define inner-block
  (lambda (name prop)
    (div-helper name
                (list->proc->string prop
                                    (lambda (x)
                                      (div-helper
                                        (car x)
                                        (if (string? (cadr x))
                                          (cadr x)
                                          (symbol->string (cadr x)))))))))

#|--------------------|#
#|  SYNTAX OF RESUME  |#
#|--------------------|#

(provide resume)
(provide contacts)
(provide name)
(provide content)
(provide url)
(provide span)
(provide role)
(provide education)
(provide work)
(provide project)
(provide skill)
(provide other)
(provide rlist)
(provide block)

(require racket/string)
(define-syntax contacts
  (syntax-rules ()
    ((_ item ...)
     (html-tag "ul" '() 
               (list->proc->string (list item ...)
                                   (lambda (x)
                                     (string-append "<li>"
                                                    (symbol->string (car x)) 
                                                    ":"
                                                    (if (string-contains? (cadr x) "@")
                                                      (html-link (string-append "mailto:" (cadr x)) (cadr x))
                                                      (cadr x))
                                                    "</li>")))))))


(define-syntax name
  (syntax-rules ()
    ((_ n)
     (list 'name n))))

(define-syntax content
  (syntax-rules ()
    ((_ c ...)
     (list 'content (string-append c ...)))))

(define-syntax url
  (syntax-rules ()
    ((_ n)
     (list 'url (html-link n n)))))

(define-syntax span
  (syntax-rules ()
    ((_ start end)
     (list 'span (string-append start " - " end)))))

(define-syntax role
  (syntax-rules ()
    ((_ name content ...)
     (list 'role (string-append (div-helper "name" name)
                                (div-helper "content" 
                                            (string-append content
                                                           ...)))))))

(define-syntax education
  (syntax-rules ()
    ((_ prop ...)
     (inner-block "edu" (list prop ...)))))

(define-syntax work
  (syntax-rules ()
    ((_ prop ...)
     (inner-block "work" (list prop ...)))))

(define-syntax project
  (syntax-rules ()
    ((_ prop ...)
     (inner-block "project" (list prop ...)))))

(define-syntax skill
  (syntax-rules ()
    ((_ prop ...)
     (inner-block "skill" (list prop ...)))))

(define-syntax other
  (syntax-rules ()
    ((_ prop ...)
     (inner-block "other" (list prop ...)))))

(define-syntax block
  (syntax-rules ()
    ((_ title prop ...)
     (div-helper "block"
                 (string-append (div-helper "title" title)
                                (list->proc->string (list prop ...) (lambda (x) x)))))))

(define-syntax rlist
  (syntax-rules ()
    ((_ item ...)
     (html-list-unordered (list item ...)))))

(define-syntax resume
  (syntax-rules ()
    ((_ name contact block ...)
     (display
       (string-append
         "<!DOCTYPE html>"
         (html-tag "html" '() `(
                                ,(html-tag "head" '() (list (html-tag "meta" '((charset "UTF-8")) "")
                                                            (html-tag "link" '((rel "stylesheet") 
                                                                               (href "resume.css")) "")))
                                ,(html-tag "body" '() (list (div-helper "head" (string-append
                                                                                 (div-helper "name" name)
                                                                                 (div-helper "contact" contact)))
                                                            block
                                                            ...)))))))))
