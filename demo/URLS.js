typeof window !== "undefined" &&
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["HlsDemo"] = factory();
	else
		root["HlsDemo"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./demo/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./demo/main.js":
/*!**********************************!*\
  !*** ./demo/main.js + 1 modules ***!
  \**********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./demo/demo-utils.js
function sortObject(obj) {
  if (typeof obj !== 'object') {
    return obj;
  }

  var temp = {};
  var keys = [];

  for (var key in obj) {
    keys.push(key);
  }

  keys.sort();

  for (var index in keys) {
    temp[keys[index]] = sortObject(obj[keys[index]]);
  }

  return temp;
}
function copyTextToClipboard(text) {
  var textArea = document.createElement('textarea');
  textArea.value = text;
  document.body.appendChild(textArea);
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Copying text command was ' + msg);
  } catch (err) {
    console.log('Oops, unable to copy');
  }

  document.body.removeChild(textArea);
}
// CONCATENATED MODULE: ./demo/main.js

var STORAGE_KEYS = {
  Editor_Persistence: 'hlsjs:config-editor-persist',
  Hls_Config: 'hlsjs:config'
};

var testStreams = __webpack_require__(/*! ../tests/test-streams */ "./tests/test-streams.js");

var defaultTestStreamUrl = testStreams['bbb'].url;
var sourceURL = decodeURIComponent(getURLParam('src', defaultTestStreamUrl));
var demoConfig = getURLParam('demoConfig', null);

if (demoConfig) {
  demoConfig = JSON.parse(atob(demoConfig));
} else {
  demoConfig = {};
}

var hlsjsDefaults = {
  debug: true,
  enableWorker: true
};
var enableStreaming = getDemoConfigPropOrDefault('enableStreaming', true);
var autoRecoverError = getDemoConfigPropOrDefault('autoRecoverError', true);
var levelCapping = getDemoConfigPropOrDefault('levelCapping', -1);
var limitMetrics = getDemoConfigPropOrDefault('limitMetrics', -1);
var dumpfMP4 = getDemoConfigPropOrDefault('dumpfMP4', false);
var bufferingIdx = -1;
var selectedTestStream = null;
var video = $('#video')[0];
var startTime = Date.now();
var lastSeekingIdx;
var lastStartPosition;
var lastDuration;
var lastAudioTrackSwitchingIdx;
var hls;
var url;
var events;
var stats;
var tracks;
var fmp4Data;
var configPersistenceEnabled = false;
var configEditor = null;
$(document).ready(function () {
  setupConfigEditor();
  Object.keys(testStreams).forEach(function (key) {
    var stream = testStreams[key];
    var option = new Option(stream.description, key);
    $('#streamSelect').append(option);
  });
  $('#streamSelect').change(function () {
    selectedTestStream = testStreams[$('#streamSelect').val()];
    var streamUrl = selectedTestStream.url;
    $('#streamURL').val(streamUrl);
    loadSelectedStream();
  });
  $('#streamURL').change(function () {
    selectedTestStream = null;
    loadSelectedStream();
  });
  $('#videoSize').change(function () {
    $('#video').width($('#videoSize').val());
    $('#bufferedCanvas').width($('#videoSize').val());
  });
  $('#enableStreaming').click(function () {
    enableStreaming = this.checked;
    loadSelectedStream();
  });
  $('#autoRecoverError').click(function () {
    autoRecoverError = this.checked;
    onDemoConfigChanged();
  });
  $('#dumpfMP4').click(function () {
    dumpfMP4 = this.checked;
    onDemoConfigChanged();
  });
  $('#limitMetrics').change(function () {
    limitMetrics = this.value;
    onDemoConfigChanged();
  });
  $('#levelCapping').change(function () {
    levelCapping = this.value;
    onDemoConfigChanged();
  });
  $('#limitMetrics').val(limitMetrics);
  $('#enableStreaming').prop('checked', enableStreaming);
  $('#autoRecoverError').prop('checked', autoRecoverError);
  $('#dumpfMP4').prop('checked', dumpfMP4);
  $('#levelCapping').val(levelCapping);
  $('h2').append('&nbsp;<a target=_blank href=https://github.com/video-dev/hls.js/releases/tag/v' + Hls.version + '>v' + Hls.version + '</a>');
  $('#currentVersion').html('Hls version:' + Hls.version);
  $('#streamURL').val(sourceURL);
  video.volume = 0.05;
  hideAllTabs();
  $('#metricsButtonWindow').toggle(windowSliding);
  $('#metricsButtonFixed').toggle(!windowSliding);
  loadSelectedStream();
});

function setupGlobals() {
  window.events = events = {
    url: url,
    t0: performance.now(),
    load: [],
    buffer: [],
    video: [],
    level: [],
    bitrate: []
  }; // actual values, only on window

  window.recoverDecodingErrorDate = null;
  window.recoverSwapAudioCodecDate = null;
  window.fmp4Data = fmp4Data = {
    'audio': [],
    'video': []
  };
  window.onClickBufferedRange = onClickBufferedRange;
  window.updateLevelInfo = updateLevelInfo;
  window.onDemoConfigChanged = onDemoConfigChanged;
  window.createfMP4 = createfMP4;
  window.goToMetricsPermaLink = goToMetricsPermaLink;
  window.toggleTab = toggleTab;
  window.applyConfigEditorValue = applyConfigEditorValue;
}

function trimArray(target, limit) {
  if (limit < 0) {
    return;
  }

  while (target.length > limit) {
    target.shift();
  }
}

function trimEventHistory() {
  var x = limitMetrics;

  if (x < 0) {
    return;
  }

  trimArray(events.load, x);
  trimArray(events.buffer, x);
  trimArray(events.video, x);
  trimArray(events.level, x);
  trimArray(events.bitrate, x);
}

