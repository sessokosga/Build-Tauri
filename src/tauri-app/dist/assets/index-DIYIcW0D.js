var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
let showWatermark = 0;
const debug = 0, debugOverlay = 0;
function ASSERT() {
}
function debugRect() {
}
function debugPoly() {
}
function debugCircle() {
}
function debugPoint() {
}
function debugLine() {
}
function debugOverlap() {
}
function debugText() {
}
function debugClear() {
}
function debugSaveCanvas() {
}
function debugSaveText() {
}
function debugSaveDataURL() {
}
const PI = Math.PI;
function abs(a) {
  return Math.abs(a);
}
function min(a, b) {
  return Math.min(a, b);
}
function max(a, b) {
  return Math.max(a, b);
}
function sign(a) {
  return Math.sign(a);
}
function mod(a, b = 1) {
  return (a % b + b) % b;
}
function clamp(a, b = 0, c = 1) {
  return a < b ? b : a > c ? c : a;
}
function percent(a, b, c) {
  return (c -= b) ? clamp((a - b) / c) : 0;
}
function lerp(a, b, c) {
  return b + clamp(a) * (c - b);
}
function distanceWrap(a, b, c = 1) {
  a = (a - b) % c;
  return 2 * a % c - a;
}
function lerpWrap(a, b, c, d = 1) {
  return c + clamp(a) * distanceWrap(b, c, d);
}
function distanceAngle(a, b) {
  return distanceWrap(a, b, 2 * PI);
}
function lerpAngle(a, b, c) {
  return lerpWrap(a, b, c, 2 * PI);
}
function smoothStep(a) {
  return a * a * (3 - 2 * a);
}
function nearestPowerOfTwo(a) {
  return 2 ** Math.ceil(Math.log2(a));
}
function isOverlapping(a, b, c, d = vec2$1()) {
  return 2 * abs(a.x - c.x) < b.x + d.x && 2 * abs(a.y - c.y) < b.y + d.y;
}
function isIntersecting(a, b, c, d) {
  c = c.subtract(d.scale(0.5));
  d = c.add(d);
  b = b.subtract(a);
  c = a.subtract(c);
  d = a.subtract(d);
  a = [-b.x, b.x, -b.y, b.y];
  b = [c.x, -d.x, c.y, -d.y];
  c = 0;
  d = 1;
  for (let e = 4; e--; ) if (a[e]) {
    const f = b[e] / a[e];
    if (0 > a[e]) {
      if (f > d) return false;
      c = max(f, c);
    } else {
      if (f < c) return false;
      d = min(f, d);
    }
  } else if (0 > b[e]) return false;
  return true;
}
function wave(a = 1, b = 1, c = time) {
  return b / 2 * (1 - Math.cos(c * a * 2 * PI));
}
function formatTime(a) {
  return (a / 60 | 0) + ":" + (10 > a % 60 ? "0" : "") + (a % 60 | 0);
}
function rand(a = 1, b = 0) {
  return b + Math.random() * (a - b);
}
function randInt(a, b = 0) {
  return Math.floor(rand(a, b));
}
function randSign() {
  return 2 * randInt(2) - 1;
}
function randVector(a = 1) {
  return new Vector2().setAngle(rand(2 * PI), a);
}
function randInCircle(a = 1, b = 0) {
  return 0 < a ? randVector(a * rand(b / a, 1) ** 0.5) : new Vector2();
}
function randColor(a = new Color(), b = new Color(0, 0, 0, 1), c = false) {
  return c ? a.lerp(b, rand()) : new Color(rand(a.r, b.r), rand(a.g, b.g), rand(a.b, b.b), rand(a.a, b.a));
}
class RandomGenerator {
  constructor(a) {
    this.seed = a;
  }
  float(a = 1, b = 0) {
    this.seed ^= this.seed << 13;
    this.seed ^= this.seed >>> 17;
    this.seed ^= this.seed << 5;
    return b + (a - b) * abs(this.seed % 1e8) / 1e8;
  }
  int(a, b = 0) {
    return Math.floor(this.float(a, b));
  }
  sign() {
    return 0.5 < this.float() ? 1 : -1;
  }
}
function vec2$1(a = 0, b) {
  return "number" == typeof a ? new Vector2(a, void 0 == b ? a : b) : new Vector2(a.x, a.y);
}
class Vector2 {
  constructor(a = 0, b = 0) {
    this.x = a;
    this.y = b;
    ASSERT(this.isValid());
  }
  set(a = 0, b = 0) {
    this.x = a;
    this.y = b;
    ASSERT(this.isValid());
    return this;
  }
  copy() {
    return new Vector2(this.x, this.y);
  }
  add(a) {
    return new Vector2(this.x + a.x, this.y + a.y);
  }
  subtract(a) {
    return new Vector2(this.x - a.x, this.y - a.y);
  }
  multiply(a) {
    return new Vector2(this.x * a.x, this.y * a.y);
  }
  divide(a) {
    return new Vector2(this.x / a.x, this.y / a.y);
  }
  scale(a) {
    return new Vector2(this.x * a, this.y * a);
  }
  length() {
    return this.lengthSquared() ** 0.5;
  }
  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }
  distance(a) {
    return this.distanceSquared(a) ** 0.5;
  }
  distanceSquared(a) {
    return (this.x - a.x) ** 2 + (this.y - a.y) ** 2;
  }
  normalize(a = 1) {
    const b = this.length();
    return b ? this.scale(a / b) : new Vector2(0, a);
  }
  clampLength(a = 1) {
    const b = this.length();
    return b > a ? this.scale(a / b) : this;
  }
  dot(a) {
    return this.x * a.x + this.y * a.y;
  }
  cross(a) {
    return this.x * a.y - this.y * a.x;
  }
  angle() {
    return Math.atan2(this.x, this.y);
  }
  setAngle(a = 0, b = 1) {
    this.x = b * Math.sin(a);
    this.y = b * Math.cos(a);
    return this;
  }
  rotate(a) {
    const b = Math.cos(a);
    a = Math.sin(a);
    return new Vector2(this.x * b - this.y * a, this.x * a + this.y * b);
  }
  setDirection(a, b = 1) {
    a = mod(a, 4);
    return vec2$1(a % 2 ? a - 1 ? -b : b : 0, a % 2 ? 0 : a ? -b : b);
  }
  direction() {
    return abs(this.x) > abs(this.y) ? 0 > this.x ? 3 : 1 : 0 > this.y ? 2 : 0;
  }
  invert() {
    return new Vector2(this.y, -this.x);
  }
  floor() {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }
  area() {
    return abs(this.x * this.y);
  }
  lerp(a, b) {
    return this.add(a.subtract(this).scale(clamp(b)));
  }
  arrayCheck(a) {
    return 0 <= this.x && 0 <= this.y && this.x < a.x && this.y < a.y;
  }
  toString(a = 3) {
  }
  isValid() {
    return "number" == typeof this.x && !isNaN(this.x) && "number" == typeof this.y && !isNaN(this.y);
  }
}
function rgb$1(a, b, c, d) {
  return new Color(a, b, c, d);
}
function hsl(a, b, c, d) {
  return new Color().setHSLA(a, b, c, d);
}
function isColor(a) {
  return a instanceof Color;
}
class Color {
  constructor(a = 1, b = 1, c = 1, d = 1) {
    this.r = a;
    this.g = b;
    this.b = c;
    this.a = d;
    ASSERT(this.isValid());
  }
  set(a = 1, b = 1, c = 1, d = 1) {
    this.r = a;
    this.g = b;
    this.b = c;
    this.a = d;
    ASSERT(this.isValid());
    return this;
  }
  copy() {
    return new Color(this.r, this.g, this.b, this.a);
  }
  add(a) {
    return new Color(this.r + a.r, this.g + a.g, this.b + a.b, this.a + a.a);
  }
  subtract(a) {
    return new Color(this.r - a.r, this.g - a.g, this.b - a.b, this.a - a.a);
  }
  multiply(a) {
    return new Color(this.r * a.r, this.g * a.g, this.b * a.b, this.a * a.a);
  }
  divide(a) {
    return new Color(this.r / a.r, this.g / a.g, this.b / a.b, this.a / a.a);
  }
  scale(a, b = a) {
    return new Color(this.r * a, this.g * a, this.b * a, this.a * b);
  }
  clamp() {
    return new Color(clamp(this.r), clamp(this.g), clamp(this.b), clamp(this.a));
  }
  lerp(a, b) {
    return this.add(a.subtract(this).scale(clamp(b)));
  }
  setHSLA(a = 0, b = 0, c = 1, d = 1) {
    a = mod(a, 1);
    b = clamp(b);
    c = clamp(c);
    b = 0.5 > c ? c * (1 + b) : c + b - c * b;
    c = 2 * c - b;
    const e = (f, g, k) => 1 > 6 * (k = mod(k, 1)) ? f + 6 * (g - f) * k : 1 > 2 * k ? g : 2 > 3 * k ? f + (g - f) * (4 - 6 * k) : f;
    this.r = e(c, b, a + 1 / 3);
    this.g = e(c, b, a);
    this.b = e(c, b, a - 1 / 3);
    this.a = d;
    ASSERT(this.isValid());
    return this;
  }
  HSLA() {
    const a = clamp(this.r), b = clamp(this.g), c = clamp(this.b), d = clamp(this.a), e = Math.max(a, b, c), f = Math.min(a, b, c), g = (e + f) / 2;
    let k = 0, h = 0;
    if (e != f) {
      let m = e - f;
      h = 0.5 < g ? m / (2 - e - f) : m / (e + f);
      a == e ? k = (b - c) / m + (b < c ? 6 : 0) : b == e ? k = (c - a) / m + 2 : c == e && (k = (a - b) / m + 4);
    }
    return [k / 6, h, g, d];
  }
  mutate(a = 0.05, b = 0) {
    return new Color(this.r + rand(a, -a), this.g + rand(a, -a), this.b + rand(a, -a), this.a + rand(b, -b)).clamp();
  }
  toString(a = true) {
    const b = (c) => (16 > (c = 255 * clamp(c) | 0) ? "0" : "") + c.toString(16);
    return "#" + b(this.r) + b(this.g) + b(this.b) + (a ? b(this.a) : "");
  }
  setHex(a) {
    ASSERT("string" == typeof a && "#" == a[0]);
    ASSERT([4, 5, 7, 9].includes(a.length));
    6 > a.length ? (this.r = clamp(parseInt(a[1], 16) / 15), this.g = clamp(parseInt(a[2], 16) / 15), this.b = clamp(parseInt(a[3], 16) / 15), this.a = 5 == a.length ? clamp(parseInt(a[4], 16) / 15) : 1) : (this.r = clamp(parseInt(a.slice(1, 3), 16) / 255), this.g = clamp(parseInt(a.slice(3, 5), 16) / 255), this.b = clamp(parseInt(a.slice(5, 7), 16) / 255), this.a = 9 == a.length ? clamp(parseInt(a.slice(7, 9), 16) / 255) : 1);
    ASSERT(this.isValid());
    return this;
  }
  rgbaInt() {
    const a = 255 * clamp(this.r) | 0, b = 255 * clamp(this.g) << 8, c = 255 * clamp(this.b) << 16, d = 255 * clamp(this.a) << 24;
    return a + b + c + d;
  }
  isValid() {
    return "number" == typeof this.r && !isNaN(this.r) && "number" == typeof this.g && !isNaN(this.g) && "number" == typeof this.b && !isNaN(this.b) && "number" == typeof this.a && !isNaN(this.a);
  }
}
const WHITE = rgb$1(), BLACK = rgb$1(0, 0, 0), GRAY = rgb$1(0.5, 0.5, 0.5), RED = rgb$1(1, 0, 0), ORANGE = rgb$1(1, 0.5, 0), YELLOW = rgb$1(1, 1, 0), GREEN = rgb$1(0, 1, 0), CYAN = rgb$1(0, 1, 1), BLUE = rgb$1(0, 0, 1), PURPLE = rgb$1(0.5, 0, 1), MAGENTA = rgb$1(1, 0, 1);
class Timer {
  constructor(a) {
    this.time = void 0 == a ? void 0 : time + a;
    this.setTime = a;
  }
  set(a = 0) {
    this.time = time + a;
    this.setTime = a;
  }
  unset() {
    this.time = void 0;
  }
  isSet() {
    return void 0 != this.time;
  }
  active() {
    return time < this.time;
  }
  elapsed() {
    return time >= this.time;
  }
  get() {
    return this.isSet() ? time - this.time : 0;
  }
  getPercent() {
    return this.isSet() ? percent(this.time - time, this.setTime, 0) : 0;
  }
  toString() {
  }
  valueOf() {
    return this.get();
  }
}
let cameraPos = vec2$1(), cameraScale = 32, canvasMaxSize = vec2$1(1920, 1080), canvasFixedSize = vec2$1(), canvasPixelated = true, tilesPixelated = true, fontDefault = "arial", showSplashScreen = false, headlessMode = false, glEnable = true, glOverlay = true, tileSizeDefault = vec2$1(16), tileFixBleedScale = 0, enablePhysicsSolver = true, objectDefaultMass = 1, objectDefaultDamping = 1, objectDefaultAngleDamping = 1, objectDefaultElasticity = 0, objectDefaultFriction = 0.8, objectMaxSpeed = 1, gravity = 0, particleEmitRateScale = 1, gamepadsEnable = true, gamepadDirectionEmulateStick = true, inputWASDEmulateDirection = true, touchInputEnable = true, touchGamepadEnable = false, touchGamepadAnalog = true, touchGamepadSize = 99, touchGamepadAlpha = 0.3, vibrateEnable = true, soundEnable = true, soundVolume = 0.3, soundDefaultRange = 40, soundDefaultTaper = 0.7, medalDisplayTime = 5, medalDisplaySlideTime = 0.5, medalDisplaySize = vec2$1(640, 80), medalDisplayIconSize = 50, medalsPreventUnlock = false;
function setCameraPos(a) {
  cameraPos = a;
}
function setCameraScale(a) {
  cameraScale = a;
}
function setCanvasMaxSize(a) {
  canvasMaxSize = a;
}
function setCanvasFixedSize(a) {
  canvasFixedSize = a;
}
function setCanvasPixelated(a) {
  canvasPixelated = a;
}
function setTilesPixelated(a) {
  tilesPixelated = a;
}
function setFontDefault(a) {
  fontDefault = a;
}
function setShowSplashScreen(a) {
  showSplashScreen = a;
}
function setHeadlessMode(a) {
  headlessMode = a;
}
function setGlEnable(a) {
  glEnable = a;
}
function setGlOverlay(a) {
  glOverlay = a;
}
function setTileSizeDefault(a) {
  tileSizeDefault = a;
}
function setTileFixBleedScale(a) {
  tileFixBleedScale = a;
}
function setEnablePhysicsSolver(a) {
  enablePhysicsSolver = a;
}
function setObjectDefaultMass(a) {
  objectDefaultMass = a;
}
function setObjectDefaultDamping(a) {
  objectDefaultDamping = a;
}
function setObjectDefaultAngleDamping(a) {
  objectDefaultAngleDamping = a;
}
function setObjectDefaultElasticity(a) {
  objectDefaultElasticity = a;
}
function setObjectDefaultFriction(a) {
  objectDefaultFriction = a;
}
function setObjectMaxSpeed(a) {
  objectMaxSpeed = a;
}
function setGravity(a) {
  gravity = a;
}
function setParticleEmitRateScale(a) {
  particleEmitRateScale = a;
}
function setGamepadsEnable(a) {
  gamepadsEnable = a;
}
function setGamepadDirectionEmulateStick(a) {
  gamepadDirectionEmulateStick = a;
}
function setInputWASDEmulateDirection(a) {
  inputWASDEmulateDirection = a;
}
function setTouchInputEnable(a) {
  touchInputEnable = a;
}
function setTouchGamepadEnable(a) {
  touchGamepadEnable = a;
}
function setTouchGamepadAnalog(a) {
  touchGamepadAnalog = a;
}
function setTouchGamepadSize(a) {
  touchGamepadSize = a;
}
function setTouchGamepadAlpha(a) {
  touchGamepadAlpha = a;
}
function setVibrateEnable(a) {
  vibrateEnable = a;
}
function setSoundEnable(a) {
  soundEnable = a;
}
function setSoundVolume(a) {
  soundVolume = a;
  soundEnable && !headlessMode && audioGainNode && (audioGainNode.gain.value = a);
}
function setSoundDefaultRange(a) {
  soundDefaultRange = a;
}
function setSoundDefaultTaper(a) {
  soundDefaultTaper = a;
}
function setMedalDisplayTime(a) {
  medalDisplayTime = a;
}
function setMedalDisplaySlideTime(a) {
  medalDisplaySlideTime = a;
}
function setMedalDisplaySize(a) {
  medalDisplaySize = a;
}
function setMedalDisplayIconSize(a) {
  medalDisplayIconSize = a;
}
function setMedalsPreventUnlock(a) {
  medalsPreventUnlock = a;
}
function setShowWatermark(a) {
  showWatermark = a;
}
function setDebugKey(a) {
}
class EngineObject {
  constructor(a = vec2$1(), b = vec2$1(1), c, d = 0, e = new Color(), f = 0) {
    this.pos = a.copy();
    this.size = b;
    this.drawSize = void 0;
    this.tileInfo = c;
    this.angle = d;
    this.color = e;
    this.additiveColor = void 0;
    this.mirror = false;
    this.mass = objectDefaultMass;
    this.damping = objectDefaultDamping;
    this.angleDamping = objectDefaultAngleDamping;
    this.elasticity = objectDefaultElasticity;
    this.friction = objectDefaultFriction;
    this.gravityScale = 1;
    this.renderOrder = f;
    this.velocity = vec2$1();
    this.angleVelocity = 0;
    this.spawnTime = time;
    this.children = [];
    this.clampSpeedLinear = true;
    this.parent = void 0;
    this.localPos = vec2$1();
    this.localAngle = 0;
    this.collideRaycast = this.isSolid = this.collideSolidObjects = this.collideTiles = false;
    engineObjects.push(this);
  }
  updateTransforms() {
    const a = this.parent;
    if (a) {
      const b = a.getMirrorSign();
      this.pos = this.localPos.multiply(vec2$1(b, 1)).rotate(-a.angle).add(a.pos);
      this.angle = b * this.localAngle + a.angle;
    }
    for (const b of this.children) b.updateTransforms();
  }
  update() {
    if (!this.parent) {
      if (this.clampSpeedLinear) this.velocity.x = clamp(this.velocity.x, -objectMaxSpeed, objectMaxSpeed), this.velocity.y = clamp(this.velocity.y, -objectMaxSpeed, objectMaxSpeed);
      else {
        var a = this.velocity.lengthSquared();
        a > objectMaxSpeed * objectMaxSpeed && (a = objectMaxSpeed / a ** 0.5, this.velocity.x *= a, this.velocity.y *= a);
      }
      a = this.pos.copy();
      this.velocity.x *= this.damping;
      this.velocity.y *= this.damping;
      this.mass && (this.velocity.y += gravity * this.gravityScale);
      this.pos.x += this.velocity.x;
      this.pos.y += this.velocity.y;
      this.angle += this.angleVelocity *= this.angleDamping;
      ASSERT(0 <= this.angleDamping && 1 >= this.angleDamping);
      ASSERT(0 <= this.damping && 1 >= this.damping);
      if (enablePhysicsSolver && this.mass) {
        var b = 0 > this.velocity.y;
        if (this.groundObject) {
          var c = this.groundObject.velocity ? this.groundObject.velocity.x : 0;
          this.velocity.x = c + (this.velocity.x - c) * this.friction;
          this.groundObject = 0;
        }
        if (this.collideSolidObjects) for (var d of engineObjectsCollide) {
          if (!this.isSolid && !d.isSolid || d.destroyed || d.parent || d == this) continue;
          if (!isOverlapping(this.pos, this.size, d.pos, d.size)) continue;
          c = this.collideWithObject(d);
          var e = d.collideWithObject(this);
          if (!c || !e) continue;
          if (isOverlapping(a, this.size, d.pos, d.size)) {
            c = a.subtract(d.pos);
            e = c.length();
            c = 0.01 > e ? randVector(1e-3) : c.scale(1e-3 / e);
            this.velocity = this.velocity.add(c);
            d.mass && (d.velocity = d.velocity.subtract(c));
            continue;
          }
          e = this.size.add(d.size);
          var f = 2 * (a.y - d.pos.y) > e.y + gravity;
          const k = 2 * abs(a.y - d.pos.y) < e.y;
          var g = 2 * abs(a.x - d.pos.x) < e.x;
          c = max(this.elasticity, d.elasticity);
          if (f || g || !k) {
            if (this.pos.y = d.pos.y + (e.y / 2 + 1e-3) * sign(a.y - d.pos.y), d.groundObject && b || !d.mass) b && (this.groundObject = d), this.velocity.y *= -c;
            else if (d.mass) {
              g = (this.mass * this.velocity.y + d.mass * d.velocity.y) / (this.mass + d.mass);
              const h = d.velocity.y * (d.mass - this.mass) / (this.mass + d.mass) + 2 * this.velocity.y * this.mass / (this.mass + d.mass);
              this.velocity.y = lerp(c, g, this.velocity.y * (this.mass - d.mass) / (this.mass + d.mass) + 2 * d.velocity.y * d.mass / (this.mass + d.mass));
              d.velocity.y = lerp(c, g, h);
            }
          }
          !f && k && (this.pos.x = d.pos.x + (e.x / 2 + 1e-3) * sign(a.x - d.pos.x), d.mass ? (e = (this.mass * this.velocity.x + d.mass * d.velocity.x) / (this.mass + d.mass), f = d.velocity.x * (d.mass - this.mass) / (this.mass + d.mass) + 2 * this.velocity.x * this.mass / (this.mass + d.mass), this.velocity.x = lerp(c, e, this.velocity.x * (this.mass - d.mass) / (this.mass + d.mass) + 2 * d.velocity.x * d.mass / (this.mass + d.mass)), d.velocity.x = lerp(c, e, f)) : this.velocity.x *= -c);
        }
        if (this.collideTiles && tileCollisionTest(this.pos, this.size, this) && !tileCollisionTest(a, this.size, this)) {
          d = tileCollisionTest(vec2$1(a.x, this.pos.y), this.size, this);
          c = tileCollisionTest(vec2$1(this.pos.x, a.y), this.size, this);
          if (d || !c) this.velocity.y *= -this.elasticity, (this.groundObject = b) ? this.pos.y = (a.y - this.size.y / 2 | 0) + this.size.y / 2 + 1e-4 : this.pos.y = a.y;
          c && (this.pos.x = a.x, this.velocity.x *= -this.elasticity);
        }
      }
    }
  }
  render() {
    drawTile(this.pos, this.drawSize || this.size, this.tileInfo, this.color, this.angle, this.mirror, this.additiveColor);
  }
  destroy() {
    if (!this.destroyed) {
      this.destroyed = 1;
      this.parent && this.parent.removeChild(this);
      for (const a of this.children) a.destroy(a.parent = 0);
    }
  }
  localToWorld(a) {
    return this.pos.add(a.rotate(-this.angle));
  }
  worldToLocal(a) {
    return a.subtract(this.pos).rotate(this.angle);
  }
  localToWorldVector(a) {
    return a.rotate(this.angle);
  }
  worldToLocalVector(a) {
    return a.rotate(-this.angle);
  }
  collideWithTile(a, b) {
    return 0 < a;
  }
  collideWithObject(a) {
    return true;
  }
  getAliveTime() {
    return time - this.spawnTime;
  }
  applyAcceleration(a) {
    this.mass && (this.velocity = this.velocity.add(a));
  }
  applyForce(a) {
    this.applyAcceleration(a.scale(1 / this.mass));
  }
  getMirrorSign() {
    return this.mirror ? -1 : 1;
  }
  addChild(a, b = vec2$1(), c = 0) {
    ASSERT(!a.parent && !this.children.includes(a));
    this.children.push(a);
    a.parent = this;
    a.localPos = b.copy();
    a.localAngle = c;
  }
  removeChild(a) {
    ASSERT(a.parent == this && this.children.includes(a));
    this.children.splice(this.children.indexOf(a), 1);
    a.parent = 0;
  }
  setCollision(a = true, b = true, c = true, d = true) {
    this.collideSolidObjects = a;
    this.isSolid = b;
    this.collideTiles = c;
    this.collideRaycast = d;
  }
  toString() {
  }
  renderDebugInfo() {
  }
}
let mainCanvas, mainContext, overlayCanvas, overlayContext, mainCanvasSize = vec2$1(), textureInfos = [], drawCount;
function tile(a = vec2$1(), b = tileSizeDefault, c = 0, d = 0) {
  if (headlessMode) return new TileInfo();
  "number" === typeof b && (b = vec2$1(b));
  var e = textureInfos[c];
  const f = b.add(vec2$1(2 * d));
  "number" === typeof a && (e = e.size.x / f.x | 0, a = 0 < e ? vec2$1(a % e, a / e | 0) : vec2$1());
  a = vec2$1(a.x * f.x + d, a.y * f.y + d);
  return new TileInfo(a, b, c, d);
}
class TileInfo {
  constructor(a = vec2$1(), b = tileSizeDefault, c = 0, d = 0) {
    this.pos = a.copy();
    this.size = b.copy();
    this.textureIndex = c;
    this.padding = d;
  }
  offset(a) {
    return new TileInfo(this.pos.add(a), this.size, this.textureIndex);
  }
  frame(a) {
    return this.offset(vec2$1(a * (this.size.x + 2 * this.padding), 0));
  }
  getTextureInfo() {
    return textureInfos[this.textureIndex];
  }
}
class TextureInfo {
  constructor(a) {
    this.image = a;
    this.size = vec2$1(a.width, a.height);
    this.glTexture = glEnable && glCreateTexture(a);
  }
}
function screenToWorld(a) {
  return new Vector2((a.x - mainCanvasSize.x / 2 + 0.5) / cameraScale + cameraPos.x, (a.y - mainCanvasSize.y / 2 + 0.5) / -cameraScale + cameraPos.y);
}
function worldToScreen(a) {
  return new Vector2((a.x - cameraPos.x) * cameraScale + mainCanvasSize.x / 2 - 0.5, (a.y - cameraPos.y) * -cameraScale + mainCanvasSize.y / 2 - 0.5);
}
function getCameraSize() {
  return mainCanvasSize.scale(1 / cameraScale);
}
function drawTile(a, b = vec2$1(1), c, d = new Color(), e = 0, f, g = new Color(0, 0, 0, 0), k = glEnable, h, m) {
  const n = c && c.getTextureInfo();
  if (k) if (h && (a = screenToWorld(a), b = b.scale(1 / cameraScale)), n) {
    var l = vec2$1(1).divide(n.size);
    k = c.pos.x * l.x;
    h = c.pos.y * l.y;
    m = c.size.x * l.x;
    const p = c.size.y * l.y;
    l = l.scale(tileFixBleedScale);
    glSetTexture(n.glTexture);
    glDraw(a.x, a.y, f ? -b.x : b.x, b.y, e, k + l.x, h + l.y, k - l.x + m, h - l.y + p, d.rgbaInt(), g.rgbaInt());
  } else glDraw(a.x, a.y, b.x, b.y, e, 0, 0, 0, 0, 0, d.rgbaInt());
  else showWatermark && ++drawCount, b = vec2$1(b.x, -b.y), drawCanvas2D(a, b, e, f, (p) => {
    if (n) {
      const q = c.pos.x + tileFixBleedScale, r = c.pos.y + tileFixBleedScale, x = c.size.x - 2 * tileFixBleedScale, v = c.size.y - 2 * tileFixBleedScale;
      p.globalAlpha = d.a;
      p.drawImage(n.image, q, r, x, v, -0.5, -0.5, 1, 1);
      p.globalAlpha = 1;
    } else p.fillStyle = d, p.fillRect(-0.5, -0.5, 1, 1);
  }, h, m);
}
function drawRect(a, b, c, d, e, f, g) {
  drawTile(a, b, void 0, c, d, false, void 0, e, f, g);
}
function drawLine(a, b, c = 0.1, d, e, f, g) {
  b = vec2$1((b.x - a.x) / 2, (b.y - a.y) / 2);
  c = vec2$1(c, 2 * b.length());
  drawRect(a.add(b), c, d, b.angle(), e, f, g);
}
function drawPoly(a, b = new Color(), c = 0, d = new Color(0, 0, 0), e, f = mainContext) {
  f.fillStyle = b.toString();
  f.beginPath();
  for (const g of e ? a : a.map(worldToScreen)) f.lineTo(g.x, g.y);
  f.closePath();
  f.fill();
  c && (f.strokeStyle = d.toString(), f.lineWidth = e ? c : c * cameraScale, f.stroke());
}
function drawEllipse(a, b = 1, c = 1, d = 0, e = new Color(), f = 0, g = new Color(0, 0, 0), k, h = mainContext) {
  k || (a = worldToScreen(a), b *= cameraScale, c *= cameraScale, f *= cameraScale);
  h.fillStyle = e.toString();
  h.beginPath();
  h.ellipse(a.x, a.y, b, c, d, 0, 9);
  h.fill();
  f && (h.strokeStyle = g.toString(), h.lineWidth = f, h.stroke());
}
function drawCircle(a, b = 1, c = new Color(), d = 0, e = new Color(0, 0, 0), f, g = mainContext) {
  drawEllipse(a, b, b, 0, c, d, e, f, g);
}
function drawCanvas2D(a, b, c, d, e, f, g = mainContext) {
  f || (a = worldToScreen(a), b = b.scale(cameraScale));
  g.save();
  g.translate(a.x + 0.5, a.y + 0.5);
  g.rotate(c);
  g.scale(d ? -b.x : b.x, -b.y);
  e(g);
  g.restore();
}
function drawText(a, b, c = 1, d, e = 0, f, g, k, h, m = mainContext) {
  drawTextScreen(a, worldToScreen(b), c * cameraScale, d, e * cameraScale, f, g, k, h, m);
}
function drawTextOverlay(a, b, c = 1, d, e = 0, f, g, k, h) {
  drawText(a, b, c, d, e, f, g, k, h, overlayContext);
}
function drawTextScreen(a, b, c = 1, d = new Color(), e = 0, f = new Color(0, 0, 0), g = "center", k = fontDefault, h, m = overlayContext) {
  m.fillStyle = d.toString();
  m.lineWidth = e;
  m.strokeStyle = f.toString();
  m.textAlign = g;
  m.font = c + "px " + k;
  m.textBaseline = "middle";
  m.lineJoin = "round";
  b = b.copy();
  (a + "").split("\n").forEach((n) => {
    e && m.strokeText(n, b.x, b.y, h);
    m.fillText(n, b.x, b.y, h);
    b.y += c;
  });
}
function setBlendMode(a, b = glEnable, c) {
  b ? glAdditive = a : (c || (c = mainContext), c.globalCompositeOperation = a ? "lighter" : "source-over");
}
function combineCanvases() {
  glCopyToContext(mainContext, true);
  mainContext.drawImage(overlayCanvas, 0, 0);
  glClearCanvas();
  overlayCanvas.width |= 0;
}
let engineFontImage;
class FontImage {
  constructor(a, b = vec2$1(8), c = vec2$1(0, 1), d = overlayContext) {
    engineFontImage || ((engineFontImage = new Image()).src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAAYAQAAAAA9+x6JAAAAAnRSTlMAAHaTzTgAAAGiSURBVHjaZZABhxxBEIUf6ECLBdFY+Q0PMNgf0yCgsSAGZcT9sgIPtBWwIA5wgAPEoHUyJeeSlW+gjK+fegWwtROWpVQEyWh2npdpBmTUFVhb29RINgLIukoXr5LIAvYQ5ve+1FqWEMqNKTX3FAJHyQDRZvmKWubAACcv5z5Gtg2oyCWE+Yk/8JZQX1jTTCpKAFGIgza+dJCNBF2UskRlsgwitHbSV0QLgt9sTPtsRlvJjEr8C/FARWA2bJ/TtJ7lko34dNDn6usJUMzuErP89UUBJbWeozrwLLncXczd508deAjLWipLO4Q5XGPcJvPu92cNDaN0P5G1FL0nSOzddZOrJ6rNhbXGmeDvO3TF7DeJWl4bvaYQTNHCTeuqKZmbjHaSOFes+IX/+IhHrnAkXOAsfn24EM68XieIECoccD4KZLk/odiwzeo2rovYdhvb2HYFgyznJyDpYJdYOmfXgVdJTaUi4xA2uWYNYec9BLeqdl9EsoTw582mSFDX2DxVLbNt9U3YYoeatBad1c2Tj8t2akrjaIGJNywKB/7h75/gN3vCMSaadIUTAAAAAElFTkSuQmCC");
    this.image = a || engineFontImage;
    this.tileSize = b;
    this.paddingSize = c;
    this.context = d;
  }
  drawText(a, b, c = 1, d) {
    this.drawTextScreen(a, worldToScreen(b).floor(), c * cameraScale | 0, d);
  }
  drawTextScreen(a, b, c = 4, d) {
    const e = this.context;
    e.save();
    const f = this.tileSize, g = f.add(this.paddingSize).scale(c), k = this.image.width / this.tileSize.x | 0;
    (a + "").split("\n").forEach((h, m) => {
      const n = d ? h.length * f.x * c / 2 | 0 : 0;
      for (let q = h.length; q--; ) {
        var l = h[q].charCodeAt(0);
        if (32 > l || 127 < l) l = 127;
        var p = l - 32;
        l = p % k;
        p = p / k | 0;
        const r = b.add(vec2$1(q, m).multiply(g));
        e.drawImage(this.image, l * f.x, p * f.y, f.x, f.y, r.x - n, r.y, f.x * c, f.y * c);
      }
    });
    e.restore();
  }
}
function isFullscreen() {
  return !!document.fullscreenElement;
}
function toggleFullscreen() {
  const a = mainCanvas.parentElement;
  isFullscreen() ? document.exitFullscreen && document.exitFullscreen() : a.requestFullscreen && a.requestFullscreen();
}
function setCursor(a = "auto") {
  mainCanvas.parentElement.style.cursor = a;
}
function keyIsDown(a, b = 0) {
  return inputData[b] && !!(inputData[b][a] & 1);
}
function keyWasPressed(a, b = 0) {
  return inputData[b] && !!(inputData[b][a] & 2);
}
function keyWasReleased(a, b = 0) {
  return inputData[b] && !!(inputData[b][a] & 4);
}
function clearInput() {
  inputData = [[]];
  touchGamepadButtons = [];
}
const mouseIsDown = keyIsDown, mouseWasPressed = keyWasPressed, mouseWasReleased = keyWasReleased;
let mousePos = vec2$1(), mousePosScreen = vec2$1(), mouseWheel = 0, isUsingGamepad = false, preventDefaultInput = false;
function gamepadIsDown(a, b = 0) {
  return keyIsDown(a, b + 1);
}
function gamepadWasPressed(a, b = 0) {
  return keyWasPressed(a, b + 1);
}
function gamepadWasReleased(a, b = 0) {
  return keyWasReleased(a, b + 1);
}
function gamepadStick(a, b = 0) {
  return gamepadStickData[b] ? gamepadStickData[b][a] || vec2$1() : vec2$1();
}
let inputData = [[]];
function inputUpdate() {
  headlessMode || (touchInputEnable && isTouchDevice || document.hasFocus() || clearInput(), mousePos = screenToWorld(mousePosScreen), gamepadsUpdate());
}
function inputUpdatePost() {
  if (!headlessMode) {
    for (const a of inputData) for (const b in a) a[b] &= 1;
    mouseWheel = 0;
  }
}
function inputInit() {
  function a(b) {
    return inputWASDEmulateDirection ? "KeyW" == b ? "ArrowUp" : "KeyS" == b ? "ArrowDown" : "KeyA" == b ? "ArrowLeft" : "KeyD" == b ? "ArrowRight" : b : b;
  }
  headlessMode || (onkeydown = (b) => {
    b.repeat || (isUsingGamepad = false, inputData[0][b.code] = 3, inputWASDEmulateDirection && (inputData[0][a(b.code)] = 3));
  }, onkeyup = (b) => {
    inputData[0][b.code] = 4;
    inputWASDEmulateDirection && (inputData[0][a(b.code)] = 4);
  }, onmousedown = (b) => {
    soundEnable && !headlessMode && audioContext && "running" != audioContext.state && audioContext.resume();
    isUsingGamepad = false;
    inputData[0][b.button] = 3;
    mousePosScreen = mouseToScreen(b);
    b.button && b.preventDefault();
  }, onmouseup = (b) => inputData[0][b.button] = inputData[0][b.button] & 2 | 4, onmousemove = (b) => mousePosScreen = mouseToScreen(b), onwheel = (b) => mouseWheel = b.ctrlKey ? 0 : sign(b.deltaY), oncontextmenu = (b) => false, onblur = (b) => clearInput(), isTouchDevice && touchInputEnable && touchInputInit());
}
function mouseToScreen(a) {
  if (!mainCanvas || headlessMode) return vec2$1();
  const b = mainCanvas.getBoundingClientRect();
  return vec2$1(mainCanvas.width, mainCanvas.height).multiply(vec2$1(percent(a.x, b.left, b.right), percent(a.y, b.top, b.bottom)));
}
const gamepadStickData = [];
function gamepadsUpdate() {
  const a = (g) => {
    const k = (h) => 0.3 < h ? percent(h, 0.3, 0.8) : -0.3 > h ? -percent(-h, 0.3, 0.8) : 0;
    return vec2$1(k(g.x), k(-g.y)).clampLength();
  };
  if (touchGamepadEnable && isTouchDevice && touchGamepadTimer.isSet()) {
    var b = gamepadStickData[0] || (gamepadStickData[0] = []);
    b[0] = vec2$1();
    touchGamepadAnalog ? b[0] = a(touchGamepadStick) : 0.3 < touchGamepadStick.lengthSquared() && (b[0].x = Math.round(touchGamepadStick.x), b[0].y = -Math.round(touchGamepadStick.y), b[0] = b[0].clampLength());
    b = inputData[1] || (inputData[1] = []);
    for (var c = 10; c--; ) {
      var d = 3 == c ? 2 : 2 == c ? 3 : c, e = gamepadIsDown(d, 0);
      b[d] = touchGamepadButtons[c] ? e ? 1 : 3 : e ? 4 : 0;
    }
  }
  if (gamepadsEnable && navigator && navigator.getGamepads && document.hasFocus()) for (b = navigator.getGamepads(), c = b.length; c--; ) {
    e = b[c];
    const g = inputData[c + 1] || (inputData[c + 1] = []);
    d = gamepadStickData[c] || (gamepadStickData[c] = []);
    if (e) {
      for (var f = 0; f < e.axes.length - 1; f += 2) d[f >> 1] = a(vec2$1(e.axes[f], e.axes[f + 1]));
      for (f = e.buttons.length; f--; ) {
        const k = e.buttons[f], h = gamepadIsDown(f, c);
        g[f] = k.pressed ? h ? 1 : 3 : h ? 4 : 0;
        isUsingGamepad || (isUsingGamepad = !c && k.pressed);
      }
      gamepadDirectionEmulateStick && (e = vec2$1((gamepadIsDown(15, c) && 1) - (gamepadIsDown(14, c) && 1), (gamepadIsDown(12, c) && 1) - (gamepadIsDown(13, c) && 1)), e.lengthSquared() && (d[0] = e.clampLength()));
      touchGamepadEnable && isUsingGamepad && touchGamepadTimer.unset();
    }
  }
}
function vibrate(a = 100) {
  vibrateEnable && !headlessMode && navigator && navigator.vibrate && navigator.vibrate(a);
}
function vibrateStop() {
  vibrate(0);
}
const isTouchDevice = !headlessMode && void 0 !== window.ontouchstart;
let touchGamepadTimer = new Timer(), touchGamepadButtons, touchGamepadStick;
function touchInputInit() {
  function a(e) {
    soundEnable && !headlessMode && audioContext && "running" != audioContext.state && audioContext.resume();
    const f = e.touches.length;
    if (f) {
      const g = vec2$1(e.touches[0].clientX, e.touches[0].clientY);
      mousePosScreen = mouseToScreen(g);
      d ? isUsingGamepad = touchGamepadEnable : inputData[0][0] = 3;
    } else d && (inputData[0][0] = inputData[0][0] & 2 | 4);
    d = f;
    document.hasFocus() && e.preventDefault();
    return true;
  }
  function b(e) {
    touchGamepadStick = vec2$1();
    touchGamepadButtons = [];
    isUsingGamepad = true;
    if (e.touches.length && (touchGamepadTimer.set(), paused && !d)) {
      touchGamepadButtons[9] = 1;
      a(e);
      return;
    }
    const f = vec2$1(touchGamepadSize, mainCanvasSize.y - touchGamepadSize), g = mainCanvasSize.subtract(vec2$1(touchGamepadSize, touchGamepadSize)), k = mainCanvasSize.scale(0.5);
    for (const m of e.touches) {
      var h = mouseToScreen(vec2$1(m.clientX, m.clientY));
      h.distance(f) < touchGamepadSize ? touchGamepadStick = h.subtract(f).scale(2 / touchGamepadSize).clampLength() : h.distance(g) < touchGamepadSize ? (h = h.subtract(g).direction(), touchGamepadButtons[h] = 1) : h.distance(k) < touchGamepadSize && !d && (touchGamepadButtons[9] = 1);
    }
    a(e);
    return true;
  }
  let c = a;
  touchGamepadEnable && (c = b, touchGamepadButtons = [], touchGamepadStick = vec2$1());
  document.addEventListener("touchstart", (e) => c(e), { passive: false });
  document.addEventListener("touchmove", (e) => c(e), { passive: false });
  document.addEventListener("touchend", (e) => c(e), { passive: false });
  onmousedown = onmouseup = () => 0;
  let d;
}
function touchGamepadRender() {
  if (touchInputEnable && isTouchDevice && !headlessMode && touchGamepadEnable && touchGamepadTimer.isSet()) {
    var a = percent(touchGamepadTimer.get(), 4, 3);
    if (a && !paused) {
      var b = overlayContext;
      b.save();
      b.globalAlpha = a * touchGamepadAlpha;
      b.strokeStyle = "#fff";
      b.lineWidth = 3;
      b.fillStyle = 0 < touchGamepadStick.lengthSquared() ? "#fff" : "#000";
      b.beginPath();
      a = vec2$1(touchGamepadSize, mainCanvasSize.y - touchGamepadSize);
      if (touchGamepadAnalog) b.arc(a.x, a.y, touchGamepadSize / 2, 0, 9), b.fill();
      else for (var c = 10; c--; ) {
        var d = c * PI / 4;
        b.arc(a.x, a.y, 0.6 * touchGamepadSize, d + PI / 8, d + PI / 8);
        c % 2 && b.arc(a.x, a.y, 0.33 * touchGamepadSize, d, d);
        1 == c && b.fill();
      }
      b.stroke();
      a = vec2$1(mainCanvasSize.x - touchGamepadSize, mainCanvasSize.y - touchGamepadSize);
      for (c = 4; c--; ) d = a.add(vec2$1().setDirection(c, touchGamepadSize / 2)), b.fillStyle = touchGamepadButtons[c] ? "#fff" : "#000", b.beginPath(), b.arc(d.x, d.y, touchGamepadSize / 4, 0, 9), b.fill(), b.stroke();
      b.restore();
    }
  }
}
let audioContext = new AudioContext(), audioGainNode;
function audioInit() {
  soundEnable && !headlessMode && (audioGainNode = audioContext.createGain(), audioGainNode.connect(audioContext.destination), audioGainNode.gain.value = soundVolume);
}
class Sound {
  constructor(a, b = soundDefaultRange, c = soundDefaultTaper) {
    soundEnable && !headlessMode && (this.range = b, this.taper = c, this.randomness = 0, a && (this.randomness = void 0 != a[1] ? a[1] : 0.05, a[1] = 0, this.sampleChannels = [zzfxG(...a)], this.sampleRate = zzfxR));
  }
  play(a, b = 1, c = 1, d = 1, e = false) {
    if (soundEnable && !headlessMode && this.sampleChannels) {
      var f;
      if (a) {
        if (f = this.range) {
          const g = cameraPos.distanceSquared(a);
          if (g > f * f) return;
          b *= percent(g ** 0.5, f, f * this.taper);
        }
        f = 2 * worldToScreen(a).x / mainCanvas.width - 1;
      }
      a = c + c * this.randomness * d * rand(-1, 1);
      this.gainNode = audioContext.createGain();
      return this.source = playSamples(this.sampleChannels, b, a, f, e, this.sampleRate, this.gainNode);
    }
  }
  setVolume(a = 1) {
    this.gainNode && (this.gainNode.gain.value = a);
  }
  stop() {
    this.source && this.source.stop();
    this.source = void 0;
  }
  getSource() {
    return this.source;
  }
  playNote(a, b, c) {
    return this.play(b, c, 2 ** (a / 12), 0);
  }
  getDuration() {
    return this.sampleChannels && this.sampleChannels[0].length / this.sampleRate;
  }
  isLoading() {
    return !this.sampleChannels;
  }
}
class SoundWave extends Sound {
  constructor(a, b = 0, c, d, e) {
    super(void 0, c, d);
    soundEnable && !headlessMode && (this.randomness = b, fetch(a).then((f) => f.arrayBuffer()).then((f) => audioContext.decodeAudioData(f)).then((f) => {
      this.sampleChannels = [];
      for (let g = f.numberOfChannels; g--; ) this.sampleChannels[g] = Array.from(f.getChannelData(g));
      this.sampleRate = f.sampleRate;
    }).then(() => e && e(this)));
  }
}
function playAudioFile(a, b = 1, c = false) {
  if (soundEnable && !headlessMode) return new SoundWave(a, 0, 0, 0, (d) => d.play(void 0, b, 1, 1, c));
}
class Music extends Sound {
  constructor(a) {
    super(void 0);
    soundEnable && !headlessMode && (this.randomness = 0, this.sampleChannels = zzfxM(...a), this.sampleRate = zzfxR);
  }
  playMusic(a, b = false) {
    return super.play(void 0, a, 1, 1, b);
  }
}
function speak(a, b = "", c = 1, d = 1, e = 1) {
  if (soundEnable && !headlessMode && speechSynthesis) return a = new SpeechSynthesisUtterance(a), a.lang = b, a.volume = 2 * c * soundVolume, a.rate = d, a.pitch = e, speechSynthesis.speak(a), a;
}
function speakStop() {
  speechSynthesis && speechSynthesis.cancel();
}
function getNoteFrequency(a, b = 220) {
  return b * 2 ** (a / 12);
}
function playSamples(a, b = 1, c = 1, d = 0, e = false, f = zzfxR, g) {
  if (soundEnable && !headlessMode) {
    var k = audioContext.createBuffer(a.length, a[0].length, f), h = audioContext.createBufferSource();
    a.forEach((m, n) => k.getChannelData(n).set(m));
    h.buffer = k;
    h.playbackRate.value = c;
    h.loop = e;
    g = g || audioContext.createGain();
    g.gain.value = b;
    g.connect(audioGainNode);
    a = new StereoPannerNode(audioContext, { pan: clamp(d, -1, 1) });
    h.connect(a).connect(g);
    "running" != audioContext.state ? audioContext.resume().then(() => h.start()) : h.start();
    return h;
  }
}
function zzfx(...a) {
  return playSamples([zzfxG(...a)]);
}
const zzfxR = 44100;
function zzfxG(a = 1, b = 0.05, c = 220, d = 0, e = 0, f = 0.1, g = 0, k = 1, h = 0, m = 0, n = 0, l = 0, p = 0, q = 0, r = 0, x = 0, v = 0, D = 1, z = 0, E = 0, A = 0) {
  let w = 2 * PI;
  var t = zzfxR;
  let F = h *= 500 * w / t / t;
  b = c *= rand(1 + b, 1 - b) * w / t;
  let C = [], y = 0, G = 0, u = 0, H = 1, R = 0, S = 0, B = 0, J;
  var L = w * abs(A) * 2 / t, K = Math.cos(L), M = Math.sin(L) / 2 / 2, I = 1 + M;
  L = -2 * K / I;
  M = (1 - M) / I;
  let N = (1 + sign(A) * K) / 2 / I;
  K = -(sign(A) + K) / I;
  let O = I = 0, P = 0, Q = 0;
  d = d * t + 9;
  z *= t;
  e *= t;
  f *= t;
  v *= t;
  m *= 500 * w / t ** 3;
  r *= w / t;
  n *= w / t;
  l *= t;
  p = p * t | 0;
  for (J = d + z + e + f + v | 0; u < J; C[u++] = B * a) ++S % (100 * x | 0) || (B = g ? 1 < g ? 2 < g ? 3 < g ? Math.sin(y ** 3) : clamp(Math.tan(y), 1, -1) : 1 - (2 * y / w % 2 + 2) % 2 : 1 - 4 * abs(Math.round(y / w) - y / w) : Math.sin(y), B = (p ? 1 - E + E * Math.sin(w * u / p) : 1) * sign(B) * abs(B) ** k * (u < d ? u / d : u < d + z ? 1 - (u - d) / z * (1 - D) : u < d + z + e ? D : u < J - v ? (J - u - v) / f * D : 0), B = v ? B / 2 + (v > u ? 0 : (u < J - v ? 1 : (J - u) / v) * C[u - v | 0] / 2 / a) : B, A && (B = Q = N * I + K * (I = O) + N * (O = B) - M * P - L * (P = Q))), t = (c += h += m) * Math.cos(r * G++), y += t + t * q * Math.sin(u ** 5), H && ++H > l && (c += n, b += n, H = 0), !p || ++R % p || (c = b, h = F, H = H || 1);
  return C;
}
function zzfxM(a, b, c, d = 125) {
  let e, f, g, k, h, m, n, l, p, q, r, x, v, D = 0, z, E = [], A = [], w = [], t = 0, F = 0, C = 1, y = {}, G = zzfxR / d * 60 >> 2;
  for (; C; t++) E = [C = l = x = 0], c.forEach((u, H) => {
    n = b[u][t] || [0, 0, 0];
    C |= b[u][t] && 1;
    z = x + (b[u][0].length - 2 - (l ? 0 : 1)) * G;
    v = H == c.length - 1;
    e = 2;
    for (g = x; e < n.length + v; l = ++e) {
      h = n[e];
      p = e == n.length + v - 1 && v || q != (n[0] || 0) || h | 0;
      for (f = 0; f < G && l; f++ > G - 99 && p && 1 > r ? r += 1 / 99 : 0) m = (1 - r) * E[D++] / 2 || 0, A[g] = (A[g] || 0) - m * F + m, w[g] = (w[g++] || 0) + m * F + m;
      h && (r = h % 1, F = n[1] || 0, h |= 0) && (E = y[[q = n[D = 0] || 0, h]] = y[[q, h]] || (k = [...a[q]], k[2] *= 2 ** ((h - 12) / 12), 0 < h ? zzfxG(...k) : []));
    }
    x = z;
  });
  return [A, w];
}
let tileCollision = [], tileCollisionSize = vec2$1();
function initTileCollision(a) {
  tileCollisionSize = a;
  tileCollision = [];
  for (a = tileCollision.length = tileCollisionSize.area(); a--; ) tileCollision[a] = 0;
}
function setTileCollisionData(a, b = 0) {
  a.arrayCheck(tileCollisionSize) && (tileCollision[(a.y | 0) * tileCollisionSize.x + a.x | 0] = b);
}
function getTileCollisionData(a) {
  return a.arrayCheck(tileCollisionSize) ? tileCollision[(a.y | 0) * tileCollisionSize.x + a.x | 0] : 0;
}
function tileCollisionTest(a, b = vec2$1(), c) {
  const d = max(a.x - b.x / 2 | 0, 0);
  var e = max(a.y - b.y / 2 | 0, 0);
  const f = min(a.x + b.x / 2, tileCollisionSize.x);
  for (a = min(a.y + b.y / 2, tileCollisionSize.y); e < a; ++e) for (b = d; b < f; ++b) {
    const g = tileCollision[e * tileCollisionSize.x + b];
    if (g && (!c || c.collideWithTile(g, vec2$1(b, e)))) return true;
  }
  return false;
}
function tileCollisionRaycast(a, b, c) {
  const d = b.subtract(a), e = d.length();
  var f = d.normalize();
  f = vec2$1(abs(1 / f.x), abs(1 / f.y));
  let g = a.floor(), k = f.x * (0 > d.x ? a.x - g.x : g.x - a.x + 1), h = f.y * (0 > d.y ? a.y - g.y : g.y - a.y + 1);
  for (; ; ) {
    const m = getTileCollisionData(g);
    if (m && (!c || c.collideWithTile(m, g))) return g.add(vec2$1(0.5));
    if (k > e && h > e) break;
    k > h ? (g.y += sign(d.y), h += f.y) : (g.x += sign(d.x), k += f.x);
  }
}
class TileLayerData {
  constructor(a, b = 0, c = false, d = new Color()) {
    this.tile = a;
    this.direction = b;
    this.mirror = c;
    this.color = d;
  }
  clear() {
    this.tile = this.direction = 0;
    this.mirror = false;
    this.color = new Color();
  }
}
class TileLayer extends EngineObject {
  constructor(a, b = tileCollisionSize, c = tile(), d = vec2$1(1), e = 0) {
    super(a, b, c, 0, void 0, e);
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    this.scale = d;
    this.isOverlay = false;
    this.data = [];
    for (a = this.size.area(); a--; ) this.data.push(new TileLayerData());
    headlessMode && (this.redraw = () => {
    }, this.render = () => {
    }, this.redrawStart = () => {
    }, this.redrawEnd = () => {
    }, this.drawTileData = () => {
    }, this.drawCanvas2D = () => {
    });
  }
  setData(a, b, c = false) {
    a.arrayCheck(this.size) && (this.data[(a.y | 0) * this.size.x + a.x | 0] = b, c && this.drawTileData(a));
  }
  getData(a) {
    return a.arrayCheck(this.size) && this.data[(a.y | 0) * this.size.x + a.x | 0];
  }
  update() {
  }
  render() {
    ASSERT(mainContext != this.context);
    glOverlay || this.isOverlay || glCopyToContext(mainContext);
    const a = worldToScreen(this.pos.add(vec2$1(0, this.size.y * this.scale.y)));
    (this.isOverlay ? overlayContext : mainContext).drawImage(this.canvas, a.x, a.y, cameraScale * this.size.x * this.scale.x, cameraScale * this.size.y * this.scale.y);
  }
  redraw() {
    this.redrawStart(true);
    for (let a = this.size.x; a--; ) for (let b = this.size.y; b--; ) this.drawTileData(vec2$1(a, b), false);
    this.redrawEnd();
  }
  redrawStart(a = false) {
    this.savedRenderSettings = [mainCanvas, mainContext, mainCanvasSize, cameraPos, cameraScale];
    mainCanvas = this.canvas;
    mainContext = this.context;
    mainCanvasSize = this.size.multiply(this.tileInfo.size);
    cameraPos = this.size.scale(0.5);
    cameraScale = this.tileInfo.size.x;
    a && (mainCanvas.width = mainCanvasSize.x, mainCanvas.height = mainCanvasSize.y);
    this.context.imageSmoothingEnabled = !tilesPixelated;
    glPreRender();
  }
  redrawEnd() {
    ASSERT(mainContext == this.context);
    glCopyToContext(mainContext, true);
    [mainCanvas, mainContext, mainCanvasSize, cameraPos, cameraScale] = this.savedRenderSettings;
  }
  drawTileData(a, b = true) {
    var c = this.tileInfo.size;
    b && (b = a.multiply(c), this.context.clearRect(b.x, this.canvas.height - b.y, c.x, -c.y));
    b = this.getData(a);
    void 0 != b.tile && (ASSERT(mainContext == this.context), a = a.add(vec2$1(0.5)), c = tile(b.tile, c, this.tileInfo.textureIndex), drawTile(a, vec2$1(1), c, b.color, b.direction * PI / 2, b.mirror));
  }
  drawCanvas2D(a, b, c, d, e) {
    const f = this.context;
    f.save();
    a = a.subtract(this.pos).multiply(this.tileInfo.size);
    b = b.multiply(this.tileInfo.size);
    f.translate(a.x, this.canvas.height - a.y);
    f.rotate(c);
    f.scale(d ? -b.x : b.x, b.y);
    e(f);
    f.restore();
  }
  drawTile(a, b = vec2$1(1), c, d = new Color(), e, f) {
    this.drawCanvas2D(a, b, e, f, (g) => {
      const k = c && c.getTextureInfo();
      k ? (g.globalAlpha = d.a, g.drawImage(k.image, c.pos.x, c.pos.y, c.size.x, c.size.y, -0.5, -0.5, 1, 1), g.globalAlpha = 1) : (g.fillStyle = d, g.fillRect(-0.5, -0.5, 1, 1));
    });
  }
  drawRect(a, b, c, d) {
    this.drawTile(a, b, void 0, c, d);
  }
}
class ParticleEmitter extends EngineObject {
  constructor(a, b, c = 0, d = 0, e = 100, f = PI, g, k = new Color(), h = new Color(), m = new Color(1, 1, 1, 0), n = new Color(1, 1, 1, 0), l = 0.5, p = 0.1, q = 1, r = 0.1, x = 0.05, v = 1, D = 1, z = 0, E = PI, A = 0.1, w = 0.2, t = false, F = false, C = true, y = F ? 1e9 : 0, G = false) {
    super(a, vec2$1(), g, b, void 0, y);
    this.emitSize = c;
    this.emitTime = d;
    this.emitRate = e;
    this.emitConeAngle = f;
    this.colorStartA = k;
    this.colorStartB = h;
    this.colorEndA = m;
    this.colorEndB = n;
    this.randomColorLinear = C;
    this.particleTime = l;
    this.sizeStart = p;
    this.sizeEnd = q;
    this.speed = r;
    this.angleSpeed = x;
    this.damping = v;
    this.angleDamping = D;
    this.gravityScale = z;
    this.particleConeAngle = E;
    this.fadeRate = A;
    this.randomness = w;
    this.collideTiles = t;
    this.additive = F;
    this.localSpace = G;
    this.trailScale = 0;
    this.particleCreateCallback = this.particleDestroyCallback = void 0;
    this.emitTimeBuffer = 0;
  }
  update() {
    this.parent && super.update();
    if (!this.emitTime || this.getAliveTime() <= this.emitTime) {
      if (this.emitRate * particleEmitRateScale) {
        const a = 1 / this.emitRate / particleEmitRateScale;
        for (this.emitTimeBuffer += timeDelta; 0 < this.emitTimeBuffer; this.emitTimeBuffer -= a) this.emitParticle();
      }
    } else this.destroy();
  }
  emitParticle() {
    var a = "number" === typeof this.emitSize ? randInCircle(this.emitSize / 2) : vec2$1(rand(-0.5, 0.5), rand(-0.5, 0.5)).multiply(this.emitSize).rotate(this.angle);
    let b = rand(this.particleConeAngle, -this.particleConeAngle);
    this.localSpace || (a = this.pos.add(a), b += this.angle);
    const c = this.randomness;
    var d = (l) => l + l * rand(c, -c);
    const e = d(this.particleTime), f = d(this.sizeStart), g = d(this.sizeEnd), k = d(this.speed);
    d = d(this.angleSpeed) * randSign();
    var h = rand(this.emitConeAngle, -this.emitConeAngle);
    const m = randColor(this.colorStartA, this.colorStartB, this.randomColorLinear), n = randColor(this.colorEndA, this.colorEndB, this.randomColorLinear);
    h = this.localSpace ? h : this.angle + h;
    a = new Particle(a, this.tileInfo, b, m, n, e, f, g, this.fadeRate, this.additive, this.trailScale, this.localSpace && this, this.particleDestroyCallback);
    a.velocity = vec2$1().setAngle(h, k);
    a.angleVelocity = d;
    a.fadeRate = this.fadeRate;
    a.damping = this.damping;
    a.angleDamping = this.angleDamping;
    a.elasticity = this.elasticity;
    a.friction = this.friction;
    a.gravityScale = this.gravityScale;
    a.collideTiles = this.collideTiles;
    a.renderOrder = this.renderOrder;
    a.mirror = !!randInt(2);
    this.particleCreateCallback && this.particleCreateCallback(a);
    return a;
  }
  render() {
  }
}
class Particle extends EngineObject {
  constructor(a, b, c, d, e, f, g, k, h, m, n, l, p) {
    super(a, vec2$1(), b, c);
    this.colorStart = d;
    this.colorEndDelta = e.subtract(d);
    this.lifeTime = f;
    this.sizeStart = g;
    this.sizeEndDelta = k - g;
    this.fadeRate = h;
    this.additive = m;
    this.trailScale = n;
    this.localSpaceEmitter = l;
    this.destroyCallback = p;
    this.clampSpeedLinear = false;
  }
  render() {
    const a = min((time - this.spawnTime) / this.lifeTime, 1), b = vec2$1(this.sizeStart + a * this.sizeEndDelta);
    var c = this.fadeRate / 2;
    c = new Color(this.colorStart.r + a * this.colorEndDelta.r, this.colorStart.g + a * this.colorEndDelta.g, this.colorStart.b + a * this.colorEndDelta.b, (this.colorStart.a + a * this.colorEndDelta.a) * (a < c ? a / c : a > 1 - c ? (1 - a) / c : 1));
    this.additive && setBlendMode(true);
    let d = this.pos, e = this.angle;
    this.localSpaceEmitter && (d = this.localSpaceEmitter.pos.add(d.rotate(-this.localSpaceEmitter.angle)), e += this.localSpaceEmitter.angle);
    if (this.trailScale) {
      var f = this.velocity;
      this.localSpaceEmitter && (f = f.rotate(-this.localSpaceEmitter.angle));
      var g = f.length();
      g && (f = f.scale(1 / g), g *= this.trailScale, b.y = max(b.x, g), e = f.angle(), drawTile(d.add(f.multiply(vec2$1(0, -g / 2))), b, this.tileInfo, c, e, this.mirror));
    } else drawTile(d, b, this.tileInfo, c, e, this.mirror);
    this.additive && setBlendMode();
    1 == a && (this.color = c, this.size = b, this.destroyCallback && this.destroyCallback(this), this.destroyed = 1);
  }
}
const medals = {};
let medalsDisplayQueue = [], medalsSaveName, medalsDisplayTimeLast;
function medalsInit(a) {
  medalsSaveName = a;
  medalsForEach((b) => b.unlocked = !!localStorage[b.storageKey()]);
  engineAddPlugin(void 0, function() {
    if (medalsDisplayQueue.length) {
      var b = medalsDisplayQueue[0], c = timeReal - medalsDisplayTimeLast;
      if (medalsDisplayTimeLast) if (c > medalDisplayTime) medalsDisplayTimeLast = 0, medalsDisplayQueue.shift();
      else {
        const d = medalDisplayTime - medalDisplaySlideTime;
        b.render(c < medalDisplaySlideTime ? 1 - c / medalDisplaySlideTime : c > d ? (c - d) / medalDisplaySlideTime : 0);
      }
      else medalsDisplayTimeLast = timeReal;
    }
  });
}
function medalsForEach(a) {
  Object.values(medals).forEach((b) => a(b));
}
class Medal {
  constructor(a, b, c = "", d = "🏆", e) {
    ASSERT(0 <= a && !medals[a]);
    this.id = a;
    this.name = b;
    this.description = c;
    this.icon = d;
    this.unlocked = false;
    e && ((this.image = new Image()).src = e);
    medals[a] = this;
  }
  unlock() {
    medalsPreventUnlock || this.unlocked || (localStorage[this.storageKey()] = this.unlocked = true, medalsDisplayQueue.push(this));
  }
  render(a = 0) {
    const b = overlayContext;
    var c = min(medalDisplaySize.x, mainCanvas.width);
    const d = overlayCanvas.width - c;
    a *= -medalDisplaySize.y;
    b.save();
    b.beginPath();
    b.fillStyle = new Color(0.9, 0.9, 0.9).toString();
    b.strokeStyle = new Color(0, 0, 0).toString();
    b.lineWidth = 3;
    b.rect(d, a, c, medalDisplaySize.y);
    b.fill();
    b.stroke();
    b.clip();
    this.renderIcon(vec2$1(d + 15 + medalDisplayIconSize / 2, a + medalDisplaySize.y / 2));
    c = vec2$1(d + medalDisplayIconSize + 30, a + 28);
    drawTextScreen(this.name, c, 38, new Color(0, 0, 0), 0, void 0, "left");
    c.y += 32;
    drawTextScreen(this.description, c, 24, new Color(0, 0, 0), 0, void 0, "left");
    b.restore();
  }
  renderIcon(a, b = medalDisplayIconSize) {
    this.image ? overlayContext.drawImage(this.image, a.x - b / 2, a.y - b / 2, b, b) : drawTextScreen(this.icon, a, 0.7 * b, new Color(0, 0, 0));
  }
  storageKey() {
    return medalsSaveName + "_" + this.id;
  }
}
let glCanvas, glContext, glAntialias = true, glShader, glActiveTexture, glArrayBuffer, glGeometryBuffer, glPositionData, glColorData, glInstanceCount, glAdditive, glBatchAdditive;
const gl_MAX_INSTANCES = 1e4, gl_INDICES_PER_INSTANCE = 11, gl_INSTANCE_BYTE_STRIDE = 4 * gl_INDICES_PER_INSTANCE, gl_INSTANCE_BUFFER_SIZE = gl_MAX_INSTANCES * gl_INSTANCE_BYTE_STRIDE;
function glInit() {
  if (glEnable && !headlessMode) {
    glCanvas = document.createElement("canvas");
    glContext = glCanvas.getContext("webgl2", { antialias: glAntialias });
    var a = mainCanvas.parentElement;
    glOverlay && a.appendChild(glCanvas);
    glShader = glCreateProgram("#version 300 es\nprecision highp float;uniform mat4 m;in vec2 g;in vec4 p,u,c,a;in float r;out vec2 v;out vec4 d,e;void main(){vec2 s=(g-.5)*p.zw;gl_Position=m*vec4(p.xy+s*cos(r)-vec2(-s.y,s)*sin(r),1,1);v=mix(u.xw,u.zy,g);d=c;e=a;}", "#version 300 es\nprecision highp float;uniform sampler2D s;in vec2 v;in vec4 d,e;out vec4 c;void main(){c=texture(s,v)*d+e;}");
    a = new ArrayBuffer(gl_INSTANCE_BUFFER_SIZE);
    glPositionData = new Float32Array(a);
    glColorData = new Uint32Array(a);
    glArrayBuffer = glContext.createBuffer();
    glGeometryBuffer = glContext.createBuffer();
    a = new Float32Array([glInstanceCount = 0, 0, 1, 0, 0, 1, 1, 1]);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, glGeometryBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, a, glContext.STATIC_DRAW);
  }
}
function glPreRender() {
  if (glEnable && !headlessMode) {
    glClearCanvas();
    glContext.useProgram(glShader);
    glContext.activeTexture(glContext.TEXTURE0);
    textureInfos[0] && glContext.bindTexture(glContext.TEXTURE_2D, glActiveTexture = textureInfos[0].glTexture);
    var a = glAdditive = glBatchAdditive = 0, b = (d, e, f, g) => {
      d = glContext.getAttribLocation(glShader, d);
      const k = f && gl_INSTANCE_BYTE_STRIDE, h = f && 1, m = 1 == f;
      glContext.enableVertexAttribArray(d);
      glContext.vertexAttribPointer(d, g, e, m, k, a);
      glContext.vertexAttribDivisor(d, h);
      a += g * f;
    };
    glContext.bindBuffer(glContext.ARRAY_BUFFER, glGeometryBuffer);
    b("g", glContext.FLOAT, 0, 2);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, glArrayBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, gl_INSTANCE_BUFFER_SIZE, glContext.DYNAMIC_DRAW);
    b("p", glContext.FLOAT, 4, 4);
    b("u", glContext.FLOAT, 4, 4);
    b("c", glContext.UNSIGNED_BYTE, 1, 4);
    b("a", glContext.UNSIGNED_BYTE, 1, 4);
    b("r", glContext.FLOAT, 4, 1);
    b = vec2$1(2 * cameraScale).divide(mainCanvasSize);
    var c = vec2$1(-1).subtract(cameraPos.multiply(b));
    glContext.uniformMatrix4fv(glContext.getUniformLocation(glShader, "m"), false, [b.x, 0, 0, 0, 0, b.y, 0, 0, 1, 1, 1, 1, c.x, c.y, 0, 0]);
  }
}
function glClearCanvas() {
  glContext.viewport(0, 0, glCanvas.width = mainCanvas.width, glCanvas.height = mainCanvas.height);
  glContext.clear(glContext.COLOR_BUFFER_BIT);
}
function glSetTexture(a) {
  headlessMode || a == glActiveTexture || (glFlush(), glContext.bindTexture(glContext.TEXTURE_2D, glActiveTexture = a));
}
function glCompileShader(a, b) {
  b = glContext.createShader(b);
  glContext.shaderSource(b, a);
  glContext.compileShader(b);
  return b;
}
function glCreateProgram(a, b) {
  const c = glContext.createProgram();
  glContext.attachShader(c, glCompileShader(a, glContext.VERTEX_SHADER));
  glContext.attachShader(c, glCompileShader(b, glContext.FRAGMENT_SHADER));
  glContext.linkProgram(c);
  return c;
}
function glCreateTexture(a) {
  const b = glContext.createTexture();
  glContext.bindTexture(glContext.TEXTURE_2D, b);
  a && a.width ? glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, a) : (a = new Uint8Array([255, 255, 255, 255]), glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, 1, 1, 0, glContext.RGBA, glContext.UNSIGNED_BYTE, a));
  a = tilesPixelated ? glContext.NEAREST : glContext.LINEAR;
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, a);
  glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, a);
  return b;
}
function glFlush() {
  if (glInstanceCount) {
    var a = glBatchAdditive ? glContext.ONE : glContext.ONE_MINUS_SRC_ALPHA;
    glContext.blendFuncSeparate(glContext.SRC_ALPHA, a, glContext.ONE, a);
    glContext.enable(glContext.BLEND);
    glContext.bufferSubData(glContext.ARRAY_BUFFER, 0, glPositionData);
    glContext.drawArraysInstanced(glContext.TRIANGLE_STRIP, 0, 4, glInstanceCount);
    showWatermark && (drawCount += glInstanceCount);
    glInstanceCount = 0;
    glBatchAdditive = glAdditive;
  }
}
function glCopyToContext(a, b = false) {
  glEnable && (glInstanceCount || b) && (glFlush(), glOverlay && !b || a.drawImage(glCanvas, 0, 0));
}
function glSetAntialias(a = true) {
  glAntialias = a;
}
function glDraw(a, b, c, d, e, f, g, k, h, m, n = 0) {
  (glInstanceCount >= gl_MAX_INSTANCES || glBatchAdditive != glAdditive) && glFlush();
  let l = glInstanceCount++ * gl_INDICES_PER_INSTANCE;
  glPositionData[l++] = a;
  glPositionData[l++] = b;
  glPositionData[l++] = c;
  glPositionData[l++] = d;
  glPositionData[l++] = f;
  glPositionData[l++] = g;
  glPositionData[l++] = k;
  glPositionData[l++] = h;
  glColorData[l++] = m;
  glColorData[l++] = n;
  glPositionData[l++] = e;
}
const engineName = "LittleJS", engineVersion = "1.11.4", frameRate = 60, timeDelta = 1 / frameRate;
let engineObjects = [], engineObjectsCollide = [], frame = 0, time = 0, timeReal = 0, paused = false;
function setPaused(a) {
  paused = a;
}
let frameTimeLastMS = 0, frameTimeBufferMS = 0, averageFPS = 0;
const pluginUpdateList = [], pluginRenderList = [];
function engineAddPlugin(a, b) {
  a && pluginUpdateList.push(a);
  b && pluginRenderList.push(b);
}
function engineInit(a, b, c, d, e, f = [], g = document.body) {
  function k(n = 0) {
    var l = n - frameTimeLastMS;
    frameTimeLastMS = n;
    if (showWatermark) averageFPS = lerp(0.05, averageFPS, 1e3 / (l || 1));
    n = debug;
    timeReal += l / 1e3;
    frameTimeBufferMS += paused ? 0 : l;
    n || (frameTimeBufferMS = min(frameTimeBufferMS, 50));
    h();
    if (paused) {
      for (const r of engineObjects) r.parent || r.updateTransforms();
      inputUpdate();
      pluginUpdateList.forEach((r) => r());
      c();
      inputUpdatePost();
    } else {
      l = 0;
      0 > frameTimeBufferMS && -9 < frameTimeBufferMS && (l = frameTimeBufferMS, frameTimeBufferMS = 0);
      for (; 0 <= frameTimeBufferMS; frameTimeBufferMS -= 1e3 / frameRate) time = frame++ / frameRate, inputUpdate(), b(), pluginUpdateList.forEach((r) => r()), engineObjectsUpdate(), c(), inputUpdatePost();
      frameTimeBufferMS += l;
    }
    if (!headlessMode) {
      mainCanvasSize = vec2$1(mainCanvas.width, mainCanvas.height);
      overlayContext.imageSmoothingEnabled = mainContext.imageSmoothingEnabled = !tilesPixelated;
      glPreRender();
      d();
      engineObjects.sort((r, x) => r.renderOrder - x.renderOrder);
      for (var q of engineObjects) q.destroyed || q.render();
      e();
      pluginRenderList.forEach((r) => r());
      touchGamepadRender();
      glCopyToContext(mainContext);
      showWatermark && (overlayContext.textAlign = "right", overlayContext.textBaseline = "top", overlayContext.font = "1em monospace", overlayContext.fillStyle = "#000", q = engineName + " v" + engineVersion + " / " + drawCount + " / " + engineObjects.length + " / " + averageFPS.toFixed(1) + (glEnable ? " GL" : " 2D"), overlayContext.fillText(q, mainCanvas.width - 3, 3), overlayContext.fillStyle = "#fff", overlayContext.fillText(q, mainCanvas.width - 2, 2), drawCount = 0);
    }
    requestAnimationFrame(k);
  }
  function h() {
    if (!headlessMode) {
      if (canvasFixedSize.x) {
        mainCanvas.width = canvasFixedSize.x;
        mainCanvas.height = canvasFixedSize.y;
        const n = innerWidth / innerHeight, l = mainCanvas.width / mainCanvas.height;
        (glCanvas || mainCanvas).style.width = mainCanvas.style.width = overlayCanvas.style.width = n < l ? "100%" : "";
        (glCanvas || mainCanvas).style.height = mainCanvas.style.height = overlayCanvas.style.height = n < l ? "" : "100%";
      } else mainCanvas.width = min(innerWidth, canvasMaxSize.x), mainCanvas.height = min(innerHeight, canvasMaxSize.y);
      overlayCanvas.width = mainCanvas.width;
      overlayCanvas.height = mainCanvas.height;
      mainCanvasSize = vec2$1(mainCanvas.width, mainCanvas.height);
    }
  }
  function m() {
    new Promise((n) => n(a())).then(k);
  }
  headlessMode ? m() : (g.style.cssText = "margin:0;overflow:hidden;width:100vw;height:100vh;display:flex;align-items:center;justify-content:center;background:#000;" + (canvasPixelated ? "image-rendering:pixelated;" : "") + "user-select:none;-webkit-user-select:none;" + (touchInputEnable ? "touch-action:none;-webkit-touch-callout:none" : ""), g.appendChild(mainCanvas = document.createElement("canvas")), mainContext = mainCanvas.getContext("2d"), inputInit(), audioInit(), glInit(), g.appendChild(overlayCanvas = document.createElement("canvas")), overlayContext = overlayCanvas.getContext("2d"), mainCanvas.style.cssText = overlayCanvas.style.cssText = "position:absolute", glCanvas && (glCanvas.style.cssText = "position:absolute"), h(), g = f.map((n, l) => new Promise((p) => {
    const q = new Image();
    q.crossOrigin = "anonymous";
    q.onerror = q.onload = () => {
      textureInfos[l] = new TextureInfo(q);
      p();
    };
    q.src = n;
  })), f.length || g.push(new Promise((n) => {
    textureInfos[0] = new TextureInfo(new Image());
    n();
  })), showSplashScreen && g.push(new Promise((n) => {
    function l() {
      clearInput();
      drawEngineSplashScreen(p += 0.01);
      1 < p ? n() : setTimeout(l, 16);
    }
    let p = 0;
    console.log(`${engineName} Engine v${engineVersion}`);
    l();
  })), Promise.all(g).then(m));
}
function engineObjectsUpdate() {
  function a(b) {
    if (!b.destroyed) {
      b.update();
      for (const c of b.children) a(c);
    }
  }
  engineObjectsCollide = engineObjects.filter((b) => b.collideSolidObjects);
  for (const b of engineObjects) b.parent || (a(b), b.updateTransforms());
  engineObjects = engineObjects.filter((b) => !b.destroyed);
}
function engineObjectsDestroy() {
  for (const a of engineObjects) a.parent || a.destroy();
  engineObjects = engineObjects.filter((a) => !a.destroyed);
}
function engineObjectsCollect(a, b, c = engineObjects) {
  const d = [];
  if (a) if (b instanceof Vector2) for (const e of c) isOverlapping(a, b, e.pos, e.size) && d.push(e);
  else {
    b *= b;
    for (const e of c) a.distanceSquared(e.pos) < b && d.push(e);
  }
  else for (const e of c) d.push(e);
  return d;
}
function engineObjectsCallback(a, b, c, d = engineObjects) {
  engineObjectsCollect(a, b, d).forEach((e) => c(e));
}
function engineObjectsRaycast(a, b, c = engineObjects) {
  const d = [];
  for (const e of c) e.collideRaycast && isIntersecting(a, b, e.pos, e.size) && d.push(e);
  return d;
}
function drawEngineSplashScreen(a) {
  const b = overlayContext;
  var c = overlayCanvas.width = innerWidth, d = overlayCanvas.height = innerHeight, e = percent(a, 1, 0.8), f = percent(a, 0, 0.5), g = b.createRadialGradient(c / 2, d / 2, 0, c / 2, d / 2, 0.7 * Math.hypot(c, d));
  g.addColorStop(0, hsl(0, 0, lerp(f, 0, e / 2), e).toString());
  g.addColorStop(1, hsl(0, 0, 0, e).toString());
  b.save();
  b.fillStyle = g;
  b.fillRect(0, 0, c, d);
  g = (h, m, n, l, p) => {
    b.beginPath();
    b.rect(h, m, n, p ? l * k : l);
    (b.fillStyle = p) ? b.fill() : b.stroke();
  };
  f = (h, m, n, l = 0, p = 2 * PI, q, r) => {
    const x = (l + p) / 2;
    l = k * (p - l) / 2;
    b.beginPath();
    r && b.lineTo(h, m);
    b.arc(h, m, n, x - l, x + l);
    (b.fillStyle = q) ? b.fill() : b.stroke();
  };
  e = (h = 0, m = 0) => hsl([0.98, 0.3, 0.57, 0.14][h % 4] - 10, 0.8, [0, 0.3, 0.5, 0.8, 0.9][m]).toString();
  a = wave(1, 1, a);
  const k = percent(a, 0.1, 0.5);
  b.translate(c / 2, d / 2);
  c = min(6, min(c, d) / 99);
  b.scale(c, c);
  b.translate(-40, -35);
  b.lineJoin = b.lineCap = "round";
  b.lineWidth = 0.1 + 1.9 * k;
  c = percent(a, 0.1, 1);
  b.setLineDash([99 * c, 99]);
  g(7, 16, 18, -8, e(2, 2));
  g(7, 8, 18, 4, e(2, 3));
  g(25, 8, 8, 8, e(2, 1));
  g(25, 8, -18, 8);
  g(25, 8, 8, 8);
  g(25, 16, 7, 23, e());
  g(11, 39, 14, -23, e(1, 1));
  g(11, 16, 14, 18, e(1, 2));
  g(11, 16, 14, 8, e(1, 3));
  g(25, 16, -14, 24);
  g(15, 29, 6, -9, e(2, 2));
  f(15, 21, 5, 0, PI / 2, e(2, 4), 1);
  g(21, 21, -6, 9);
  g(37, 14, 9, 6, e(3, 2));
  g(37, 14, 4.5, 6, e(3, 3));
  g(37, 14, 9, 6);
  g(50, 20, 10, -8, e(0, 1));
  g(50, 20, 6.5, -8, e(0, 2));
  g(50, 20, 3.5, -8, e(0, 3));
  g(50, 20, 10, -8);
  f(55, 2, 11.4, 0.5, PI - 0.5, e(3, 3));
  f(55, 2, 11.4, 0.5, PI / 2, e(3, 2), 1);
  f(55, 2, 11.4, 0.5, PI - 0.5);
  g(45, 7, 20, -7, e(0, 2));
  g(45, -1, 20, 4, e(0, 3));
  g(45, -1, 20, 8);
  for (c = 5; c--; ) f(60 - 6 * c, 30, 9.9, 0, 2 * PI, e(c + 2, 3)), f(60 - 6 * c, 30, 10, -0.5, PI + 0.5, e(c + 2, 2)), f(60 - 6 * c, 30, 10.1, 0.5, PI - 0.5, e(c + 2, 1));
  f(36, 30, 10, PI / 2, 3 * PI / 2);
  f(48, 30, 10, PI / 2, 3 * PI / 2);
  f(60, 30, 10);
  b.beginPath();
  b.lineTo(36, 20);
  b.lineTo(60, 20);
  b.stroke();
  f(60, 30, 4, PI, 3 * PI, e(3, 2));
  f(60, 30, 4, PI, 2 * PI, e(3, 3));
  f(60, 30, 4, PI, 3 * PI);
  for (c = 6; c--; ) b.beginPath(), b.lineTo(53, 54), b.lineTo(53, 40), b.lineTo(53 + (1 + 2.9 * c) * k, 40), b.lineTo(53 + (4 + 3.5 * c) * k, 54), b.fillStyle = e(0, c % 2 + 2), b.fill(), c % 2 && b.stroke();
  g(6, 40, 5, 5);
  g(6, 40, 5, 5, e());
  g(15, 54, 38, -14, e());
  for (g = 3; g--; ) for (c = 2; c--; ) f(15 * g + 15, 47, c ? 7 : 1, PI, 3 * PI, e(g, 3)), b.stroke(), f(15 * g + 15, 47, c ? 7 : 1, 0, PI, e(g, 2)), b.stroke();
  b.beginPath();
  b.lineTo(6, 40);
  b.lineTo(68, 40);
  b.stroke();
  b.beginPath();
  b.lineTo(77, 54);
  b.lineTo(4, 54);
  b.stroke();
  f = engineName;
  b.font = "900 16px arial";
  b.textAlign = "center";
  b.textBaseline = "top";
  b.lineWidth = 0.1 + 3.9 * k;
  g = 0;
  for (c = 0; c < f.length; ++c) g += b.measureText(f[c]).width;
  for (c = 2; c--; ) for (let h = 0, m = 41 - g / 2; h < f.length; ++h) b.fillStyle = e(h, 2), d = b.measureText(f[h]).width, b[c ? "strokeText" : "fillText"](f[h], m + d / 2, 55.5, 17 * k), m += d;
  b.restore();
}
const LittleJS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ASSERT,
  BLACK,
  BLUE,
  CYAN,
  Color,
  EngineObject,
  FontImage,
  GRAY,
  GREEN,
  MAGENTA,
  Medal,
  Music,
  ORANGE,
  PI,
  PURPLE,
  Particle,
  ParticleEmitter,
  RED,
  RandomGenerator,
  Sound,
  SoundWave,
  TextureInfo,
  TileInfo,
  TileLayer,
  TileLayerData,
  Timer,
  Vector2,
  WHITE,
  YELLOW,
  abs,
  audioContext,
  get cameraPos() {
    return cameraPos;
  },
  get cameraScale() {
    return cameraScale;
  },
  get canvasFixedSize() {
    return canvasFixedSize;
  },
  get canvasMaxSize() {
    return canvasMaxSize;
  },
  get canvasPixelated() {
    return canvasPixelated;
  },
  clamp,
  clearInput,
  combineCanvases,
  debug,
  debugCircle,
  debugClear,
  debugLine,
  debugOverlap,
  debugOverlay,
  debugPoint,
  debugPoly,
  debugRect,
  debugSaveCanvas,
  debugSaveDataURL,
  debugSaveText,
  debugText,
  distanceAngle,
  distanceWrap,
  drawCanvas2D,
  drawCircle,
  drawEllipse,
  drawLine,
  drawPoly,
  drawRect,
  drawText,
  drawTextOverlay,
  drawTextScreen,
  drawTile,
  get enablePhysicsSolver() {
    return enablePhysicsSolver;
  },
  engineAddPlugin,
  get engineFontImage() {
    return engineFontImage;
  },
  engineInit,
  engineName,
  get engineObjects() {
    return engineObjects;
  },
  engineObjectsCallback,
  engineObjectsDestroy,
  engineObjectsRaycast,
  engineObjectsUpdate,
  engineVersion,
  get fontDefault() {
    return fontDefault;
  },
  formatTime,
  get frame() {
    return frame;
  },
  frameRate,
  get gamepadDirectionEmulateStick() {
    return gamepadDirectionEmulateStick;
  },
  gamepadIsDown,
  gamepadStick,
  gamepadWasPressed,
  gamepadWasReleased,
  get gamepadsEnable() {
    return gamepadsEnable;
  },
  gamepadsUpdate,
  getCameraSize,
  getNoteFrequency,
  getTileCollisionData,
  get glActiveTexture() {
    return glActiveTexture;
  },
  get glAdditive() {
    return glAdditive;
  },
  get glAntialias() {
    return glAntialias;
  },
  get glArrayBuffer() {
    return glArrayBuffer;
  },
  get glBatchAdditive() {
    return glBatchAdditive;
  },
  get glCanvas() {
    return glCanvas;
  },
  glClearCanvas,
  get glColorData() {
    return glColorData;
  },
  glCompileShader,
  get glContext() {
    return glContext;
  },
  glCopyToContext,
  glCreateProgram,
  glCreateTexture,
  glDraw,
  get glEnable() {
    return glEnable;
  },
  glFlush,
  get glGeometryBuffer() {
    return glGeometryBuffer;
  },
  get glInstanceCount() {
    return glInstanceCount;
  },
  get glOverlay() {
    return glOverlay;
  },
  get glPositionData() {
    return glPositionData;
  },
  glSetAntialias,
  glSetTexture,
  get glShader() {
    return glShader;
  },
  get gravity() {
    return gravity;
  },
  get headlessMode() {
    return headlessMode;
  },
  hsl,
  initTileCollision,
  get inputWASDEmulateDirection() {
    return inputWASDEmulateDirection;
  },
  isColor,
  isFullscreen,
  isIntersecting,
  isOverlapping,
  isTouchDevice,
  get isUsingGamepad() {
    return isUsingGamepad;
  },
  keyIsDown,
  keyWasPressed,
  keyWasReleased,
  lerp,
  lerpAngle,
  lerpWrap,
  get mainCanvas() {
    return mainCanvas;
  },
  get mainCanvasSize() {
    return mainCanvasSize;
  },
  get mainContext() {
    return mainContext;
  },
  max,
  get medalDisplayIconSize() {
    return medalDisplayIconSize;
  },
  get medalDisplaySize() {
    return medalDisplaySize;
  },
  get medalDisplaySlideTime() {
    return medalDisplaySlideTime;
  },
  get medalDisplayTime() {
    return medalDisplayTime;
  },
  medals,
  medalsInit,
  get medalsPreventUnlock() {
    return medalsPreventUnlock;
  },
  min,
  mod,
  mouseIsDown,
  get mousePos() {
    return mousePos;
  },
  get mousePosScreen() {
    return mousePosScreen;
  },
  mouseToScreen,
  mouseWasPressed,
  mouseWasReleased,
  get mouseWheel() {
    return mouseWheel;
  },
  nearestPowerOfTwo,
  get objectDefaultAngleDamping() {
    return objectDefaultAngleDamping;
  },
  get objectDefaultDamping() {
    return objectDefaultDamping;
  },
  get objectDefaultElasticity() {
    return objectDefaultElasticity;
  },
  get objectDefaultFriction() {
    return objectDefaultFriction;
  },
  get objectDefaultMass() {
    return objectDefaultMass;
  },
  get objectMaxSpeed() {
    return objectMaxSpeed;
  },
  get overlayCanvas() {
    return overlayCanvas;
  },
  get overlayContext() {
    return overlayContext;
  },
  get particleEmitRateScale() {
    return particleEmitRateScale;
  },
  get paused() {
    return paused;
  },
  percent,
  playAudioFile,
  playSamples,
  preventDefaultInput,
  rand,
  randColor,
  randInCircle,
  randInt,
  randSign,
  randVector,
  rgb: rgb$1,
  screenToWorld,
  setBlendMode,
  setCameraPos,
  setCameraScale,
  setCanvasFixedSize,
  setCanvasMaxSize,
  setCanvasPixelated,
  setCursor,
  setDebugKey,
  setEnablePhysicsSolver,
  setFontDefault,
  setGamepadDirectionEmulateStick,
  setGamepadsEnable,
  setGlEnable,
  setGlOverlay,
  setGravity,
  setHeadlessMode,
  setInputWASDEmulateDirection,
  setMedalDisplayIconSize,
  setMedalDisplaySize,
  setMedalDisplaySlideTime,
  setMedalDisplayTime,
  setMedalsPreventUnlock,
  setObjectDefaultAngleDamping,
  setObjectDefaultDamping,
  setObjectDefaultElasticity,
  setObjectDefaultFriction,
  setObjectDefaultMass,
  setObjectMaxSpeed,
  setParticleEmitRateScale,
  setPaused,
  setShowSplashScreen,
  setShowWatermark,
  setSoundDefaultRange,
  setSoundDefaultTaper,
  setSoundEnable,
  setSoundVolume,
  setTileCollisionData,
  setTileFixBleedScale,
  setTileSizeDefault,
  setTilesPixelated,
  setTouchGamepadAlpha,
  setTouchGamepadAnalog,
  setTouchGamepadEnable,
  setTouchGamepadSize,
  setTouchInputEnable,
  setVibrateEnable,
  get showSplashScreen() {
    return showSplashScreen;
  },
  get showWatermark() {
    return showWatermark;
  },
  sign,
  smoothStep,
  get soundDefaultRange() {
    return soundDefaultRange;
  },
  get soundDefaultTaper() {
    return soundDefaultTaper;
  },
  get soundEnable() {
    return soundEnable;
  },
  get soundVolume() {
    return soundVolume;
  },
  speak,
  speakStop,
  textureInfos,
  tile,
  get tileCollision() {
    return tileCollision;
  },
  tileCollisionRaycast,
  get tileCollisionSize() {
    return tileCollisionSize;
  },
  tileCollisionTest,
  get tileFixBleedScale() {
    return tileFixBleedScale;
  },
  get tileSizeDefault() {
    return tileSizeDefault;
  },
  get tilesPixelated() {
    return tilesPixelated;
  },
  get time() {
    return time;
  },
  timeDelta,
  get timeReal() {
    return timeReal;
  },
  toggleFullscreen,
  get touchGamepadAlpha() {
    return touchGamepadAlpha;
  },
  get touchGamepadAnalog() {
    return touchGamepadAnalog;
  },
  get touchGamepadEnable() {
    return touchGamepadEnable;
  },
  get touchGamepadSize() {
    return touchGamepadSize;
  },
  vec2: vec2$1,
  vibrate,
  get vibrateEnable() {
    return vibrateEnable;
  },
  vibrateStop,
  wave,
  worldToScreen,
  zzfx
}, Symbol.toStringTag, { value: "Module" }));
const body = document.getElementById("body");
const welcome = document.getElementById("welcome");
const game_over = document.getElementById("game_over");
const prestige$1 = document.getElementById("prestige");
function setMainVisible(visible) {
  if (body)
    body.style.display = visible ? "block" : "none";
}
function setWelcomeVisible(visible) {
  if (welcome)
    welcome.style.display = visible ? "block" : "none";
}
function setGameOverVisible(visible) {
  if (game_over)
    game_over.style.display = visible ? "block" : "none";
}
function setPrestigeVisible(visible) {
  if (prestige$1)
    prestige$1.style.display = visible ? "block" : "none";
}
function getCSSRuleIndex(selector) {
  for (let idx = 0; idx < document.styleSheets[0].cssRules.length; idx++) {
    const rule = document.styleSheets[0].cssRules[idx];
    if (selector === rule["selectorText"]) {
      return idx;
    }
  }
  return -1;
}
function init() {
  setMainVisible(false);
  setWelcomeVisible(true);
  setGameOverVisible(false);
  setPrestigeVisible(false);
}
function getData() {
  return `{"sheets":[{"name":"tasks","columns":[{"typeStr":"0","name":"id","kind":null,"scope":null},{"typeStr":"1","name":"name","kind":"localizable"},{"typeStr":"5:Job,Construction,Exploration,Reproduction","name":"type"},{"typeStr":"2","name":"autoRemove","kind":null},{"typeStr":"2","name":"autoRestart"},{"typeStr":"2","name":"ModifyInvCap"},{"typeStr":"17","name":"need","kind":null},{"typeStr":"17","name":"result","kind":null},{"typeStr":"1","name":"details","kind":"localizable"},{"typeStr":"4","name":"speed","kind":null}],"lines":[{"id":"task_punch_tree","name":"Punch tree","speed":0.5,"need":{"villagers":1},"details":"A Simple resource","autoRestart":true,"result":{"woods":1},"ModifyInvCap":false,"type":0,"autoRemove":false},{"id":"task_punch_berry","name":"Punch berry tree","autoRestart":true,"ModifyInvCap":false,"need":{"villagers":1},"result":{"berries":1},"details":"Used to feed villagers","speed":0.5,"type":0,"autoRemove":false},{"id":"task_punch_rock","name":"Punch rock","need":{"villagers":1},"speed":0.5,"details":"A Simple resource","autoRestart":true,"result":{"stones":1},"ModifyInvCap":false,"type":0,"autoRemove":false},{"id":"task_create_stick","name":"Make a stick","need":{"villagers":1,"woods":1},"speed":0.5,"details":"A Simple resource","autoRestart":true,"result":{"sticks":1},"ModifyInvCap":false,"type":0,"autoRemove":false},{"id":"task_build_house","name":"House","need":{"villagers":1,"woods":2,"stones":1},"speed":0.3,"details":"A nice place to live","autoRestart":false,"result":{"houses":1},"ModifyInvCap":false,"type":1,"autoRemove":false},{"id":"task_build_shed","name":"Shed","need":{"villagers":1,"woods":1,"stones":1,"sticks":1},"speed":0.3,"details":"Increase your inventory cap by 5","autoRestart":false,"result":{"woods":5,"stones":5,"sticks":5,"houses":2,"villagers":2,"berries":5,"custom":"inventory.sheds += 1"},"ModifyInvCap":true,"type":1,"autoRemove":false},{"id":"task_build_shop","name":"Shop","autoRestart":false,"ModifyInvCap":false,"need":{"villagers":1,"woods":20,"stones":20,"sticks":10},"result":{"custom":"readyToUnlock['shop'] = true"},"details":"A place to sell your resources","speed":0.2,"type":1,"autoRemove":true},{"id":"task_build_research_cencer","name":"Research Center","type":1,"autoRemove":true,"autoRestart":false,"ModifyInvCap":false,"need":{"villagers":1,"woods":50,"stones":50,"sticks":25},"result":{"custom":"readyToUnlock['project'] = true"},"details":"Invest in projects, improve quality of life","speed":0.1},{"id":"task_make_offspring","name":"Make Offspring","type":3,"autoRemove":false,"autoRestart":false,"ModifyInvCap":false,"need":{"villagers":2,"houses":1},"result":{"custom":"addTask(['task_raise_offspring']); startTaskID('task_raise_offspring'); inventory.offsprings++"},"details":"Needs a house to grow in","speed":0.2},{"id":"task_raise_offspring","name":"Raise Offspring","type":3,"autoRemove":true,"autoRestart":false,"ModifyInvCap":false,"need":{"offsprings":1,"houses":1},"result":{"villagers":1},"details":"Grow an offspring to a real villager","speed":0.2},{"id":"task_build_warehouse","name":"Warehouse","type":1,"autoRemove":false,"autoRestart":false,"ModifyInvCap":true,"need":{"villagers":2,"sticks":100,"stones":200,"woods":200},"result":{"berries":100,"houses":100,"offsprings":10,"sticks":100,"stones":100,"villagers":20,"woods":100,"custom":"inventory.warehouses +=1"},"details":"Increase your inventory cap by 100","speed":0.1}],"separators":[],"props":{}},{"name":"resources","columns":[{"typeStr":"0","name":"id","kind":null,"scope":null},{"typeStr":"1","name":"name","kind":"localizable"},{"typeStr":"4","name":"price"}],"lines":[{"id":"woods","name":"Wood","price":1},{"id":"stones","name":"Stone","price":1},{"id":"sticks","name":"Stick","price":2},{"id":"berries","name":"Berry","price":1}],"separators":[],"props":{}},{"name":"projects","columns":[{"typeStr":"0","name":"id","kind":null,"scope":null},{"typeStr":"1","name":"name","kind":"localizable"},{"typeStr":"1","name":"log","kind":"localizable"},{"typeStr":"1","name":"description","kind":"localizable"},{"typeStr":"3","name":"cost","kind":null},{"typeStr":"1","name":"action"}],"lines":[{"id":"proj_hire_villager","name":"Hire a Villager","description":"Do more stuffs","action":"inventory.villagers += 1","cost":100,"log":"Hired another villager"},{"id":"proj_auto_gather_food","name":"Gather Food Automatically","description":"When there is not enough food, interrupt the current task and start gathering food","action":"enabledAutomations['auto_gather_food'] = true","cost":150,"log":"Automated Food gathering enabled"},{"id":"proj_auto_gather_wood","name":"Gather Wood Automatically","log":"Automated Wood gathering enabled","description":"When there is no wood, interrupt the current task and start gathering wood","cost":150,"action":"enabledAutomations['auto_gather_wood'] = true"},{"id":"proj_auto_gather_stone","name":"Gather Stone Automatically","log":"Automated Stone gathering enabled","description":"When there is no stone, interrupt the current task and start gathering wood","cost":150,"action":"enabledAutomations['auto_gather_stone'] = true"},{"id":"proj_auto_build_shed","name":"Build Shed Automatically","description":"When the inventory capacity is reached. Build a shed to increase it's cap","action":"enabledAutomations['auto_build_shed'] = true","cost":200,"log":"Automated Shed building enabled"},{"id":"proj_increase_resource_price_by_25","name":"Increase public demand","log":"Resources price increased by 25%","description":"Increase resources price by 25%","cost":250,"action":"increaseResourceCost(25)"},{"id":"proj_double_job_production","name":"Double Job Results","log":"Job results doubled","description":"Double the result of job tasks","cost":250,"action":"increaseJobResults(100)"},{"id":"proj_start_house_building_program","name":"House construction program","log":"","description":"Encourage villagers to build houses","cost":150,"action":"readyToUnlock['house'] = true"},{"id":"proj_procreation","name":"Procreation","log":"","description":"Encourage villagers to make offsprings","cost":150,"action":"readyToUnlock['procreation'] = true"},{"id":"proj_reduce_project_cost_by_10","name":"Reduce Projects cost by 10%","log":"","description":"","cost":0,"action":"costReduction = .1"},{"id":"proj_double_initial_villagers","name":"Double initial villagers number","log":"","description":"","cost":0,"action":"inventory.villagers = 2"}],"separators":[],"props":{}},{"name":"unlocks","columns":[{"typeStr":"0","name":"id","kind":null,"scope":null},{"typeStr":"1","name":"name","kind":null},{"typeStr":"1","name":"condition"},{"typeStr":"1","name":"action","kind":null}],"lines":[{"id":"unlock_shed","name":"Construction: Shed available","condition":"return isInventoryFull()","action":"addTask(['task_build_shed'])"},{"id":"unlock_warehouse","name":"Construction: Warehouse available","condition":"return inventory.max_woods >= 100","action":"addTask(['task_build_warehouse'])"},{"id":"unlock_house","name":"Construction: House available","condition":"return readyToUnlock['house'] == true","action":"addTask(['task_build_house'])"},{"id":"unlock_research_center","name":"Construction: Research Center available","condition":"return shop.style.display == 'block'","action":"addTask(['task_build_research_cencer'])"},{"id":"unlock_shop","name":"Construction: Shop available","condition":"return inventory.max_woods >= 20","action":"addTask(['task_build_shop']); status_money.style.display = 'block';"},{"id":"unlock_auto_gather_food","name":"","condition":"return inventory.villagers >= 2","action":"addProject([ 'proj_auto_gather_food']);"},{"id":"unlock_auto_gather_wood","name":"","condition":"return inventory.villagers >= 2","action":"addProject([ 'proj_auto_gather_wood']);"},{"id":"unlock_auto_gather_stone","name":"","condition":"return inventory.villagers >= 2","action":"addProject([ 'proj_auto_gather_stone']);"},{"id":"unlock_auto_build_shed","name":"","condition":"return inventory.villagers >= 2","action":"addProject([ 'proj_auto_build_shed']);"},{"id":"unlock_projects","name":"Projects are now available","condition":"return readyToUnlock['project'] == true","action":"addProject(['proj_hire_villager'])"},{"id":"unlock_offspring","name":"Villagers are encouraged to make offspring","condition":"return readyToUnlock['procreation'] == true","action":"addTask(['task_make_offspring'])"},{"id":"unlock_show_shop","name":"Resources can now be sold in the shop","condition":"return readyToUnlock['shop'] == true","action":"shop.style.display = 'block'"},{"id":"unlock_inv_woods","name":"","condition":"return inventory.woods >= 1","action":"lab_wood_count.parentElement.style.visibility= 'visible'"},{"id":"unlock_inv_berries","name":"","condition":"return inventory.berries >= 1","action":"lab_berry_count.parentElement.style.visibility= 'visible'"},{"id":"unlock_inv_stones","name":"","condition":"return inventory.stones >= 1","action":"lab_stone_count.parentElement.style.visibility= 'visible'"},{"id":"unlock_inv_houses","name":"","condition":"return inventory.houses>= 1","action":"lab_house_count.parentElement.style.visibility= 'visible'"},{"id":"unlock_inv_offsprings","name":"","condition":"return inventory.offsprings>= 1","action":"lab_offspring_count.parentElement.style.visibility= 'visible'"},{"id":"unlock_inv_sticks","name":"","condition":"return inventory.sticks>= 1","action":"lab_stick_count.parentElement.style.visibility= 'visible'"},{"id":"unlock_increase_resource_cost","name":"","condition":"return totalResourcesSold() >= 200","action":"addProject([ 'proj_increase_resource_cost_by_25']);"},{"id":"unlock_double_job_results","name":"","condition":"return totalResourcesProduiced() >= 200 && readyToUnlock['project'] == true","action":"addProject(['proj_double_job_production','proj_start_house_building_program'])"},{"id":"unlock_procreation","name":"","condition":"return readyToUnlock['house'] == true","action":"addProject(['proj_procreation'])"},{"id":"unlock_prestige","name":"","condition":"return moon >= 100","action":"suggestPrestige()"}],"separators":[],"props":{}},{"name":"quests","columns":[{"typeStr":"0","name":"id","kind":null,"scope":null},{"typeStr":"1","name":"name","kind":"localizable"},{"typeStr":"1","name":"condition","kind":null}],"lines":[{"id":"quest_gather_berry","name":"Gather Berry","condition":"return inventory.berries >= 1"},{"id":"quest_harvest_tree","name":"Harvest a tree","condition":"return inventory.woods >= 1"},{"id":"quest_make_stick","name":"Make a stick","condition":"return inventory.sticks >= 1"},{"id":"quest_gather_stone","name":"Gather Stone","condition":"return inventory.stones >= 1"},{"id":"moon_speed_x2","name":"Set Moon speed x2","condition":"return timeMultiplier == 2"},{"id":"moon_speed_x4","name":"Set Moon speed x4","condition":"return timeMultiplier == 4"},{"id":"pause_moon","name":"Pause the moon","condition":"return isMoonPaused == true"},{"id":"quest_build_shed","name":"Build a Shed","condition":"return inventory.sheds >= 1"},{"id":"quest_build_shop","name":"Build a Shop","condition":"return shop.style.display == 'block'"},{"id":"quest_sell_wood","name":"Sell Wood","condition":"return resourcesSold.woods >= 1"},{"id":"quest_sell_stick","name":"Sell Stick","condition":"return resourcesSold.sticks >= 1"},{"id":"quest_sell_berry","name":"Sell Berry","condition":"return resourcesSold.berries >= 1"},{"id":"quest_sell_stone","name":"Sell Stone","condition":"return resourcesSold.stones >= 1"},{"id":"quest_build_research_cencer","name":"Build a Research Center","condition":"return projects.style.display == 'block'"},{"id":"quest_hire_villager","name":"Hire a Villager","condition":"return inventory.villagers > 1"},{"id":"quest_build_house","name":"Build a House","condition":"return inventory.houses >= 1"},{"id":"quest_make_offspring","name":"Make an offspring","condition":"return inventory.offsprings >= 1"},{"id":"quest_build_warehouse","name":"Build a Warehouse","condition":"return inventory.warehouses >= 1"},{"id":"quest_5_villagers","name":"Have 5 Villagers","condition":"return inventory.villagers >= 5"},{"id":"quest_10_villagers","name":"Have 10 Villagers","condition":"return inventory.villagers >= 10"},{"id":"quest_30_villagers","name":"Have 30 Villagers","condition":"return inventory.villagers >= 30"},{"id":"quest_50_villagers","name":"Have 50 Villagers","condition":"return inventory.villagers >= 50"}],"separators":[],"props":{}},{"name":"automations","columns":[{"typeStr":"0","name":"id","kind":null,"scope":null},{"typeStr":"1","name":"name","kind":"localizable"},{"typeStr":"1","name":"startCondition","kind":null},{"typeStr":"6:tasks","name":"taskID"},{"typeStr":"1","name":"stopCondition","kind":null}],"lines":[{"id":"auto_berry","name":"Gather berries automatically","startCondition":"return enabledAutomations['auto_gather_food'] && food < foodNeeded","stopCondition":"return food >= foodNeeded","taskID":"task_punch_berry"},{"id":"auto_wood","name":"Gather wood automatically","startCondition":"return enabledAutomations['auto_gather_wood'] && inventory.woods <= 0","taskID":"task_punch_tree","stopCondition":"return inventory.woods >= inventory.max_woods/2"},{"id":"auto_stone","name":"Gather stone automatically","startCondition":"return enabledAutomations['auto_gather_stone'] && inventory.stones <= 0","taskID":"task_punch_rock","stopCondition":"return inventory.stones >= inventory.max_stones/2"},{"id":"auto_shed","name":"Build shed automatically","startCondition":"return enabledAutomations['auto_build_shed'] &&  isInventoryFull()","stopCondition":"return  !isInventoryFull()","taskID":"task_build_shed"}],"separators":[],"props":{}},{"name":"tasks@need","props":{"hide":true,"isProps":true},"separators":[],"lines":[],"columns":[{"typeStr":"3","name":"woods","opt":true},{"typeStr":"3","name":"stones","opt":true},{"typeStr":"3","name":"villagers","opt":true},{"typeStr":"3","name":"sticks","opt":true},{"typeStr":"3","name":"houses","opt":true,"kind":null},{"typeStr":"3","name":"offsprings","opt":true,"kind":null}]},{"name":"tasks@result","props":{"hide":true,"isProps":true},"separators":[],"lines":[],"columns":[{"typeStr":"3","name":"woods","opt":true},{"typeStr":"3","name":"stones","opt":true},{"typeStr":"3","name":"sticks","opt":true},{"typeStr":"3","name":"houses","opt":true},{"typeStr":"3","name":"villagers","opt":true},{"typeStr":"3","name":"berries","opt":true},{"typeStr":"1","name":"custom","opt":true},{"typeStr":"3","name":"offsprings","opt":true}]}],"customTypes":[],"compress":true}`;
}
class Task {
  constructor(name = "", autoRestart = false, need, result, describedNeed = "", details = "", speed = 1, id2 = "", type = 0, autoRemove = false) {
    __publicField(this, "_isRunning");
    __publicField(this, "cssSelectorText");
    __publicField(this, "isCancelled");
    __publicField(this, "whyDisabled");
    __publicField(this, "onCompleted", null);
    __publicField(this, "progress");
    __publicField(this, "btn");
    __publicField(this, "labTitle");
    this.name = name;
    this.autoRestart = autoRestart;
    this.need = need;
    this.result = result;
    this.describedNeed = describedNeed;
    this.details = details;
    this.speed = speed;
    this.id = id2;
    this.type = type;
    this.autoRemove = autoRemove;
    this.cssSelectorText = "";
    this.isCancelled = false;
    this.whyDisabled = "";
    this._isRunning = false;
    this.progress = null;
    this.btn = null;
    this.labTitle = null;
  }
  set isRunning(value) {
    if (this._isRunning != value) {
      if (value) {
        this.showProgress();
      } else {
        this.hideProgress();
      }
    }
    this._isRunning = value;
  }
  get isRunning() {
    return this._isRunning;
  }
  bindDom(progress, btn, labTitle) {
    this.progress = progress;
    this.btn = btn;
    this.labTitle = labTitle;
    if (this.labTitle)
      this.labTitle.textContent = this.name;
    this.isRunning = false;
  }
  /**
   * Show the progress bar
   */
  hideProgress() {
    if (this.progress) {
      this.progress.style.visibility = "hidden";
      this.progress.style.width = "0%";
      if (this.isCancelled) {
        this.progress.style.alignSelf = "flex-start";
      } else {
        this.progress.style.alignSelf = "flex-end";
      }
    }
  }
  /**
   * Hide the progress bar
   */
  showProgress() {
    if (this.progress) {
      this.progress.style.visibility = "visible";
      this.progress.value = 0;
      this.progress.style.width = "100%";
      this.progress.style.alignSelf = "flex-start";
    }
  }
  /**
   * Start the task
   */
  start() {
    var _a;
    this.isRunning = true;
    this.isCancelled = false;
    this.cssSelectorText = `#${(_a = this.btn) == null ? void 0 : _a.id}::before`;
    this.setRunningIcon();
  }
  stop(cancelled = false) {
    this.isCancelled = cancelled;
    this.isRunning = false;
    this.resetIcon();
  }
  /**
   * Reset the progress bar
   */
  resetProgress() {
    if (this.progress)
      this.progress.value = 0;
  }
  resetIcon() {
    const idx = getCSSRuleIndex(this.cssSelectorText);
    if (document.styleSheets[0].cssRules[idx] != null) {
      document.styleSheets[0].deleteRule(idx);
    }
  }
  setRunningIcon() {
    var _a;
    document.styleSheets[0].insertRule(`#${(_a = this.btn) == null ? void 0 : _a.id}::before{content:"∎";}`);
  }
  reset() {
    this.resetProgress();
    this.isCancelled = false;
    this.isRunning = false;
  }
}
class Need {
  constructor(villagers = 0, woods = 0, stones = 0, sticks = 0, offsprings = 0, money2 = 0) {
    this.villagers = villagers;
    this.woods = woods;
    this.stones = stones;
    this.sticks = sticks;
    this.offsprings = offsprings;
    this.money = money2;
  }
}
class Result {
  constructor(villagers = 0, woods = 0, stones = 0, sticks = 0, houses = 0, berries = 0, offsprings = 0, modifyInventoryCap = false, strCustom) {
    __publicField(this, "custom");
    this.villagers = villagers;
    this.woods = woods;
    this.stones = stones;
    this.sticks = sticks;
    this.houses = houses;
    this.berries = berries;
    this.offsprings = offsprings;
    this.modifyInventoryCap = modifyInventoryCap;
    this.strCustom = strCustom;
    this.custom = new Function();
  }
}
class Quest {
  constructor(id2, name, strCondition) {
    __publicField(this, "_isCompleted");
    __publicField(this, "eltCheckbox", null);
    __publicField(this, "eltQuest", null);
    __publicField(this, "condition");
    this.id = id2;
    this.name = name;
    this.strCondition = strCondition;
    this._isCompleted = false;
    this.condition = new Function();
  }
  set isCompleted(value) {
    this._isCompleted = value;
    if (!this.eltCheckbox || !this.eltQuest)
      return;
    if (this._isCompleted) {
      this.eltCheckbox.checked = true;
      this.eltQuest.style.opacity = ".6.";
    } else {
      this.eltCheckbox.checked = false;
      this.eltQuest.style.opacity = "1";
    }
  }
  get isCompleted() {
    return this._isCompleted;
  }
  bindDom(quest2, checkbox) {
    this.eltCheckbox = checkbox;
    this.eltQuest = quest2;
  }
}
class ShopEntry {
  constructor(id2, name, price) {
    __publicField(this, "_price");
    __publicField(this, "_amount");
    __publicField(this, "total");
    __publicField(this, "eltPrice", null);
    __publicField(this, "eltTotal", null);
    __publicField(this, "eltName", null);
    __publicField(this, "eltAmount", null);
    __publicField(this, "valueChanged", null);
    this.id = id2;
    this.name = name;
    this._price = price;
    this._amount = 0;
    this.total = 0;
  }
  get price() {
    return this._price;
  }
  get amount() {
    return this._amount;
  }
  set price(value) {
    this._price = value;
    if (this.eltPrice)
      this.eltPrice.textContent = value.toString();
    this.total = this.amount * value;
    if (this.valueChanged != null)
      this.valueChanged();
  }
  set amount(value) {
    this._amount = value;
    this.total = this.amount * this.price;
    if (this.eltTotal)
      this.eltTotal.textContent = this.total.toString();
    if (this.valueChanged != null)
      this.valueChanged();
  }
  bindDom(name, price, amount, total, valueChanged = null) {
    this.eltName = name;
    this.eltPrice = price;
    this.eltAmount = amount;
    this.eltTotal = total;
    this.valueChanged = valueChanged;
    this.eltAmount.onchange = () => {
      if (this.eltAmount)
        this.amount = parseInt(this.eltAmount.value);
    };
    this.eltAmount.value = "0";
    this.total = 0;
    this.amount = 0;
    this.price = this._price;
    this.eltName.textContent = this.name;
  }
}
class Project {
  constructor(id2, name, description, log, cost, strAction) {
    __publicField(this, "isRemoved");
    __publicField(this, "element", null);
    __publicField(this, "action");
    this.id = id2;
    this.name = name;
    this.description = description;
    this.log = log;
    this.cost = cost;
    this.strAction = strAction;
    this.isRemoved = false;
    this.action = new Function();
  }
  bindDom(element) {
    this.element = element;
  }
}
class Unlock {
  constructor(id2, name, strCondition, strAction, isCompleted = false) {
    __publicField(this, "condition");
    __publicField(this, "action");
    this.id = id2;
    this.name = name;
    this.strCondition = strCondition;
    this.strAction = strAction;
    this.isCompleted = isCompleted;
    this.condition = new Function();
    this.action = new Function();
  }
}
class Automation {
  constructor(id2, name, strStartCondition, taskID, strStopCondition) {
    __publicField(this, "isRunning");
    __publicField(this, "stoppedTaskID");
    __publicField(this, "runningTask");
    __publicField(this, "storedAutoRestart");
    __publicField(this, "isWaiting");
    __publicField(this, "stopCondition");
    __publicField(this, "startCondition");
    this.id = id2;
    this.name = name;
    this.strStartCondition = strStartCondition;
    this.taskID = taskID;
    this.strStopCondition = strStopCondition;
    this.isRunning = false;
    this.stoppedTaskID = "";
    this.runningTask = null;
    this.storedAutoRestart = false;
    this.isWaiting = false;
    this.stopCondition = new Function();
    this.startCondition = new Function();
  }
}
class Data {
  constructor() {
    __publicField(this, "json");
    __publicField(this, "tasks");
    __publicField(this, "resources");
    __publicField(this, "projects");
    __publicField(this, "unlocks");
    __publicField(this, "quests");
    __publicField(this, "automations");
    this.json = JSON.parse(getData());
    this.tasks = this.getSheet("tasks");
    this.resources = this.getSheet("resources");
    this.projects = this.getSheet("projects");
    this.unlocks = this.getSheet("unlocks");
    this.quests = this.getSheet("quests");
    this.automations = this.getSheet("automations");
  }
  getSheet(name) {
    for (const sheet of this.json["sheets"]) {
      if (sheet["name"] === name) {
        return sheet;
      }
    }
  }
  getTaskByID(id2) {
    return this.getLineByID(this.tasks, id2);
  }
  getLineByID(sheet, id2) {
    for (let line of sheet["lines"]) {
      if (line["id"] === id2) {
        return line;
      }
    }
    console.error("method `getLineByID` ", id2, " not found");
  }
  /**
   * @param {String} id - Task id
   */
  getTaskInstanceByID(id2) {
    if (id2.length <= 0)
      return;
    let line = this.getTaskByID(id2);
    let describedNeed = "";
    for (const k in line["need"]) {
      describedNeed += line["need"][k] + "x " + k + "<br/>";
    }
    return new Task(
      line["name"],
      line["autoRestart"],
      new Need(
        line["need"]["villagers"],
        line["need"]["woods"],
        line["need"]["stones"],
        line["need"]["sticks"],
        line["need"]["offsprings"],
        line["need"]["money"]
      ),
      new Result(
        line["result"]["villagers"],
        line["result"]["woods"],
        line["result"]["stones"],
        line["result"]["sticks"],
        line["result"]["houses"],
        line["result"]["berries"],
        line["result"]["offsprings"],
        line["ModifyInvCap"],
        line["result"]["custom"]
      ),
      describedNeed,
      line["details"],
      line["speed"],
      id2,
      line["type"],
      line["autoRemove"]
    );
  }
  getAllTaskInstances() {
    let listTasks2 = [];
    for (const line of this.tasks["lines"]) {
      listTasks2.push(this.getTaskInstanceByID(line["id"]));
    }
    return listTasks2;
  }
  /**
   *
   * @param {String} id
   * @returns {ShopEntry}
   */
  getShopEntryInstanceByID(id2) {
    let line = this.getLineByID(this.resources, id2);
    return new ShopEntry(
      line["id"],
      line["name"],
      line["price"]
    );
  }
  getAllShopEntryInstances() {
    let listEntries = [];
    for (const line of this.resources["lines"]) {
      let entry = this.getShopEntryInstanceByID(line["id"]);
      const price = document.getElementById(`price_${entry.id}`);
      const name = document.getElementById(`name_${entry.id}`);
      const amount = document.getElementById(`amount_${entry.id}`);
      const total = document.getElementById(`total_${entry.id}`);
      if (price != null && name != null && amount != null && total != null) {
        entry.bindDom(name, price, amount, total);
        listEntries.push(entry);
      }
    }
    return listEntries;
  }
  getProjectInstanceByID(id2) {
    const line = this.getLineByID(this.projects, id2);
    return new Project(
      line["id"],
      line["name"],
      line["description"],
      line["log"],
      line["cost"],
      line["action"]
    );
  }
  getAllProjectInstances() {
    const projects = this.projects["lines"];
    let listProjects2 = [];
    for (const line of projects) {
      listProjects2.push(this.getProjectInstanceByID(line["id"]));
    }
    return listProjects2;
  }
  getAllUnlockInstances() {
    let listUnlocks2 = [];
    for (const line of this.unlocks["lines"]) {
      listUnlocks2.push(new Unlock(
        line["id"],
        line["name"],
        line["condition"],
        line["action"]
      ));
    }
    return listUnlocks2;
  }
  getQuestInstanceByID(id2) {
    const line = this.getLineByID(this.quests, id2);
    return new Quest(
      id2,
      line["name"],
      line["condition"]
    );
  }
  getAllQuestInstances() {
    let listQuests2 = [];
    for (const line of this.quests["lines"]) {
      let quest2 = this.getQuestInstanceByID(line["id"]);
      listQuests2.push(quest2);
    }
    return listQuests2;
  }
  getAllAutomationInstances() {
    let listAutomations2 = [];
    for (const line of this.automations["lines"]) {
      let auto2 = new Automation(
        line["id"],
        line["name"],
        line["startCondition"],
        line["taskID"],
        line["stopCondition"]
      );
      listAutomations2.push(auto2);
    }
    return listAutomations2;
  }
}
class DomUtils {
  constructor() {
    __publicField(this, "taskContainerIDs");
    this.taskContainerIDs = ["job_container", "construction_container", "exploration_container", "reproduction_container"];
  }
  addProject(project2) {
    if (document.getElementById(project2.id) != null) {
      console.error(`The element id ${project2.id} was already created`);
      return;
    }
    const parent = document.getElementById("project_container");
    if (!parent || !parent.parentElement)
      return;
    parent.parentElement.style.display = "block";
    parent.insertAdjacentHTML("beforeend", `
            <li aria-disabled="true" id="${project2.id}" class="item project">
                <span class="project_title">
                    <span class="project_name">${project2.name}</span>
                    <span class="project_cost">(Money: ${project2.cost})</span>
                </span>
                <p class="project_description">${project2.description}</p>
            </li>
        `);
    project2.bindDom(document.getElementById(project2.id));
  }
  addTask(task2) {
    if (task2.type >= this.taskContainerIDs.length) {
      console.error(`Task type ${task2.type} unknown, task ID: ${task2.id}`);
      return;
    }
    if (document.getElementById(`progress_${task2.id}`) != null || document.getElementById(`btn_${task2.id}`) != null || document.getElementById(`lab_${task2.id}`) != null) {
      console.error(`The element id ${task2.id} was already created`);
      return;
    }
    const parent = document.getElementById(this.taskContainerIDs[task2.type]);
    if (!parent || !parent.parentElement)
      return;
    parent.parentElement.style.display = "block";
    parent.insertAdjacentHTML("beforeend", `
            <li class="job" id="${task2.id}">
                <div class="title">
                    <span id="lab_${task2.id}">${task2.name}</span>
                    <button title="Play" id="btn_${task2.id}" class="icon-only icon-play"
                        type="button"></button>
                </div>
                <progress id="progress_${task2.id}" max="100" min="0" value="0"></progress>
            </li>
        `);
    task2.bindDom(document.querySelector(`#progress_${task2.id}`), document.querySelector(`#btn_${task2.id}`), document.querySelector(`#lab_${task2.id}`));
  }
  addQuest(quest2) {
    const parent = document.getElementById("quest_container");
    if (!parent || !parent.parentElement)
      return;
    if (document.getElementById(`${quest2.id}`) != null) {
      console.error(`The element id ${quest2.id} was already created`);
      return;
    }
    parent.insertAdjacentHTML("beforeend", `
            <li id="${quest2.id}" class="quest" style="display:none">
                <input disabled type="checkbox" name="${quest2.name}" id="checkbox_${quest2.id}" >
                <label id="lab_${quest2.id}" for="checkbox_${quest2.id}">${quest2.name}</label>
            </li>
        `);
    quest2.bindDom(document.querySelector(`#${quest2.id}`), document.querySelector(`#checkbox_${quest2.id}`));
  }
  clean() {
    const idx = getCSSRuleIndex("#btn_pause_moon::before");
    if (idx >= 0 && idx < document.styleSheets[0].cssRules.length) {
      document.styleSheets[0].deleteRule(idx);
    }
    const quests = document.getElementsByClassName("quest");
    while (quests.length > 0) {
      quests[0].remove();
    }
    const project_parent = document.getElementById("projects");
    if (project_parent)
      project_parent.style.display = "none";
    const projects = document.getElementsByClassName("project");
    while (projects.length > 0) {
      projects[0].remove();
    }
    const tasks = document.getElementsByClassName("job");
    while (tasks.length > 0) {
      tasks[0].remove();
    }
    const shop_parent = document.getElementById("shop");
    if (shop_parent)
      shop_parent.style.display = "none";
    const elts = document.querySelectorAll('.shop input[type="number"]');
    for (const elt of elts)
      elt.value = "0";
    for (const elt of document.getElementsByClassName("total"))
      elt.textContent = "0";
  }
  addLog(log) {
    if (log.trim().length <= 0)
      return;
    const parent = document.getElementById("activity_log_container");
    if (!parent)
      return;
    while (parent.children.length > 2)
      parent.children[0].remove();
    parent.insertAdjacentHTML("beforeend", `<li>${log}</li>`);
  }
  remove(id2) {
    const elt = document.getElementById(id2);
    if (elt) {
      elt.remove();
    }
  }
}
class Inventory {
  constructor(eltWood, eltStone, eltStick, eltHouse, eltVillagers, eltBerry, eltOffspring, valueChanged) {
    __publicField(this, "_max_villagers");
    __publicField(this, "_villagers");
    __publicField(this, "_max_houses");
    __publicField(this, "_houses");
    __publicField(this, "_max_sticks");
    __publicField(this, "_sticks");
    __publicField(this, "_max_stones");
    __publicField(this, "_stones");
    __publicField(this, "_max_woods");
    __publicField(this, "_woods");
    __publicField(this, "_max_berries");
    __publicField(this, "_berries");
    __publicField(this, "_max_offsprings");
    __publicField(this, "_offsprings");
    __publicField(this, "working_villagers");
    __publicField(this, "sheds");
    __publicField(this, "warehouses");
    this.eltWood = eltWood;
    this.eltStone = eltStone;
    this.eltStick = eltStick;
    this.eltHouse = eltHouse;
    this.eltVillagers = eltVillagers;
    this.eltBerry = eltBerry;
    this.eltOffspring = eltOffspring;
    this.valueChanged = valueChanged;
    this._woods = 0;
    this._max_woods = 15;
    this._stones = 0;
    this._max_stones = 15;
    this._sticks = 0;
    this._max_sticks = 15;
    this._houses = 0;
    this._max_houses = 2;
    this._villagers = 1;
    this._max_villagers = 2;
    this.working_villagers = 0;
    this._berries = 0;
    this._max_berries = 15;
    this._offsprings = 0;
    this._max_offsprings = 2;
    this.sheds = 0;
    this.warehouses = 0;
  }
  get max_villagers() {
    return this._max_villagers;
  }
  get villagers() {
    return this._villagers;
  }
  get max_houses() {
    return this._max_houses;
  }
  get houses() {
    return this._houses;
  }
  get max_sticks() {
    return this._max_sticks;
  }
  get sticks() {
    return this._sticks;
  }
  get max_stones() {
    return this._max_stones;
  }
  get stones() {
    return this._stones;
  }
  get max_woods() {
    return this._max_woods;
  }
  get woods() {
    return this._woods;
  }
  get berries() {
    return this._berries;
  }
  get max_berries() {
    return this._max_berries;
  }
  get offsprings() {
    return this._offsprings;
  }
  get max_offsprings() {
    return this._max_offsprings;
  }
  set max_villagers(value) {
    this._max_villagers = value;
    if (this.eltVillagers)
      this.eltVillagers.textContent = this.villagers + "/" + this.max_villagers;
  }
  set villagers(value) {
    this._villagers = value;
    if (this._villagers > this._max_villagers)
      this._villagers = this._max_villagers;
    if (this.eltVillagers)
      this.eltVillagers.textContent = this.villagers + "/" + this.max_villagers;
  }
  set max_houses(value) {
    this._max_houses = value;
    if (this.eltHouse)
      this.eltHouse.textContent = this.houses + "/" + this.max_houses;
  }
  set houses(value) {
    this._houses = value;
    if (this._houses > this._max_houses)
      this._houses = this._max_houses;
    if (this.eltHouse)
      this.eltHouse.textContent = this.houses + "/" + this.max_houses;
  }
  set max_sticks(value) {
    this._max_sticks = value;
    if (this.eltStick)
      this.eltStick.textContent = this.sticks + "/" + this.max_sticks;
  }
  set sticks(value) {
    this._sticks = value;
    if (this._sticks > this._max_sticks)
      this._sticks = this._max_sticks;
    if (this.eltStick)
      this.eltStick.textContent = this.sticks + "/" + this.max_sticks;
    if (this.valueChanged)
      this.valueChanged();
  }
  set max_stones(value) {
    this._max_stones = value;
    if (this.eltStone)
      this.eltStone.textContent = this.stones + "/" + this.max_stones;
  }
  set stones(value) {
    this._stones = value;
    if (this._stones > this._max_stones)
      this._stones = this._max_stones;
    if (this.eltStone)
      this.eltStone.textContent = this.stones + "/" + this.max_stones;
    if (this.valueChanged)
      this.valueChanged();
  }
  set max_woods(value) {
    this._max_woods = value;
    if (this.eltWood)
      this.eltWood.textContent = this.woods + "/" + this.max_woods;
  }
  set woods(value) {
    this._woods = value;
    if (this._woods > this._max_woods)
      this._woods = this._max_woods;
    if (this.eltWood)
      this.eltWood.textContent = this.woods + "/" + this.max_woods;
    if (this.valueChanged)
      this.valueChanged();
  }
  set berries(value) {
    this._berries = value;
    if (this._berries > this._max_berries)
      this._berries = this._max_berries;
    if (this.eltBerry)
      this.eltBerry.textContent = this.berries + "/" + this.max_berries;
    if (this.valueChanged)
      this.valueChanged();
  }
  set max_berries(value) {
    this._max_berries = value;
    if (this.eltBerry)
      this.eltBerry.textContent = this.berries + "/" + this.max_berries;
  }
  set offsprings(value) {
    this._offsprings = value;
    if (this._offsprings > this._max_offsprings)
      this._offsprings = this._max_offsprings;
    if (this.eltOffspring)
      this.eltOffspring.textContent = this.offsprings + "/" + this.max_offsprings;
    if (this.valueChanged)
      this.valueChanged();
  }
  set max_offsprings(value) {
    this._max_offsprings = value;
    if (this.eltOffspring)
      this.eltOffspring.textContent = this.offsprings + "/" + this.max_offsprings;
  }
  reset() {
    this.woods = 0;
    this.max_woods = 15;
    this.stones = 0;
    this.max_stones = 15;
    this.sticks = 0;
    this.max_sticks = 15;
    this.houses = 0;
    this.max_houses = 2;
    this.villagers = 1;
    this.max_villagers = 2;
    this.working_villagers = 0;
    this.berries = 0;
    this.max_berries = 15;
  }
}
const { vec2, rgb } = LittleJS;
init();
setShowSplashScreen(true);
const STARTING_TASK = [
  "task_punch_berry",
  "task_punch_tree",
  "task_create_stick",
  "task_punch_rock"
];
const FOOD_PER_VILLAGER = 2;
const FOOD_PER_OFFSPRING = 1;
const FOOD_LIST = ["berries"];
document.getElementById("shop");
document.getElementById("projects");
const sfx_new_game = document.querySelector("#sfx_new_game");
const btn_keep_playing = document.querySelector("#btn_keep_playing");
const btn_prestige = document.querySelector("#btn_prestige");
const btn_new_game = document.querySelector("#btn_new_game");
const btn_start_game = document.querySelector("#btn_start_game");
const btn_sell = document.querySelector("#btn_sell");
const btn_pause_moon = document.querySelector("#btn_pause_moon");
const btn_speed_moon = document.querySelector("#btn_speed_moon");
const sfx_game_over = document.querySelector("#sfx_game_over");
const moon_reached = document.getElementById("moon_reached");
const shop_total = document.getElementById("shop_total");
const progress_moon = document.querySelector("#progress_moon");
const prestige = document.getElementById("prestige");
const select_prestige = document.getElementById("select_prestige");
const music_background = document.querySelector("#music_background");
const suggest_prestige = document.getElementById("suggest_prestige");
const sfx_task_cancelled = document.querySelector("#sfx_task_cancelled");
const sfx_task_start = document.querySelector("#sfx_task_start");
const sfx_moon_pause = document.querySelector("#sfx_moon_pause");
const sfx_click = document.querySelector("#sfx_click");
const sfx_quest_complete = document.querySelector("#sfx_quest_complete");
const detail_title = document.getElementById("detail_title");
const detail = document.getElementById("detail");
const lab_moon_count = document.getElementById("lab_moon_count");
const lab_food_count_red = document.getElementById("lab_food_count_red");
const lab_food_count = document.getElementById("lab_food_count");
const lab_money_count = document.getElementById("lab_money_count");
const lab_moon_speed = document.getElementById("lab_moon_speed");
let food;
let moon;
let money;
let isGameOver;
let timeMultiplier;
let costReduction = 0;
let hasPrestige = false;
let moonSpeed;
let isMoonPaused;
let foodNeeded;
let gameHasStarted = false;
let inventory;
let data = new Data();
let domUtils = new DomUtils();
let listTasks;
let listShopEntry;
let listProjects;
let listUnlocks;
let listQuests;
let listPrestiges = [];
let listAutomations;
let enabledAutomations = {};
let readyToUnlock = {};
let resourcesSold;
let resourcesProduiced;
function initVariables() {
  setPaused(false);
  food = 0;
  moon = 1;
  money = 0;
  isGameOver = false;
  timeMultiplier = 1;
  moonSpeed = 0.02;
  isMoonPaused = false;
  foodNeeded = 0;
  inventory = new Inventory(
    document.getElementById("lab_wood_count"),
    document.getElementById("lab_stone_count"),
    document.getElementById("lab_stick_count"),
    document.getElementById("lab_house_count"),
    document.getElementById("lab_villager_count"),
    document.getElementById("lab_berry_count"),
    document.getElementById("lab_offspring_count"),
    inventoryChanged
  );
  listTasks = [];
  listShopEntry = [];
  listProjects = [];
  listUnlocks = [];
  listQuests = [];
  listAutomations = [];
  if (!hasPrestige)
    listPrestiges = [];
  resourcesSold = {
    "woods": 0,
    "sticks": 0,
    "berries": 0,
    "stones": 0
  };
  resourcesProduiced = {
    "woods": 0,
    "sticks": 0,
    "berries": 0,
    "stones": 0
  };
  enabledAutomations = {
    "auto_gather_food": false,
    "auto_build_shed": false,
    "auto_gather_wood": false,
    "auto_gather_stone": false
  };
  enabledAutomations["auto_gather_stone"];
  readyToUnlock = {
    "house": false,
    "procreation": false,
    "project": false,
    "shop": false
  };
  readyToUnlock["house"];
}
function newGame() {
  initVariables();
  sfx_new_game == null ? void 0 : sfx_new_game.play();
  domUtils.clean();
  for (const task2 of listTasks) {
    task2.resetIcon();
  }
  gameHasStarted = true;
  setGameOverVisible(false);
  setMainVisible(true);
  setWelcomeVisible(false);
  addTask(STARTING_TASK);
  listShopEntry = data.getAllShopEntryInstances();
  listUnlocks = data.getAllUnlockInstances();
  listQuests = data.getAllQuestInstances();
  listAutomations = data.getAllAutomationInstances();
  for (const quest2 of listQuests) {
    domUtils.addQuest(quest2);
  }
  for (const unlock of listUnlocks) {
    unlock.condition = eval(`() => {
            ${unlock.strCondition}
        }`);
    unlock.action = eval(`() => {
            ${unlock.strAction}
        }`);
  }
  for (const project of listProjects) {
    project.action = eval(`() => {
            ${project.strAction}
        }`);
  }
  for (const quest of listQuests) {
    quest.condition = eval(`() => {
            ${quest.strCondition}
        }`);
  }
  for (const task of listTasks) {
    task.result.custom = eval(`() => {
            ${task.result.strCustom}
        }`);
  }
  for (const auto of listAutomations) {
    auto.stopCondition = eval(`() => {
            ${auto.strStopCondition}
        }`);
    auto.stopCondition = eval(`() => {
            ${auto.strStopCondition}
        }`);
  }
  for (const entry of listShopEntry) {
    if (entry.eltAmount)
      entry.eltAmount.addEventListener("input", inventoryChanged);
    entry.valueChanged = updateMarketTotal;
  }
  inventoryChanged();
  disabledAllButton(false);
  if (progress_moon)
    progress_moon.value = 0;
  if (hasPrestige) {
    for (const id2 of listPrestiges) {
      const project2 = data.getProjectInstanceByID(id2);
      project2.action();
    }
  }
}
function gameInit() {
  initVariables();
  setGameOverVisible(false);
  setMainVisible(false);
  setWelcomeVisible(true);
  setPrestigeVisible(false);
  if (btn_keep_playing)
    btn_keep_playing.onclick = onBtnKeepPlayingPressed;
  if (btn_prestige)
    btn_prestige.onclick = onBtnPrestigePressed;
  if (btn_new_game)
    btn_new_game.onclick = newGame;
  if (btn_start_game)
    btn_start_game.onclick = newGame;
  if (btn_sell) {
    btn_sell.onclick = onBtnSellPressed;
    btn_sell.addEventListener("keydown", (e) => {
      console.log("down ", e.key);
      if (e.key == "Enter")
        onBtnSellPressed();
    });
  }
  if (btn_pause_moon)
    btn_pause_moon.onclick = onBtnPauseMoonPressed;
  if (btn_speed_moon)
    btn_speed_moon.onclick = onBtnSpeedPressed;
}
function gameUpdate() {
  if (isGameOver)
    return;
  if (gameHasStarted && music_background && music_background.readyState === 4 && music_background.paused)
    music_background == null ? void 0 : music_background.play();
  showGameStatus();
  if (!isMoonPaused) {
    for (const task2 of listTasks) {
      if (task2.isRunning && task2.progress) {
        task2.progress.value += task2.speed * timeMultiplier;
        if (task2.onCompleted && task2.progress.value >= task2.progress.max)
          task2.onCompleted();
      }
    }
  }
  checkTaskAvailability();
  checkProjectAvailability();
  checkUnlocks();
  checkQuests();
  checkAutomations();
  if (inventory.villagers <= 0 && !isGameOver) {
    isGameOver = true;
    sfx_game_over == null ? void 0 : sfx_game_over.play();
    setGameOverVisible(isGameOver);
    setMainVisible(true);
    setWelcomeVisible(false);
    if (moon_reached)
      moon_reached.textContent = (moon - 1).toString();
    disabledAllButton();
  }
}
function gameUpdatePost() {
}
function gameRender() {
  drawRect(vec2(), vec2(1920, 1080), rgb(1, 1, 1, 1));
}
function gameRenderPost() {
}
function onTaskCompleted() {
  const task2 = this;
  if (task2.result.modifyInventoryCap) {
    for (let elt in task2.result) {
      if (elt in inventory) {
        const max2 = "max_" + elt;
        const p = elt;
        inventory[max2] += task2.result[p];
      }
    }
  } else {
    for (let elt in task2.result) {
      if (elt in inventory) {
        const iv = elt;
        const p = elt;
        inventory[iv] += task2.result[p];
        if (elt in resourcesProduiced) {
          resourcesProduiced[elt] += task2.result[elt];
        }
      }
    }
  }
  task2.result.custom();
  inventory.working_villagers -= task2.need.villagers;
  task2.stop();
  let isAutomationWaiting = false;
  let autoTask = null;
  for (const auto2 of listAutomations) {
    if (auto2.isWaiting) {
      autoTask = auto2;
      isAutomationWaiting = true;
      break;
    }
  }
  const isVillagerAvailable = inventory.villagers > inventory.working_villagers + task2.need.villagers;
  if (task2.autoRestart && !task2.isCancelled) {
    if (!isVillagerAvailable && isAutomationWaiting) {
      if (autoTask)
        autoTask.stoppedTaskID = task2.id;
    } else {
      startTask(task2);
    }
  } else
    task2.resetIcon();
  if (task2.autoRemove) {
    domUtils.remove(task2.id);
    listTasks = listTasks.filter((t) => t.id != task2.id);
  }
}
function cancelTask(task2) {
  task2.stop(true);
  restoreCost(task2.need);
}
function onTaskBtnPressed() {
  if (isMoonPaused || isGameOver)
    return;
  var task2 = this;
  if (task2.isRunning) {
    sfx_task_cancelled == null ? void 0 : sfx_task_cancelled.play();
    cancelTask(task2);
  } else {
    sfx_task_start == null ? void 0 : sfx_task_start.play();
    startTask(task2);
  }
}
function onBtnSpeedPressed() {
  if (isGameOver)
    return;
  sfx_moon_pause == null ? void 0 : sfx_moon_pause.play();
  timeMultiplier *= 2;
  if (timeMultiplier == 2) {
    if (music_background)
      music_background.playbackRate = 1.2;
  } else if (timeMultiplier == 4) {
    if (music_background)
      music_background.playbackRate = 1.4;
  } else if (timeMultiplier == 8) {
    if (music_background)
      music_background.playbackRate = 1.6;
  } else if (timeMultiplier > 8) {
    timeMultiplier = 1;
    if (music_background)
      music_background.playbackRate = 1;
  }
  if (lab_moon_speed)
    lab_moon_speed.textContent = String(timeMultiplier);
}
function onBtnPauseMoonPressed() {
  if (isGameOver)
    return;
  sfx_moon_pause == null ? void 0 : sfx_moon_pause.play();
  const idx = getCSSRuleIndex("#btn_pause_moon::before");
  if (idx >= 0 && idx < document.styleSheets[0].cssRules.length) {
    document.styleSheets[0].deleteRule(idx);
  }
  isMoonPaused = !isMoonPaused;
  if (isMoonPaused) {
    document.styleSheets[0].insertRule(`#btn_pause_moon::before{content:"►";}`);
  }
}
function onProjectPressed(project2) {
  if (!project2.element || project2.element.ariaDisabled === "true" || project2.isRemoved || isGameOver || isMoonPaused) {
    return;
  }
  sfx_click == null ? void 0 : sfx_click.play();
  money -= project2.cost;
  project2.action();
  project2.isRemoved = true;
  domUtils.addLog(project2.log);
  domUtils.remove(project2.element.id);
  listProjects = listProjects.filter((p) => !p.isRemoved);
}
function onBtnSellPressed() {
  if (isGameOver)
    return;
  sfx_click == null ? void 0 : sfx_click.play();
  if (shop_total && shop_total.textContent !== null)
    money += parseInt(shop_total.textContent);
  for (const entry of listShopEntry) {
    if (entry.id in inventory) {
      inventory[entry.id] -= entry._amount;
      resourcesSold[entry.id] += parseInt(entry._amount);
      entry.eltAmount.value = 0;
      entry.amount = 0;
    }
  }
}
function onBtnKeepPlayingPressed() {
  setPrestigeVisible(false);
  hasPrestige = false;
}
function onBtnPrestigePressed() {
  if (!select_prestige || !suggest_prestige)
    return;
  hasPrestige = true;
  if (prestige)
    prestige.style.width = "500";
  let list_choices = document.querySelectorAll(".prestige_choice");
  for (const choice of list_choices) {
    choice.onclick = () => {
      if (prestige)
        prestige.style.width = "400";
      setPrestigeVisible(false);
      select_prestige.style.display = "none";
      suggest_prestige.style.display = "block";
      listPrestiges.push(choice.id);
      newGame();
    };
  }
  select_prestige.style.display = "block";
  suggest_prestige.style.display = "none";
}
function isInventoryFull(ignore = false) {
  if (ignore)
    return false;
  const resources = ["woods", "sticks", "stones", "berries"];
  for (const elt of resources) {
    if (elt in inventory && `max_${elt}` in inventory) {
      if (inventory[elt] >= inventory[`max_${elt}`]) {
        return true;
      }
    }
  }
  return false;
}
isInventoryFull(true);
function hasEnoughResourcesForTask(task2) {
  let available_villagers = inventory.villagers - inventory.working_villagers;
  for (let elt in task2.need) {
    if (elt != "villagers" && task2.need[elt] > 0 && task2.need[elt] > inventory[elt]) {
      return false;
    }
  }
  return available_villagers >= task2.need.villagers;
}
function whatIsLackingForTask(task2) {
  let available_villagers = inventory.villagers - inventory.working_villagers;
  let lacking = {};
  for (let elt in task2.need) {
    if (elt != "villagers" && task2.need[elt] > 0 && task2.need[elt] > inventory[elt]) {
      lacking[elt] = task2.need[elt] - inventory[elt];
    }
  }
  if (available_villagers < task2.need.villagers) {
    lacking["villagers"] = task2.need.villagers;
  }
  return lacking;
}
function hasEnoughInventorySpace(task2) {
  if (task2.result.modifyInventoryCap)
    return true;
  for (const elt in task2.result) {
    if (elt in inventory) {
      if (inventory[`max_${elt}`] < task2.result[elt] + inventory[elt])
        return false;
    }
  }
  return true;
}
function checkTaskAvailability() {
  for (let task2 of listTasks) {
    task2.whyDisabled = "";
    if (!hasEnoughInventorySpace(task2))
      task2.whyDisabled = "Inventory is full";
    else if (!hasEnoughResourcesForTask(task2)) {
      task2.whyDisabled = "Lacking: ";
      const lacks = whatIsLackingForTask(task2);
      for (const id2 in lacks) {
        if (id2 === "villagers")
          task2.whyDisabled += "free ";
        task2.whyDisabled += `${id2}(${lacks[id2]}), `;
      }
    }
    if (task2.btn) {
      if (isGameOver || isMoonPaused || !hasEnoughInventorySpace(task2)) {
        task2.btn.disabled = true;
      } else
        task2.btn.disabled = !task2.isRunning && !hasEnoughResourcesForTask(task2);
      if (task2.btn.disabled && !isMoonPaused)
        task2.resetIcon();
    }
  }
}
function checkProjectAvailability() {
  for (const project2 of listProjects) {
    if (project2.element) {
      if (project2.cost > money)
        project2.element.ariaDisabled = "true";
      else
        project2.element.ariaDisabled = "false";
    }
  }
}
function checkUnlocks() {
  for (const unlock2 of listUnlocks) {
    if (unlock2.condition() && !unlock2.isCompleted) {
      unlock2.action();
      unlock2.isCompleted = true;
      domUtils.addLog(unlock2.name);
    }
  }
}
function checkQuests() {
  for (const quest2 of listQuests) {
    if (!quest2.isCompleted && quest2.eltQuest && quest2.eltQuest.style.display == "block") {
      if (quest2.condition()) {
        quest2.isCompleted = true;
        sfx_quest_complete == null ? void 0 : sfx_quest_complete.play();
        domUtils.addLog(`Quest Completed : ${quest2.name} `);
      }
    }
  }
  let completedQuest = 0;
  let new_quest = 0;
  for (const quest2 of listQuests) {
    if (!quest2.isCompleted && quest2.eltQuest) {
      quest2.eltQuest.style.display = "block";
      quest2.isCompleted = false;
      new_quest++;
      if (completedQuest < 4)
        break;
      else if (new_quest >= 2)
        break;
    } else {
      completedQuest++;
    }
  }
}
function checkAutomations() {
  for (let a of listAutomations) {
    let auto2 = a;
    if (auto2.isRunning) {
      if (auto2.stopCondition() || auto2.runningTask != null && !auto2.runningTask.isRunning) {
        auto2.isRunning = false;
        if (auto2.runningTask)
          auto2.runningTask.autoRestart = auto2.storedAutoRestart;
        auto2.runningTask = null;
        if (auto2.stoppedTaskID != "") {
          startTaskID(auto2.stoppedTaskID);
        }
      }
    } else {
      if (auto2.startCondition()) {
        if (inventory.villagers > inventory.working_villagers) {
          if (auto2.runningTask)
            auto2.runningTask = startTaskID(auto2.taskID);
          if (auto2.runningTask != null) {
            auto2.storedAutoRestart = auto2.runningTask.autoRestart;
            auto2.runningTask.autoRestart = false;
            auto2.isRunning = true;
            auto2.isWaiting = false;
          }
        } else {
          auto2.isWaiting = true;
        }
      }
    }
  }
}
function suggestPrestige(ignore = false) {
  if (ignore) return;
  isMoonPaused = true;
  setPrestigeVisible(true);
}
suggestPrestige(true);
function addTask(IDs) {
  for (const id of IDs) {
    const task = data.getTaskInstanceByID(id);
    if (task != null) {
      task.result.custom = eval(`() => {
                ${task.result.strCustom}
            }`);
      listTasks.push(task);
      domUtils.addTask(task);
      if (task.btn)
        task.btn.onclick = onTaskBtnPressed.bind(task);
      task.onCompleted = onTaskCompleted.bind(task);
      if (task.labTitle && detail && detail_title)
        task.labTitle.onmouseenter = function() {
          detail_title.textContent = task.name;
          if (task.whyDisabled.trim().length > 0)
            detail.innerHTML = task.details + `<br/><b style="color:red">${task.whyDisabled}</b><br/>Requires:<br/>` + task.describedNeed;
          else
            detail.innerHTML = task.details + "<br/><br/>Requires:<br/>" + task.describedNeed;
        };
      if (task.labTitle && detail_title && detail)
        task.labTitle.onmouseleave = function() {
          detail_title.textContent = "";
          detail.innerHTML = "";
        };
    }
  }
}
function addProject(IDs = []) {
  for (const id of IDs) {
    const project = data.getProjectInstanceByID(id);
    if (project != null) {
      project.action = eval(`() => {
                ${project.strAction}
            }`);
      project.cost -= project.cost * costReduction;
      listProjects.push(project);
      domUtils.addProject(project);
      if (project.element)
        project.element.onclick = () => {
          onProjectPressed(project);
        };
    }
  }
}
addProject();
function applyCost(need) {
  inventory.working_villagers += need.villagers;
  for (let elt in need) {
    if (elt != "villagers") {
      inventory[elt] -= need[elt];
    }
  }
}
function startTask(task2) {
  if (hasEnoughResourcesForTask(task2) && hasEnoughInventorySpace(task2)) {
    applyCost(task2.need);
    task2.start();
    return true;
  } else {
    task2.resetIcon();
  }
  return false;
}
function startTaskID(id2) {
  for (const task2 of listTasks) {
    if (task2.id === id2) {
      if (startTask(task2))
        task2.setRunningIcon();
      return task2;
    }
  }
  return null;
}
function restoreCost(need) {
  for (let elt in need) {
    if (elt != "villagers") {
      inventory[elt] += need[elt];
    }
  }
  inventory.working_villagers -= need.villagers;
}
function showGameStatus() {
  if (!lab_moon_count || !lab_food_count_red || !lab_food_count || !progress_moon || !lab_money_count)
    return;
  food = 0;
  foodNeeded = inventory.villagers * FOOD_PER_VILLAGER + inventory.offsprings * FOOD_PER_OFFSPRING;
  lab_moon_count.textContent = moon.toString();
  for (let elt of FOOD_LIST) {
    if (elt in inventory) {
      food += inventory[elt];
    }
  }
  if (food < foodNeeded) {
    lab_food_count_red.style.display = "block";
    lab_food_count_red.textContent = `Food: ${food}/${foodNeeded}`;
    lab_food_count.style.display = "none";
  } else {
    lab_food_count_red.style.display = "none";
    lab_food_count.style.display = "block";
    lab_food_count.textContent = `Food: ${food}/${foodNeeded}`;
  }
  if (!isMoonPaused) {
    progress_moon.value += moonSpeed * timeMultiplier;
    if (progress_moon.value >= 100) {
      progress_moon.value = 0;
      feedVillagers();
      moon += 1;
    }
  }
  lab_money_count.textContent = money.toString();
}
function feedVillagers() {
  let villagersFed = food / FOOD_PER_VILLAGER - food % FOOD_PER_VILLAGER;
  let starvingVilagers = Math.floor(inventory.villagers - villagersFed);
  if (starvingVilagers < 0)
    starvingVilagers = 0;
  while (foodNeeded > 0 && food > 0) {
    for (let elt of FOOD_LIST) {
      if (elt in inventory) {
        inventory[elt] -= 1;
        food -= 1;
        foodNeeded -= 1;
      }
    }
  }
  inventory.villagers -= starvingVilagers;
}
function updateMarketTotal() {
  let total = 0;
  for (const e of listShopEntry) {
    let entry = e;
    total += entry.total;
  }
  if (shop_total)
    shop_total.textContent = total.toString();
  if (btn_sell)
    btn_sell.disabled = total <= 0;
}
function inventoryChanged() {
  for (const e of listShopEntry) {
    const entry = e;
    if (entry.id in inventory) {
      entry.eltAmount.max = inventory[entry.id];
      if (entry.eltAmount.value > inventory[entry.id]) {
        entry.eltAmount.value = inventory[entry.id];
        entry.amount = inventory[entry.id];
      }
    }
  }
}
function disabledAllButton(disable = true) {
  for (const elt of document.getElementsByTagName("button")) {
    if (elt.id != "btn_new_game")
      elt.disabled = disable;
  }
}
function totalResourcesSold() {
  let total = 0;
  for (const r in resourcesSold) {
    total += resourcesSold[r];
  }
  return total;
}
totalResourcesSold();
function totalResourcesProduiced() {
  let total = 0;
  for (const r in resourcesProduiced) {
    total += resourcesProduiced[r];
  }
  return total;
}
totalResourcesProduiced();
setHeadlessMode(true);
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);
