require('./main.scss');
var login = require('../../services/login');

module.exports = {
    template: `
    <div style='border: 1px solid blue; padding: 10px;'>
        <h1>Main Component</h1>
        <a ui-sref='test'>Test</a>
        <a ui-sref='dashboard'>Dashboard</a>
        <a ui-sref='anotherTest'>Another Test</a>
        <br /><dashboard></dashboard>
        <div ui-view></div>
    </div>`,
    controllerAs: 'vm',
    controller: function() {
        console.log('hello from the main component');
        console.log(login);
        login.auth();
    }
}