function loadSelectedStream() {
  if (!Hls.isSupported()) {
    handleUnsupported();
    return;
  }

  url = $('#streamURL').val();
  setupGlobals();
  hideCanvas();

  if (hls) {
    hls.destroy();

    if (hls.bufferTimer) {
      clearInterval(hls.bufferTimer);
      hls.bufferTimer = undefined;
    }

    hls = null;
  }

  if (!enableStreaming) {
    logStatus('Streaming disabled');
    return;
  }

  logStatus('Loading ' + url); // Extending both a demo-specific config and the user config which can override all

  var hlsConfig = $.extend({}, hlsjsDefaults, getEditorValue({
    parse: true
  }));

  if (selectedTestStream && selectedTestStream.config) {
    console.info('[loadSelectedStream] extending hls config with stream-specific config: ', selectedTestStream.config);
    $.extend(hlsConfig, selectedTestStream.config);
    updateConfigEditorValue(hlsConfig);
  }

  onDemoConfigChanged();
  console.log('Using Hls.js config:', hlsConfig);
  window.hls = hls = new Hls(hlsConfig);
  logStatus('Loading manifest and attaching video element...');
  hls.loadSource(url);
  hls.autoLevelCapping = levelCapping;
  hls.attachMedia(video);
  hls.on(Hls.Events.MEDIA_ATTACHED, function () {
    logStatus('Media element attached');
    bufferingIdx = -1;
    events.video.push({
      time: performance.now() - events.t0,
      type: 'Media attached'
    });
    trimEventHistory();
  });
  hls.on(Hls.Events.MEDIA_DETACHED, function () {
    logStatus('Media element detached');
    bufferingIdx = -1;
    tracks = [];
    events.video.push({
      time: performance.now() - events.t0,
      type: 'Media detached'
    });
    trimEventHistory();
  });
  hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, function (event, data) {
    showCanvas();
    var event = {
      time: performance.now() - events.t0,
      type: data.id + ' init segment'
    };
    events.video.push(event);
    trimEventHistory();
  });
  hls.on(Hls.Events.FRAG_PARSING_METADATA, function (event, data) {//console.log("Id3 samples ", data.samples);
  });
  hls.on(Hls.Events.LEVEL_SWITCHING, function (event, data) {
    events.level.push({
      time: performance.now() - events.t0,
      id: data.level,
      bitrate: Math.round(hls.levels[data.level].bitrate / 1000)
    });
    trimEventHistory();
    updateLevelInfo();
  });
  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    var event = {
      type: 'manifest',
      name: '',
      start: 0,
      end: data.levels.length,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      duration: data.stats.tload - data.stats.tfirst
    };
    events.load.push(event);
    trimEventHistory();
    refreshCanvas();
  });
  hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
    logStatus('No of quality levels found: ' + hls.levels.length);
    logStatus('Manifest successfully loaded');
    stats = {
      levelNb: data.levels.length,
      levelParsed: 0
    };
    trimEventHistory();
    updateLevelInfo();
  });
  hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, function (event, data) {
    logStatus('No of audio tracks found: ' + data.audioTracks.length);
    updateAudioTrackInfo();
  });
  hls.on(Hls.Events.AUDIO_TRACK_SWITCHING, function (event, data) {
    logStatus('Audio track switching...');
    updateAudioTrackInfo();
    var event = {
      time: performance.now() - events.t0,
      type: 'audio switching',
      name: '@' + data.id
    };
    events.video.push(event);
    trimEventHistory();
    lastAudioTrackSwitchingIdx = events.video.length - 1;
  });
  hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, function (event, data) {
    logStatus('Audio track switched');
    updateAudioTrackInfo();
    var event = {
      time: performance.now() - events.t0,
      type: 'audio switched',
      name: '@' + data.id
    };

    if (lastAudioTrackSwitchingIdx !== undefined) {
      events.video[lastAudioTrackSwitchingIdx].duration = event.time - events.video[lastAudioTrackSwitchingIdx].time;
      lastAudioTrackSwitchingIdx = undefined;
    }

    events.video.push(event);
    trimEventHistory();
  });
  hls.on(Hls.Events.LEVEL_LOADED, function (event, data) {
    events.isLive = data.details.live;
    var event = {
      type: 'level',
      id: data.level,
      start: data.details.startSN,
      end: data.details.endSN,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      parsing: data.stats.tparsed - data.stats.tload,
      duration: data.stats.tload - data.stats.tfirst
    };
    var parsingDuration = data.stats.tparsed - data.stats.tload;

    if (stats.levelParsed) {
      this.sumLevelParsingMs += parsingDuration;
    } else {
      this.sumLevelParsingMs = parsingDuration;
    }

    stats.levelParsed++;
    stats.levelParsingUs = Math.round(1000 * this.sumLevelParsingMs / stats.levelParsed); //console.log('parsing level duration :' + stats.levelParsingUs + 'us,count:' + stats.levelParsed);

    events.load.push(event);
    trimEventHistory();
    refreshCanvas();
  });
  hls.on(Hls.Events.AUDIO_TRACK_LOADED, function (event, data) {
    events.isLive = data.details.live;
    var event = {
      type: 'audio track',
      id: data.id,
      start: data.details.startSN,
      end: data.details.endSN,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      parsing: data.stats.tparsed - data.stats.tload,
      duration: data.stats.tload - data.stats.tfirst
    };
    events.load.push(event);
    trimEventHistory();
    refreshCanvas();
  });
  hls.on(Hls.Events.FRAG_BUFFERED, function (event, data) {
    var event = {
      type: data.frag.type + ' fragment',
      id: data.frag.level,
      id2: data.frag.sn,
      time: data.stats.trequest - events.t0,
      latency: data.stats.tfirst - data.stats.trequest,
      load: data.stats.tload - data.stats.tfirst,
      parsing: data.stats.tparsed - data.stats.tload,
      buffer: data.stats.tbuffered - data.stats.tparsed,
      duration: data.stats.tbuffered - data.stats.tfirst,
      bw: Math.round(8 * data.stats.total / (data.stats.tbuffered - data.stats.trequest)),
      size: data.stats.total
    };
    events.load.push(event);
    events.bitrate.push({
      time: performance.now() - events.t0,
      bitrate: event.bw,
      duration: data.frag.duration,
      level: event.id
    });

    if (hls.bufferTimer === undefined) {
      events.buffer.push({
        time: 0,
        buffer: 0,
        pos: 0
      });
      hls.bufferTimer = window.setInterval(checkBuffer, 100);
    }

    trimEventHistory();
    refreshCanvas();
    updateLevelInfo();
    var latency = data.stats.tfirst - data.stats.trequest,
        parsing = data.stats.tparsed - data.stats.tload,
        process = data.stats.tbuffered - data.stats.trequest,
        bitrate = Math.round(8 * data.stats.length / (data.stats.tbuffered - data.stats.tfirst));

    if (stats.fragBuffered) {
      stats.fragMinLatency = Math.min(stats.fragMinLatency, latency);
      stats.fragMaxLatency = Math.max(stats.fragMaxLatency, latency);
      stats.fragMinProcess = Math.min(stats.fragMinProcess, process);
      stats.fragMaxProcess = Math.max(stats.fragMaxProcess, process);
      stats.fragMinKbps = Math.min(stats.fragMinKbps, bitrate);
      stats.fragMaxKbps = Math.max(stats.fragMaxKbps, bitrate);
      stats.autoLevelCappingMin = Math.min(stats.autoLevelCappingMin, hls.autoLevelCapping);
      stats.autoLevelCappingMax = Math.max(stats.autoLevelCappingMax, hls.autoLevelCapping);
      stats.fragBuffered++;
    } else {
      stats.fragMinLatency = stats.fragMaxLatency = latency;
      stats.fragMinProcess = stats.fragMaxProcess = process;
      stats.fragMinKbps = stats.fragMaxKbps = bitrate;
      stats.fragBuffered = 1;
      stats.fragBufferedBytes = 0;
      stats.autoLevelCappingMin = stats.autoLevelCappingMax = hls.autoLevelCapping;
      this.sumLatency = 0;
      this.sumKbps = 0;
      this.sumProcess = 0;
      this.sumParsing = 0;
    }

    stats.fraglastLatency = latency;
    this.sumLatency += latency;
    stats.fragAvgLatency = Math.round(this.sumLatency / stats.fragBuffered);
    stats.fragLastProcess = process;
    this.sumProcess += process;
    this.sumParsing += parsing;
    stats.fragAvgProcess = Math.round(this.sumProcess / stats.fragBuffered);
    stats.fragLastKbps = bitrate;
    this.sumKbps += bitrate;
    stats.fragAvgKbps = Math.round(this.sumKbps / stats.fragBuffered);
    stats.fragBufferedBytes += data.stats.total;
    stats.fragparsingKbps = Math.round(8 * stats.fragBufferedBytes / this.sumParsing);
    stats.fragparsingMs = Math.round(this.sumParsing);
    stats.autoLevelCappingLast = hls.autoLevelCapping;
  });
  hls.on(Hls.Events.LEVEL_SWITCHED, function (event, data) {
    var event = {
      time: performance.now() - events.t0,
      type: 'level switched',
      name: data.level
    };
    events.video.push(event);
    trimEventHistory();
    refreshCanvas();
    updateLevelInfo();
  });
  hls.on(Hls.Events.FRAG_CHANGED, function (event, data) {
    var event = {
      time: performance.now() - events.t0,
      type: 'frag changed',
      name: data.frag.sn + ' @ ' + data.frag.level
    };
    events.video.push(event);
    trimEventHistory();
    refreshCanvas();
    updateLevelInfo();
    stats.tagList = data.frag.tagList;
    var level = data.frag.level,
        autoLevel = data.frag.autoLevel;

    if (stats.levelStart === undefined) {
      stats.levelStart = level;
    }

    if (autoLevel) {
      if (stats.fragChangedAuto) {
        stats.autoLevelMin = Math.min(stats.autoLevelMin, level);
        stats.autoLevelMax = Math.max(stats.autoLevelMax, level);
        stats.fragChangedAuto++;

        if (this.levelLastAuto && level !== stats.autoLevelLast) {
          stats.autoLevelSwitch++;
        }
      } else {
        stats.autoLevelMin = stats.autoLevelMax = level;
        stats.autoLevelSwitch = 0;
        stats.fragChangedAuto = 1;
        this.sumAutoLevel = 0;
      }

      this.sumAutoLevel += level;
      stats.autoLevelAvg = Math.round(1000 * this.sumAutoLevel / stats.fragChangedAuto) / 1000;
      stats.autoLevelLast = level;
    } else {
      if (stats.fragChangedManual) {
        stats.manualLevelMin = Math.min(stats.manualLevelMin, level);
        stats.manualLevelMax = Math.max(stats.manualLevelMax, level);
        stats.fragChangedManual++;

        if (!this.levelLastAuto && level !== stats.manualLevelLast) {
          stats.manualLevelSwitch++;
        }
      } else {
        stats.manualLevelMin = stats.manualLevelMax = level;
        stats.manualLevelSwitch = 0;
        stats.fragChangedManual = 1;
      }

      stats.manualLevelLast = level;
    }

    this.levelLastAuto = autoLevel;
  });
  hls.on(Hls.Events.FRAG_LOAD_EMERGENCY_ABORTED, function (event, data) {
    if (stats) {
      if (stats.fragLoadEmergencyAborted === undefined) {
        stats.fragLoadEmergencyAborted = 1;
      } else {
        stats.fragLoadEmergencyAborted++;
      }
    }
  });
  hls.on(Hls.Events.FRAG_DECRYPTED, function (event, data) {
    if (!stats.fragDecrypted) {
      stats.fragDecrypted = 0;
      this.totalDecryptTime = 0;
      stats.fragAvgDecryptTime = 0;
    }

    stats.fragDecrypted++;
    this.totalDecryptTime += data.stats.tdecrypt - data.stats.tstart;
    stats.fragAvgDecryptTime = this.totalDecryptTime / stats.fragDecrypted;
  });
  hls.on(Hls.Events.ERROR, function (event, data) {
    console.warn('Error event:', data);

    switch (data.details) {
      case Hls.ErrorDetails.MANIFEST_LOAD_ERROR:
        try {
          $('#errorOut').html('Cannot load <a href="' + data.context.url + '">' + url + '</a><br>HTTP response code:' + data.response.code + ' <br>' + data.response.text);

          if (data.response.code === 0) {
            $('#errorOut').append('This might be a CORS issue, consider installing <a href="https://chrome.google.com/webstore/detail/allow-control-allow-origi/nlfbmbojpeacfghkpbjhddihlkkiljbi">Allow-Control-Allow-Origin</a> Chrome Extension');
          }
        } catch (err) {
          $('#errorOut').html('Cannot load <a href="' + data.context.url + '">' + url + '</a><br>Response body: ' + data.response.text);
        }

        break;

      case Hls.ErrorDetails.MANIFEST_LOAD_TIMEOUT:
        logError('Timeout while loading manifest');
        break;

      case Hls.ErrorDetails.MANIFEST_PARSING_ERROR:
        logError('Error while parsing manifest:' + data.reason);
        break;

      case Hls.ErrorDetails.LEVEL_LOAD_ERROR:
        logError('Error while loading level playlist');
        break;

      case Hls.ErrorDetails.LEVEL_LOAD_TIMEOUT:
        logError('Timeout while loading level playlist');
        break;

      case Hls.ErrorDetails.LEVEL_SWITCH_ERROR:
        logError('Error while trying to switch to level ' + data.level);
        break;

      case Hls.ErrorDetails.FRAG_LOAD_ERROR:
        logError('Error while loading fragment ' + data.frag.url);
        break;

      case Hls.ErrorDetails.FRAG_LOAD_TIMEOUT:
        logError('Timeout while loading fragment ' + data.frag.url);
        break;

      case Hls.ErrorDetails.FRAG_LOOP_LOADING_ERROR:
        logError('Fragment-loop loading error');
        break;

      case Hls.ErrorDetails.FRAG_DECRYPT_ERROR:
        logError('Decrypting error:' + data.reason);
        break;

      case Hls.ErrorDetails.FRAG_PARSING_ERROR:
        logError('Parsing error:' + data.reason);
        break;

      case Hls.ErrorDetails.KEY_LOAD_ERROR:
        logError('Error while loading key ' + data.frag.decryptdata.uri);
        break;

      case Hls.ErrorDetails.KEY_LOAD_TIMEOUT:
        logError('Timeout while loading key ' + data.frag.decryptdata.uri);
        break;

      case Hls.ErrorDetails.BUFFER_APPEND_ERROR:
        logError('Buffer append error');
        break;

      case Hls.ErrorDetails.BUFFER_ADD_CODEC_ERROR:
        logError('Buffer add codec error for ' + data.mimeType + ':' + data.err.message);
        break;

      case Hls.ErrorDetails.BUFFER_APPENDING_ERROR:
        logError('Buffer appending error');
        break;

      case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
        logError('Buffer stalled error');
        break;

      default:
        break;
    }

    if (data.fatal) {
      console.error('Fatal error :' + data.details);

      switch (data.type) {
        case Hls.ErrorTypes.MEDIA_ERROR:
          handleMediaError();
          break;

        case Hls.ErrorTypes.NETWORK_ERROR:
          logError('A network error occured');
          break;

        default:
          logError('An unrecoverable error occured');
          hls.destroy();
          break;
      }
    }

    if (!stats) {
      stats = {};
    } // track all errors independently


    if (stats[data.details] === undefined) {
      stats[data.details] = 1;
    } else {
      stats[data.details] += 1;
    } // track fatal error


    if (data.fatal) {
      if (stats.fatalError === undefined) {
        stats.fatalError = 1;
      } else {
        stats.fatalError += 1;
      }
    }

    $('#statisticsOut').text(JSON.stringify(sortObject(stats), null, '\t'));
  });
  hls.on(Hls.Events.BUFFER_CREATED, function (event, data) {
    tracks = data.tracks;
  });
  hls.on(Hls.Events.BUFFER_APPENDING, function (event, data) {
    if (dumpfMP4) {
      fmp4Data[data.type].push(data.data);
    }
  });
  hls.on(Hls.Events.FPS_DROP, function (event, data) {
    var evt = {
      time: performance.now() - events.t0,
      type: 'frame drop',
      name: data.currentDropped + '/' + data.currentDecoded
    };
    events.video.push(evt);
    trimEventHistory();

    if (stats) {
      if (stats.fpsDropEvent === undefined) {
        stats.fpsDropEvent = 1;
      } else {
        stats.fpsDropEvent++;
      }

      stats.fpsTotalDroppedFrames = data.totalDroppedFrames;
    }
  });
  video.addEventListener('resize', handleVideoEvent);
  video.addEventListener('seeking', handleVideoEvent);
  video.addEventListener('seeked', handleVideoEvent);
  video.addEventListener('pause', handleVideoEvent);
  video.addEventListener('play', handleVideoEvent);
  video.addEventListener('canplay', handleVideoEvent);
  video.addEventListener('canplaythrough', handleVideoEvent);
  video.addEventListener('ended', handleVideoEvent);
  video.addEventListener('playing', handleVideoEvent);
  video.addEventListener('error', handleVideoEvent);
  video.addEventListener('loadedmetadata', handleVideoEvent);
  video.addEventListener('loadeddata', handleVideoEvent);
  video.addEventListener('durationchange', handleVideoEvent);
}

