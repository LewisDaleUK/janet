const fs = require('fs')

const PubSub = require('pubsub-js')
const irc = require('irc')
const nlp = require('compromise')

class Janet {

  constructor() {
    this.config = this.loadConfig()
    this.events = PubSub

    this.loadModules()
    this.client = new irc.Client(
      this.config.irc.server,
      this.config.irc.user,
      {
        channels: this.config.irc.channels,
        port: this.config.irc.port
      }
    )

    this.client.addListener('message', (nick, to, text, message) => {
      if(to === "Janet") { //Stops pm's being processed twice
        return
      }

      console.log("DEBUG: A message was received")
      console.log(text)
      let commandEnd = text.indexOf('?')
      if(text.substr(0,6) === "Janet," && commandEnd !== -1) {
        let command = text.substr(0,commandEnd + 1).replace('Janet, ','').trim()
        let variables = text.substr(commandEnd + 1, text.length).split(',')
        this.events.publish('message: ' + command, {
          from: from,
          to: to,
          message: text,
          variables: variables
        })
      }
    })

    this.client.addListener('join', (channel, who) => {
      console.log("DEBUG: A new user joined")
      this.events.publish('join: join', who)
    })

    this.client.addListener('pm', (nick, text, message) => {
      console.log("DEBUG: A pm was received")
      let q = nlp(text)
      let matches = q.match('#Verb . #Noun').list

      for(let match of matches) {
        let verb = match.terms[0]
        let noun = match.terms[2]
        this.events.publish('pm: ' + noun.text, {
          module: verb.text,
          from: nick,
          text: text,
        })

      }
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
            this.events.subscribe(method + ': ' + module.command, (...args) => {
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
    this.events.clearAllSubscriptions()
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
