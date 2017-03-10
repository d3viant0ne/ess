// This file is loaded globally in webpack.config.js
// hoist global constants by including them here as .json files.

module.exports = {
    'aptoInstructions': require('./aptoInstructions.json'),
    'config': require('./config.json'),
    'feed': require('./feed.json'),
    'friends': require('./friends.json'),
    'photos': require('./photos.json'),
    'testData': require('./testData.json')
}