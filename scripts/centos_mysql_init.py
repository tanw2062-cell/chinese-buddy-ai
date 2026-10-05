# -*- coding: utf-8 -*-
"""Bootstrap MySQL on the owner's CentOS 8 VM. SSH password stays in the login doc."""
import os
import secrets
import sys

import paramiko

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
LOGIN = os.path.join(ROOT, "测试专用文件", "虚拟机CentOS8", "00-登录信息.md")
ENV_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".env"))


def load_ssh():
    host = user = password = None
    for line in open(LOGIN, encoding="utf-8"):
        s = line.strip()
        if s.startswith("| 当前 IP |") and "`" in s:
            host = s.split("`")[1].strip()
        elif s.startswith("| 用户名 |") and "`" in s:
            user = s.split("`")[1].strip()
        elif s.startswith("| 密码 |") and "`" in s:
            password = s.split("`")[1].strip()
    if not host or not user or not password:
        raise SystemExit("login doc missing IP/user/password")
    return host, user, password


def upsert_env(values):
    existing = {}
    if os.path.isfile(ENV_PATH):
        for line in open(ENV_PATH, encoding="utf-8"):
            if "=" in line and not line.lstrip().startswith("#"):
                k, v = line.rstrip("\n").split("=", 1)
                existing[k] = v
    existing.update(values)
    with open(ENV_PATH, "w", encoding="utf-8") as f:
        for k, v in existing.items():
            f.write("%s=%s\n" % (k, v))


def sudo_bash(ssh, sudo_password, script):
    cmd = "sudo -S -p '' bash -s"
    stdin, stdout, stderr = ssh.exec_command(cmd, timeout=90)
    stdin.write(sudo_password + "\n")
    stdin.write(script)
    stdin.channel.shutdown_write()
    code = stdout.channel.recv_exit_status()
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    return code, out, err


def main():
    host, user, sudo_password = load_ssh()
    db_name = "ai_companion"
    db_user = "companion"
    db_pass = secrets.token_urlsafe(18)

    sql = r"""
CREATE DATABASE IF NOT EXISTS ai_companion CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'companion'@'%' IDENTIFIED BY '{db_pass}';
ALTER USER 'companion'@'%' IDENTIFIED BY '{db_pass}';
GRANT ALL PRIVILEGES ON ai_companion.* TO 'companion'@'%';
FLUSH PRIVILEGES;
USE ai_companion;
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    google_id VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    avatar VARCHAR(255),
    energy INT DEFAULT 20,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
""".format(db_pass=db_pass.replace("'", "\\'"))

    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(
        host,
        port=22,
        username=user,
        password=sudo_password,
        timeout=25,
        allow_agent=False,
        look_for_keys=False,
    )
    try:
        script = """
set -e
mysql --protocol=socket <<'SQL'
{sql}
SQL
if command -v firewall-cmd >/dev/null 2>&1; then
  firewall-cmd --permanent --add-port=3306/tcp || true
  firewall-cmd --reload || true
fi
mysql -N -e "SHOW TABLES FROM ai_companion;"
""".format(sql=sql)
        code, out, err = sudo_bash(ssh, sudo_password, script)
    finally:
        ssh.close()

    sys.stdout.write(out)
    if err.strip():
        sys.stderr.write(err)
    if code != 0:
        raise SystemExit(code)

    upsert_env(
        {
            "MYSQL_HOST": host,
            "MYSQL_PORT": "3306",
            "MYSQL_USER": db_user,
            "MYSQL_PASSWORD": db_pass,
            "MYSQL_DATABASE": db_name,
        }
    )
    print("MYSQL_READY host=%s db=%s user=%s" % (host, db_name, db_user))


if __name__ == "__main__":
    main()
