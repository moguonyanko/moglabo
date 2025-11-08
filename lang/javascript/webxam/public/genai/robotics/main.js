/**
 * @fileoverview ロボット工学系APIを確認するためのサンプルスクリプト
 */

class ImageDisplay {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  drawImage(img) {
    this.canvas.width = img.width
    this.canvas.height = img.height
    this.ctx.drawImage(img, 0, 0)
  }

  drawBoundingBoxes(bouding_box_list = []) {
    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2
    bouding_box_list.forEach(box => {
      const [ymin, xmin, ymax, xmax] = box
      this.ctx.strokeRect(ymin, xmin, xmax - xmin, ymax - ymin)
    })
  }
}

let imageDisplay = null
let previewResult = null

const changeListeners = {
  selectedImage: () => {
    window.dispatchEvent(new CustomEvent('cleardisplay'))
    const fileInput = document.getElementById('selected-files')
    const display = document.getElementById('selected-image')
    display.textContent = ''
    Array.from(fileInput.files).forEach(file => {
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        imageDisplay.clear()
        imageDisplay.drawImage(img)
        URL.revokeObjectURL(img.src)
      }
    })
  }
}

const updateDisplayListeners = {
  updateBoundingBox: (result) => {
    const output = document.querySelector('.detect-objects-example .output')
    output.textContent = JSON.stringify(result)
    const bbox_list = []
    for (let name in result) {
      const res = result[name]
      for (let i = 0; i < res.length; i++) {
        bbox_list.push(res[i].bounding_box)
      }
    }
    imageDisplay.drawBoundingBoxes(bbox_list)
  }
}

const clearDisplayListeners = {
  clearBoundingBox: () => {
    imageDisplay.clear()
    previewResult = null
  }
}

const clickListeners = {
  detectObjects: async () => {
    const file = document.getElementById('selected-files')
    const targets = document.getElementById('targets').value.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
    if (!file.files.length || targets.length <= 0) {
      return
    }
    const api_url = '/brest/genaiapi/generate/robotics/detect-objects'

    const formData = new FormData()
    for (let i = 0; i < file.files.length; i++) {
      formData.append('files', file.files[i])
    }
    formData.append('targets', JSON.stringify(targets))
    const response = await fetch(api_url, {
      method: 'POST',
      body: formData
    })
    previewResult = await response.json()
    window.dispatchEvent(new CustomEvent('updatedisplay', { detail: previewResult }))
  },
  redrawBbox: () => {
    window.dispatchEvent(new CustomEvent('updatedisplay', { detail: previewResult }))
  }
}

const listeners = {
  click: clickListeners,
  change: changeListeners
}

const init = () => {
  imageDisplay = new ImageDisplay(
    document.getElementById('selected-image')
  )

  const main = document.querySelector('main')
  Object.keys(listeners).forEach(eventType => {
    main.addEventListener(eventType, async event => {
      const { eventListener } = event.target.dataset
      if (typeof listeners[eventType][eventListener] === 'function') {
        try {
          event.target.setAttribute('disabled', 'true')
          await listeners[eventType][eventListener]()
        } finally {
          event.target.removeAttribute('disabled')
        }
      }
    })
  })

  window.addEventListener('updatedisplay', event => {
    Object.values(updateDisplayListeners)
      .forEach(listener => listener(event.detail))
  })

  window.addEventListener('cleardisplay', () => {
    Object.values(clearDisplayListeners)
      .forEach(listener => listener())
  })
}

init()
