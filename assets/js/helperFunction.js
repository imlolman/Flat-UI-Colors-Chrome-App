let rgb2hex = (rgb) => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

  function hex(x) {
    let hexDigits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f");
    return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
  }
}

function hexToR(h) {
  return parseInt((cutHex(h)).substring(0, 2), 16)
}

function hexToG(h) {
  return parseInt((cutHex(h)).substring(2, 4), 16)
}

function hexToB(h) {
  return parseInt((cutHex(h)).substring(4, 6), 16)
}

function cutHex(h) {
  if (h.length > 4) {
    return (h.charAt(0) == "#") ? h.substring(1, 7) : h
  }
  if (h.charAt(0) == "#") {
    return h.substring(1, 2) + h.substring(1, 2) + h.substring(2, 3) + h.substring(2, 3) + h.substring(3, 4) + h.substring(3, 4)
  } else {
    return h.substring(0, 1) + h.substring(0, 1) + h.substring(1, 2) + h.substring(1, 2) + h.substring(2, 3) + h.substring(2, 3)
  }

}

let hex2rgb = (hex) => {
  R = hexToR(hex);
  G = hexToG(hex);
  B = hexToB(hex);
  return `rgb(${R}, ${G}, ${B})`
}

let copyToClipboard = str => {
  let el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

let setColorBoxListeners = () => {
  $('.editColorCode #h').on('input', () => calculateColors('h'))
  $('.editColorCode #r,.editColorCode #g,.editColorCode #b').on('input', () => calculateColors('r'))
  $('.editColorCode #cp').on('input', () => calculateColors('cp'))
  $('.editColorModal .cancel').on('click', () => {
    $('.editColorModal').removeClass('blowUpModalBG').addClass('blowDownModalBG')
    $('.editColorModal .color-set').removeClass('blowUpModal').addClass('blowDownModal')
    setTimeout(() => $('.editColorModal').hide(), 500)
  })
  $('.editColorCode .cancel').on('click', () => {
    $('.editColorCode').removeClass('blowUpModalBG').addClass('blowDownModalBG')
    $('.editColorCode .color-set').removeClass('blowUpModal').addClass('blowDownModal')
    setTimeout(() => $('.editColorCode').hide(), 500)
  })
  $('.editColorModal .color').on('click', openEditColorDialougBox)

  $('.editColorCode .save').on('click', saveColorFromEditColorCode)
  $('.editColorModal .save').on('click', saveColorFromEditColorModal)
  $('.editColorModal .delete').on('click', deletePaletteFromEditColorModal)
}

let deletePaletteFromEditColorModal = () => {
  window.colors[$('.editColorModal').attr('paletteid')] = null
  $('.color-set-column[paletteid="' + $('.editColorModal').attr('paletteid') + '"]').remove()
  $('.editColorModal').removeClass('blowUpModalBG').addClass('blowDownModalBG')
  $('.editColorModal .color-set').removeClass('blowUpModal').addClass('blowDownModal')
  setTimeout(() => $('.editColorModal').hide(), 500)
  exportTofile()
}


let saveColorFromEditColorModal = () => {
  $('.editColorModal .color').each((index, item) => {
    window.colors[$('.editColorModal').attr('paletteid')].colors[index] = $(item).css('background-color')
  })
  window.colors[$('.editColorModal').attr('paletteid')].name = $('.editColorModal .name').val()
  $('.editColorModal').removeClass('blowUpModalBG').addClass('blowDownModalBG')
  $('.editColorModal .color-set').removeClass('blowUpModal').addClass('blowDownModal')
  $('.color-set-column[paletteid="' + $('.editColorModal').attr('paletteid') + '"] .color').each((index, item) => {
    $(item).css('background-color', window.colors[$('.editColorModal').attr('paletteid')].colors[index])
  })
  $('.color-set-column[paletteid="' + $('.editColorModal').attr('paletteid') + '"] .name').html($('.editColorModal .name').val())
  setTimeout(() => $('.editColorModal').hide(), 500)
  exportTofile()
}

let saveColorFromEditColorCode = () => {
  $('.editColorCode').removeClass('blowUpModalBG').addClass('blowDownModalBG')
  $('.editColorCode .color-set').removeClass('blowUpModal').addClass('blowDownModal')
  $($('.editColorModal .color')[$('.editColorCode').attr('colorindex')]).css('background-color', hex2rgb($('.editColorCode #h').val()))
  setTimeout(() => $('.editColorCode').hide(), 500)
}

let openEditColorDialougBox = (event) => {
  let targetElement = event.target;
  $('.editColorCode #h').val(rgb2hex($(targetElement).css('background-color')))
  $('.editColorCode').attr('paletteid', $('.editColorModal').attr('paletteid'))
  $('.editColorCode').attr('colorindex', $(targetElement).index())
  calculateColors('h')
  $('.editColorCode').removeClass('blowDownModalBG').addClass('blowUpModalBG')
  $('.editColorCode .color-set').removeClass('blowDownModal').addClass('blowUpModal')
  $('.editColorCode').show()
}

let calculateColors = (m) => {
  if (m == 'h') {
    color = '#' + cutHex($('.editColorCode #h').val())
    $('.editColorCode #r').val(hexToR(color))
    $('.editColorCode #g').val(hexToG(color))
    $('.editColorCode #b').val(hexToB(color))
    $('.editColorCode #cp').val(color)
    $('.preview').css('background-color', hex2rgb(color))
  } else if (m == 'r') {
    color = rgb2hex(`rgb(${$('.editColorCode #r').val()},${$('.editColorCode #g').val()},${$('.editColorCode #b').val()})`)
    $('.editColorCode #h').val(color)
    $('.editColorCode #cp').val('#' + cutHex(color))
    $('.preview').css('background-color', hex2rgb(color))
  } else {
    color = cutHex($('.editColorCode #cp').val())
    $('.editColorCode #h').val(color)
    $('.editColorCode #r').val(hexToR(color))
    $('.editColorCode #g').val(hexToG(color))
    $('.editColorCode #b').val(hexToB(color))
    $('.preview').css('background-color', hex2rgb(color))
  }
}

let showCopied = (color) => {
  let texts = ['Got it!', 'It\'ll Rock!', 'Copied!', 'Paste Me!', 'Right One!', 'Will Do!']
  $('#randomText').html(texts[Math.floor(Math.random() * texts.length)])
  $('.colorCopiedBox').css('background-color', color)
  $('.colorCopiedBox').show()
  setTimeout(() => $('.colorCopiedBox').hide(), 1000);
}

let addEventListenersToColors = () => {
  document.querySelectorAll('#bigcolor').forEach(ele => {
    ele.addEventListener('click', event => {
      color = rgb2hex(event.target.style.background)
      copyToClipboard(color)
      showCopied(color)
      trackButtonClick(event)
    })
  })
}

let addEventListenersToPalette = () => {
  document.querySelectorAll('#palette').forEach(ele => {
    ele.addEventListener('click', openColorsDialougBox)
  })
  $('#loadColorsHere').sortable({
    handle: '.plate-name',
    deactivate: exportTofile
  })
  $('#loadColorsHere').sortable('enable')
}

let openColorsDialougBox = (event) => {
  let targetElement = event.target;
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
}

let makeWindowSmall = () => {
  try {
    chrome.app.window.current().innerBounds.width = chrome.app.window.current().innerBounds.minWidth
    chrome.app.window.current().innerBounds.height = chrome.app.window.current().innerBounds.minHeight
  } catch {

  }
}

let makeWindowLarge = () => {
  try {
    chrome.app.window.current().innerBounds.width = 400
    chrome.app.window.current().innerBounds.height = 700
  } catch {

  }
}

var showColors = (data) => {
  window.colors = data;
  toSet = '';
  data.forEach((colorSet, index) => {
    toSet += makeBoxFrom(colorSet, index)
  });
  $('#loadColorsHere').html(toSet);

}

let makeBoxFrom = (colorSet, index) => {
  if (colorSet != null) {
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
    return template;
  }
  return ''
}

let setEditModeOn = () => {
  $('#edit').addClass('active')
  $('#loadColorsHere').addClass('editon')
}

let setEditModeOff = () => {
  $('#edit').removeClass('active')
  $('#loadColorsHere').removeClass('editon')
}

let removeAllandReload = () => {
  chrome.storage.local.get('colors', function (result) {
    if (result.colors == undefined) {
      fetch('colors_data.json').then(res => res.json()).then(data => {
        showColors(data);
        addEventListenersToPalette()
        chrome.storage.local.set({
          colors: data
        });
      })
    } else {
      showColors(result.colors);
      addEventListenersToPalette()
    }
  });
}

let addAddNewPalletOption = () => {
  $('#loadColorsHere').prepend('<div class="col-xs-12" id="newColorSet" style="padding:0"><div class="col-xs-6 col-sm-4 col-md-4" style="height:30vw;padding:5px"><div class="addNewPalette">+</div></div></div>')
}

let bindEditEvents = () => {
  document.querySelectorAll('#palette').forEach(ele => {
    ele.removeEventListener('click', openColorsDialougBox)
  })
  $('#newColorSet').children()[0].addEventListener('click', createNewPalette)
  document.querySelectorAll('#palette').forEach(ele => {
    ele.addEventListener('click', openEditDialougBox)
  })
}

let createNewPalette = () => {
  colorSet = {
    name: 'Custom Plate',
    emoji: "\ud83c\udfa8",
    colors: []
  }

  for (i = 1; i <= 5; i++) {
    colorSet.colors.push(`rgb(${i*(255/5)},0,0)`)
  }
  for (i = 1; i <= 5; i++) {
    colorSet.colors.push(`rgb(0, ${i*(255/5)},0)`)
  }
  for (i = 1; i <= 5; i++) {
    colorSet.colors.push(`rgb(0, 0, ${i*(255/5)})`)
  }
  for (i = 1; i <= 5; i++) {
    colorSet.colors.push(`rgb(${i*(255/5)}, ${i*(255/5)}, ${i*(255/5)})`)
  }
  $('#loadColorsHere').prepend(makeBoxFrom(colorSet, window.colors.length))
  $('#palette[paletteid="' + window.colors.length + '"]').on('click', openEditDialougBox)
  window.colors.push(colorSet)
  exportTofile()
}

let openEditDialougBox = (event) => {
  let targetElement = event.target;
  while (targetElement.id != "palette") {
    targetElement = targetElement.parentElement
  }
  window.colors[$(targetElement).attr('paletteid')].colors.forEach((color, index) => {
    $($('.editColorModal .color')[index]).css('background-color', color)
  })
  $('.editColorModal').removeClass('blowDownModalBG').addClass('blowUpModalBG')
  $('.editColorModal .color-set').removeClass('blowDownModal').addClass('blowUpModal')
  $('.editColorModal .name').val(window.colors[$(targetElement).attr('paletteid')].name)
  $('.editColorModal').attr('paletteid', $(targetElement).attr('paletteid'))
  $('.editColorModal').show()
}

let exportTofile = () => {
  var toexport = []
  $('#loadColorsHere #palette').each((i, s) => {
    toexport.push(window.colors[$(s).attr('paletteid')])
  })

  chrome.storage.local.set({
    colors: toexport
  });
}