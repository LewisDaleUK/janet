const fs = require('fs')

const irc = require('irc')

class Janet {
  
  constructor() {
    this.config = this.loadConfig()
    this.modules = {
      'pm': [],
      'join': [],
      'message': []
    }

    this.loadModules()
    this.client = new irc.Client(
      this.config.irc.server,
      this.config.irc.user,
      {
        channels: this.config.irc.channels
      }
    )

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

        if (title !== 'module') {
          let module = require('./modules/' + title)
          for(let method of module.methods) {
            if (method in this.modules) {
              this.modules[method].push(module)
            }
          }
        }
      }
    }
  }
}

const janet = new Janet();
