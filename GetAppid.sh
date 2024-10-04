apt-get install -y \
    openbox \
    xorg \
    dbus-user-session \
    curl \
    unzip \
    xvfb \
    supervisor \
    libnotify4 \
    libnss3 \
    xdg-utils \
    libsecret-1-0 \
    ffmpeg \
    libgbm1 \
    libasound2 \
    fonts-wqy-zenhei \
    gnutls-bin \
    tzdata \
    fluxbox \
    nodejs \
    npm \
    x11vnc
# 安装QQ
curl -o linuxqq.deb https://dldir1.qq.com/qqfile/qq/QQNT/1aff6d6d/linuxqq_3.2.12-28060_amd64.deb
dpkg -i linuxqq.deb
apt-get -f install -y
rm linuxqq.deb
# 启动脚本
chmod 777 /opt/QQ/
mv ./LoadGetAppid.js /opt/QQ/resources/app/LoadGetAppid.js
sed -i 's/"main": ".\/application\/app_launcher\/index.js"/"main": ".\/LoadGetAppid.js"/' /opt/QQ/resources/app/package.json
# 依赖安装
cd /opt/QQ/resources/app/
npm i frida
# 启动QQ
dbus-daemon --config-file=/usr/share/dbus-1/system.conf --print-address &
Xvfb :1 -screen 0 1080x760x16 &
fluxbox &
x11vnc -display :1 -noxrecord -noxfixes -noxdamage -forever -rfbauth ~/.vnc/passwd &
export DISPLAY=:1 &
qq --no-sandbox