function handleUnsupported() {
  if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
    logStatus('You are using Firefox, it looks like MediaSource is not enabled,<br>please ensure the following keys are set appropriately in <b>about:config</b><br>media.mediasource.enabled=true<br>media.mediasource.mp4.enabled=true<br><b>media.mediasource.whitelist=false</b>');
  } else {
    logStatus('Your Browser does not support MediaSourceExtension / MP4 mediasource');
  }
}

function handleVideoEvent(evt) {
  var data = '';

  switch (evt.type) {
    case 'durationchange':
      if (evt.target.duration - lastDuration <= 0.5) {
        // some browsers report several duration change events with almost the same value ... avoid spamming video events
        return;
      }

      lastDuration = evt.target.duration;
      data = Math.round(evt.target.duration * 1000);
      break;

    case 'resize':
      data = evt.target.videoWidth + '/' + evt.target.videoHeight;
      break;

    case 'loadedmetadata':
    case 'loadeddata':
    case 'canplay':
    case 'canplaythrough':
    case 'ended':
    case 'seeking':
    case 'seeked':
    case 'play':
    case 'playing':
      lastStartPosition = evt.target.currentTime;

    case 'pause':
    case 'waiting':
    case 'stalled':
    case 'error':
      data = Math.round(evt.target.currentTime * 1000);

      if (evt.type === 'error') {
        var errorTxt,
            mediaError = evt.currentTarget.error;

        switch (mediaError.code) {
          case mediaError.MEDIA_ERR_ABORTED:
            errorTxt = 'You aborted the video playback';
            break;

          case mediaError.MEDIA_ERR_DECODE:
            errorTxt = 'The video playback was aborted due to a corruption problem or because the video used features your browser did not support';
            handleMediaError();
            break;

          case mediaError.MEDIA_ERR_NETWORK:
            errorTxt = 'A network error caused the video download to fail part-way';
            break;

          case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorTxt = 'The video could not be loaded, either because the server or network failed or because the format is not supported';
            break;
        }

        if (mediaError.message) {
          errorTxt += ' - ' + mediaError.message;
        }

        logStatus(errorTxt);
        console.error(errorTxt);
      }

      break;

    default:
      break;
  }

  var event = {
    time: performance.now() - events.t0,
    type: evt.type,
    name: data
  };
  events.video.push(event);

  if (evt.type === 'seeking') {
    lastSeekingIdx = events.video.length - 1;
  }

  if (evt.type === 'seeked') {
    events.video[lastSeekingIdx].duration = event.time - events.video[lastSeekingIdx].time;
  }

  trimEventHistory();
}

