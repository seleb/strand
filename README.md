# strand
Basic narrative scripting + interpreter inspired by Twine

## language
note: anywhere `JS` appears here, it is embedded javascript to be evaluated in the context of the interpreter instance.
- `::string`: Marks the beginning of a passage with the title `string`. Between this line and the next passage title/EOF will be the body of the passage. 
- `[[string|JS]]`: Creates an action node with the text `string` and action `JS`. Expected use for this is to create buttons, links, etc and have the renderer tell the interpreter to evaluate the action on click
- `[[link]]`: Shorthand for `[[link|this.goto("link")]]`
- `<<do JS>>`: Evaluates `JS` when the passage is executed
- `<<set var=val>>`: Shorthand for `<<do this.var=val>>`
- `<<if JS>><<elseif JS>><<endif>>`: Evaluates `JS` inside the "if". If it evaluates to a truthy value, execution will continue along that branch and the rest will be ignored. If it evaluates to a falsey value, the same is repeated for each "elseif".
- `<<else>>`: Shorthand for `<<elseif true>>`
- anything else: Creates a text node

### example
```
::start
some text with a [[shorthand link]] and a longform [[action|this.goto("other passage")]]

::shorthand link
<<set linkClicked=true>>this passage appears when you click the link
[[back|this.back()]]

::other passage
<<if this.linkClicked>>
this text shows up if you visited the shorthand link passage before getting here
<<else>>
this text shows up if you didn't
<<endif>>
```
