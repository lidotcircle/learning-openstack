## learn openstack


experiments run in ubuntu server 20.04 (LTS).
```bash
$ uname -a
Linux xxxxxx 5.4.0-73-generic #82-Ubuntu SMP Wed Apr 14 17:39:42 UTC 2021 x86_64 x86_64 x86_64 GNU/Linux
```


### installing keystone

#### 1. install mysql and memcached

using docker, refer [docker-compose.yaml](./docker-compose.yaml).

mysql setup contains an [initialized file](./mysql/keystone.sql)
```sql
CREATE DATABASE keystone;

CREATE USER 'keystone'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON keystone.* TO 'keystone'@'%';
```


#### 2. install keystone, apache2, libapache2-mod-wsgi-py3 and configure

```bash
sudo apt install keystone apache2 libapache2-mod-wsgi-py3
```

```conf
# /etc/keystone/keystone.conf

...
connnection = mysql+pymysql://keystone:password@controller.xyz/keystone
...

provier = fernet
```

```hosts
# /etc/hosts

127.0.0.1 controller.xyz
```

```conf
# /etc/apache2/apache2.conf

ServerName controller.xyz
```

```conf
# /etc/apache2/sites-enabled/keystone.conf

Listen 5000

<VirtualHost *:5000>
    ServerName controller.ldy
    WSGIScriptAlias / /usr/bin/keystone-wsgi-public
    WSGIDaemonProcess keystone-public processes=5 threads=1 user=keystone group=keystone display-name=%{GROUP}
    WSGIProcessGroup keystone-public
    WSGIApplicationGroup %{GLOBAL}
    WSGIPassAuthorization On
    LimitRequestBody 114688

    <IfVersion >= 2.4>
      ErrorLogFormat "%{cu}t %M"
    </IfVersion>

    ErrorLog /var/log/apache2/keystone.log
    CustomLog /var/log/apache2/keystone_access.log combined

    <Directory /usr/bin>
        <IfVersion >= 2.4>
            Require all granted
        </IfVersion>
        <IfVersion < 2.4>
            Order allow,deny
            Allow from all
        </IfVersion>
    </Directory>
</VirtualHost>

Alias /identity /usr/bin/keystone-wsgi-public
<Location /identity>
    SetHandler wsgi-script
    Options +ExecCGI

    WSGIProcessGroup keystone-public
    WSGIApplicationGroup %{GLOBAL}
    WSGIPassAuthorization On
</Location>
```

Then initialize sql database with
```bash
# su -s /bin/sh -c "keystone-manage db_sync" keystone
```

Initialize Fernet key repositories
```bash
# keystone-manage fernet_setup --keystone-user keystone --keystone-group keystone
# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone
```

Bootstrap keystone service, below command will insert record into **endpoint table** and **region table** respectively
```bash
# keystone-manage bootstrap --bootstrap-password password \
    --bootstrap-admin-url    http://controller.xyz:5000/v3 \
    --bootstrap-internal-url http://controller.xyz:5000/v3 \
    --bootstrap-public-url   http://controller.xyz:5000/v3 \
    --bootstrap-region-id    RegionOne
```

Restart apache2
```bash
$ sudo systemctl restart apache2
```

#### 3. test deployment

set environment variables
```bash
export OS_USERNAME=admin
export OS_PASSWORD=password
export OS_PROJECT_NAME=admin
export OS_USER_DOMAIN_NAME=Default
export OS_PROJECT_DOMAIN_NAME=Default
export OS_AUTH_URL=http://controller.xyz:5000/v3
export OS_IDENTITY_API_VERSION=3
```

install openstack package.
list domain, project, user, role
```bash
openstack domain list
...

openstack project list
...

openstack user list
...

openstack role list
```

to do something like creating new projects, new users and roles


### install horizon

just refer [official document](https://docs.openstack.org/horizon/stein/install/install-ubuntu.html)

