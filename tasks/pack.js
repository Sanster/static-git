'use strict'
const minimist = require('minimist')
const packager = require('electron-packager')
// const scripy = require('scripy')
// const $ = require('shelljs')
const pkg = require('../package.json')
const exec = require('child_process').exec

const outDir = 'pack'

const platforms = {}
const defaults = {
  version: '1.4.3',
  dir: './app',
  'app-version': pkg.version,
  out: outDir,
  overwrite: true,
  prune: false 
}

const cb = (err, paths) => {
  if (err) {
    console.log(err.message)
    process.exit(1)
  }
  if (paths) console.log(paths.join('\n'))
}

platforms.macos = () => {
  // $.mkdir('-p', `${outDir}/installers`)

  packager(Object.assign({}, defaults, {
    platform: 'darwin',
    arch: 'x64',
    'app-bundle-id': 'com.sanster.static-git',
    // icon: './build/icon.icns'
  }), (err, paths) => {
    cb(err, paths)
    // exec(`appdmg ./tasks/appdmg.json ./${outDir}/installers/EME-macos-${pkg.version}.dmg`, {
    //   stdio: 'inherit'
    // })
  })
}

platforms.macos();