## [3.0.1](https://github.com/seleb/strand/compare/v3.0.0...v3.0.1) (2024-07-06)


### Bug Fixes

* renderer doesn't have to return promises ([762715c](https://github.com/seleb/strand/commit/762715cec930d8b9476d079a2079799fb162552b))

# [3.0.0](https://github.com/seleb/strand/compare/v2.0.1...v3.0.0) (2024-07-06)


### Features

* remove `busy` flag + checks ([7d63e21](https://github.com/seleb/strand/commit/7d63e2183b7210aa2d4105928672689c5c4e866f))


### BREAKING CHANGES

* The interpreter no longer tracks a `busy` state. It is up to the renderer whether it is interruptible or not, which made this unnecessarily prescriptive.

## [2.0.1](https://github.com/seleb/strand/compare/v2.0.0...v2.0.1) (2023-01-03)


### Bug Fixes

* autolink sugar interfering with if blocks ([c95e9a4](https://github.com/seleb/strand/commit/c95e9a4c1108f1a558466dd07dcdcde0865cbc2f))


### Reverts

* Revert "chore: remove unnecessary branch" ([f5e5226](https://github.com/seleb/strand/commit/f5e5226bfb7310011b3ebdf2ce0462c5f79af7e3))

# [2.0.0](https://github.com/seleb/strand/compare/v1.2.1...v2.0.0) (2023-01-03)


### Bug Fixes

* **deps:** update `json5` ([96882a1](https://github.com/seleb/strand/commit/96882a1fbdb8cb74a2c2e7b7187214a945b6aff3))
* **deps:** update babel + rollup ([cc2748f](https://github.com/seleb/strand/commit/cc2748fc31db71c25d41c4f5f5f916de321d71d2))


### Features

* add automatic link sugar `>` and `>text` ([f4cd51a](https://github.com/seleb/strand/commit/f4cd51ac7a5a1be898ae5e5cc3d57e423256b01f))
* support `[[link>target]]` sugar ([12d32d6](https://github.com/seleb/strand/commit/12d32d6ba20b1c732eb4fbe63015b84fc3187971))


### BREAKING CHANGES

* The new automatic link sugar `>` and `>text` mean that any lines of plain text which started with `>` will now be treated as an autolink. To fix these cases, the character can be escaped with `\>`.
* Actions now support a shorthand for writing links that redirect to a passage that doesn't match their text, e.g. `[[some text>some target]]`. This will break any shorthand links that happened to use the `>` character for display, e.g. `[[continue -->]]`. To fix cases like this, you can rewrite the passage in the longer form, e.g. `[[continue -->|this.goto('continue -->')]]`

## [1.2.1](https://github.com/seleb/strand/compare/v1.2.0...v1.2.1) (2022-12-03)


### Bug Fixes

* make logger optional in constructor parameter types ([1460ed5](https://github.com/seleb/strand/commit/1460ed5ab0e34ff8ec981fef2035131c19b1b9e8))

# [1.2.0](https://github.com/seleb/strand/compare/v1.1.1...v1.2.0) (2022-12-02)


### Features

* add optional `logger` parameter ([8d30f01](https://github.com/seleb/strand/commit/8d30f01fdf33ab32392c4efd26e52b01a0bd8d37))

## [1.1.1](https://github.com/seleb/strand/compare/v1.1.0...v1.1.1) (2022-12-02)


### Bug Fixes

* add `currentPassage` to type definition ([bdaa63b](https://github.com/seleb/strand/commit/bdaa63b005ea8fb302dadb5c46e43528bc5c14fe))
* add missing `passages` field to type definition ([0082300](https://github.com/seleb/strand/commit/00823005f124f70e254e6f5326f7958ba23d2d10))
* incorrect `passages` type definition ([98b5d23](https://github.com/seleb/strand/commit/98b5d23dd35071394dcc711547c78e7054864d93))
* incorrect `passages` type definition ([64bc3f7](https://github.com/seleb/strand/commit/64bc3f7e7b8a5a29fe91ce536f36d80c62a395d9))
