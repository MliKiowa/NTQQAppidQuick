import os
from time import sleep
import frida

def on_message(message, data):
    if message['type'] == 'send':
        print("[Python] [Appid]", message['payload'])
        # 写到文件
        # 设置utf8
        # with open('log.txt', 'a', encoding='utf8') as f:
        #     f.write(message['payload'] + '\n')

def main():
    # env = {'DISPLAY': ':1'}
    # 获取所有环境变量
    env = dict(os.environ)
    print(os.environ['DISPLAY'])
    pid = frida.spawn(['/opt/QQ/qq', '--no-sandbox'], env=env)
    print("real PID",pid)
    session = frida.attach(pid)
    frida.resume(pid)
    with open("GetAppid.js") as f:
        script = session.create_script(f.read())
        script.on('message', on_message)
        script.load()

    print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
    sleep(30)
    session.detach()

if __name__ == '__main__':
    main()