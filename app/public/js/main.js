function App(http) {
  this.video = document.getElementById('video')
  this.canvas = document.getElementById('canvas')
  this.ctx = this.canvas.getContext('2d')
  this.padding = 0
  this.clip = false
  this.imageResolution = [300, 300]
  this.present = false
  this.modelNames = [
    'multi-class',
  ]
}

App.prototype = {
  /**
   * Initialize the Facial Tracker
   * @return {[type]} [description]
   */
  init: function(http) {
    this.showCameraIcon()
    this.clearValues()
    this.http = http
    this.loadModels()
    .then(models => {
      this.models = models
      this.startTracking()
    })
    .catch(err => console.error('Load models Error ::', err))
  },

  loadModels: function() {
    return new Promise((resolve, reject) => {
      Promise.all(this.modelNames.map(name => {
        return Promise.all([
          name,
          tf.loadModel(`/models/${name}/model.json`),
          this.http.GET(`/models/${name}/classifiers.json`)
        ])
      }))
      .then(models => {
        resolve(models.map((modelObj) => {
          return {
            name: modelObj[0],
            model: modelObj[1],
            classifers: JSON.parse(modelObj[2])
          }
        }))
      })
      .catch(err => reject('Load Models Error :: ' + err))
    })
  },

  startTracking: function() {
    const tracker = new tracking.ObjectTracker('face')
    const ctx = this.ctx
    const padding = this.padding

    // Set the initial scale, steps and density values
    tracker.setInitialScale(4)
    tracker.setStepSize(2)
    tracker.setEdgesDensity(0.1)
    // Begin tracking face with video camera
    tracking.track('#video', tracker, { camera: true })
    tracker.on('track', (event) => {
      // Reset canvas frame
      this.present = false
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      event.data.forEach(rect => {
        this.present = true
        const { x, y, width, height } = rect
        this.drawFrame({
          x: x - (padding / 2),
          y: y - (padding / 2),
          width: width + padding,
          height: height + padding
        })
      })
    })
  },

  /**
   * Draw frame around the detected face being tracked
   * @param  {[type]} rect Face Rect
   * @return {[type]}      [description]
   */
  drawFrame: function(rect) {
    const ctx = this.ctx
    // Apply canvas to rect vallues
    ctx.strokeStyle = '#a64ceb'
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height)
    ctx.font = '11px Helvetica'
    ctx.fillStyle = "#fff"
    // ctx.fillText('x: ' + rect.x + 'px', rect.x + rect.width + 5, rect.y + 11)
    // ctx.fillText('y: ' + rect.y + 'px', rect.x + rect.width + 5, rect.y + 22)
  },

  execute: function() {
    if (this.clip) {
      this.showCameraIcon()
      this.clearValues()
      this.video.play()
    } else if (!this.clip && this.present) {
      this.showCancelIcon()
      this.video.pause()
      this.processImageWithRect()
    }
    this.clip = !this.clip
  },

  clearValues: function() {
    const frameIds = [
      "attractive",
      "gender",
      "happy",
      "sad",
      "threatening",
      "trustworthy"
    ]
    frameIds.forEach(f => document.getElementById(f).innerHTML = "")
  },

  showCancelIcon: function() {
    document.getElementById("button").innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       width="65px" height="65px" viewBox="0 0 65 65" enable-background="new 0 0 65 65" xml:space="preserve">
    <rect x="26.494" y="2.499" transform="matrix(0.7071 -0.7071 0.7071 0.7071 -13.4616 32.5025)" width="12.012" height="60"/>
    <rect x="26.494" y="2.5" transform="matrix(-0.7071 -0.7071 0.7071 -0.7071 32.5 78.4619)" width="12.011" height="60"/>
    </svg>`
  },

  showCameraIcon: function() {
    document.getElementById("button").innerHTML = `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       width="65px" height="65px" viewBox="0 0 65 65" enable-background="new 0 0 65 65" xml:space="preserve">
    <g>
      <defs>
        <rect id="SVGID_1_" x="-4397.715" y="-597.308" width="701" height="525"/>
      </defs>
      <use xlink:href="#SVGID_1_"  overflow="visible" fill="#E6E6E6"/>
      <clipPath id="SVGID_2_">
        <use xlink:href="#SVGID_1_"  overflow="visible"/>
      </clipPath>
      <g transform="matrix(1 0 0 1 0 0)" clip-path="url(#SVGID_2_)"></g>
    </g>
    <rect x="-4397.715" y="-597.308" fill="#E6E6E6" width="701" height="524"/>
    <g>
      <defs>
        <rect id="SVGID_3_" x="-3229.715" y="-597.308" width="701" height="525"/>
      </defs>
      <use xlink:href="#SVGID_3_"  overflow="visible" fill="#E6E6E6"/>
      <clipPath id="SVGID_4_">
        <use xlink:href="#SVGID_3_"  overflow="visible"/>
      </clipPath>
      <g transform="matrix(1 0 0 1 -2.441406e-004 0)" clip-path="url(#SVGID_4_)"></g>
    </g>
    <rect x="-3229.715" y="-597.308" fill="#E6E6E6" width="701" height="524"/>
    <g>
      <defs>
        <rect id="SVGID_5_" x="-2061.715" y="-597.308" width="701" height="525"/>
      </defs>
      <use xlink:href="#SVGID_5_"  overflow="visible" fill="#E6E6E6"/>
      <clipPath id="SVGID_6_">
        <use xlink:href="#SVGID_5_"  overflow="visible"/>
      </clipPath>
      <g transform="matrix(1 0 0 1 0 0)" clip-path="url(#SVGID_6_)"></g>
    </g>
    <rect x="-2061.715" y="-597.308" fill="#E6E6E6" width="701" height="524"/>
    <g>
      <defs>
        <rect id="SVGID_7_" x="-893.715" y="-597.308" width="701" height="525"/>
      </defs>
      <use xlink:href="#SVGID_7_"  overflow="visible" fill="#E6E6E6"/>
      <clipPath id="SVGID_8_">
        <use xlink:href="#SVGID_7_"  overflow="visible"/>
      </clipPath>
      <g transform="matrix(1 0 0 1 -6.103516e-005 0)" clip-path="url(#SVGID_8_)">
      </g>
    </g>
    <rect x="-893.715" y="-597.308" fill="#E6E6E6" width="701" height="524"/>
    <g>
      <defs>
        <rect id="SVGID_9_" x="274.285" y="-597.308" width="701" height="525"/>
      </defs>
      <use xlink:href="#SVGID_9_"  overflow="visible" fill="#E6E6E6"/>
      <clipPath id="SVGID_10_">
        <use xlink:href="#SVGID_9_"  overflow="visible"/>
      </clipPath>
      <g transform="matrix(1 0 0 1 0 0)" clip-path="url(#SVGID_10_)">
      </g>
    </g>
    <rect x="274.285" y="-597.308" fill="#E6E6E6" width="701" height="524"/>
    <g>
      <path d="M-4046.715,16.692c-14.888,0-27-12.112-27-27s12.112-27,27-27s27,12.112,27,27S-4031.827,16.692-4046.715,16.692z"/>
      <path d="M-4046.715-35.308c13.807,0,25,11.193,25,25s-11.193,25-25,25c-13.804,0-25-11.193-25-25S-4060.519-35.308-4046.715-35.308
         M-4046.715-39.308c-15.991,0-29,13.01-29,29s13.009,29,29,29c15.99,0,29-13.01,29-29S-4030.725-39.308-4046.715-39.308
        L-4046.715-39.308z"/>
      <path fill="none" stroke="#FFFFFF" stroke-width="2" stroke-miterlimit="10" d="M-4021.715-10.308c0,13.807-11.193,25-25,25
        c-13.804,0-25-11.193-25-25s11.196-25,25-25C-4032.908-35.308-4021.715-24.114-4021.715-10.308z"/>
    </g>
    <text transform="matrix(1 0 0 1 -4113.8711 -653.2998)" font-family="'CourierPrime'" font-size="16">BIOMETRIC BIAS</text>
    <rect x="-4195.046" y="-454.808" opacity="0.8" fill="#C1272D" width="296.329" height="120"/>
    <rect x="-4195.046" y="-313.474" opacity="0.8" fill="#C1272D" width="296.329" height="86.666"/>
    <text transform="matrix(1 0 0 1 -4149.8481 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">threat detection level</text>
    <text transform="matrix(1 0 0 1 -3951.9766 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="14"> </text>
    <text transform="matrix(1 0 0 1 -4153.8877 -356.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">85.4</text>
    <text transform="matrix(0.583 0 0 0.583 -3966.8096 -382.6118)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">%</text>
    <rect x="-4200.265" y="-287.224" fill="none" width="307.1" height="48"/>
    <text transform="matrix(1 0 0 1 -4172.6328 -277.6084)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">Recommended Course of Action</tspan><tspan x="-5.996" y="26.399" fill="#FFFFFF" font-family="'CourierPrime'" font-size="22">Detain &amp; Interrogate</tspan></text>
    <g>
      <path d="M-2878.715,16.692c-14.888,0-27-12.112-27-27s12.112-27,27-27s27,12.112,27,27S-2863.827,16.692-2878.715,16.692z"/>
      <path d="M-2878.715-35.308c13.807,0,25,11.193,25,25s-11.193,25-25,25c-13.805,0-25-11.193-25-25S-2892.52-35.308-2878.715-35.308
         M-2878.715-39.308c-15.99,0-29,13.01-29,29s13.01,29,29,29s29-13.01,29-29S-2862.725-39.308-2878.715-39.308L-2878.715-39.308z"/>
      <circle fill="none" stroke="#FFFFFF" stroke-width="2" stroke-miterlimit="10" cx="-2878.715" cy="-10.308" r="25"/>
    </g>
    <text transform="matrix(1 0 0 1 -2945.8711 -653.2998)" font-family="'CourierPrime'" font-size="16">BIOMETRIC BIAS</text>
    <rect x="-3027.046" y="-454.808" opacity="0.8" fill="#F15A24" width="296.329" height="120"/>
    <rect x="-3027.046" y="-313.474" opacity="0.8" fill="#F15A24" width="296.329" height="86.666"/>
    <text transform="matrix(1 0 0 1 -2981.8477 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">threat detection level</text>
    <text transform="matrix(1 0 0 1 -2783.9766 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="14"> </text>
    <text transform="matrix(1 0 0 1 -2985.8877 -356.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">61.2</text>
    <text transform="matrix(0.583 0 0 0.583 -2798.8096 -382.6118)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">%</text>
    <rect x="-3020.715" y="-287.224" fill="none" width="284" height="48"/>
    <text transform="matrix(1 0 0 1 -3004.6328 -277.6084)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">Recommended Course of Action</tspan><tspan x="13.791" y="26.399" fill="#FFFFFF" font-family="'CourierPrime'" font-size="22">Identify &amp; Search</tspan></text>
    <g>
      <path d="M-1710.715,16.692c-14.888,0-27-12.112-27-27s12.112-27,27-27s27,12.112,27,27S-1695.827,16.692-1710.715,16.692z"/>
      <path d="M-1710.715-35.308c13.807,0,25,11.193,25,25s-11.193,25-25,25c-13.805,0-25-11.193-25-25S-1724.52-35.308-1710.715-35.308
         M-1710.715-39.308c-15.99,0-29,13.01-29,29s13.01,29,29,29s29-13.01,29-29S-1694.725-39.308-1710.715-39.308L-1710.715-39.308z"/>
      <circle fill="none" stroke="#FFFFFF" stroke-width="2" stroke-miterlimit="10" cx="-1710.715" cy="-10.308" r="25"/>
    </g>
    <text transform="matrix(1 0 0 1 -1777.8711 -653.2998)" font-family="'CourierPrime'" font-size="16">BIOMETRIC BIAS</text>
    <rect x="-1859.046" y="-454.808" opacity="0.8" fill="#FBB03B" width="296.329" height="120"/>
    <rect x="-1859.046" y="-313.474" opacity="0.8" fill="#FBB03B" width="296.329" height="86.666"/>
    <text transform="matrix(1 0 0 1 -1813.8477 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">threat detection level</text>
    <text transform="matrix(1 0 0 1 -1615.9766 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="14"> </text>
    <text transform="matrix(1 0 0 1 -1817.8877 -356.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">47.9</text>
    <text transform="matrix(0.583 0 0 0.583 -1630.8096 -382.6118)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">%</text>
    <rect x="-1852.715" y="-287.224" fill="none" width="284" height="48"/>
    <text transform="matrix(1 0 0 1 -1836.6328 -277.6084)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">Recommended Course of Action</tspan><tspan x="26.982" y="26.399" fill="#FFFFFF" font-family="'CourierPrime'" font-size="22">Stop &amp; Question</tspan></text>
    <g>
      <path d="M-542.715,16.692c-14.888,0-27-12.112-27-27s12.112-27,27-27s27,12.112,27,27S-527.827,16.692-542.715,16.692z"/>
      <path d="M-542.715-35.308c13.807,0,25,11.193,25,25s-11.193,25-25,25c-13.805,0-25-11.193-25-25S-556.52-35.308-542.715-35.308
         M-542.715-39.308c-15.99,0-29,13.01-29,29s13.01,29,29,29s29-13.01,29-29S-526.725-39.308-542.715-39.308L-542.715-39.308z"/>
      <circle fill="none" stroke="#FFFFFF" stroke-width="2" stroke-miterlimit="10" cx="-542.715" cy="-10.308" r="25"/>
    </g>
    <text transform="matrix(1 0 0 1 -609.8711 -653.2998)" font-family="'CourierPrime'" font-size="16">BIOMETRIC BIAS</text>
    <rect x="-691.046" y="-454.808" opacity="0.8" fill="#29ABE2" width="296.329" height="120"/>
    <rect x="-691.046" y="-313.474" opacity="0.8" fill="#29ABE2" width="296.329" height="86.666"/>
    <text transform="matrix(1 0 0 1 -645.8477 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">threat detection level</text>
    <text transform="matrix(1 0 0 1 -447.9766 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="14"> </text>
    <text transform="matrix(1 0 0 1 -649.8877 -356.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">31.9</text>
    <text transform="matrix(0.583 0 0 0.583 -462.8096 -382.6118)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">%</text>
    <rect x="-684.715" y="-287.224" fill="none" width="284" height="48"/>
    <text transform="matrix(1 0 0 1 -668.6328 -277.6084)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">Recommended Course of Action</tspan><tspan x="13.791" y="26.399" fill="#FFFFFF" font-family="'CourierPrime'" font-size="22">Add to watch list</tspan></text>
    <g>
      <path d="M625.285,17.692c-15.439,0-28-12.561-28-28s12.561-28,28-28s28,12.561,28,28S640.725,17.692,625.285,17.692z"/>
      <path d="M625.285-35.308c13.807,0,25,11.193,25,25s-11.193,25-25,25c-13.805,0-25-11.193-25-25S611.48-35.308,625.285-35.308
         M625.285-41.308c-17.094,0-31,13.906-31,31s13.906,31,31,31s31-13.906,31-31S642.379-41.308,625.285-41.308L625.285-41.308z"/>
      <circle fill="none" stroke="#FFFFFF" stroke-width="3" stroke-miterlimit="10" cx="625.285" cy="-10.308" r="25"/>
    </g>
    <g>
      <path d="M32.5-287C19.543-287,9-276.458,9-263.5S19.543-240,32.5-240c12.959,0,23.5-10.542,23.5-23.5S45.459-287,32.5-287z"/>
      <path d="M32.5-294.5c-17.094,0-31,13.906-31,31s13.906,31,31,31s31-13.906,31-31S49.594-294.5,32.5-294.5z M32.5-237
        C17.889-237,6-248.888,6-263.5S17.889-290,32.5-290c14.613,0,26.5,11.888,26.5,26.5S47.113-237,32.5-237z"/>
    </g>
    <g>
      <path d="M32.5-126.5C19.543-126.5,9-115.958,9-103s10.543,23.5,23.5,23.5C45.459-79.5,56-90.042,56-103S45.459-126.5,32.5-126.5z"
        />
      <path d="M32.5-134c-17.094,0-31,13.906-31,31s13.906,31,31,31s31-13.906,31-31S49.594-134,32.5-134z M32.5-76.5
        C17.889-76.5,6-88.388,6-103s11.889-26.5,26.5-26.5c14.613,0,26.5,11.888,26.5,26.5S47.113-76.5,32.5-76.5z"/>
    </g>
    <text transform="matrix(1 0 0 1 558.1289 -653.2998)" font-family="'CourierPrime'" font-size="16">BIOMETRIC BIAS</text>
    <rect x="476.953" y="-454.808" opacity="0.8" fill="#7DBC19" width="296.33" height="120"/>
    <rect x="476.953" y="-313.474" opacity="0.8" fill="#7DBC19" width="296.33" height="86.666"/>
    <text transform="matrix(1 0 0 1 522.1523 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">threat detection level</text>
    <text transform="matrix(1 0 0 1 720.0234 -423.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="14"> </text>
    <text transform="matrix(1 0 0 1 518.1123 -356.6382)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">12.3</text>
    <text transform="matrix(0.583 0 0 0.583 705.1904 -382.6118)" fill="#FFFFFF" font-family="'CourierPrime'" font-size="78">%</text>
    <rect x="483.285" y="-287.224" fill="none" width="284" height="48"/>
    <text transform="matrix(1 0 0 1 499.3672 -277.6084)"><tspan x="0" y="0" fill="#FFFFFF" font-family="'CourierPrime'" font-size="15">Recommended Course of Action</tspan><tspan x="86.344" y="26.399" fill="#FFFFFF" font-family="'CourierPrime'" font-size="22">Ignore</tspan></text>
    <text transform="matrix(1 0 0 1 -2360.7188 343.5752)"><tspan x="0" y="0" font-family="'MyriadPro-Regular'" font-size="79.9191">Severe (red)</tspan><tspan x="397.671" y="0" font-family="'MyriadPro-Regular'" font-size="79.9191" letter-spacing="64">	</tspan><tspan x="479.515" y="0" font-family="'MyriadPro-Regular'" font-size="79.9191">severe risk</tspan><tspan x="0" y="95.903" font-family="'MyriadPro-Regular'" font-size="79.9191">High (orange)</tspan><tspan x="459.766" y="95.903" font-family="'MyriadPro-Regular'" font-size="79.9191" letter-spacing="2">	</tspan><tspan x="479.513" y="95.903" font-family="'MyriadPro-Regular'" font-size="79.9191">high risk</tspan><tspan x="0" y="191.806" font-family="'MyriadPro-Regular'" font-size="79.9191">Elevated (yellow)</tspan><tspan x="567.177" y="191.806" font-family="'MyriadPro-Regular'" font-size="79.9191" letter-spacing="135">	</tspan><tspan x="719.272" y="191.806" font-family="'MyriadPro-Regular'" font-size="79.9191">significant risk</tspan><tspan x="0" y="287.709" font-family="'MyriadPro-Regular'" font-size="79.9191">Guarded (blue)</tspan><tspan x="501.245" y="287.709" font-family="'MyriadPro-Regular'" font-size="79.9191" letter-spacing="201">	</tspan><tspan x="719.271" y="287.709" font-family="'MyriadPro-Regular'" font-size="79.9191">general risk</tspan><tspan x="0" y="383.611" font-family="'MyriadPro-Regular'" font-size="79.9191">Low (green)</tspan><tspan x="397.989" y="383.611" font-family="'MyriadPro-Regular'" font-size="79.9191" letter-spacing="64">	</tspan><tspan x="479.514" y="383.611" font-family="'MyriadPro-Regular'" font-size="79.9191">low risk</tspan></text>
    <text transform="matrix(1 0 0 1 1502.7959 -501.8877)"><tspan x="0" y="0" opacity="0.8" fill="#C1272D" font-family="'CourierPrime'" font-size="16">Red    = </tspan><tspan x="86.344" y="0" opacity="0.8" font-family="'CourierPrime'" font-size="16">severe risk</tspan><tspan x="0" y="19.2" opacity="0.8" fill="#F15A24" font-family="'CourierPrime'" font-size="16">Orange = </tspan><tspan x="86.344" y="19.2" opacity="0.8" font-family="'CourierPrime'" font-size="16">high risk</tspan><tspan x="0" y="38.4" opacity="0.8" fill="#FBB03B" font-family="'CourierPrime'" font-size="16">Yellow = </tspan><tspan x="86.344" y="38.4" opacity="0.8" font-family="'CourierPrime'" font-size="16">significant risk</tspan><tspan x="0" y="57.6" opacity="0.8" fill="#29ABE2" font-family="'CourierPrime'" font-size="16">Blue   = </tspan><tspan x="86.344" y="57.6" opacity="0.8" font-family="'CourierPrime'" font-size="16">general risk</tspan><tspan x="0" y="76.8" opacity="0.8" fill="#7DBC19" font-family="'CourierPrime'" font-size="16">Green  = </tspan><tspan x="86.344" y="76.8" opacity="0.8" font-family="'CourierPrime'" font-size="16">low risk</tspan></text>
    <text transform="matrix(1 0 0 1 1502.7959 -250.0547)"><tspan x="0" y="0" opacity="0.8" font-family="'CourierPrime'" font-size="16">80-100% </tspan><tspan x="76.75" y="0" opacity="0.8" fill="#C1272D" font-family="'CourierPrime'" font-size="16">= Red</tspan><tspan x="0" y="19.2" opacity="0.8" font-family="'CourierPrime'" font-size="16">60-79%  </tspan><tspan x="76.75" y="19.2" opacity="0.8" fill="#F15A24" font-family="'CourierPrime'" font-size="16">= Orange</tspan><tspan x="0" y="38.4" opacity="0.8" font-family="'CourierPrime'" font-size="16">40-59%  </tspan><tspan x="76.75" y="38.4" opacity="0.8" fill="#FBB03B" font-family="'CourierPrime'" font-size="16">= Yellow</tspan><tspan x="0" y="57.6" opacity="0.8" font-family="'CourierPrime'" font-size="16">20-39%  </tspan><tspan x="76.75" y="57.6" opacity="0.8" fill="#29ABE2" font-family="'CourierPrime'" font-size="16">= Blue</tspan><tspan x="0" y="76.8" opacity="0.8" font-family="'CourierPrime'" font-size="16">0-19%   </tspan><tspan x="76.75" y="76.8" opacity="0.8" fill="#7DBC19" font-family="'CourierPrime'" font-size="16">= Green</tspan></text>
    <rect x="1498.892" y="-657.557" fill="none" width="588.786" height="116.333"/>
    <text transform="matrix(1 0 0 1 1498.8916 -647.3013)"><tspan x="0" y="0" font-family="'CourierPrime'" font-size="16">So... been thinking about this UI and how to create an  </tspan><tspan x="0" y="19.2" font-family="'CourierPrime'" font-size="16">emotional affect on the viewer from the score results.  </tspan><tspan x="0" y="57.6" font-family="'CourierPrime'" font-size="16">The US department of homeland security uses a colour coding </tspan><tspan x="0" y="76.8" font-family="'CourierPrime'" font-size="16">system to identify the threat levels of “people of interest”.</tspan></text>
    <rect x="1498.892" y="-348.39" fill="none" width="588.787" height="89.333"/>
    <text transform="matrix(1 0 0 1 1498.8916 -338.1343)"><tspan x="0" y="0" font-family="'CourierPrime'" font-size="16">Since we are just focusing the project on “trustworthiness” </tspan><tspan x="0" y="19.2" font-family="'CourierPrime'" font-size="16">now as the parameter, what do you guys think of incorporating </tspan><tspan x="0" y="38.4" font-family="'CourierPrime'" font-size="16">something like this into the algorithm’s score results? </tspan></text>
    <rect x="1498.892" y="-96.391" fill="none" width="588.787" height="89.333"/>
    <text transform="matrix(1 0 0 1 1498.8916 -86.1348)"><tspan x="0" y="0" font-family="'CourierPrime'" font-size="16">We could then provide an additional layer of threat from the </tspan><tspan x="0" y="19.2" font-family="'CourierPrime'" font-size="16">AI, some kind of recommended course of action for authority </tspan><tspan x="0" y="38.399" font-family="'CourierPrime'" font-size="16">to take dependent on the threat level...</tspan></text>
    <rect x="2700.451" y="-398.078" fill="none" width="521.668" height="151.547"/>
    <text transform="matrix(1 0 0 1 2700.4512 -387.8218)"><tspan x="0" y="0" font-family="'CourierPrime'" font-size="16">What do you guys think of this? It definitely changes </tspan><tspan x="0" y="19.2" font-family="'CourierPrime'" font-size="16">the narrative of the project... too far off track? </tspan><tspan x="0" y="38.4" font-family="'CourierPrime'" font-size="16">have I watched too many black mirror episodes? Better </tspan><tspan x="0" y="57.6" font-family="'CourierPrime'" font-size="16">to stick to a “trustworthiness” outcome rather than </tspan><tspan x="0" y="76.799" font-family="'CourierPrime'" font-size="16">turn the dial up into suspicion and danger? </tspan><tspan x="0" y="115.2" font-family="'CourierPrime'" font-size="16">Thoughts?</tspan></text>
    <g>
      <path fill="#FFFFFF" d="M45-98.5c0,2.762-1.238,4-4,4H24c-2.762,0-4-1.238-4-4v-9c0-2.762,1.238-4,4-4h17c2.762,0,4,1.238,4,4
        V-98.5z"/>
      <path fill="#FFFFFF" d="M38.82-111.005c0,1.548-1.254,2.802-2.802,2.802h-7.037c-1.548,0-2.802-1.254-2.802-2.802l0,0
        c0-1.548,1.254-2.802,2.802-2.802h7.037C37.566-113.807,38.82-112.553,38.82-111.005L38.82-111.005z"/>
      <circle fill="none" stroke="#000000" stroke-width="2.5" stroke-miterlimit="10" cx="32.5" cy="-103" r="5.203"/>
      <circle cx="41.515" cy="-107.995" r="1.231"/>
    </g>
    <g>
      <path d="M32.5,1.5c-17.094,0-31,13.906-31,31s13.906,31,31,31s31-13.906,31-31S49.594,1.5,32.5,1.5z"/>
    </g>
    <g>
      <path fill="#FFFFFF" d="M47.5,38.133c0,3.313-1.487,4.796-4.801,4.796H22.301c-3.313,0-4.801-1.483-4.801-4.796V27.331
        c0-3.313,1.487-4.801,4.801-4.801h20.398c3.313,0,4.801,1.487,4.801,4.801V38.133z"/>
      <path fill="#FFFFFF" d="M40.084,23.123c0,1.86-1.507,3.363-3.362,3.363h-8.443c-1.855,0-3.362-1.503-3.362-3.363l0,0
        c0-1.855,1.507-3.358,3.362-3.358h8.443C38.577,19.765,40.084,21.268,40.084,23.123L40.084,23.123z"/>
      <circle fill="none" stroke="#000000" stroke-width="3" stroke-miterlimit="10" cx="32.5" cy="32.729" r="6.243"/>
      <circle cx="43.297" cy="26.76" r="1.5"/>
    </g>
    </svg>`
  },

  /**
   * Crop the image
   * @param  {[type]} crop [description]
   * @return {[type]}      [description]
   */
  processImageWithRect: function() {
    // Get Video Frame
    const videoFrame = this.videoFrame()
    // const image = document.getElementById("snap").src
    // Load image from img src
    this.predict(videoFrame)
  },

  /**
   * Snap a video frame
   * @return {Context} context of the video frame
   */
  videoFrame: function() {
    // Extract video parameters
    const video = this.video
    const vw = video.width
    const vh = video.height

    // Create a video frame canvas to snape an image from the video frame
    const frameCanvas = document.createElement('canvas')
    // Size the frame canvas
    frameCanvas.width = vw
    frameCanvas.height = vh
    const frameCtx = frameCanvas.getContext('2d')
    // Snap an image frame from the video
    frameCtx.drawImage(video, 0, 0, vw, vh)
    return frameCanvas.toDataURL()
  },

  loadAndProcessImg: function(img) {
    // const croppedImg = this.cropImage(img, frame)
    const resizedImg = this.resizeImage(img)
    const batchedImg = this.batchImage(resizedImg)
    return batchedImg
  },

  loadImage: async function(src) {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.src = src
      img.onload = () => resolve(tf.fromPixels(img))
      img.onerror = (e) => reject(e)
    })
  },

  cropImage: function(img, frame) {
    // Extract crop values
    const {
      x,
      y,
      width,
      height
    } = frame
    return img.slice([x, y, 0], [width, height, 3])
  },

  resizeImage: function(image) {
    return tf.image.resizeBilinear(image, [224, 224])
  },

  batchImage: function(image) {
    // Expand our tensor to have an additional dimension, whose size is 1
    const batchedImage = image.expandDims(0)
    // Turn pixel data into a float between -1 and 1.
    return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1))
  },

  predict: async function(imgSrc) {
    this.loadImage(imgSrc).then(img => {
      const processedImg = this.loadAndProcessImg(img)
      this.models.forEach(ml => {
        const {
          name,
          model,
          classifers
        } = ml

        model.predict(processedImg).data()
        .then(prediction => {

          let classes = {}

          prediction.forEach((predict, i) => {
            // Split the label for filtering
            const [
              classifier,
              cat
            ] = classifers[i].split("_")

            if (!classes[classifier]) {
              classes[classifier] = {
                category: [cat],
                values: [predict]
              }
            } else {
              const categories = classes[classifier]
              categories.category.push(cat)
              categories.values.push(predict)
            }
          })
          for (let className in classes) {
            if (classes.hasOwnProperty(className)) {
              // if (className !== "sad" && className !== "gender") {
                const predictions = classes[className]
                const confidence = Math.max(...predictions.values)
                const idx = predictions.values.indexOf(confidence)
                const prediction = predictions.category[idx]
                document.getElementById(className).innerHTML = prediction
              // }
            }
          }
        })
        .catch(err => console.error('prediction error ::', err))
      })
    })
    .catch(err => console.error('Load Image Error ::', err))
  },
}
