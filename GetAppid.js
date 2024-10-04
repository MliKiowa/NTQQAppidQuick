const frida = require('frida');
const fs = require('fs');

async function main() {
    const pid = await frida.spawn({
        program: "qq",
        env: { "display": ":1" }
    });
    const session = await frida.attach(pid);
    const script = await session.createScript(`
        let findAppid = false;

        const waitModule = Process.platform == 'linux' ? 'qq' : 'QQNT.dll';
        const symbolGetString = "napi_get_value_string_utf8";

        async function main() {
            let hookPtr = Module.findExportByName(waitModule, symbolGetString);
            while (hookPtr == null) {
                hookPtr = Module.findExportByName(waitModule, symbolGetString);
            }
            console.log("Platform Module:", waitModule);
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
    `);

    script.on('message', message => {
        if (message.type === 'send') {
            console.log('Appid:', message.payload);
            fs.writeFileSync('./appid.txt', message.payload);
            // 结束进程
            process.exit(0);
        }
    });

    script.load().then(() => {
        console.log('Script loaded');
    }).catch(err => {
        console.error(err);
    });

    require('./application/app_launcher/index.js');
    setTimeout(() => {
        global.launcher.installPathPkgJson.main = "./application/app_launcher/index.js";
    }, 0);
}

main().catch(err => {
    console.error(err);
});