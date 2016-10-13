import 'colors'

import nopt from 'nopt'
import prompt from 'prompt'
import fs from 'fs'
import path from 'path'

import {
  spec,
  dict,
  utils
} from 'trustoss-spec'

const { log } = utils


import checkDotFile from './checkDotFile'
import buildDefaultConfig from './buildDefaultConfig'
import checkFiles from './checkFiles'
import checkTags from './checkTags'


export default function * trustOSSlint (lintOpts = {}, opts) {
  console.log('running')
  if (!opts) {
    opts = lintOpts
    lintOpts = {}
  }
  const log = opts.utils.log
  const info = opts.utils.info
  const warn = opts.utils.warn
  const danger = opts.utils.danger

  log(info, 'Linting Repo')

  let dotfile = yield checkDotFile(lintOpts, opts)

  if (!dotfile) dotfile = yield buildDefaultConfig(opts)

  const fileChecks = yield checkFiles(dotfile, opts)

  const tagChecks = yield checkTags(fileChecks, opts)
}
