/* 高山神社 (Takayama Shrine) 木鱼物理打击与 0~180° 飞字粒子系统
 * 移动端兼容优化：支持 pointerdown 极速零延迟触控响应
 */

class MuyuManager {
    constructor() {
        this.clickArea = null;
        this.muyuBody = null;
        this.mallet = null;
        this.particlesLayer = null;
        this.hitCountElem = null;
        this.meritTotalElem = null;

        this.wordPool = [
            "好运 +1", "烦恼 -1", "病痛退散", "水逆退散", 
            "财运 +1", "平心静气", "小人退散", "智慧 +1", 
            "诸事顺遂", "灵感闪现", "福气满满", "脱单指日可待"
        ];
    }

    init() {
        this.clickArea = document.getElementById('muyuClickArea');
        this.muyuBody = document.getElementById('muyuBody');
        this.mallet = document.getElementById('mallet');
        this.particlesLayer = document.getElementById('muyuParticles');
        this.hitCountElem = document.getElementById('muyuHitCount');
        this.meritTotalElem = document.getElementById('muyuMeritTotal');

        if (this.clickArea) {
            // 使用 pointerdown 替代 click 实现移动端零延迟击打
            let lastTouchTime = 0;
            const handleKnock = (e) => {
                const now = Date.now();
                if (now - lastTouchTime < 60) return; // 简易防抖
                lastTouchTime = now;

                if (e.cancelable && e.type === 'touchstart') {
                    e.preventDefault();
                }
                this.knock(e);
            };

            this.clickArea.addEventListener('pointerdown', handleKnock);
        }
    }

    generateMeritValue() {
        const rand = Math.random();
        if (rand < 0.30) return 1;       // 30%
        if (rand < 0.56) return 2;       // 26%
        if (rand < 0.76) return 3;       // 20%
        if (rand < 0.92) return 4;       // 16%
        if (rand < 0.965) return 5;      // 4.5%
        if (rand < 0.99) return 6;       // 2.5%
        return 7;                        // 1.0% (5,6,7 总计 8.0% < 10%)
    }

    knock(event) {
        this.muyuBody.classList.remove('knock-hit');
        this.mallet.classList.remove('swing');

        void this.clickArea.offsetWidth;

        this.muyuBody.classList.add('knock-hit');
        this.mallet.classList.add('swing');

        const meritGain = this.generateMeritValue();
        const isBigMerit = meritGain >= 5;

        if (window.shrineAudio) {
            window.shrineAudio.playMuyuSound(isBigMerit);
        }

        if (window.shrineApp) {
            window.shrineApp.addMerit(meritGain);
            window.shrineApp.recordMuyuHit(meritGain);
        }

        this.spawnFloatingWord(meritGain, isBigMerit);
    }

    spawnFloatingWord(meritGain, isBigMerit) {
        if (!this.particlesLayer) return;

        const wordElem = document.createElement('div');
        wordElem.className = 'muyu-word' + (isBigMerit ? ' big-merit' : '');

        let textContent = `功德 +${meritGain}`;
        if (Math.random() < 0.5) {
            const randomExtra = this.wordPool[Math.floor(Math.random() * this.wordPool.length)];
            textContent = `功德 +${meritGain} · ${randomExtra}`;
        }
        if (isBigMerit) {
            textContent = `✨ 大功德 +${meritGain}！`;
        }
        wordElem.innerText = textContent;

        // 0~180° 弧形发散
        const angleDeg = Math.random() * 180;
        const angleRad = (angleDeg * Math.PI) / 180;
        const distance = 100 + Math.random() * 70;

        const tx = -distance * Math.cos(angleRad);
        const ty = -distance * Math.sin(angleRad);

        wordElem.style.setProperty('--tx', `${tx}px`);
        wordElem.style.setProperty('--ty', `${ty}px`);

        wordElem.style.left = `calc(70% - 60px)`;
        wordElem.style.top = `60%`;

        this.particlesLayer.appendChild(wordElem);

        setTimeout(() => {
            if (wordElem.parentNode) {
                wordElem.parentNode.removeChild(wordElem);
            }
        }, 1200);
    }

    updateStats(hits, hitMeritTotal) {
        if (this.hitCountElem) this.hitCountElem.innerText = hits;
        if (this.meritTotalElem) this.meritTotalElem.innerText = hitMeritTotal;
    }
}

window.muyuManager = new MuyuManager();
