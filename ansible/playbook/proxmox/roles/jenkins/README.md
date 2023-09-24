# 

- kubectl logs
- set kubectl config

https://www.orchome.com/16641


## ENV

- vps-admin
  - password
  - username
- tencent-vps-admin
  - password
  - username
- cdn-domain cdn.alomerry.com
- bark-notification-device-alomerry
- bark-notification-device-tobery1
- webhook-trigger-token
- docker-login
  - user
  - password
- k8sconfig


Error: Another active Homebrew update process is already in progress.
Please wait for it to finish or terminate it to continue.
==> Downloading https://formulae.brew.sh/api/formula.jws.json
######################################################################## 100.0%
==> Downloading https://formulae.brew.sh/api/cask.jws.json
######################################################################## 100.0%
==> Upgrading 1 outdated package:
frpc 0.51.1 -> 0.51.3
==> Fetching frpc
==> Downloading https://ghcr.io/v2/homebrew/core/frpc/manifests/0.51.3
######################################################################## 100.0%
==> Downloading https://ghcr.io/v2/homebrew/core/frpc/blobs/sha256:132004b6c5c5f5fed10b2a65e2d3a8983d6b2e34f05959177eb72ebd9e7ce978
==> Downloading from https://pkg-containers.githubusercontent.com/ghcr1/blobs/sha256:132004b6c5c5f5fed10b2a65e2d3a8983d6b2e34f05959177eb72ebd9e7ce978?se=2023-09-19T23%3A40%3A00Z&sig=zZyiiMXqEJGJazWPX%2Be2awXqnf3LMGtuuUERwDZYEb
######################################################################## 100.0%
==> Upgrading frpc
  0.51.1 -> 0.51.3

==> Pouring frpc--0.51.3.arm64_ventura.bottle.tar.gz
==> Caveats
To restart frpc after an upgrade:
  brew services restart frpc
Or, if you don't want/need a background service you can just run:
  /opt/homebrew/opt/frpc/bin/frpc -c /opt/homebrew/etc/frp/frpc.ini
==> Summary
🍺  /opt/homebrew/Cellar/frpc/0.51.3: 9 files, 14.0MB
==> Running `brew cleanup frpc`...
Disable this behaviour by setting HOMEBREW_NO_INSTALL_CLEANUP.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
Removing: /opt/homebrew/Cellar/frpc/0.51.1... (9 files, 13.2MB)