#!/bin/sh

# keystone-manage fernet_setup     --keystone-user keystone --keystone-group keystone
# keystone-manage credential_setup --keystone-user keystone --keystone-group keystone

keystone-manage bootstrap --bootstrap-password password \
    --bootstrap-admin-url    http://controller.ldy:5000/v3 \
    --bootstrap-internal-url http://controller.ldy:5000/v3 \
    --bootstrap-public-url   http://controller.ldy:5000/v3 \
    --bootstrap-region-id    RegionOne