function handleMediaError() {
  if (autoRecoverError) {
    var now = performance.now();

    if (!recoverDecodingErrorDate || now - recoverDecodingErrorDate > 3000) {
      recoverDecodingErrorDate = performance.now();
      $('#statusOut').append(', trying to recover media error.');
      hls.recoverMediaError();
    } else {
      if (!recoverSwapAudioCodecDate || now - recoverSwapAudioCodecDate > 3000) {
        recoverSwapAudioCodecDate = performance.now();
        $('#statusOut').append(', trying to swap audio codec and recover media error.');
        hls.swapAudioCodec();
        hls.recoverMediaError();
      } else {
        $('#statusOut').append(', cannot recover. Last media error recovery failed.');
      }
    }
  }
}

function timeRangesToString(r) {
  var log = '';

  for (var i = 0; i < r.length; i++) {
    log += '[' + r.start(i) + ', ' + r.end(i) + ']';
    log += ' ';
  }

  return log;
}

function checkBuffer() {
  var v = $('#video')[0];
  var canvas = $('#bufferedCanvas')[0];
  var ctx = canvas.getContext('2d');
  var r = v.buffered;
  var bufferingDuration;
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'gray';

  if (r) {
    if (!canvas.width || canvas.width !== v.clientWidth) {
      canvas.width = v.clientWidth;
    }

    var pos = v.currentTime,
        bufferLen;

    for (var i = 0, bufferLen = 0; i < r.length; i++) {
      var start = r.start(i) / v.duration * canvas.width;
      var end = r.end(i) / v.duration * canvas.width;
      ctx.fillRect(start, 3, Math.max(2, end - start), 10);

      if (pos >= r.start(i) && pos < r.end(i)) {
        // play position is inside this buffer TimeRange, retrieve end of buffer position and buffer length
        bufferLen = r.end(i) - pos;
      }
    } // check if we are in buffering / or playback ended state


    if (bufferLen <= 0.1 && v.paused === false && pos - lastStartPosition > 0.5) {
      // don't create buffering event if we are at the end of the playlist, don't report ended for live playlist
      if (lastDuration - pos <= 0.5 && events.isLive === false) {} else {
        // we are not at the end of the playlist ... real buffering
        if (bufferingIdx !== -1) {
          bufferingDuration = performance.now() - events.t0 - events.video[bufferingIdx].time;
          events.video[bufferingIdx].duration = bufferingDuration;
          events.video[bufferingIdx].name = bufferingDuration;
        } else {
          events.video.push({
            type: 'buffering',
            time: performance.now() - events.t0
          });
          trimEventHistory(); // we are in buffering state

          bufferingIdx = events.video.length - 1;
        }
      }
    }

    if (bufferLen > 0.1 && bufferingIdx != -1) {
      bufferingDuration = performance.now() - events.t0 - events.video[bufferingIdx].time;
      events.video[bufferingIdx].duration = bufferingDuration;
      events.video[bufferingIdx].name = bufferingDuration; // we are out of buffering state

      bufferingIdx = -1;
    } // update buffer/position for current Time


    var event = {
      time: performance.now() - events.t0,
      buffer: Math.round(bufferLen * 1000),
      pos: Math.round(pos * 1000)
    };
    var bufEvents = events.buffer,
        bufEventLen = bufEvents.length;

    if (bufEventLen > 1) {
      var event0 = bufEvents[bufEventLen - 2],
          event1 = bufEvents[bufEventLen - 1];
      var slopeBuf0 = (event0.buffer - event1.buffer) / (event0.time - event1.time);
      var slopeBuf1 = (event1.buffer - event.buffer) / (event1.time - event.time);
      var slopePos0 = (event0.pos - event1.pos) / (event0.time - event1.time);
      var slopePos1 = (event1.pos - event.pos) / (event1.time - event.time); // compute slopes. if less than 30% difference, remove event1

      if ((slopeBuf0 === slopeBuf1 || Math.abs(slopeBuf0 / slopeBuf1 - 1) <= 0.3) && (slopePos0 === slopePos1 || Math.abs(slopePos0 / slopePos1 - 1) <= 0.3)) {
        bufEvents.pop();
      }
    }

    events.buffer.push(event);
    trimEventHistory();
    refreshCanvas();
    var log = 'Duration: ' + v.duration + '\n' + 'Buffered: ' + timeRangesToString(v.buffered) + '\n' + 'Seekable: ' + timeRangesToString(v.seekable) + '\n' + 'Played: ' + timeRangesToString(v.played) + '\n';

    if (hls.media) {
      for (var type in tracks) {
        log += 'Buffer for ' + type + ' contains: ' + timeRangesToString(tracks[type].buffer.buffered) + '\n';
      }

      var videoPlaybackQuality = v.getVideoPlaybackQuality;

      if (videoPlaybackQuality && typeof videoPlaybackQuality === typeof Function) {
        log += 'Dropped frames: ' + v.getVideoPlaybackQuality().droppedVideoFrames + '\n';
        log += 'Corrupted frames:' + v.getVideoPlaybackQuality().corruptedVideoFrames + '\n';
      } else if (v.webkitDroppedFrameCount) {
        log += 'Dropped frames:' + v.webkitDroppedFrameCount + '\n';
      }
    }

    $('#bufferedOut').text(log);
    $('#statisticsOut').text(JSON.stringify(sortObject(stats), null, '\t'));
    ctx.fillStyle = 'blue';
    var x = v.currentTime / v.duration * canvas.width;
    ctx.fillRect(x, 0, 2, 15);
  }
}

