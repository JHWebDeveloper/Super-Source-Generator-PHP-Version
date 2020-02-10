(function (w, d) {
  'use strict'

  const form = d.forms[0]
  const srcList = form[2]
  const paste = form[3]
  const firstSrc = form[4]
  const prefix = form['prefix']
  let dataURLs = []
    
  const regex = {
    badCommas: /^(\s*\,*)+$/,
    badName:   /(^\s*((source:)|(courtesy:))?\s*)|(\s*$)/ig,
    badChars:  /(^Source:)|([\/\\\<\>\"\:])|(\&)/g
  }
	
	
  // --- Toggle Submit Button ---
	
  function toggleSubmit() {
    let srcsFilled = false
        
    if (!paste.hidden) {
      srcsFilled = !regex.badCommas.test(paste.value)
    } else {
      srcsFilled = Array.from(d.getElementsByName('source-name')).some(el => !!el.value)
    }
        
    form['generate'].disabled = !(srcsFilled && (form['final-mugs'].checked || form['premade'].checked))
  }
    
  srcList.addEventListener('input',  toggleSubmit)
	
  form['options'].addEventListener('change', toggleSubmit)

		
  // --- Add/Delete Source Text Fields ---
    
  function deleteTextField() {
    srcList.removeChild(this.parentElement)
    toggleSubmit()
  }
	
  function createTextField(val) {
    const group  = d.createElement('span')
    const text   = d.createElement('input')
    const button = d.createElement('input')
			
    text.type  = 'text'
    text.name  = 'source-name'
    text.value = val || ''
    text.maxLength   = 51
    text.placeholder = 'Type source name here'
		
    button.type = 'button'
    button.name = button.value = 'remove'
    button.className = 'material-icons'
    button.title     = 'Delete this source'
		
    group.appendChild(text)
    group.appendChild(button)
		
    return group
  }
	
  function addTextField() {
    const newField = createTextField(firstSrc.value)
			
    firstSrc.value = ''
    firstSrc.focus()
		
    srcList.insertBefore(newField, firstSrc.parentElement.nextElementSibling)
  }
    
  srcList.addEventListener('click', e => {
    if (e.target.name === 'add') addTextField()
    if (e.target.name === 'remove') deleteTextField.call(e.target)
  })

  firstSrc.addEventListener('keydown', e => {
    if (e.keyCode === 13) addTextField()
  })
    
    
  // --- Toggle Paste Mode --- 
	
  function toggleMode() {
    const isEntry = !paste.hidden
    const mode = `${isEntry ? 'Paste' : 'Entry'} Mode`
	    
    paste.hidden = isEntry
    this.value = mode
    this.title = `Switch to ${mode}`

    const focusEl = isEntry ? firstSrc : paste
        
    focusEl.focus()
		
    toggleSubmit()
  }
	
  form['mode-switch'].addEventListener('click', toggleMode)
    
    
  // --- Build Source Super ---
    
  function cleanFileName(str, p1, p2, p3) {
    if (p1) return 'Source'
    if (p2) return '_'
    if (p3) return 'and'
  }
    
  function buildCanvas(src) {
    const cnv  = d.createElement('canvas')
    const ctx  = cnv.getContext('2d')
		
    cnv.width  = 1280
    cnv.height = 720
		
    ctx.globalCompositeOperation = 'destination-over'
	    
    ctx.fillStyle = '#ffffff'
    ctx.font      = '25px Gotham'
    ctx.textAlign = 'center'
    ctx.fillText(src, 640, 684)
		
    const txtWd = Math.max(330, ctx.measureText(src).width + 40)
		
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)'
    ctx.fillRect(640 - txtWd / 2, 659, txtWd, 33)
		
    return {
      name: src.replace(regex.badChars, cleanFileName),
      url: cnv.toDataURL()
    }
  }
    
  function formatSources() {
    let srcs = []
    let msg  = []
		
    form.classList.add('loading')
        
    if (!paste.hidden) {
      srcs = paste.value.split(/\s*,\s*/)
    } else {
      d.getElementsByName('source-name').forEach(el => {
        srcs.push(el.value)
      })
    }
        
    srcs = srcs.filter(val => val)
        
    if (srcs.some(val => /^\s*courtesy:\s*/i.test(val))) {
      msg = srcs.length > 1 ? ['One or more of your sources begin', 'These'] : ['Your source begins', 'This']
      msg.push(prefix.checked ? 'replaced with "Source:"' : 'deleted')
					
      if(!confirm(`${msg[0]} with "Courtesy:" which is not permitted. ${msg[1]} will be ${msg[2]}.`)) {
        form.classList.remove('loading')
        return false
      }
    }

    srcs.forEach(src => {
      src = src.replace(regex.badName, '').slice(0, 51) 
      dataURLs.push(buildCanvas(prefix.checked ? `Source: ${src}` : src))
    })
        
    form['dataURL'].value = JSON.stringify(dataURLs)
  }

  form.onsubmit = formatSources
	
	
  // --- Tabbed Browsing ---
	
  function enableTabbedBrowsing(e) {
    if (e.keyCode === 9) {
      d.body.className = 'accessible'
      w.removeEventListener('keydown', enableTabbedBrowsing)
    }
  }
	
  w.addEventListener('keydown', enableTabbedBrowsing)
})(window, document)
