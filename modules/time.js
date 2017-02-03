const JanetModule = require('./janetmodule')

/**
 * A simple command to ask Janet the current time
 * @author Lewis Dale
 */
class Time extends JanetModule {
    constructor(client) {
      super({
        name: 'Time',
        showInHelp: true,
        command: 'what time is it?',
        methods: ['message']
      }, client)
    }

  respond(event, data) {
    let date = new Date()
    this.client.say(data.from + ", it is currently " + date.toTimeString())
  }
}

module.exports = (client) => {
    return new Time(client)
}