function showCanvas() {
  showMetrics();
  $('#bufferedOut').show();
  $('#bufferedCanvas').show();
}

function hideCanvas() {
  hideMetrics();
  $('#bufferedOut').hide();
  $('#bufferedCanvas').hide();
}

function getMetrics() {
  var json = JSON.stringify(events);
  var jsonpacked = jsonpack.pack(json); // console.log('packing JSON from ' + json.length + ' to ' + jsonpacked.length + ' bytes');

  return btoa(jsonpacked);
}

function copyMetricsToClipBoard() {
  copyTextToClipboard(getMetrics());
}

function goToMetrics() {
  var url = document.URL;
  url = url.substr(0, url.lastIndexOf('/') + 1) + 'metrics.html';
  window.open(url, '_blank');
}

function goToMetricsPermaLink() {
  var url = document.URL;
  var b64 = getMetrics();
  url = url.substr(0, url.lastIndexOf('/') + 1) + 'metrics.html#data=' + b64;
  window.open(url, '_blank');
}

function minsecs(ts) {
  var m = Math.floor(Math.floor(ts % 3600) / 60);
  var s = Math.floor(ts % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function onClickBufferedRange(event) {
  var canvas = $('#bufferedCanvas')[0];
  var v = $('#video')[0];
  var target = (event.clientX - canvas.offsetLeft) / canvas.width * v.duration;
  v.currentTime = target;
}

function updateLevelInfo() {
  if (!hls.levels) {
    return;
  }

  var button_template = '<button type="button" class="btn btn-sm ';
  var button_enabled = 'btn-primary" ';
  var button_disabled = 'btn-success" ';
  var html1 = button_template;

  if (hls.autoLevelEnabled) {
    html1 += button_enabled;
  } else {
    html1 += button_disabled;
  }

  html1 += 'onclick="hls.currentLevel=-1">auto</button>';
  var html2 = button_template;

  if (hls.autoLevelEnabled) {
    html2 += button_enabled;
  } else {
    html2 += button_disabled;
  }

  html2 += 'onclick="hls.loadLevel=-1">auto</button>';
  var html3 = button_template;

  if (hls.autoLevelCapping === -1) {
    html3 += button_enabled;
  } else {
    html3 += button_disabled;
  }

  html3 += 'onclick="levelCapping=hls.autoLevelCapping=-1;updateLevelInfo();onDemoConfigChanged();">auto</button>';
  var html4 = button_template;

  if (hls.autoLevelEnabled) {
    html4 += button_enabled;
  } else {
    html4 += button_disabled;
  }

  html4 += 'onclick="hls.nextLevel=-1">auto</button>';

  for (var i = 0; i < hls.levels.length; i++) {
    html1 += button_template;

    if (hls.currentLevel === i) {
      html1 += button_enabled;
    } else {
      html1 += button_disabled;
    }

    var levelName = i;
    var label = level2label(i);

    if (label) {
      levelName += ' (' + level2label(i) + 'p)';
    }

    html1 += 'onclick="hls.currentLevel=' + i + '">' + levelName + '</button>';
    html2 += button_template;

    if (hls.loadLevel === i) {
      html2 += button_enabled;
    } else {
      html2 += button_disabled;
    }

    html2 += 'onclick="hls.loadLevel=' + i + '">' + levelName + '</button>';
    html3 += button_template;

    if (hls.autoLevelCapping === i) {
      html3 += button_enabled;
    } else {
      html3 += button_disabled;
    }

    html3 += 'onclick="levelCapping=hls.autoLevelCapping=' + i + ';updateLevelInfo();onDemoConfigChanged();">' + levelName + '</button>';
    html4 += button_template;

    if (hls.nextLevel === i) {
      html4 += button_enabled;
    } else {
      html4 += button_disabled;
    }

    html4 += 'onclick="hls.nextLevel=' + i + '">' + levelName + '</button>';
  }

  var v = $('#video')[0];

  if (v.videoWidth && v.videoHeight) {
    $('#currentResolution').html(v.videoWidth + ' x ' + v.videoHeight);
  }

  if ($('#currentLevelControl').html() != html1) {
    $('#currentLevelControl').html(html1);
  }

  if ($('#loadLevelControl').html() != html2) {
    $('#loadLevelControl').html(html2);
  }

  if ($('#levelCappingControl').html() != html3) {
    $('#levelCappingControl').html(html3);
  }

  if ($('#nextLevelControl').html() != html4) {
    $('#nextLevelControl').html(html4);
  }
}

function updateAudioTrackInfo() {
  var button_template = '<button type="button" class="btn btn-sm ';
  var button_enabled = 'btn-primary" ';
  var button_disabled = 'btn-success" ';
  var html1 = '';
  var audioTrackId = hls.audioTrack,
      len = hls.audioTracks.length;

  for (var i = 0; i < len; i++) {
    html1 += button_template;

    if (audioTrackId === i) {
      html1 += button_enabled;
    } else {
      html1 += button_disabled;
    }

    html1 += 'onclick="hls.audioTrack=' + i + '">' + hls.audioTracks[i].name + '</button>';
  }

  $('#audioTrackControl').html(html1);
}

function level2label(index) {
  if (hls && hls.levels.length - 1 >= index) {
    var level = hls.levels[index];

    if (level.name) {
      return level.name;
    } else {
      if (level.height) {
        return level.height + 'p / ' + Math.round(level.bitrate / 1024) + 'kb';
      } else {
        if (level.bitrate) {
          return Math.round(level.bitrate / 1024) + 'kb';
        } else {
          return null;
        }
      }
    }
  }
}

function getDemoConfigPropOrDefault(propName, defaultVal) {
  return typeof demoConfig[propName] !== 'undefined' ? demoConfig[propName] : defaultVal;
}

function getURLParam(sParam, defaultValue) {
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');

  for (var i = 0; i < sURLVariables.length; i++) {
    var sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] == sParam) {
      return 'undefined' == sParameterName[1] ? undefined : 'false' == sParameterName[1] ? false : sParameterName[1];
    }
  }

  return defaultValue;
}

