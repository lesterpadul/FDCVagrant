# control nodejs
echo "Restart node server"
cd /var/www/NativeCamp-NJSv2 && pm2 start server.js

# control redis
echo "Restart redis"
redis-server