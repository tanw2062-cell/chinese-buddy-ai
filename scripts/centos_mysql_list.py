# -*- coding: utf-8 -*-
import os, sys, paramiko
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))
LOGIN = os.path.join(ROOT, "测试专用文件", "虚拟机CentOS8", "00-登录信息.md")

def load():
    host = user = password = None
    for line in open(LOGIN, encoding="utf-8"):
        s = line.strip()
        if s.startswith("| 当前 IP |") and "`" in s:
            host = s.split("`")[1].strip()
        elif s.startswith("| 用户名 |") and "`" in s:
            user = s.split("`")[1].strip()
        elif s.startswith("| 密码 |") and "`" in s:
            password = s.split("`")[1].strip()
    return host, user, password

host, user, pw = load()
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, 22, user, pw, timeout=25, allow_agent=False, look_for_keys=False)
script = r"""
set -e
mysql --protocol=socket --batch --raw <<'SQL'
SHOW DATABASES;
SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME='ai_companion';
USE ai_companion;
SHOW TABLES;
SHOW CREATE TABLE users\G
SELECT COUNT(*) AS user_rows FROM users;
SQL
"""
stdin, stdout, stderr = ssh.exec_command("sudo -S -p '' bash -s", timeout=60)
stdin.write(pw + "\n")
stdin.write(script)
stdin.channel.shutdown_write()
code = stdout.channel.recv_exit_status()
sys.stdout.write(stdout.read().decode("utf-8", "replace"))
sys.stderr.write(stderr.read().decode("utf-8", "replace"))
ssh.close()
raise SystemExit(code)
