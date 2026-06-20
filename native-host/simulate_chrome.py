#!/usr/bin/env python3
"""模拟Chrome通过stdin/stdout和native host对话的方式，正确按协议加长度前缀"""
import subprocess
import struct
import json
import sys

def send_and_receive(proc, msg_dict):
    encoded = json.dumps(msg_dict).encode("utf-8")
    proc.stdin.write(struct.pack("<I", len(encoded)))
    proc.stdin.write(encoded)
    proc.stdin.flush()

    raw_length = proc.stdout.read(4)
    if not raw_length:
        print("没有收到任何响应（host可能已退出）")
        return None
    length = struct.unpack("<I", raw_length)[0]
    response = proc.stdout.read(length).decode("utf-8")
    return json.loads(response)

if __name__ == "__main__":
    host_path = sys.argv[1] if len(sys.argv) > 1 else "host.py"
    proc = subprocess.Popen(
        ["python3", host_path],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    result = send_and_receive(proc, {"action": "ping"})
    print("响应:", result)
    proc.terminate()
    stderr_output = proc.stderr.read().decode("utf-8")
    if stderr_output:
        print("stderr输出:", stderr_output)
