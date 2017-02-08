const nlp = require('compromise')

const JanetModule = require('./janetmodule')

/**
 * Command to get Janet to search YouTube for a video
 * @author Lewis Dale
 */
class Video extends JanetModule {
  constructor(client) {
    super({
      name: 'Video',
      showInHelp: true,
      command: 'video',
      methods: ['pm', 'message']
    }, client)
  }

  respond(evt, data) {
    let msg = nlp(data.text)

    console.log(msg.match('" * "'))
  }
}

module.exports = (client) => {
  return new Video(client)
}
