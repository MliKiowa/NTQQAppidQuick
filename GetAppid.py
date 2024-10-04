import frida
import sys

def on_message(message, data):
    if message['type'] == 'send':
        print("[Python] [Appid]", message['payload'])
        # 写到文件
        # 设置utf8
        # with open('log.txt', 'a', encoding='utf8') as f:
        #     f.write(message['payload'] + '\n')

def main():
    env = {'DISPLAY': ':1'}
    pid = frida.spawn(['/opt/QQ/qq', '--no-sandbox','--disable-gpu'], env=env)
    # pid在/opt/QQ/pid.txt
    # with open("/opt/QQ/pid.txt") as f:
    #     pid = int(f.read())
    print("real PID",pid)
    session = frida.attach(pid)
    frida.resume(pid)
    with open("GetAppid.js") as f:
        script = session.create_script(f.read())
        script.on('message', on_message)
        script.load()

    print("[!] Ctrl+D on UNIX, Ctrl+Z on Windows/cmd.exe to detach from instrumented program.\n\n")
    sys.stdin.read()
    session.detach()

if __name__ == '__main__':
    main()