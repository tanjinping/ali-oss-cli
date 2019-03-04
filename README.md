# compress dist and upload it to aliyun oss

```bash
npm i --save-dev ali-oss-cli
```

make UTF-8 file '.ossrc' 

```bash
{
    "accessKeyId": "***",
    "accessKeySecret": "***",
    "region": "oss-cn-hangzhou", // eg: oss-cn-hangzhou
    "bucket": "stgame",
    "srcPath":"dist", // compress and upload directory
    "zipName": "dev-servername-latest.zip" // zip file name
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

