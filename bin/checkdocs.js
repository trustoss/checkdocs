import 'babel-polyfill'
import 'colors'

import lint from '../lib/lint'
import nopt from 'nopt'
import path from 'path'

import {
  utils
} from 'trustoss-spec'

const { log } = utils

// No idea how to es6 import json files :/
const pkg = require('../package.json')

const knownOpts = {
  'command': String,
  'config': path,
  'version': Boolean,
  'default': Boolean,
  'verbose': Boolean,
  'help': Boolean
}
const shortHands = {
  'c': ['--config'],
  'd': ['--default'],
  'v': ['--verbose'],
  'V': ['--version'],
  'h': ['--help'],
}

const parsed = nopt(knownOpts, shortHands, process.argv, 2)

let command = parsed.command

if (command && command.indexOf('/')>-1) {
  command = command.split('/')
  command = command[command.length-1]
} else if (!command) {
  command = 'trustoss'
}

const info = `[${command}]`.green
utils.info = info
const warn = `[${command} | WARNING]`.yellow
utils.warn = warn
const danger = `[${command} | ERROR]`.red
utils.danger = danger

if (parsed.help) {
  console.log(`
${info} cli v${pkg.version}

Usage: ${command} [options]

Options:

  -h, --help           output usage information
  -V, --version        output the version number
  -d, --default        Use default configuration
  -c, --config [path]  ${command} configuration [docs.json]
  -v, --verbose        Verbose`
  )
  process.exit(0)
}

if (parsed.version) {
  console.log(`
${info} cli v${pkg.version}
`)
  process.exit(0)
}
if (parsed.verbose) {
  process.env.VERBOSE = true
}

log(info, 'cli v' + pkg.version)
log(info, 'cli parsing complete. Beginning lint.')

lint({ utils })
