capsulejs
=========

Easy deploy code from git (bitbucket/github) to you web server

[![NPM](https://nodei.co/npm/capsulejs.png)](https://nodei.co/npm/capsulejs/)


Install
---

```sh
npm install -g capsulejs

```

Directory structure illustration 
---
```sh
  var/
  └──web/
      ├───test1.com/            <--- Document root (simlink to /var/web/source_test1/2016-01-07_09-09-09)
      ├───test2.com/            <--- Document root (simlink to /varweb/source_test1/2016-03-07_09-09-09)
      ├───source_test1/
      │   ├───2016-01-02_09-00-00/
      │   ├───2016-01-05_09-09-09/
      │   └───2016-01-07_09-09-09/
      └───source_test2/
          └───2016-03-07_09-09-09/

```

Initial configuration
---
```sh
capsulejs init
```

** Capsulejs should generate capsule.json in current folder
### default capsule.json

```json
    {
        "prod" : {                  //Specify collection name
            "server": {
                "host": [],         // Ex. ["127.0.0.1", "127.0.0.1"]
                "user": "",
                "password": "",     // ssh login password when set private_key is blank
                "private_key": "",  // Private key path when set password is blank
                "location": "",     // Git clone to container folder Ex. "/var/web/source_test1" or "/var/web/source_test2"
                "simlink": "",      // Webserver document root each domain Ex. "/var/web/test1.com" or "/var/web/test2.com"
                "user_group": "",   // User group Ex: www-data:www-data
                "version_limit": 3  // Maximum file version on server
            },
            "repository": {
                "host": "",         //Git url Ex: ssh://git@github.com/foo/bar.git
                "branch": "master"
            },
            "command": {
                "post": {
                    "Command_name": ""  //Add unix command run after cloned; use {dir} = current directory
                    //Ex. "config": "mv {dir}/application/cconfig_production.php {dir}/application/cconfig.php"
                }
            }
        }
    }
```

Deploy from git
---
```sh
capsulejs deploy <collection name>
```
### Example code

```sh
capsulejs deploy prod
```

Rollback to previous version
---
```sh
capsulejs rollback <collection name>
```

### Example code
```sh
capsulejs rollback prod
```


License
---

MIT

Changelogs
---
#### 1.3
- Server ip config with array
- Remove muti collaction deploy
- Add limit verions store in server
- 

#### 1.2.3
- Deploy multi server

#### 1.2.2
- Support ssh passphrase

#### 1.2.1
- Support ssh private key

#### 1.1.2
- Fix depth for git clone

#### 1.1.1
- Fix delete dir error when rollback

#### 1.1.0
- Add post command execute after clone

#### 1.0.2
- Add document and to README.md

#### 1.0.1
- Start project and publish to npm server
