# Remote Log Server README

Use your Visual Studio Code editor as a log destination. Creates no files on disk and works for remote logging too.

## Usage

Press <CTRL+F12> to start a server, and connect to the server via telnet or socket programms sending text.

Example python code:

```
# REMOTE LOG PYTHON CLIENT DEMO
import socket
from  json import dumps
from time import sleep

HOST, PORT = 'localhost', 8888
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.connect((HOST, PORT))
    for i in range(1, 3):
        s.sendall('Hello World\n')
        sleep(1)
```

## Features

1. [CTRL+F12] to start a server
3. [F12] to toggle server pause/resume

<!-- ## Requirements

... -->

## Extension Settings

This extension contributes the following settings:

* `RemoteLogServer.host`: The host address of the remote control server, default = 'localhost'.
* `RemoteLogServer.port`: The tcp/ip port the remote control server listens to, default = 9527.

<!-- ## Known Issues

... -->

<!-- ## Release Notes


### 1.0.0

Basically done. -->

<!-- Fixed issue #. -->

<!-- ### 1.1.0

Added features X, Y, and Z. -->

-----------------------------------------------------------------------------------------------------------

<!-- ### CONTRIBUTORS

... -->

**Enjoy!**
