import checkOneFile from './checkOneFile'

export default function checkFiles (data, opts) {
  const log = opts.helpers.log

  const info = opts.helpers.info
  const warn = opts.helpers.warn
  const danger = opts.helpers.danger
  log(info, 'Checking if files exist', data)
  const fileChecks = []

  const dataKeys = Object.keys(data)
  for (let i = 0; i < dataKeys.length; i++) {
    const thisKey = dataKeys[i]
    if (thisKey.indexOf('_location') < 0) continue
    fileChecks.push(checkOneFile(data.docroot, thisKey, data[thisKey], opts))
  }
  console.log(fileChecks)
  return Promise.all(fileChecks)
}