function onDemoConfigChanged() {
  demoConfig = {
    enableStreaming: enableStreaming,
    autoRecoverError: autoRecoverError,
    dumpfMP4: dumpfMP4,
    levelCapping: levelCapping,
    limitMetrics: limitMetrics
  };

  if (configPersistenceEnabled) {
    persistEditorValue();
  }

  var serializedDemoConfig = btoa(JSON.stringify(demoConfig));
  var baseURL = document.URL.split('?')[0];
  var streamURL = $('#streamURL').val();
  var permalinkURL = baseURL + "?src=" + encodeURIComponent(streamURL) + "&demoConfig=" + serializedDemoConfig;
  $('#StreamPermalink').html("<a href=\"" + permalinkURL + "\">" + permalinkURL + "</a>");
}

function onConfigPersistenceChanged(event) {
  configPersistenceEnabled = event.target.checked;
  localStorage.setItem(STORAGE_KEYS.Editor_Persistence, JSON.stringify(configPersistenceEnabled));

  if (configPersistenceEnabled) {
    persistEditorValue();
  } else {
    localStorage.removeItem(STORAGE_KEYS.Hls_Config);
  }
}

function getEditorValue(options) {
  options = $.extend({
    parse: false
  }, options || {});
  var value = configEditor.session.getValue();

  if (options.parse) {
    try {
      value = JSON.parse(value);
    } catch (e) {
      console.warn('[getEditorValue] could not parse editor value', e);
      value = {};
    }
  }

  return value;
}

function getPersistedHlsConfig() {
  var value = localStorage.getItem(STORAGE_KEYS.Hls_Config);

  if (value === null) {
    return value;
  }

  try {
    value = JSON.parse(value);
  } catch (e) {
    console.warn('[getPersistedHlsConfig] could not hls config json', e);
    value = {};
  }

  return value;
}

function persistEditorValue() {
  localStorage.setItem(STORAGE_KEYS.Hls_Config, getEditorValue());
}

function setupConfigEditor() {
  configEditor = ace.edit('config-editor');
  configEditor.setTheme('ace/theme/github');
  configEditor.session.setMode('ace/mode/json');
  var contents = hlsjsDefaults;
  var shouldRestorePersisted = JSON.parse(localStorage.getItem(STORAGE_KEYS.Editor_Persistence)) === true;

  if (shouldRestorePersisted) {
    $.extend(contents, getPersistedHlsConfig());
  }

  var elPersistence = document.querySelector('#configPersistence');
  elPersistence.addEventListener('change', onConfigPersistenceChanged);
  elPersistence.checked = shouldRestorePersisted;
  configPersistenceEnabled = shouldRestorePersisted;
  updateConfigEditorValue(contents);
}

function updateConfigEditorValue(obj) {
  var json = JSON.stringify(obj, null, 2);
  configEditor.session.setValue(json);
}

function applyConfigEditorValue() {
  onDemoConfigChanged();
  loadSelectedStream();
}

function createfMP4(type) {
  if (fmp4Data[type].length) {
    var blob = new Blob([arrayConcat(fmp4Data[type])], {
      type: 'application/octet-stream'
    });
    var filename = type + '-' + new Date().toISOString() + '.mp4';
    saveAs(blob, filename); //$('body').append('<a download="hlsjs-' + filename + '" href="' + window.URL.createObjectURL(blob) + '">Download ' + filename + ' track</a><br>');
  }
}

function arrayConcat(inputArray) {
  var totalLength = inputArray.reduce(function (prev, cur) {
    return prev + cur.length;
  }, 0);
  var result = new Uint8Array(totalLength);
  var offset = 0;
  inputArray.forEach(function (element) {
    result.set(element, offset);
    offset += element.length;
  });
  return result;
}

function hideAllTabs() {
  $('#playbackControlTab').hide();
  $('#qualityLevelControlTab').hide();
  $('#audioTrackControlTab').hide();
  $('#metricsDisplayTab').hide();
  $('#statsDisplayTab').hide();
}

function toggleTab(tabElId) {
  hideAllTabs();
  hideMetrics();
  $('#' + tabElId).show();
}

function appendLog(textElId, message) {
  var el = $('#' + textElId);
  var logText = el.text();

  if (logText.length) {
    logText += '\n';
  }

  var timestamp = (Date.now() - startTime) / 1000;
  var newMessage = timestamp + ' | ' + message;
  logText += newMessage; // update

  el.text(logText);
}

function logStatus(message) {
  appendLog('statusOut', message);
}

function logError(message) {
  appendLog('errorOut', message);
}

/***/ }),

   

    
/***/ "./tests/test-streams.js":
/*!*******************************!*\
  !*** ./tests/test-streams.js ***!
  \*******************************/
