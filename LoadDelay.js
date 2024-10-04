const fs = require('fs');
console.log('LoadDelay.js started');
//输出本进程的PID
console.log('PID:', process.pid);
//将pid写到/opt/QQ/pid.txt文件中
fs.writeFileSync('/opt/QQ/pid.txt', process.pid.toString());
setTimeout(() => {
    require('./application/app_launcher/index.js');
}, 5000);