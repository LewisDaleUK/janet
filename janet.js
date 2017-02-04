const fs = require('fs')

const irc = require('irc')

class Janet {

  constructor() {
    this.config = this.loadConfig()

    this.events = {
      'join': require('pubsub-js'),
      'message': require('pubsub-js'),
      'pm': require('pubsub-js'),
    }

    this.loadModules()
    this.client = new irc.Client(
      this.config.irc.server,
      this.config.irc.user,
      {
        channels: this.config.irc.channels
      }
    )

    this.client.addListener('message', (from, to, message) => {
      console.log("DEBUG: A message was received")
      let commandEnd = message.indexOf('?')
      if(message.substr(0,6) === "Janet," && commandEnd !== -1) {
        let command = message.substr(0,commandEnd + 1).replace('Janet, ','').trim()
        let variables = message.substr(commandEnd + 1, message.length).split(',')
        this.events.message.publish(command, {
          from: from,
          to: to,
          message: message,
          variables: variables
        })
      }
    })

    this.client.addListener('join', (channel, who) => {
      console.log("DEBUG: A new user joined")
      this.events.join.publish('join', who)
    })

    this.client.addListener('pm', (nick, text, message) => {
      console.log("DEBUG: A pm was received")
      this.events.pm.publish(text, {
        from: nick,
        message: message
      })
    })
  }

  /**
   * Load the config file config.json
   * @return An object containing the bot configuration
   **/
  loadConfig() {
    return JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
  }

  /**
   * Loads the modules from the modules directory
   */
  loadModules() {
    let files = fs.readdirSync('modules')
    for (let file of files) {

      if (file.substr(-3) === '.js') {
        let title = file.substr(0, file.length - 3)

        if (title !== 'janetmodule') {
          delete require.cache[require.resolve('./modules/' + title)]
          let module = require('./modules/' + title)(this)

          for(let method of module.methods) {
            this.events[method].subscribe(module.command, (...args) => {
              module.respond(...args) })
          }
        }
      }
    }
  }

  /**
   * Clear the module list
   */
  clearModules() {
    for(let key in this.events) {
      this.events[key].clearAllSubscriptions()
    }
  }

  /**
   * Says a phrase across all of the joined channels
   */
  say(phrase) {
    for (let channel of this.config.irc.channels) {
      this.client.say(channel, phrase)
    }
  }
}

const janet = new Janet();
