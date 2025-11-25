/**
 * @fileoverview ロボット工学系APIを確認するためのサンプルスクリプト
 */

let imageLayer = null
let drawingLayer = null

let previewBoxList = {}
let previewPointList = {}


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

class DrawingLayer extends AbstractLayer {
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

  drawPoints(objects = []) {
    const { width: imgWidth, height: imgHeight } = imageLayer.size
    this.canvas.width = imgWidth
    this.canvas.height = imgHeight

    this.ctx.lineWidth = 2
    this.ctx.font = 'bold 0.8rem serif'

    objects.forEach(obj => {
      const { point, action, index, label } = obj
      const [y, x] = point
      this.ctx.beginPath()
      this.ctx.fillStyle = 'blue'
      this.ctx.arc(x, y, 10, 0, 2 * Math.PI)
      this.ctx.fill()
      this.ctx.fillStyle = 'red'
      if (label && action) {
        this.ctx.fillText(`[${index}]${label}:${action}`, x + 8, y - 8)
      }
    })
  }
}

const updateOutput = result => {
  const output = document.querySelector('.result-container .output')
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
  selectedImage: fileInput => {
    window.dispatchEvent(new CustomEvent('clear'))
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

const updateBboxListeners = {
  updateBbox: result => {
    updateOutput(result)
    drawingLayer.clear()
    const bbox_list = []
    for (let name in result) {
      const res = result[name]
      for (let i = 0; i < res.length; i++) {
        bbox_list.push(res[i].bounding_box)
      }
    }
    drawingLayer.draw(bbox_list)
  }
}

const updatePointsListeners = {
  updatePoints: objects => {
    updateOutput(objects)
    drawingLayer.clear()
    const objs = Object.values(objects).flat().map((obj, index) => {
      /**
       * ここでobjectsのプロパティを変更すると、元のオブジェクトも変更されてしまうため、
       * 新しいオブジェクトを生成してからindexを追加している。
       */
      return Object.assign({ index }, obj)
    })
    drawingLayer.drawPoints(objs)
  }
}

const clearListeners = {
  clearAll: () => {
    previewBoxList = {}
    previewPointList = {}
    drawingLayer.clear()
    imageLayer.clear()
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
      previewBoxList = await response.json()
      window.dispatchEvent(new CustomEvent('updatebbox',
        { detail: previewBoxList }))
    } catch (e) {
      window.dispatchEvent(new CustomEvent('genaierror', { detail: e }))
    }
  },
  redrawBbox: () => {
    window.dispatchEvent(new CustomEvent('updatebbox',
      { detail: previewBoxList }))
  },
  onClickOrchestration: async () => {
    const fileInput = document.getElementById('orchestration-target-file')
    if (!fileInput.files.length) {
      return
    }
    const taskSource = document.getElementById('task-source').value

    // ひとまず一つのファイルからタスクの説明を生成させる。
    const file = fileInput.files[0]
    const formData = new FormData()
    formData.append('files', file)
    formData.append('task_source', JSON.stringify([taskSource]))
    const api_url = '/brest/genaiapi/generate/robotics/task-orchestration'

    try {
      const response = await fetch(api_url, {
        method: 'POST',
        body: formData
      })
      previewPointList = await response.json()
      window.dispatchEvent(new CustomEvent('updatepoints',
        { detail: previewPointList }))
    } catch (e) {
      window.dispatchEvent(new CustomEvent('genaierror', { detail: e }))
    }
  },
  redrawObjects: () => {
    window.dispatchEvent(new CustomEvent('updatepoints',
      { detail: previewPointList }))
  }
}

const init = () => {
  imageLayer = new SelectedImageLayer(
    document.getElementById('selected-image')
  )
  drawingLayer = new DrawingLayer(
    document.getElementById('drawing-layer')
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
      changeListeners[eventListener](event.target)
    }
  })

  window.addEventListener('updatebbox', event => {
    Object.values(updateBboxListeners)
      .forEach(listener => listener(event.detail))
  })

  window.addEventListener('updatepoints', event => {
    Object.values(updatePointsListeners)
      .forEach(listener => listener(event.detail))
  })

  window.addEventListener('clear', () => {
    Object.values(clearListeners)
      .forEach(listener => listener())
  })

  window.addEventListener('genaierror', event => {
    alert(event.detail.message)
  })
}

init()
