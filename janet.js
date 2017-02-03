const fs = require('fs')

const irc = require('irc')
const PubSub = require('pubsub-js')

const MessagePubSub = require('pubsub-js')

class Janet {
  
  constructor() {
    this.config = this.loadConfig()

    this.events = {
      'join': require('pubsub-js'),
      'message': require('pubsub-js')
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
      if(message.substr(0,6) === "Janet,") {
        let command = message.replace('Janet, ','').trim()
        this.events.message.publish(command, {
          from: from,
          to: to,
          message: message
        })
      }
    })

    this.client.addListener('join', (channel, who) => {
        PubSub.publish('join', who)
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
   * Says a phrase across all of the joined channels
   */
  say(phrase) {
    for (let channel of this.config.irc.channels) {
      this.client.say(channel, phrase)
    }
  }
}

const janet = new Janet();
