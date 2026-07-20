/* 高山神社 (Takayama Shrine) Web Audio API 音效合成引擎 
 * 移动端兼容优化：触摸即刻解锁 AudioContext
 */

class ShrineAudioEngine {
    constructor() {
        this.ctx = null;
        this.enabled = true;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleSound() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    // 敲击木鱼：清脆、空灵、透亮的“咚——”声
    playMuyuSound(isBigMerit = false) {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;

        // 1. 敲击瞬态 (Transient Click)
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1400, now);
        clickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.015);
        clickGain.gain.setValueAtTime(0.4, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);
        clickOsc.connect(clickGain);
        clickGain.connect(this.ctx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.015);

        // 2. 空灵主腔体共鸣 (Hollow Body Resonance)
        const mainOsc = this.ctx.createOscillator();
        const mainGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(isBigMerit ? 680 : 580, now);
        filter.Q.setValueAtTime(4.0, now);

        mainOsc.type = 'sine';
        const baseFreq = isBigMerit ? 620 : 520;
        mainOsc.frequency.setValueAtTime(baseFreq, now);
        mainOsc.frequency.exponentialRampToValueAtTime(baseFreq * 0.78, now + 0.22);

        const decayDuration = isBigMerit ? 0.45 : 0.32;
        mainGain.gain.setValueAtTime(0.85, now);
        mainGain.gain.exponentialRampToValueAtTime(0.0005, now + decayDuration);

        mainOsc.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(this.ctx.destination);

        mainOsc.start(now);
        mainOsc.stop(now + decayDuration);

        // 3. 高阶空灵泛音 (Ethereal Harmonic)
        const harmonic = this.ctx.createOscillator();
        const harmGain = this.ctx.createGain();
        harmonic.type = 'sine';
        harmonic.frequency.setValueAtTime(baseFreq * 2.1, now);
        harmonic.frequency.exponentialRampToValueAtTime(baseFreq * 1.8, now + 0.25);

        harmGain.gain.setValueAtTime(isBigMerit ? 0.25 : 0.12, now);
        harmGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        harmonic.connect(harmGain);
        harmGain.connect(this.ctx.destination);
        harmonic.start(now);
        harmonic.stop(now + 0.25);
    }

    // 摇签筒
    playShakeSound() {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;
        for (let i = 0; i < 4; i++) {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(700 + Math.random() * 600, now + i * 0.05);
            osc.frequency.exponentialRampToValueAtTime(250, now + i * 0.05 + 0.04);

            gain.gain.setValueAtTime(0.2, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.04);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.05);
        }
    }

    // 点亮长明灯
    playLampLightSound() {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(1400, now + 0.08);
        filter.frequency.exponentialRampToValueAtTime(150, now + 0.2);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.2);
    }

    // 换殿/磬音
    playChimeSound() {
        if (!this.enabled) return;
        this.init();

        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 1.2);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.5);
    }
}

window.shrineAudio = new ShrineAudioEngine();

// 移动端全局首次触摸唤醒 AudioContext
const unlockAudio = () => {
    if (window.shrineAudio) window.shrineAudio.init();
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('pointerdown', unlockAudio);
};
document.addEventListener('touchstart', unlockAudio, { passive: true });
document.addEventListener('pointerdown', unlockAudio, { passive: true });
