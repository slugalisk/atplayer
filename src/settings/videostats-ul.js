import videojs from 'video.js';
const Component = videojs.getComponent('Component');
const dom = videojs.dom || videojs;

class VideoStatsUL extends Component {

  constructor(player, options) {
    super(player, options);

    this.createStats();
  }

  createEl(tag = 'ul', props = {className: "pl-stats-list js-playback-stats"}, attributes = {}) {
    let el = super.createEl(tag, props, attributes);
    return el;
  }

  buildCSSClass() {
    // vjs-icon-cog can be removed when the settings menu is integrated in video.js
    return `pl-stats-list js-playback-stats ${super.buildCSSClass()}`;
  }

  createStats() {
    let statEL = this.el();

    let button = dom.createEl('button', {className: 'vjs-icon-cancel player-button player-button--noscale player-button--close'}, {type: "button", id: "", tabindex: 0}, "");
    button.addEventListener("click", () => {
      this.hide();
      document.getElementById('videostats-toggle').checked = false;
    }, false);

    statEL.insertBefore(button, statEL.contentEl_);

    const player = this.player();

    const version = this.options_.version;
    let videoResolution = this.plStat("Video Resolution:", player.videoWidth() + "x" + player.videoHeight());
    let displayResolution = this.plStat("Display Resolution:", player.currentWidth() + "x" + player.currentHeight());
    let skippedFrames = this.plStat("Skipped Frames:", "0");
    let bufferSize = this.plStat("Buffer Size:", "0.00sec.");
    let playbackRate = this.plStat("Playback Rate:", "0 Kbps");
    let versionStat = this.plStat("Version:", version);

    statEL.insertBefore(videoResolution, statEL.contentEl_);
    statEL.insertBefore(displayResolution, statEL.contentEl_);
    statEL.insertBefore(skippedFrames, statEL.contentEl_);
    statEL.insertBefore(bufferSize, statEL.contentEl_);
    statEL.insertBefore(playbackRate, statEL.contentEl_);
    statEL.insertBefore(versionStat, statEL.contentEl_);

    setInterval(() => {
      this.updateStats();
    }, 1000);
  }

  updateStats() {
    const player = this.player();
    let hls = player.tech({ IWillNotUseThisInPlugins: true }).hls;
    let stats;
    if(hls) {
      stats = hls.stats;
    }

    let statEL = this.el();
    for(let i = 1; i<statEL.children.length; i++) {
      let stat = statEL.children[i];
      let value = stat.children[1];
      let span = value.children[0];
      
      if(i == 1) {
        span.innerHTML = player.videoWidth() + "x" + player.videoHeight();
      } else if(i == 2) {
        span.innerHTML = player.currentWidth() + "x" + player.currentHeight();
      } else if(i == 3 && stats) {
        span.innerHTML = stats.videoPlaybackQuality.droppedVideoFrames;
      } else if(i == 4 && stats) {
        span.innerHTML = (stats.buffered[0].end - stats.buffered[0].start).toFixed(2) + " sec";
      } else if (i== 5 && stats) {
        span.innerHTML = Math.round(stats.bandwidth/8000) + " Kbps";
      }
    }
  }

  plStat(name, value) {
    let el = dom.createEl('li', {className: 'pl-stat'}, {}, "");
    let statName = el.insertBefore(dom.createEl('div', {className: 'pl-stat__name'}, {}, ""), this.contentEl_);
    statName.insertBefore(dom.createEl('span', {}, {}, name), this.contentEl_);
    let statValue = el.insertBefore(dom.createEl('div', {className: 'pl-stat__value'}, {}, ""), this.contentEl_);
    statValue.insertBefore(dom.createEl('span', {}, {}, value), this.contentEl_);

    el.insertBefore(statName , this.contentEl_);
    el.insertBefore(statValue , this.contentEl_);

    return el;
  }
}

videojs.registerComponent('VideoStatsUL', VideoStatsUL);
export default VideoStatsUL;