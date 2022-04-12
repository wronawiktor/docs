# Lab Exercises for HA Control Plane


## Exercise 0 - Make Kubernetes cluster fully High-Available

* On host k8s-host install haproxy package

```shell
sudo apt-get install haproxy
```

* Edit `/etc/haproxy/haproxy.cfg` on k8s-host

```
global
	log /dev/log	local0
	log /dev/log	local1 notice
	chroot /var/lib/haproxy
	stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
	stats timeout 30s
	user haproxy
	group haproxy
	daemon

	# Default SSL material locations
	ca-base /etc/ssl/certs
	crt-base /etc/ssl/private

	# Default ciphers to use on SSL-enabled listening sockets.
	# For more information, see ciphers(1SSL). This list is from:
	#  https://hynek.me/articles/hardening-your-web-servers-ssl-ciphers/
	# An alternative list with additional directives can be obtained from
	#  https://mozilla.github.io/server-side-tls/ssl-config-generator/?server=haproxy
	ssl-default-bind-ciphers ECDH+AESGCM:DH+AESGCM:ECDH+AES256:DH+AES256:ECDH+AES128:DH+AES:RSA+AESGCM:RSA+AES:!aNULL:!MD5:!DSS
	ssl-default-bind-options no-sslv3

defaults
	log	global
	mode	tcp
	option	tcplog
	option	dontlognull
        timeout connect 5000
        timeout client  50000
        timeout server  50000
	errorfile 400 /etc/haproxy/errors/400.http
	errorfile 403 /etc/haproxy/errors/403.http
	errorfile 408 /etc/haproxy/errors/408.http
	errorfile 500 /etc/haproxy/errors/500.http
	errorfile 502 /etc/haproxy/errors/502.http
	errorfile 503 /etc/haproxy/errors/503.http
	errorfile 504 /etc/haproxy/errors/504.http

frontend proxynode
  bind *:80
  bind *:6443
  stats uri /proxystats
  default_backend k8sMasters

backend k8sMasters
  balance roundrobin
  server k8s-master1 10.168.0.101:6443 check
  server k8s-master2 10.168.0.102:6443 check
  server k8s-master3 10.168.0.103:6443 check

listen stats
  bind :9999
  mode http
  stats enable
  stats hide-version
  stats uri /stats
```

* Restart HAproxy service

```shell
sudo systemctl restart haproxy
```

* Open tunnel and check HA proxy stats

```shell
ssh -l tux -p <PORT> <LAB_SERVER_IP> -L 9999:10.168.0.1:9999
```

Localy on your desktop open in webrowser

http://localhost:9999/stats

* Now we can switch in all /etc/hosts  on all nodes k8smaster from 10.168.0.101 -> 10.168.0.1

Output from /etc/hosts

```

...
10.168.0.1 k8smaster
...

```

