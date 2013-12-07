[0.2.3](https://github.com/ljharb/node-json-file/releases/tag/v0.2.3) / 2013-12-07
==================
  * ensure raw file contents are compared as a string - in node 0.6 and 0.8, it's a Buffer.
  * Updating `tape`
  * Adding some badges to `README`

[0.2.2](https://github.com/ljharb/node-json-file/releases/tag/v0.2.2) / 2013-10-14
==================
  * Adding a `CHANGELOG`
  * Updating `tape`
  * Pass the utf8 encoding option to avoid the extra step of converting a buffer to a string

[0.2.1](https://github.com/ljharb/node-json-file/releases/tag/v0.2.1) / 2013-09-17
==================
  * Correcting `README`
  * Adding a `LICENSE` file
  * Updating `tape`

[0.2.0](https://github.com/ljharb/node-json-file/releases/tag/v0.2.0) / 2013-08-20
==================
  * Updating `README`
  * Removing the filename requirement to `save`
  * Pass in the filename when constructing an object

[0.1.1](https://github.com/ljharb/node-json-file/releases/tag/v0.1.1) / 2013-08-20
==================
  * Updating `node.extend`, `foreach`, `object-keys`

[0.1.0](https://github.com/ljharb/node-json-file/releases/tag/v0.1.0) / 2013-08-14
==================
  * Updating dependencies
  * Denesting tests so they pass
  * Fixing incorrect variable references
  * Removing incorrect test end calls
  * Fixing the filename to not rely on process.cwd() being automatically added. Fixes [#4](https://github.com/ljharb/node-json-file/issues/4)
  * Merge pull request [#1](https://github.com/ljharb/node-json-file/issues/1) from Raynos/patch-1
    setImmediate is not needed
  * Fixing tests - however, nested tests don't work in `tape` 1.0.2
  * Using tape again!
  * Merge pull request [#2](https://github.com/ljharb/node-json-file/issues/2) from Raynos/patch-2
    Read the file I give you. Dont assume cwd()
  * setImmediate is not needed

[0.0.8](https://github.com/ljharb/node-json-file/releases/tag/v0.0.8) / 2013-04-24
==================
  * Using `tap` instead of `tape`
  * Updating the error tests

[0.0.7](https://github.com/ljharb/node-json-file/releases/tag/v0.0.7) / 2013-04-17
==================
  * Updating `node.extend` and `is`

[0.0.6](https://github.com/ljharb/node-json-file/releases/tag/v0.0.6) / 2013-04-17
==================
  * Updating `is`

[0.0.5](https://github.com/ljharb/node-json-file/releases/tag/v0.0.5) / 2013-04-14
==================
  * Updating `node.extend` and `is`

[0.0.4](https://github.com/ljharb/node-json-file/releases/tag/v0.0.4) / 2013-04-08
==================
  * Updating `node.extend`, `tape`, `foreach`
  * Fixing a test

[0.0.3](https://github.com/ljharb/node-json-file/releases/tag/v0.0.3) / 2013-04-07
==================
  * Using `is` instead of `is-extended`
  * Using `foreach` shim instead of native forEach

[0.0.2](https://github.com/ljharb/node-json-file/releases/tag/v0.0.2) / 2013-04-03
==================
  * Adding dependency status; moving links to an index at the bottom
  * Fixing link in README
  * Updating `is-extended`; removing unused module
  * Adding an `npm` version badge

[0.0.1](https://github.com/ljharb/node-json-file/releases/tag/v0.0.1) / 2013-04-01
==================
  * Initial implementation

