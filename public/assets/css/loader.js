module.exports = function(source) {
  this.cacheable();
  return `@import './assets/css/app.scss';
    ${source}`;
}