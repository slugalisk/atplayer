import videojs from 'video.js';
const Component = videojs.getComponent('Component');
const dom = videojs.dom || videojs;

class VideoStatsLabelWrapper extends Component {

  constructor(player, label) {
    super(player, label);
  }

  createEl(tag = 'div', props = {className: "pl-toggle__label-wrapper"}, attributes = {}) {
    let el = super.createEl(tag, props, attributes);
    el.insertBefore(dom.createEl('label', {className: 'pl-form__label qa-toggle-label'}, {for: 'videostats-toggle', role: 'button', tabindex: '0'}, "Video Stats"), this.contentEl_)
    return el;
  }

  buildCSSClass() {
    // vjs-icon-cog can be removed when the settings menu is integrated in video.js
    return `pl-toggle__label-wrapper ${super.buildCSSClass()}`;
  }
}

videojs.registerComponent('VideoStatsLabelWrapper', VideoStatsLabelWrapper);
export default VideoStatsLabelWrapper;