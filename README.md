# strand

![strand icon](./strandIcon.png)

Basic narrative scripting + interpreter inspired by Twine

```sh
npm i strand-core
```

## language

note: anywhere `JS` appears here, it is embedded javascript to be evaluated in the context of the interpreter instance.

- `::string`: Marks the beginning of a passage with the title `string`. Between this line and the next passage title/EOF will be the body of the passage.
- `[[string|JS]]`: Creates an action node with the text `string` and action `JS`. Expected use for this is to create buttons, links, etc and have the renderer tell the interpreter to evaluate the action on click
- `<<do JS>>`: Evaluates `JS` when the passage is executed
- `<<if JS>><<elseif JS>><<endif>>`: Evaluates `JS` inside the "if". If it evaluates to a truthy value, execution will continue along that branch and the rest will be ignored. If it evaluates to a falsey value, the same is repeated for each "elseif".
- `<<print JS>>`: Evaluates `JS` when the passage is executed, and creates a text node with the evaluated value
- anything else: Creates a text node

### shorthands

- `[[link]]`: Shorthand for `[[link|this.goto("link")]]`
- `[[link>target]]`: Shorthand for `[[link|this.goto("target")]]`
- `>` or `>string`: Shorthand for a "passage break", i.e. adds a link with the text `string` and an automatically generated passage heading. Expected use for this is breaking up long passages into multiple purely linear interactions without needing to mark up each one individually
- `<<set var=val>>`: Shorthand for `<<do this.var=val>>`
- `<<else>>`: Shorthand for `<<elseif true>>`

[VSCode extension](https://marketplace.visualstudio.com/items?itemName=seansleblanc.strand-vscode)

[Example renderer](https://github.com/seleb/strand-htmlrenderer)

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
