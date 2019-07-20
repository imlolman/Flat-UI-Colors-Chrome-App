const rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

  function hex(x) {
    const hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
  }
}

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const showCopied = (color) => {
  const texts = ['Got it!', 'It\'ll Rock!', 'Copied!', 'Paste Me!', 'Right One!', 'Will Do!']
  $('#randomText').html(texts[Math.floor(Math.random() * texts.length)])
  $('.colorCopiedBox').css('background', color)
  $('.colorCopiedBox').show()
  setTimeout(() => $('.colorCopiedBox').hide(), 1000);
}


const addEventListenersToColors = () => {
  document.querySelectorAll('#bigcolor').forEach(ele => {
    ele.addEventListener('click', event => {
      color = rgb2hex(event.target.style.background)
      copyToClipboard(color)
      showCopied(color)
      trackButtonClick(event)
    })
  })
}

const addEventListenersToPalette = () => {
  document.querySelectorAll('#palette').forEach(ele => {
    ele.addEventListener('click', (event) => {
      const targetElement = event.target;
      while (targetElement.id != "palette") {
        targetElement = targetElement.parentElement
      }
      template = ''
      window.colors[targetElement.getAttribute('paletteid')].colors.forEach(color => {
        template += `<div class="color" id="bigcolor" style="background: ${color}"></div>`
      })
      $('.color-box').html(template)
      $('#home').fadeOut(100);
      $('#set').fadeIn(100)
      makeWindowSmall()
      addEventListenersToColors()
    })
  })
}

// ! depriciated, to be removed in next version
const makeWindowSmall = () => {
  try {
    chrome.app.window.current().innerBounds.width = chrome.app.window.current().innerBounds.minWidth
    chrome.app.window.current().innerBounds.height = chrome.app.window.current().innerBounds.minHeight
    $('#resize').attr('res', 'lg')
    $('#resize').attr('data-tip', 'Resize Bigger')
  } catch {

  }
}

const makeWindowLarge = () => {
  try {
    chrome.app.window.current().innerBounds.width = 400
    chrome.app.window.current().innerBounds.height = 700
    $('#resize').attr('res', 'sm')
    $('#resize').attr('data-tip', 'Resize to Smallest')
  } catch {

  }
}

var showColors = (data) => {
  window.colors = data;
  toSet = '';
  data.forEach((colorSet, index) => {
    middleColours = '';
    colorSet.colors.forEach(color => {
      middleColours += `<div class="color" style="background: ${color}"></div>`
    })
    template = `      
      <div class="col-xs-6 col-sm-4 col-md-4 color-set-column" id="palette" paletteid="${index}">
        <div class="color-set">
          <div class="show-color">
            ` + middleColours + `    
          </div>
          <div class="plate-name">
            <span class="name">${colorSet.name}</span>
            <span class="emoji">${colorSet.emoji}</span>
          </div>
        </div>
      </div>`
    toSet += template;
  });
  $('#loadColoursHere').html(toSet);
}