/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function () {
  chrome.app.window.create('index.html', {
    id: 'main',
    innerBounds: {
      width: 400,
      height: 700,
      minWidth: 349,
      minHeight: 200
    },
    alwaysOnTop: false,
    'frame': 'none' // It will be a rectangle filled with your HTML
  });
});