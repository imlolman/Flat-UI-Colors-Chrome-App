window.addEventListener('load', () => {
  makeWindowLarge()
  fetch('colors_data.json').then(res => res.json()).then(data => {
    showColors(data);
    addEventListenersToPalette()
  })
  $('.btn').tipr({
    'speed': 0,
  })

  $('#pin').on('click', () => {
    $('.tipr_container_above').remove()
    if ($('#pin').hasClass('active')) {
      chrome.app.window.current().setAlwaysOnTop(false);
      $('#pin').removeClass('active')
    } else {
      chrome.app.window.current().setAlwaysOnTop(true);
      $('#pin').addClass('active')
    }
  })

  $('#minimize').on('click', () => {
    chrome.app.window.current().minimize()
    $('.tipr_container_above').remove()
  });

  $('#close').on('click', () => {
    chrome.app.window.current().close()
  });

  $('#resize').on('click', () => {
    $('.tipr_container_above').remove()
    if ($('#resize').attr('res') == 'sm') {
      makeWindowSmall()
    } else {
      makeWindowLarge()
    }
  });

  $('#back').on('click', () => {
    $('#home').fadeIn(100);
    $('#set').fadeOut(100)
    makeWindowLarge()
  })
})

var makeWindowSmall = () => {
  try {
    chrome.app.window.current().innerBounds.width = chrome.app.window.current().innerBounds.minWidth
    chrome.app.window.current().innerBounds.height = chrome.app.window.current().innerBounds.minHeight
    $('#resize').attr('res', 'lg')
    $('#resize').attr('data-tip', 'Resize Bigger')
    $('#resize').html('⬜')
  } catch {

  }
}

var makeWindowLarge = () => {
  try {
    chrome.app.window.current().innerBounds.width = 400
    chrome.app.window.current().innerBounds.height = 700
    $('#resize').attr('res', 'sm')
    $('#resize').attr('data-tip', 'Resize to Smallest')
    $('#resize').html('◼')
  } catch {

  }
}

var addEventListenersToPalette = () => {
  document.querySelectorAll('#palette').forEach(ele => {
    ele.addEventListener('click', (event) => {
      var targetElement = event.target;
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

var addEventListenersToColors = () => {
  document.querySelectorAll('#bigcolor').forEach(ele => {
    ele.addEventListener('click', event => {
      color = rgb2hex(event.target.style.background)
      copyToClipboard(color)
      showCopied(color)
      trackButtonClick(event)
    })
  })
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

var rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

  function hex(x) {
    var hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
  }
}

var copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

var showCopied = (color) => {
  var texts = ['Got it!', 'It\'ll Rock!', 'Copied!', 'Paste Me!', 'Right One!', 'Will Do!']
  $('#randomText').html(texts[Math.floor(Math.random() * texts.length)])
  $('.colorCopiedBox').css('background', color)
  $('.colorCopiedBox').show()
  setTimeout(() => $('.colorCopiedBox').hide(), 1000);
}