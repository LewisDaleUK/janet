const Module = require('./module')

class Greet extends Module {

  constructor() {
    super({
      name: 'Greet',
      showInHelp: false,
      command: 'Hello',
      methods: ['join']
    })

    this.test = {}
  }
  
  respond(input) {
    return "Hello, " + input
  }
}

module.exports = new Greet()
