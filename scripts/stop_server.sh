#!/bin/bash
sudo rm -rf app.config.json
cd /home/ec2-user
echo '{
  apps : [
    {
      name      : "esgwize-client",
      script    : "npx",
      interpreter: "none",
      args: "serve -s esgwize -p 3000"
    }
  ]
}' > app.config.json
sudo rm -rf esgwize
mkdir /home/ec2-user/esgwize
cd /tmp/esgwize/build/
sudo cp -r /tmp/esgwize/build/* /home/ec2-user/esgwize
cd /home/ec2-user/
sudo chown -R ec2-user:ec2-user esgwize
cd /tmp/esgwize/
sudo chmod -R ug+rwx scripts appspec.yml
sudo cp -r scripts appspec.yml /home/ec2-user/esgwize
cd /home/ec2-user/
pm2 stop app.config.json
pm2 delete esgwize-client

