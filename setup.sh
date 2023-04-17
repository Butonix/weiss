

# Empty the .env file
echo "" >  .env.local

# Generate hash for API key
md5="weiss-random-hash"
hash="$(echo -n "$md5" | openssl rand -hex 20 )"


# Insert value to .env file
cat << EOF >> .env.local
NEXT_PUBLIC_DB_HOST="localhost"
NEXT_PUBLIC_DB_NAME="weiss"
NEXT_PUBLIC_DB_PORT=28015
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_API_KEY="$hash"
NEXT_PUBLIC_CLIENT_ORIGINS="localhost:2323"
EOF

echo "" >  .env.local

echo -n "Enter domain or subdomain: " 
read domain

cat << EOF >> /etc/nginx/sites-available/weiss.conf
server {
        listen 80;
        server_name $domain;

        location / {
                proxy_pass             http://127.0.0.1:2323;
                proxy_read_timeout     60;
                proxy_connect_timeout  60;
                proxy_redirect         off;

                # Allow the use of websockets
                proxy_http_version 1.1;
                proxy_set_header Upgrade "$http_upgrade";
                proxy_set_header Connection 'upgrade';
                proxy_set_header Host $host;
                proxy_cache_bypass $http_upgrade;
        }

         location ^~ /storage/ {
        alias /var/www/html/weiss/public/storage/;
        sendfile           on;
        sendfile_max_chunk 5m;
    }
}
EOF

sudo ln -s /etc/nginx/sites-available/weiss.conf /etc/nginx/sites-enabled/weiss.conf

if ! type "man" > /dev/null; then
  echo "Installing ssl certificate for $domain"
  sudo certbot certonly --standalone -d $domain
fi
