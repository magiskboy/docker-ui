## Docker UI

### Preconfig in local

Install docker
```bash
$ sudo apt install docker
```

then expose docker engine api to tcp port

Open `/lib/systemd/system/docker.service` and searching for `ExecStart`.

Replace with `ExecStart /usr/bin/dockerd -H fd:// -H=tcp://127.0.0.1:9001`

And test
```bash
$ curl 127.0.0.1:9001/containers/json
```
