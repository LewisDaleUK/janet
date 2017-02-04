const fs = require('fs')

const JanetModule = require('./janetmodule')

class Commands extends JanetModule {
  constructor(client) {
    super({
      name: 'Commands',
      command: 'what commands are available?',
      showInHelp: true,
      methods: ['message'],
    }, client)
  }

  respond(event, data) {
    fs.readdir('modules', (err, files) => {
      let commands = [];

      for (let file of files) {
        let title = file.substr(0, file.length - 3)
        if (title !== 'janetmodule') {
          let module = require('../modules/' + title)(this.client)
          if (module.showInHelp) {
            commands.push(module.name)
          }
        }
      }
      this.client.say(commands.join(', '))
    })
  }
}

module.exports = (client) => {
  return new Commands(client)
}
