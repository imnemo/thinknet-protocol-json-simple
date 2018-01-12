const debug = require('debug')('thinknet')
const {Protocol} = require('thinknet')

class ProtocolJsonSimple extends Protocol {
  constructor(opt = {}) {
    super(opt)
    this.eol = (opt.eol === undefined ? '\r\n' : opt.eol)
  }
  parse(buf, opt = {}) {
    if(opt.type === 'object')
      return [].push(buf)
    if(opt.type === 'array')
      return buf
    //默认buf的数据类型是TCP传输的Buffer
    if(!Buffer.isBuffer(buf)){
      debug(`Error: data type invalid!`)
      return []
    }
    let dataStrArry = buf
                  .toString('utf8')
                  .trimRight('\r\n')
                  .split('\r\n')
    let dataObjArry = []
    dataStrArry.forEach((dataStr) => {
      let dataObj
      try{
        dataObj = JSON.parse(dataStr)
      }catch(e){
        return
      }
      dataObjArry.push(dataObj)
    })
    return dataObjArry
  }
  build(data) {
    return JSON.stringify(data) + this.eol
  }
}

module.exports = ProtocolJsonSimple