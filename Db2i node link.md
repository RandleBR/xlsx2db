##  Symlink to from the /OS400/db2i to the node_modules 
The IBM DB2i Async Addon driver for Node4 / Node6  

```
ln -s  /QOpenSys/QIBM/ProdData/OPS/Node4/os400/db2i/              
          /QOpensys/QIBM/ProdData/OPS/Node4/lib/node_modules/db2i/

ln -s  /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i/              
          /QOpensys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i/
```
## Create New package.json file

Create file in  
/QOpensys/QIBM/ProdData/OPS/Node4/lib/node_modules/db2i/package.json
and
/QOpensys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i/package.json

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

from directory /QOpenSys/QIBM/ProdData/OPS/Node6/node_modules/db2i :
repeat for Node4

```
npm link
```

## Using the link in a node project

In project each project directory, exeute :

```
npm link db2i
```

The project require() can be be be shortened (and does not include the node version)

```
modulename = require('db2i/lib/db2a')
```

