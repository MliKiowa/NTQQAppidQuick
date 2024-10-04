let findAppid = false;

const waitModule = Process.platform == 'linux' ? 'qq' : 'QQNT.dll';
const symbolGetString = "napi_get_value_string_utf8";
send("Hooking");
async function main() {
    let hookPtr = Module.findExportByName(waitModule, symbolGetString);
    while (hookPtr == null) {
        hookPtr = Module.findExportByName(waitModule, symbolGetString);
    }
    console.log("Platform Module:", waitModule);
    send("Platform Module:" + waitModule);
    Interceptor.attach(hookPtr, {
        onEnter(args) {
            this.data = args[2];
        },
        onLeave(retval) {
            let data = Memory.readUtf8String(this.data).substring(0, 10);
            if (!findAppid && /^\d+$/.test(data) && data.startsWith("5")) {
                send(data);
                findAppid = true;
            }
        }
    });
}

main().then();