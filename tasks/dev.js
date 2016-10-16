'use strict'
const exec = require('child_process').exec

let bundled = false

const webpack = exec('npm run watch')

webpack.stdout.on('data', data => {
  console.log(data)
  if (!bundled) {
    bundled = true
    const electron = exec('npm start')
    electron.stdout.on('data', e_data => {
      console.log(e_data)
    })
  }
})

webpack.stderr.on('data', data => console.error(data))