/*! no static exports found */
/*! ModuleConcatenation bailout: Module is not an ECMAScript module */
/***/ (function(module, exports) {

/**
 * Create test stream
 * @param {string} url
 * @param {string} description
 * @param {boolean} [live]
 * @param {boolean} [abr]
 * @param {string[]} [blacklist_ua]
 * @returns {{url: string, description: string, live: boolean, abr: boolean, blacklist_ua: string[]}}
 */
function createTestStream(url, description, live, abr, blacklist_ua) {
  if (live === void 0) {
    live = false;
  }

  if (abr === void 0) {
    abr = true;
  }

  if (blacklist_ua === void 0) {
    blacklist_ua = [];
  }

  return {
    url: url,
    description: description,
    live: live,
    abr: abr,
    blacklist_ua: blacklist_ua
  };
}
/**
 * @param {Object} target
 * @param {Object} [config]
 * @returns {{url: string, description: string, live: boolean, abr: boolean, blacklist_ua: string[]}}
 */


function createTestStreamWithConfig(target, config) {
  if (typeof target !== 'object') {
    throw new Error('target should be object');
  }

  var testStream = createTestStream(target.url, target.description, target.live, target.abr, target.blacklist_ua);
  testStream.config = config;
  return testStream;
}

    
module.exports = {
    
    
  bbb: createTestStreamWithConfig({
    url: 'http://173.208.166.179/1tv-live-ca7a6c579c-der-da-spy-zoy-ye-kona-warkareya-dawusa_bastard/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - 1TV'
  }, {
    // try to workaround test failing because of slow seek on Chrome/Win10
    nudgeMaxRetry: 5
  }),
    
  aghaniAghani: {
    'url': 'https://svs.itworkscdn.net/aghanilive/aghanilive/playlist.m3u8',
    'description': 'Afghanistan - Aghani Aghani',
    'live': false,
    'abr': false,
    'blacklist_ua': ['internet explorer']
  },
  arezoTv: {
    'url': 'http://173.208.166.179/afg_ar_tv_789-456-dont_copy_my_links-mother-fucker-kona-werakawa/tracks-v1a1/mono.m3u8',
    'description': 'Afghanistan - Arezo TV',
    'live': false,
    'abr': true
  },
  arianaNews: {
    'url': 'https://d10rltuy0iweup.cloudfront.net/ATNNEWS/myStream/chunklist_w796472816.m3u8',
    'description': 'Afghanistan - Ariana News',
    'live': false,
    'abr': false,
    'blacklist_ua': ['internet explorer']
  },
  arianaTvOne: {
    'url': 'http://d2g7v53450s2i2.cloudfront.net/ATNUS/streamdelay/chunklist_w1314452267.m3u8?fluxustv.m3u8',
    'description': 'Afghanistan - Ariana TV 1',
    'live': false,
    'abr': false,
    'blacklist_ua': ['internet explorer']
  },

  /* // went offline for us :( would be good to replace this for regression test with something mimicking the issue
  issue649: {
    'url': 'https://cdn3.screen9.com/media/c/W/cW87csHkxsgu5TV1qs78aA_auto_hls.m3u8?auth=qlUjeCtbVdtkDfZYrtveTIVUXX1yuSqgF8wfWabzKpX72r-d5upW88-FHuyRRdnZA_1PKRTGAtTt_6Z-aj22kw',
    'description': 'hls.js/issues/649',
    'live': false,
    'abr': false
  },
  */
  arianaTvTwo: {
    'url': 'https://d10rltuy0iweup.cloudfront.net/ATNNAT/myStream/chunklist_w2121902183.m3u8',
    'description': 'Afghanistan - Ariana TV 2',
    'live': false,
    'abr': false,
    'blacklist_ua': ['safari']
  },
  baharTv: {
    'url': 'http://iptv.bahartv-af.com/bahartv/playlist1/index.m3u8',
    'description': 'Afghanistan - Bahar TV',
    'live': false,
    'abr': true
  },

  /*
  bbbAES: {
    'url': 'https://test-streams.mux.dev/bbbAES/playlists/sample_aes/index.m3u8',
    'description': 'SAMPLE-AES encrypted',
    'live': false,
    'abr': false
  },
  */
  hewadTv: {
    'url': 'http://173.208.166.179/hewad_tv_live-741zxc_dala-fuckoff-789g_ghjkl_hj963klj123/tracks-v1a1/mono.m3u8',
    'description': 'Afghanistan - Hewad TV',
    'live': false,
    'abr': false,
    'blacklist_ua': ['safari']
  },
  jahanTv: {
    'url': 'http://173.208.166.179/jahan_numa_tv_live-486asdf456_fuck_ghjk123zxcv458wxyz-fuck-off/tracks-v1a1/mono.m3u8',
    'description': 'Afghanistan - Jahan TV',
    'live': false,
    'abr': false,
    'blacklist_ua': ['internet explorer', 'MicrosoftEdge', 'safari', 'firefox']
  },
  kabulTv: {
    'url': 'http://1-fss27-s0.streamhoster.com/lv_kabultv/_definst_/kabultvus/chunklist.m3u8',
    'description': 'Afghanistan - Kabul TV',
    'live': false,
    'abr': false,
    'blacklist_ua': ['safari', 'internet explorer']
  },
  kayhanTv: {
    'url': 'http://playout395.livestreamingcdn.com:1935/live/Stream1/playlist.m3u8',
    'description': 'Afghanistan - Kayhan TV',
    'live': false,
    'abr': true,
    'blacklist_ua': ['safari', 'internet explorer']
  },
  khursidTv: {
    'url': 'http://173.208.166.179/khurshid_tv_live-motherkhata-a28b7_789abc_636wwwww4e888555-dont-copy/tracks-v1a1/mono.m3u8',
    'description': 'Afghanistan - Khurshid TV',
    'live': false,
    'abr': false
  },

  /*
  uspHLSAteam: createTestStream(
    'http://demo.unified-streaming.com/video/ateam/ateam.ism/ateam.m3u8?session_id=27199',
    'A-Team movie trailer - HLS by Unified Streaming Platform'
  ),
  */
  lemarTv: createTestStreamWithConfig({
    url: 'http://173.208.166.179/lemar_tv_live-kona-warkawa-dawosa-ma-use-kawa-bastard-Dozd_zxcv555/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - Lemar TV',
    blacklist_ua: ['firefox', 'safari', 'internet explorer']
  }, {
    widevineLicenseUrl: 'https://cwip-shaka-proxy.appspot.com/no_auth',
    emeEnabled: true
  }),
  miteraTv: {
    'url': 'http://173.208.166.179/mitra_tv_live-4a64668668a3b6599d1_asdf-9f7896449d697f-fuck-off/tracks-v1a1/mono.m3u8',
    'description': 'Afghanistan - Mitra TV',
    'live': false,
    'abr': false
  },
  pamirTv: {
    url: 'http://live.pamir.tv/ptv/d0dbe915091d400bd8ee7f27f0791303.sdp/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - Pamir TV'
  },
  payamEAfghanTv: {
    url: 'http://g5nl6xx5lpq6-hls-live.5centscdn.com/602/live12345/payameafghantv.stream/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - Payam-E-Afghan TV'
  },
  rtaTv: {
    url: 'http://173.208.166.179/rta_tv_live-789jkl456hgf_789_defgh/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - RTA'
  },
  toloNews: {
    url: 'http://173.208.166.179/tolo_news_live-1c104a79_dawus-khairatkhor_bastard-off_a3b65f99f6e409555/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan TOLO News'
  },
  tutiTv: {
    url: 'https://rrsatrtmp.tulix.tv/livecdn827/myStream.sdp/chunklist.m3u8',
    description: 'Afghanistan - Tuti'
  },
  // altAudioNoVideoCodecSignaled: {
  //   url: 'https://d35u71x3nb8v2y.cloudfront.net/4b711b97-513c-4d36-ad29-298ab23a2e5e/3cbf1114-b2f4-4320-afb3-f0f7eeeb8630/playlist.m3u8',
  //   description: 'Alternate audio track, but no video codec is signaled in the master manifest'
  // },
  watanHd: {
    url: 'http://51.15.236.137/hls/stream.m3u8',
    description: 'Afghanistan - Watan HD'
  },
    
    wesalhaqTvOne: {
    url: 'http://live.wesalhaq.tv/live/whaq_360p/gmswf.m3u8?v=',
    description: 'Afghanistan - Wesalhaq TV 1'
  },
  
     wesalhaqTvTwo: {
    url: 'rtmp://live.noorlive.com:1935/wesal/wesal1',
    description: 'Afghanistan - Wesalhaq TV 2'
  },
  
     zanTv: {
    url: 'http://173.208.166.179/zan_tv_live_456qwer586_stop_tyui123ikm159-fuck-off/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - Zan TV'
  },
  
     zarinTv: {
    url: 'https://5c21f7ec1999d.streamlock.net/8176/8176/playlist.m3u8',
    description: 'Afghanistan - Zarin TV'
  },
  
     zhwandoonTv: {
    url: 'http://173.208.166.179/zhwandoon_tv_live-ca76ca2c8763_bastard-koni-dozd-lanati-kona-warkawa-c2df49a4/tracks-v1a1/mono.m3u8',
    description: 'Afghanistan - Zhwandoon TV'
  },
  
    
      
    albMusic: {
    url: 'http://albmusic.dyndns.tv:1935/albuk/albmus.stream/playlist.m3u8',
    description: 'Albania - AlbMUSIC'
  },
      albUkTv: {
    url: 'http://albuk.dyndns.tv:1935/albuk/albuk.stream/playlist.m3u8',
    description: 'Albania - AlbUK TV'
  },
        apollonTv: {
    url: 'http://185.80.224.14:8095/hls/stream.m3u8',
    description: 'Albania - Apollon TV'
  },
        channelOne: {
    url: 'http://145.239.2.153:8081/channelone/channelone/chunks.m3u8',
    description: 'Albania - Channel One'
  },
        euroalMusic: {
    url: 'http://5.135.92.131:1935/live/euroAl/chunklist.m3u8',
    description: 'Albania - EUROAL, Music'
  },
        fineLiving: {
    url: 'http://70.32.0.9:5000/live/543/playlist.m3u8',
    description: 'Albania - Fine Living, Entertainment'
  },
        kohaTv: {
    url: 'rtmp://live.tvkoha.tv:1935/live/koha/livestream',
    description: 'Albania - Koha TV'
  },
        newsTF: {
    url: 'http://tv.balkanweb.com:8081/news24/livestream/playlist.m3u8',
    description: 'Albania - News 24'
  },
        oraNews: {
    url: 'http://145.239.2.153:8081/oranews/live/chunks.m3u8',
    description: 'Albania - Ora News'
  },
        oraTv: {
    url: 'http://dcunilive36-lh.akamaihd.net:80/i/dclive_1@662093/master.m3u8',
    description: 'Albania - Ora TV'
  },
        peaceTv: {
    url: 'http://82.114.67.178:8081/hls/PeaceTV.m3u8',
    description: 'Albania - Peace TV'
  },
        reportTv: {
    url: 'http://66.55.93.204/hls-live/livepkgr/_definst_/report/stream.m3u8',
    description: 'Albania - Report TV'
  },
        rrokumTv: {
    url: 'http://82.114.65.202:1935/live/rrokumtv/playlist.m3u8',
    description: 'Albania - Rrokum TV'
  },
        rtshOneHD: {
    url: 'http://79.106.48.2/live/rtsh_1ott/playlist.m3u8',
    description: 'Albania - RTSH 1 HD'
  },
        rtshTwoHD: {
    url: 'http://79.106.48.2/live/rtsh_1ott_p3/playlist.m3u8',
    description: 'Albania - RTSH 2 HD'
  },
       rtshThreeHD: {
    url: 'http://79.106.48.2/live/rtsh_2ott_p3/playlist.m3u8',
    description: 'Albania - RTSH 3 HD'
  },
       rtshTF: {
    url: 'http://79.106.48.2/live/rtsh_24_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH 24, News'
  },
       rtshThree: {
    url: 'http://79.106.48.2/live/rtsh_3ott_p3/playlist.m3u8',
    description: 'Albania - RTSH 3'
  },
       rtshFemije: {
    url: 'http://79.106.48.2/live/rtsh_femije_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH Femije',
            'live': false,
    'abr': false
   
  },
       rtshFilm: {
    url: 'http://79.106.48.2/live/rtsh_film_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH Film, Movies'
  },
       rtshMuzike: {
    url: 'http://79.106.48.2/live/rtsh_muzike_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH Muzike, Music'
  },
       rtshPlus: {
    url: 'http://79.106.48.2/live/rtsh_plus_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH Plus'
  },
       rtshShqipOne: {
    url: 'http://79.106.48.2/live/rtsh_shqip_ott_p2/playlist.m3u8',
    description: 'Albania - RTSH Shqip 1'
  },
       rtshShqipTwo: {
    url: 'http://79.106.48.2/live/rtsh_shqip_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH Shqip 2'
  },
       rtshSport: {
    url: 'http://79.106.48.2/live/rtsh_sport_ott_p3/playlist.m3u8',
    description: 'Albania - RTSH Sport'
  },
       rTvOne: {
    url: 'http://79.106.102.68/hls/rtvnje.m3u8',
    description: 'Albania - RTV 1'
  },
       rTvPendimi: {
    url: 'http://tv.rtvpendimi.com:8081/hls/RTVPendimi.m3u8',
    description: 'Albania - RTV Pendimi'
  },
       topSound: {
    url: 'https://cdn.tvtopsound.com:1443/TopSoundTV/stream/TopSoundTV/live_720/chunks.m3u8',
    description: 'Albania - Top Sound, Music'
  },
      
       tringSmile : {
    url: 'http://stream.shqiptv.com:7080/TRINGSMILE-8772-sd/index.m3u8',
    description: 'Albania - Tring Smile'
  },
      
       tvBoin: {
    url: 'http://tva.fastbroad.com:80/i/tvboin_1@380599/index_2000_av-p.m3u8',
    description: 'Albania - TV Boin'
  },
      
       tvSeven: {
    url: 'http://media.az-mediaserver.com:1935/7064/7064/chunklist_w464537904.m3u8',
    description: 'Albania - TV7'
  },
      
       zJarrTv: {
    url: 'http://217.73.132.66:1935/live/Zjarr.stream/playlist.m3u8',
    description: 'Albania - Zjarr TV'
  },
    
    
    /****************************** Algeria ***************************************/
    
     amelTv: {
    url: 'http://player.mslivestream.net/mslive/27a2733c4bc60825f0386b5b333fac0e.sdp/tracks-v1a1/mono.m3u8',
    description: 'Algeria - Amel TV'
  },
     canalAlgerie: {
    url: 'http://www.elahmad.com/tv/m3u8/fr_xoyky_49.m3u8?id=algerie',
    description: 'Algeria - Canal Algérie'
  },
     chaineNordAfricane: {
    url: 'http://str81.creacast.com/cna/live.sdp/playlist.m3u8',
    description: 'Algeria - Chaine Nord-Africaine'
  },
    
    /****** Andhora *******/
    
     rtvaOne: {
    url: 'http://videos.rtva.ad:1935/live/rtva/playlist.m3u8',
    description: 'Andorra - RTVA 1'
  },
     rtvaTwo: {
    url: 'http://videos.rtva.ad:1935/live/web/playlist.m3u8',
    description: 'Andorra - RTVA 2'
  },
     rtvaThree: {
    url: 'https://videos.rtva.ad/live/rtva/chunklist_w1082760031.m3u8',
    description: 'Andorra - RTVA 3'
  },
     rtvaFour: {
    url: 'https://videos.rtva.ad/live/web/chunklist_w1342231881.m3u8',
    description: 'Andorra - RTVA 4'
  },
    
    /********** Angola *********/
     tpaOne: {
    url: 'http://api.new.livestream.com/accounts/1181452/events/5141181/live.m3u8',
    description: 'Angola - TPA 1'
  },
    
    /********** Argentina *************/

    
    
    
    
};

/***/ })



	
	
/******/ })["default"];
});
//# sourceMappingURL=hls-demo.js.map
    