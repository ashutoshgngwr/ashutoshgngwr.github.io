---
image: false
layout: post
mathjax: false
title: Setting up a self-managed PostgreSQL server on AWS EC2 for a small-scale application
---

Recently, I moved Noice to a subscription-based service model. With it came a
lot of development and cost optimisation challenges. One of these challenges was
hosting a database for the backend service. I chose PostgreSQL because of my
previous experience with it. I also had unused AWS credits, so I deliberately
limited my options to either a self-managed server on AWS EC2 or a managed
server on AWS RDS. Being a small-scale operation, RDS didn't seem like a
cost-effective solution. Comparing the on-demand cost of `m1.large` instances
for EC2 and RDS yields a 40% markup in RDS pricing. Therefore, I started
exploring the self-managed option.

During the initial development cycle, I started with a spot machine running
PostgreSQL 14. I needed it to develop and test the backend service, but it also
gave me the required experience to run a production instance. When setting up
the production instance, I had the following goals.

1. **Set up a single availability zone configuration**: we can suffer a little
   downtime without seriously hurting our reputation.

1. **Automate periodic physical backups**: If we need, we can quickly spin up
   new replicas ready to take over the production load.

1. **Continuous WAL archiving**: We can minimise the data loss when restoring
   the latest physical backup on a replica, bridging the gap since the last
   checkpoint using the archived WAL.

Setting up a single availability zone configuration on EC2 is easy. I spun up an
on-demand instance running on Debian 11 with two EBS volumes, one for the root
partition and another for PostgreSQL data. Once the machine was ready, I mounted
the data volume and added it to the filesystem table to automatically mount it
on reboots.

```bash
# find the device id for the data volume (assuming `nvme1n1` in this example).
lsblk

# unmount the device if it is mounted.
sudo umount /dev/nvme1n1

# create a new filesystem on the block device.
sudo mkfs.ext4 /dev/nvme1n1

# create the mountpoint (PostgreSQL data directory).
sudo mkdir -p /var/lib/postgresql

# mount the block device.
sudo mount /dev/nvme1n1 /var/lib/postgresql

# add the mount point to the filesystem table.
echo "/dev/nvme1n1  /var/lib/postgresql auto  defaults,nofail 0 2" | sudo tee -a /etc/fstab
```

Then, I followed the [official guide to install PostgreSQL on
Debian](https://www.postgresql.org/download/linux/debian/). Once the database
server was up and running, I installed [wal-g](https://github.com/wal-g/wal-g).

wal-g is an archival restoration tool for PostgreSQL, MySQL/MariaDB, and MS SQL
Server. Configuring wal-g was a bit tricky. It accepts its configuration from
environment variables. Since I am not using a secrets management solution, I
created a wrapper script to read values from files and pass them as environment
variables to the wal-g binary. The script doesn't inject AWS credentials; I'm
using an instance role for authentication instead.

```bash
#!/usr/bin/env bash
# Source for /usr/local/bin/wal-g-helper

env \
  AWS_REGION="$(cat /etc/wal-g/AWS_REGION)" \
  WALG_S3_PREFIX="$(cat /etc/wal-g/S3_PREFIX)" \
  WALG_PREVENT_WAL_OVERWRITE=true \
  PGHOST=/var/run/postgresql \
  /usr/local/bin/wal-g "$@"
```

After configuring wal-g, I created a cron job for physical backups with the
following script. It runs once every day. It checkpoints and then streams the
data to the S3 prefix. It then deletes older backups, retaining the seven most
recent physical backups.

```bash
#!/usr/bin/env bash

set -e

{
  echo;
  echo "-------";
  echo "Starting full back-up ($(date))";
  sudo -u postgres /usr/local/bin/wal-g-helper backup-push /var/lib/postgresql/14/main;
  sudo -u postgres /usr/local/bin/wal-g-helper delete --confirm retain FULL 7;
  sudo -u postgres /usr/local/bin/wal-g-helper delete --confirm garbage;
} >> /var/log/wal-g/backup-push.log 2>&1
```

For WAL archiving, I followed the [official
documentation](https://www.postgresql.org/docs/current/continuous-archiving.html#BACKUP-ARCHIVING-WAL)
to configure the server. I also used this opportunity to tune the default
PostgreSQL configuration using the [Pgtune](https://pgtune.leopard.in.ua/) tool.

```conf
wal_level = replica
archive_mode = on
archive_command = '/usr/local/bin/wal-g-helper wal-push "%p" >> /var/log/wal-g/wal-push.log 2>&1'
archive_timeout = '30min'

# recovery config
restore_command = '/usr/local/bin/wal-g-helper wal-fetch "%f" "%p" >> /var/log/wal-g/wal-fetch.log 2>&1'
```

Next, I restarted the PostgreSQL server for the updated configuration to take
effect.

```console
sudo systemctl restart postgresql.service
```

The instructions for using the backup to spin up a replica or restore an
existing server are simple.

- Stop the PostgreSQL systemd service.

  ```console
  sudo systemctl stop postgresql.service 
  ```

- Remove the data directory and restore the latest full (physical) backup.

  ```console
  sudo rm -rf /var/lib/postgresql/14/main
  sudo -u postgres wal-g-helper backup-fetch /var/lib/postgresql/14/main LATEST
  ```

- Optionally configure a recovery target time and action for performing
  point-in-time recovery using the WAL archive. See
  [this](https://www.postgresql.org/docs/14/runtime-config-wal.html#RUNTIME-CONFIG-WAL-RECOVERY-TARGET).

- Restart the server in recovery mode.

  ```console
  sudo -u postgres touch /var/lib/postgresql/14/main/recovery.signal
  sudo systemctl start postgresql.service
  ```
