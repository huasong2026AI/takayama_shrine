/* 高山神社 (Takayama Shrine) 长明灯奉纳与千日祈愿无限加时系统 
 * 要求：中间木札框增长，按钮简化为【🔥 续灯】
 */

class LampsManager {
    constructor() {
        this.container = null;
        this.modal = null;
        this.blessingInput = null;
        this.donorInput = null;
        this.confirmBtn = null;
        this.cancelBtn = null;

        // 续照加时 Modal
        this.renewModal = null;
        this.renewDesc = null;
        this.customMeritInput = null;
        this.confirmRenewBtn = null;
        this.cancelRenewBtn = null;
        this.selectedRenewMerit = 100;

        this.selectedSlotIndex = null;
        this.timerInterval = null;

        this.maxLamps = 3;
        this.lampsData = Array.from({ length: 3 }, (_, i) => ({
            id: i,
            lit: false,
            expiresAt: null,
            blessing: '',
            donor: ''
        }));
    }

    init(savedLampsData = null) {
        if (savedLampsData && Array.isArray(savedLampsData)) {
            this.lampsData = savedLampsData.slice(0, 3);
            while (this.lampsData.length < 3) {
                this.lampsData.push({
                    id: this.lampsData.length,
                    lit: false,
                    expiresAt: null,
                    blessing: '',
                    donor: ''
                });
            }
        }

        this.container = document.getElementById('lampsContainer');
        this.modal = document.getElementById('lampModal');
        this.blessingInput = document.getElementById('lampBlessingInput');
        this.donorInput = document.getElementById('lampDonorInput');
        this.confirmBtn = document.getElementById('confirmLampBtn');
        this.cancelBtn = document.getElementById('cancelLampBtn');

        // 绑定加时 Modal
        this.renewModal = document.getElementById('renewLampModal');
        this.renewDesc = document.getElementById('renewModalDesc');
        this.customMeritInput = document.getElementById('customMeritInput');
        this.confirmRenewBtn = document.getElementById('confirmRenewBtn');
        this.cancelRenewBtn = document.getElementById('cancelRenewBtn');

        if (this.cancelBtn) this.cancelBtn.addEventListener('click', () => this.closeModal());
        if (this.confirmBtn) this.confirmBtn.addEventListener('click', () => this.confirmLightLamp());

        if (this.cancelRenewBtn) this.cancelRenewBtn.addEventListener('click', () => this.closeRenewModal());
        if (this.confirmRenewBtn) this.confirmRenewBtn.addEventListener('click', () => this.confirmRenewLamp());

        // 预设快捷选项点击
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const meritVal = parseInt(btn.dataset.merit, 10);
                this.selectedRenewMerit = meritVal;
                if (this.customMeritInput) this.customMeritInput.value = meritVal;
            });
        });

        if (this.customMeritInput) {
            this.customMeritInput.addEventListener('input', () => {
                this.selectedRenewMerit = Math.max(100, parseInt(this.customMeritInput.value, 10) || 100);
            });
        }

        this.renderLamps();
        this.startTimer();
    }

    // 获取守护位阶与勋章
    getGuardianshipBadge(remainingHours) {
        if (remainingHours >= 8760) {
            return { title: '👑 万代长明', cls: 'rank-eternal' };
        } else if (remainingHours >= 720) {
            return { title: '✨ 岁岁安康', cls: 'rank-year' };
        } else if (remainingHours >= 168) {
            return { title: '🌟 月相常耀', cls: 'rank-month' };
        } else if (remainingHours >= 48) {
            return { title: '🔥 七日庇佑', cls: 'rank-week' };
        }
        return { title: '🕯️ 虔心微光', cls: 'rank-day' };
    }

    renderLamps() {
        if (!this.container) return;
        this.container.innerHTML = '';

        const now = Date.now();

        this.lampsData.forEach(lamp => {
            if (lamp.lit && lamp.expiresAt && lamp.expiresAt <= now) {
                lamp.lit = false;
            }
        });

        const activeLamps = this.lampsData.filter(lamp => lamp.lit && lamp.expiresAt > now);

        if (activeLamps.length === 0) {
            const emptyElem = document.createElement('div');
            emptyElem.className = 'lamps-empty-notice';
            emptyElem.innerHTML = `
                <div class="empty-lantern-icon">⛩️</div>
                <p class="empty-text">当前暂未供奉长明灯<br>点亮长明灯 · 投入功德可无限叠加加时庇佑</p>
                <button class="btn-primary btn-gold btn-large" onclick="window.lampsManager.openLightModalForFirstAvailable()">
                    🔥 奉纳第一座长明灯 (100功德)
                </button>
            `;
            this.container.appendChild(emptyElem);
            return;
        }

        activeLamps.forEach((lamp) => {
            const remainingMs = Math.max(0, lamp.expiresAt - now);
            const remainingHours = remainingMs / (3600 * 1000);
            const timeFormatted = this.formatLongTime(Math.floor(remainingMs / 1000));
            const badge = this.getGuardianshipBadge(remainingHours);

            const slotElem = document.createElement('div');
            slotElem.className = `lamp-jp-card lit ${badge.cls}`;

            slotElem.innerHTML = `
                <div class="lantern-box">
                    <svg viewBox="0 0 80 100" class="jp-lantern-svg glowing">
                        <defs>
                            <radialGradient id="lampGlowGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stop-color="#fff5cc"/>
                                <stop offset="40%" stop-color="#ffaa00"/>
                                <stop offset="100%" stop-color="#cc3300"/>
                            </radialGradient>
                        </defs>
                        <path d="M 35 5 Q 40 0 45 5" fill="none" stroke="#d4af37" stroke-width="3"/>
                        <path d="M 20 12 L 60 12 L 54 20 L 26 20 Z" fill="#4a2d18" stroke="#1f1007" stroke-width="1.5"/>
                        <rect x="24" y="20" width="32" height="55" rx="4" fill="url(#lampGlowGrad)" stroke="#4a2d18" stroke-width="2"/>
                        <line x1="24" y1="34" x2="56" y2="34" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
                        <line x1="24" y1="48" x2="56" y2="48" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
                        <line x1="24" y1="62" x2="56" y2="62" stroke="rgba(0,0,0,0.3)" stroke-width="1.5"/>
                        <text x="40" y="46" font-size="12" fill="#660000" text-anchor="middle" font-weight="bold">长明</text>
                        <path d="M 24 75 L 56 75 L 50 82 L 30 82 Z" fill="#4a2d18" stroke="#1f1007"/>
                        <path d="M 40 82 L 40 98" fill="none" stroke="#c82828" stroke-width="2"/>
                    </svg>
                </div>

                <div class="fuda-plaque">
                    <div class="fuda-header">
                        <span class="fuda-badge ${badge.cls}">${badge.title}</span>
                        <span class="fuda-no">第${lamp.id + 1}席</span>
                    </div>
                    <div class="fuda-body">
                        <span class="fuda-text">${lamp.blessing || '愿平安吉祥'}</span>
                    </div>
                    <div class="fuda-footer">
                        <span class="fuda-donor">奉纳人：${lamp.donor || '高山信徒'}</span>
                        <span class="fuda-timer">${timeFormatted}</span>
                    </div>
                </div>

                <button class="btn-primary btn-gold lamp-renew-btn" title="注入功德，延长护持时间" onclick="window.lampsManager.openRenewModal(${lamp.id})">
                    🔥 续灯
                </button>
            `;

            this.container.appendChild(slotElem);
        });

        if (activeLamps.length < this.maxLamps) {
            const addBtnBox = document.createElement('div');
            addBtnBox.className = 'add-lamp-box';
            addBtnBox.innerHTML = `
                <button class="btn-primary btn-gold btn-large" onclick="window.lampsManager.openLightModalForFirstAvailable()">
                    ➕ 奉纳新长明灯 (100功德) · 还能供奉 ${this.maxLamps - activeLamps.length} 盏
                </button>
            `;
            this.container.appendChild(addBtnBox);
        } else {
            const fullBadge = document.createElement('div');
            fullBadge.className = 'lamps-full-badge';
            fullBadge.innerText = '✨ 3 座长明灯千灯献照中 (可随时点击【🔥 续灯】)';
            this.container.appendChild(fullBadge);
        }
    }

    formatLongTime(totalSeconds) {
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (days > 0) {
            return `${days}天 ${hours}小时`;
        }
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    openLightModalForFirstAvailable() {
        const now = Date.now();
        const availableIndex = this.lampsData.findIndex(l => !l.lit || l.expiresAt <= now);
        if (availableIndex !== -1) {
            this.openLightModal(availableIndex);
        } else {
            if (window.shrineApp) window.shrineApp.showToast('已达到 3 盏供奉上限！您可以点击【🔥 续灯】无上限增加护持时间！');
        }
    }

    openLightModal(slotIndex) {
        if (window.shrineApp && window.shrineApp.merit < 100) {
            window.shrineApp.showToast('功德不足 100！请先敲木鱼积累功德。');
            return;
        }

        this.selectedSlotIndex = slotIndex;
        const currentData = this.lampsData[slotIndex];

        if (this.blessingInput) this.blessingInput.value = currentData.blessing || '';
        if (this.donorInput) this.donorInput.value = currentData.donor || '';

        if (this.modal) {
            this.modal.classList.add('active');
        }
    }

    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
        this.selectedSlotIndex = null;
    }

    confirmLightLamp() {
        if (this.selectedSlotIndex === null) return;

        if (!window.shrineApp.deductMerit(100)) {
            window.shrineApp.showToast('功德不足 100！');
            this.closeModal();
            return;
        }

        const blessing = (this.blessingInput.value || '愿逢考必过，万事胜意').trim();
        const donor = (this.donorInput.value || '高山信徒').trim();
        const durationMs = 12 * 60 * 60 * 1000;

        this.lampsData[this.selectedSlotIndex] = {
            id: this.selectedSlotIndex,
            lit: true,
            expiresAt: Date.now() + durationMs,
            blessing: blessing,
            donor: donor
        };

        if (window.shrineAudio) {
            window.shrineAudio.playLampLightSound();
        }

        window.shrineApp.showToast(`✨ 第 ${this.selectedSlotIndex + 1} 座长明灯奉纳成功！已开启 12 小时庇佑！`);
        window.shrineApp.saveState();

        this.closeModal();
        this.renderLamps();
    }

    openRenewModal(slotIndex) {
        this.selectedSlotIndex = slotIndex;
        const lamp = this.lampsData[slotIndex];
        const remainingMs = Math.max(0, lamp.expiresAt - Date.now());
        const timeFormatted = this.formatLongTime(Math.floor(remainingMs / 1000));

        if (this.renewDesc) {
            this.renewDesc.innerText = `第 ${slotIndex + 1} 座长明灯当前庇佑剩余：${timeFormatted}。投入功德可无上限追加时长！`;
        }

        if (this.renewModal) {
            this.renewModal.classList.add('active');
        }
    }

    closeRenewModal() {
        if (this.renewModal) {
            this.renewModal.classList.remove('active');
        }
        this.selectedSlotIndex = null;
    }

    confirmRenewLamp() {
        if (this.selectedSlotIndex === null) return;

        const amount = Math.max(100, this.selectedRenewMerit || 100);

        if (!window.shrineApp.deductMerit(amount)) {
            this.closeRenewModal();
            return;
        }

        const hoursAdded = (amount / 100) * 12;
        const msAdded = hoursAdded * 3600 * 1000;

        const lamp = this.lampsData[this.selectedSlotIndex];
        const baseTime = Math.max(Date.now(), lamp.expiresAt || 0);
        lamp.expiresAt = baseTime + msAdded;
        lamp.lit = true;

        if (window.shrineAudio) {
            window.shrineAudio.playLampLightSound();
        }

        const remainingHours = (lamp.expiresAt - Date.now()) / (3600 * 1000);
        const badge = this.getGuardianshipBadge(remainingHours);

        window.shrineApp.showToast(`✨ 成功注入 ${amount} 功德！守护时长延长 ${hoursAdded} 小时！当前位阶：【${badge.title}】`);
        window.shrineApp.saveState();

        this.closeRenewModal();
        this.renderLamps();
    }

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            this.renderLamps();
        }, 1000);
    }

    getExportData() {
        return this.lampsData;
    }
}

window.lampsManager = new LampsManager();
