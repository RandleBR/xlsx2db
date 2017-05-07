##  Symlink to from the /OS400/db2i to the node_modules 

ln   /QOpensys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i   /QOpenSys/QIBM/ProdData/OPS/Node6/os400/db2i

## Create New package.json file

Create file in  /QOpensys/QIBM/ProdData/OPS/Node6/lib/node_modules/db2i/package.json

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

```
npm link
```

## Using the link in a node project

In project directory, exeute :

```
npm link db2i
```

Now in project the require can be 

```
modulename = require('db2i/lib/db2a')
```

