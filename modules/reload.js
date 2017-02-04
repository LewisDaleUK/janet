const JanetModule = require('./janetmodule')

class Reload extends JanetModule {

  constructor(client) {
    super({
      name: 'Reload',
      showInHelp: false,
      command: 'reload',
      methods: ['pm']
    }, client)
  }

  respond(event, data) {
    this.client.say("Just checking to see if I've got any new modules...")
    this.client.clearModules();
    this.client.loadModules();
    this.client.say("I'm back now")
  }
}

module.exports = (client) => {
  return new Reload(client)
}
