# aliyun oss upload cli

```bash
npm i -g ali-oss-cli
```

make file '.ossrc'

```bash
{
    "accessKeyId": "***",
    "accessKeySecret": "***",
    "region": "oss-cn-hangzhou", // eg: oss-cn-hangzhou
    "bucket": "stgame",
    "prefix": "test", // oss directory prefix; eg: auto_upload_ci/test
    "srcPath":"dist", // upload directory
    "exclude": ".*$" // Optional, default: .*$
}
```

edit 'package.json'

```bash
{
    ...
    "scripts": :{
        "upload": "ossUpload"
        ...
    }
    ...
}
```

upload

```bash
npm run upload
```

