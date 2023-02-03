#!/bin/bash
cd /home/ec2-user/
pm2 start app.config.json
cd /opt/codedeploy-agent/deployment-root/
sudo rm -rf *
cd /tmp/
sudo rm -rf *
