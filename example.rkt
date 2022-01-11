#lang racket/base
(require "resumegen.rkt")

(resume 
  "Exa Example"
  (contacts 
    '[E-mail "exa@example.com"] 
    '[Phone "123-456-7890"]
    '[LinkedIn "linkedin.com/in/exa_example"])
  (block "Education"
    (education 
      [name "University of Maryland"]
      [span "September 1996" "May 2001"]
      [content "Masters of Computer Science"
               [rlist
                 "Graduated Summa Cum Laude"
                 "Member of Student Association of Computer Science"
                 "Managed a student project to organize a conference for 50+ professionals"]]))
  (block "Experience"
    (work
      [name "Seton Hospital"]
      [span "September 2004" "November 2006"]
      [role "Junior Project Manager"
            [rlist 
              "Streamlined IT logistics and administration operation cutting costs by 25%."
              "Diagnosed problems with hardware and operating systems and implemented new solutions."
              "Maintained the user database of over 30000 patients."
              "Managed project for lean training for all IT Support Officers."]])
    (work
      [name "Seton Hospital"]
      [span "December 2006" "Present"]
      [role "Senior Project Manager"
            [rlist
              "Oversaw all major hospital IT projects for 10+ years."
              "Responsible for creating, improving, and developing IT project strategies."
              "implemented the highly successful Lean Training and Six Sigma projects for all employees. Cut costs by 32% in less than six months."
              "I reduced the costs of IT infrastructure maintenance by 5% in 2015 by successfully rebuilding the infrastructure."]]))

  (block "Skills"
    (skill 
      [name "Business Process Improvement"]
      [content "history of successful innovations leading to cost sawings."])
    (skill
      [name "Vendor Management"]
      [content "managing vendors in projects with budget over $1000000."])
    (skill
      [name "Project Scheduling"]
      [content "over 90% of projects led were finished in due time."])
    (skill
      [name "Sales Analysis"]
      [content "background in IT Sales with deep understanding of negootiating contracts"]))

  (block "Projects"
    (project
      [name "PIHSystem"]
      [url "https://exa.example.com/PIHSys"]
      [content "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. "]))

  (block "Others"
    (other
      [name "Awards"]
      [content "Employee of the month, May 2005"])
    (other
      [name "Certifications"]
      [content "Certified Construction Manager (CCM) 2008"])))
