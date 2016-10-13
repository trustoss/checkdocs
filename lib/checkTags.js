export default function checkTags (documents, opts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger

  log(info, documents)
  log(info, 'Scanning tags')
  log(info, 'comparing tag timestamp to last updated changelog')
  log(info, 'checking the rest of the files present')
}
