/**
 * @fileoverview シェーダーの基本を学ぶためのサンプル
 * 参考:
 * https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context
 */

// import vsSource from './vssource.js'; 
// import fsSource from './fssource.js';

// 何でもかんでもCustomElementsにするとDOMとロジックの分離が
// 為されにくくなる。

const loadShader = ({ context, type, source }) => {
  const shader = context.createShader(type);
  context.shaderSource(shader, source);
  context.compileShader(shader);

  if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
    context.deleteShader(shader);
    const log = context.getShaderInfoLog(shader);
    throw new Error(`シェーダーのコンパイルに失敗しました: ${log}`);
  }

  return shader;
};

const initShaderProgram = ({ context, vsSource, fsSource }) => {
  const vertexShader = loadShader({
    context,
    type: context.VERTEX_SHADER,
    source: vsSource
  });
  const fragmentShader = loadShader({
    context,
    type: context.FRAGMENT_SHADER,
    source: fsSource
  });

  const shaderProgram = context.createProgram();
  context.attachShader(shaderProgram, vertexShader);
  context.attachShader(shaderProgram, fragmentShader);
  context.linkProgram(shaderProgram);

  if (!context.getProgramParameter(shaderProgram, context.LINK_STATUS)) {
    const log = context.getProgramInfoLog(shaderProgram);
    throw new Error(`シェーダープログラムの初期化に失敗しました: ${log}`);
  }

  return shaderProgram;
};

const createShaderProgramInfo = ({ context, vsSource, fsSource }) => {
  const program = initShaderProgram({
    context, vsSource, fsSource
  });
  const info = {
    program,
    attribLocations: {
      vertexPosition: context.getAttribLocation(program, 'aVertexPosition')
    },
    uniformLocations: {
      projectionMatrix: context.getUniformLocation(program, 'uProjectionMatrix'),
      modelViewMatrix: context.getUniformLocation(program, 'uModelViewMatrix')
    },
  };
  return info;
};

const initBuffers = context => {
  const positionBuffer = context.createBuffer();
  context.bindBuffer(context.ARRAY_BUFFER, positionBuffer);

  // 描画する形状の座標群
  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0,
    1.0, -1.0
  ];

  context.bufferData(context.ARRAY_BUFFER,
    new Float32Array(positions),
    context.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
};

const setVertexAttribute = ({ context, buffers, programInfo }) => {
  const numComponents = 2;
  const type = context.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  context.bindBuffer(context.ARRAY_BUFFER, buffers.position);
  context.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset);
  context.enableVertexAttribArray(
    programInfo.attribLocations.vertexPosition);
};

const drawScene = ({ context, programInfo, buffers }) => {
  context.clearColor(0.0, 0.0, 0.0, 1.0);
  context.clearDepth(1.0);
  context.enable(context.DEPTH_TEST);
  context.depthFunc(context.LEQUAL);
  context.clear(context.COLOR_BUFFER_BIT | context.DEPTH_BUFFER_BIT);

  const fieldOfViewRadian = 45 * Math.PI / 180;
  const aspect = context.canvas.clientWidth / context.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  mat4.perspective(
    projectionMatrix,
    fieldOfViewRadian,
    aspect,
    zNear,
    zFar
  );

  const modelViewMatrix = mat4.create();
  mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -6.0]);

  setVertexAttribute({ context, programInfo, buffers });

  context.useProgram(programInfo.program);

  context.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix);
  context.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix);

  const offset = 0;
  const vertexCount = 4;
  context.drawArrays(context.TRIANGLE_STRIP, offset, vertexCount);
};

const init = async () => {
  const context = document.querySelector('canvas').getContext('webgl');
  const vsSource = (await import('./vssource.js')).default;
  const fsSource = (await import('./fssource.js')).default;
  const programInfo = createShaderProgramInfo({ context, vsSource, fsSource });
  const buffers = initBuffers(context);
  drawScene({ context, programInfo, buffers });
};

init().then();