/**
 * @fileoverview ロボット工学系APIを確認するためのサンプルスクリプト
 */

let imageLayer = null
let bboxLayer = null
let previewResult = null

class AbstractLayer {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }
}

class SelectedImageLayer extends AbstractLayer {
  constructor(canvas) {
    super(canvas)
  }

  draw(img) {
    this.canvas.width = img.width
    this.canvas.height = img.height
    this.ctx.drawImage(img, 0, 0)
  }

  get size() {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    }
  }
}

class BoundingBoxLayer extends AbstractLayer {
  constructor(canvas) {
    super(canvas)
  }

  draw(bouding_box_list = []) {
    // 描画先のキャンバスの解像度を、画像レイヤーの解像度に合わせる
    const { width: imgWidth, height: imgHeight } = imageLayer.size
    this.canvas.width = imgWidth
    this.canvas.height = imgHeight

    this.ctx.strokeStyle = 'red'
    this.ctx.lineWidth = 2

    bouding_box_list.forEach(box => {
      const [ymin, xmin, ymax, xmax] = box
      const width = xmax - xmin
      const height = ymax - ymin

      this.ctx.strokeRect(xmin, ymin, width, height)
    })
  }
}

const updateOutput = result => {
  const output = document.querySelector('.detect-objects-example .output')
  if (result) {
    output.textContent = JSON.stringify(result)
  } else {
    output.textContent = ''
  }
}

const clearOutput = () => {
  updateOutput()
}

const changeListeners = {
  selectedImage: () => {
    window.dispatchEvent(new CustomEvent('cleardisplay'))
    const fileInput = document.getElementById('selected-files')
    Array.from(fileInput.files).forEach(file => {
      const img = document.createElement('img')
      img.src = URL.createObjectURL(file)
      img.onload = () => {
        imageLayer.clear()
        imageLayer.draw(img)
        URL.revokeObjectURL(img.src)
      }
    })
  }
}

const updateDisplayListeners = {
  updateBoundingBox: result => {
    updateOutput(result)
    bboxLayer.clear()
    const bbox_list = []
    for (let name in result) {
      const res = result[name]
      for (let i = 0; i < res.length; i++) {
        bbox_list.push(res[i].bounding_box)
      }
    }
    bboxLayer.draw(bbox_list)
  }
}

const clearDisplayListeners = {
  clearBoundingBox: () => {
    bboxLayer.clear()
    imageLayer.clear()
    previewResult = null
    clearOutput()
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
    try {
      const response = await fetch(api_url, {
        method: 'POST',
        body: formData
      })
      previewResult = await response.json()
      window.dispatchEvent(new CustomEvent('updatedisplay', { detail: previewResult }))
    } catch (e) {
      window.dispatchEvent(new CustomEvent('genaierror', { detail: e }))
    }
  },
  redrawBbox: () => {
    window.dispatchEvent(new CustomEvent('updatedisplay', { detail: previewResult }))
  }
}

const init = () => {
  imageLayer = new SelectedImageLayer(
    document.getElementById('selected-image')
  )
  bboxLayer = new BoundingBoxLayer(
    document.getElementById('bounding-box-layer')
  )

  const main = document.querySelector('main')

  main.addEventListener('click', async event => {
    const { eventListener } = event.target.dataset
    if (typeof clickListeners[eventListener] === 'function') {
      try {
        event.target.setAttribute('disabled', 'true')
        await clickListeners[eventListener]()
      } finally {
        event.target.removeAttribute('disabled')
      }
    }
  })

  main.addEventListener('change', event => {
    const { eventListener } = event.target.dataset
    if (typeof changeListeners[eventListener] === 'function') {
      changeListeners[eventListener]()
    }
  })

  window.addEventListener('updatedisplay', event => {
    Object.values(updateDisplayListeners)
      .forEach(listener => listener(event.detail))
  })

  window.addEventListener('cleardisplay', () => {
    Object.values(clearDisplayListeners)
      .forEach(listener => listener())
  })

  window.addEventListener('genaierror', event => {
    alert(event.detail.message)
  })
}

init()
