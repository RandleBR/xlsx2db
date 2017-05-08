# Using npm with the IBM DB2i driver 

The IBM DB2i Async Addon driver for Node4 and Node6 can be 'required()' in a node project by specifying the ENTIRE path of:

```
 var modName = require('/QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/db2a')
```

Note that the Node version is part of the path name, so any change in Node version forces a change to the project source.  The module db2a.js 
contains a module exports as:

```
module.exports = require('../bin/db2ia');
```

which forces the user of the module to also have the same ../bin and ../lib directory structure so the db2ia binary can be located.

The driver is not a published public package, so 'npm install db2a' can not be used.

One solution to using the IBM DB2i node drive is to use npm link. To eliminate
the Node version from the directory path, a symbolic link from the DB2i driver 
directory to the Node global node_modules directory is needed:

```
ln -s  /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/              
          /QOpensys/QIBM/ProdData/OPS/Node4/lib/node_modules/db2i/

and also for Node4 if installed

ln -s  /QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/              
          /QOpensys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i/
```
## Create a new package.json file

Create file in  
/QOpensys/QIBM/ProdData/OPS/Node4/lib/node_modules/db2i/package.json
and
/QOpensys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i/package.json
if Node4 installed:  
```
{ 
  "name": "db2i",                                  
  "version": "1.0.0",                              
  "description": "Library of the DB2i Async Addon",
  "main": "./lib/db2a.js",                         
  "license": "Licensed Materials - Property of IBM"
}

```
## Create npm global link

```
cd /QOpenSys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i
npm link
```
repeat for Node4 if installed.

## Using the link in a node project

In each node project directory that requires the IBM DB2i module, execute :

```
npm link db2i
```
This creates a symbolic link in the project's node_modules directory. 
The project require() can be be be shortened (so it does not include the node version)

```
var modulename = require('db2i/lib/db2a')
```

