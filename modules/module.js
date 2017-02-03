class Module {
  
  /**
   * Construct a new Modules instance
   * @param opts: An object containing module information
   * @param opts.name: The name of the module
   * @param opts.showInHelp: Boolean to determine if a module should be a listed command
   * @param opts.command: The command that triggers the action
   * @param opts.methods: A list of contact methods where the command is available
   */
  constructor(opts = {}) {
    let keys = [
      'name',
      'showInHelp',
      'command',
      'methods'
    ]
     
    for(let key of keys) {
      if(!(key in opts)) {
        throw new TypeError("Key " + key + " is missing from Module options")
      }

      this[key] = opts[key]
    }

  }
  
  /**
   * Response to the input, triggered by the command
   * @return A string response
   */
  respond(input) {
    throw new TypeError("Function respond has not been implemented. Please override Module.respond()")
  }
}

module.exports = Module
