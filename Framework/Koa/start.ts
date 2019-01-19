const assert = require('assert')
const exec = require('child_process').exec
const fileName:string = process.argv[2]

exec(`cd scripts && pm2 start ${fileName} --watch`, function (err, stdout, stderr) {
  assert.equal(err,null)  
})