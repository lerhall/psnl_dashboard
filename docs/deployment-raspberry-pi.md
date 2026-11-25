# Running on the Raspberry Pi 5

Target: Raspberry Pi OS (64-bit, Bookworm or later), running the production
build as a systemd service that starts on boot.

## 1. One-time setup

```bash
# Node 24 LTS (NodeSource); or use nvm/fnm if you prefer
curl -fsSL https://deb.nodesource.com/setup_24.x | sudo -E bash -
sudo apt install -y nodejs git

# pnpm, pinned via package.json "devEngines"
sudo npm install -g pnpm

# Make the Pi's clock/timezone right (the app uses DASHBOARD_TIMEZONE anyway)
sudo timedatectl set-timezone Europe/London
```

## 2. Get the code and build

```bash
git clone <your repo url> ~/psnl_dashboard
cd ~/psnl_dashboard
pnpm install --frozen-lockfile
cp .env.example .env.local && nano .env.local   # Supabase + calendar links
pnpm build
pnpm start            # test it: http://<pi-ip>:3000, Ctrl+C when happy
```

The build takes a minute or two on a Pi 5. Make sure the 4/8 GB model isn't
also running anything memory-hungry.

## 3. Run it as a service

`/etc/systemd/system/dashboard.service`:

```ini
[Unit]
Description=Personal dashboard (Next.js)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/psnl_dashboard
ExecStart=/usr/bin/pnpm start -p 3000
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

(Swap `pi` for your username.) Then:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now dashboard
journalctl -u dashboard -f        # logs (feed/calendar failures show up here)
curl localhost:3000/api/health    # → {"ok":true,...}
```

## 4. Updating

```bash
cd ~/psnl_dashboard && git pull && pnpm install --frozen-lockfile && pnpm build && sudo systemctl restart dashboard
```

## 5. Access & security

The dashboard has **no login**, and its server actions accept writes from
anyone who can reach it. So:

- **At home:** browse to `http://<pi-hostname>.local:3000`. Don't port-forward
  it on your router.
- **Away from home:** install [Tailscale](https://tailscale.com/) on the Pi and
  your phone/laptop; it's then reachable at `http://<pi-name>:3000` from your
  devices only. `tailscale serve` can add HTTPS.
- If you ever expose it publicly, add authentication first (e.g. Supabase
  Auth or a reverse proxy with basic auth).

## Optional: kiosk mode on a screen

If the Pi drives a monitor, launch Chromium full-screen on login:

```bash
chromium-browser --kiosk --noerrdialogs --disable-infobars http://localhost:3000
```

(Add it to the desktop autostart.) The overview is designed to fit one screen
at desktop widths.
