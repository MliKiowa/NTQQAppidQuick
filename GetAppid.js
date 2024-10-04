let findAppid = false;

const waitModule = Process.platform == 'linux' ? 'qq' : 'QQNT.dll';
const symbolGetString = "napi_get_value_string_utf8";
async function mainWin() {
    let hookPtr = Module.findExportByName(waitModule, symbolGetString);
    while (hookPtr == null) {
        hookPtr = Module.findExportByName(waitModule, symbolGetString);
    }
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
async function mainLinux() {
    let exports = Module.enumerateExports(waitModule);
    let hookPtr = exports.find(exp => exp.name == symbolGetString).address;
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
if (Process.platform == 'linux') {
    mainLinux().then();
} else {
    mainWin().then();
}