const JanetModule = require('./janetmodule')

/**
 * A simple greet module that says a friendly hello when somebody joins
 * @author Lewis Dale
 */
class Greet extends JanetModule {

  constructor(client) {
    super({
      name: 'Greet',
      showInHelp: false,
      command: 'join',
      methods: ['join']
    }, client)
  }
  
  respond(event, who) {
    if (who !== "Janet") {
      this.client.say("Hello, " + who)
    }
  }
}

module.exports = (client) => {
  return new Greet(client)
}
