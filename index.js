#!/usr/bin/env node
/**
 * Created by Fred(qq:24242811) on 2018/8/18.
 */
const crypto = require('crypto')
const OSS = require('ali-oss')
const fs = require('fs-extra')
const co = require('co')
const path = require('path')
const rc = require('rc')
const archiver = require('archiver')

class AliossUploader{
	constructor(options) {
		if (options.ossKey){
			options = Object.assign(options, JSON.parse(aesDecrypt(options.ossKey, 'stgame.cn')))
		}
		// 默认打印日志
		this.options = Object.assign({enableLog:true}, options)
		this.client = new OSS(options)
	}
	start(){
		let output = fs.createWriteStream(path.join('./', this.options.zipName))
		output.on('close', async () => {
			let startTime = now()
			this.log(path.join('./', this.options.zipName)+' size '+ (archive.pointer()/1024).toFixed(2) + ' KB')
			try {
				this.log('---UPLOAD START---')
				let r1 =  await this.client.put(this.options.zipName, path.resolve('./', this.options.zipName))
				this.log('put success: %j', r1);
				this.log(`---UPLOAD END (${now()-startTime}ms)---`)
			} catch(err) {
				throw err
			}
		})

		var archive = archiver('zip', {zlib: { level: 9 } })
		archive.on('warning', function(err) {
			if (err.code === 'ENOENT') {
				this.log('warning '+err)
			} else {
				throw err
			}
		})
		archive.on('error', function(err) {
			this.log('error '+err)
			throw err
		})

		archive.pipe(output)
		archive.directory(path.join('./', this.options.srcPath), false)
		archive.finalize()
	}

	log(...rest){
		if (this.options.enableLog){
			console.log.apply(this, rest)
		}
	}
}

function now() {
	return (new Date()).getTime()
}
function browserFiles(folder, list){
	list = list || []
	fs.readdirSync(folder).forEach(file=>{
		let filePath = path.join(folder, file)
		let stat = fs.statSync(filePath)
		if (stat.isDirectory()){
			browserFiles(filePath, list)
		}else if (file !== '.DS_Store' && file !== 'Thumbs.db'){
			list.push(filePath)
		}
	})
	return list
}

function aesEncrypt(data, key) {
	const cipher = crypto.createCipher('aes192', key)
	var crypted = cipher.update(data, 'utf8', 'hex')
	crypted += cipher.final('hex')
	return crypted
}

function aesDecrypt(encrypted, key) {
	const decipher = crypto.createDecipher('aes192', key)
	var decrypted = decipher.update(encrypted, 'hex', 'utf8')
	decrypted += decipher.final('utf8')
	return decrypted
}

const config = rc('oss', {
	accessKeyId: null,
	accessKeySecret: null,
	region: null,
	bucket: null,
	zipName: 'tmp-dist.zip',
	srcPath: 'dist',
	ossKey: null,
	enableLog:true
})
let uploader = new AliossUploader(config)
uploader.start()