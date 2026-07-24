/* 高山神社 (Takayama Shrine) 应用主逻辑 & 全局状态管理 */

class ShrineApp {
    constructor() {
        this.merit = 1000;
        this.muyuHits = 0;
        this.muyuMeritTotal = 0;

        this.meritElem = null;
        this.toastElem = null;
        this.soundBtn = null;
        this.soundIcon = null;

        this.storageKey = 'takayama_shrine_save_v1';
        this.hallsOrder = ['hall-main', 'hall-fortune', 'hall-bazi'];
        this.hallNames = ['第一殿：本殿', '第二殿：求签殿', '第三殿：算命殿'];
        this.currentHallIndex = 0;
    }

    init() {
        this.meritElem = document.getElementById('meritCount');
        this.toastElem = document.getElementById('shrineToast');
        this.soundBtn = document.getElementById('soundToggleBtn');
        this.soundIcon = document.getElementById('soundIcon');

        this.loadState();

        if (window.muyuManager) window.muyuManager.init();
        if (window.lampsManager) window.lampsManager.init(this.savedLampsData);
        if (window.fortuneManager) window.fortuneManager.init();
        if (window.baziCalculator) window.baziCalculator.init();

        this.bindNavigation();
        this.bindDataIO();

        if (this.soundBtn) {
            this.soundBtn.addEventListener('click', () => {
                if (window.shrineAudio) {
                    const enabled = window.shrineAudio.toggleSound();
                    if (this.soundIcon) {
                        this.soundIcon.innerText = enabled ? '🔊' : '🔇';
                    }
                    this.showToast(enabled ? '🔊 静音已解除' : '🔇 已开启静音模式');
                }
            });
        }

        // 绑定鸟居彩蛋：快速点击鸟居 7 次，功德 +1000
        const toriiIcon = document.querySelector('.torii-icon');
        if (toriiIcon) {
            let clickCount = 0;
            let lastClickTime = 0;
            toriiIcon.addEventListener('click', () => {
                const now = Date.now();
                if (now - lastClickTime > 2000) {
                    clickCount = 0;
                }
                clickCount++;
                lastClickTime = now;

                if (clickCount >= 7) {
                    this.addMerit(1000);
                    this.showToast('⛩️ 触发神明感应：虔诚参拜鸟居，功德 +1000！');
                    clickCount = 0;
                    if (window.shrineAudio) {
                        window.shrineAudio.playChimeSound();
                    }
                }
            });
        }

        this.initAtmosphere();
        this.updateUI();
        this.updateNextHallBtnLabel();
    }

    switchHall(hallId) {
        const index = this.hallsOrder.indexOf(hallId);
        if (index !== -1) {
            this.currentHallIndex = index;
        }

        // 更新 Content 视图
        document.querySelectorAll('.tab-content').forEach(sec => {
            sec.classList.remove('active');
        });
        const targetSec = document.getElementById(hallId);
        if (targetSec) {
            targetSec.classList.add('active');
        }

        this.updateNextHallBtnLabel();

        if (window.shrineAudio) {
            window.shrineAudio.playChimeSound();
        }
    }

    updateNextHallBtnLabel() {
        const nextHallBtn = document.getElementById('nextHallHeaderBtn');
        if (nextHallBtn) {
            const nextIndex = (this.currentHallIndex + 1) % this.hallsOrder.length;
            const nextName = this.hallNames[nextIndex];
            nextHallBtn.innerHTML = `<span>前往 ${nextName} ➔</span>`;
        }
    }

    bindNavigation() {
        // “下一殿 ➔” 按钮
        const nextHallBtn = document.getElementById('nextHallHeaderBtn');
        if (nextHallBtn) {
            nextHallBtn.addEventListener('click', () => {
                this.currentHallIndex = (this.currentHallIndex + 1) % this.hallsOrder.length;
                const nextHallId = this.hallsOrder[this.currentHallIndex];
                this.switchHall(nextHallId);
            });
        }

        // “🔙 返回主殿” 按钮
        document.querySelectorAll('.back-to-main-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchHall('hall-main');
            });
        });
    }

    addMerit(amount) {
        this.merit += amount;
        this.updateUI();
        this.saveState();
    }

    recordMuyuHit(meritGain) {
        this.muyuHits++;
        this.muyuMeritTotal += meritGain;
        if (window.muyuManager) {
            window.muyuManager.updateStats(this.muyuHits, this.muyuMeritTotal);
        }
        this.saveState();
    }

    deductMerit(amount) {
        if (this.merit < amount) {
            this.showToast(`功德不足！当前功德：${this.merit}，所需功德：${amount}`);
            return false;
        }
        this.merit -= amount;
        this.updateUI();
        this.saveState();
        return true;
    }

    updateUI() {
        if (this.meritElem) {
            this.meritElem.innerText = this.merit;
        }
        if (window.muyuManager) {
            window.muyuManager.updateStats(this.muyuHits, this.muyuMeritTotal);
        }
    }

    showToast(message) {
        if (!this.toastElem) return;
        this.toastElem.innerText = message;
        this.toastElem.classList.add('show');

        setTimeout(() => {
            this.toastElem.classList.remove('show');
        }, 2500);
    }

    saveState() {
        const state = {
            merit: this.merit,
            muyuHits: this.muyuHits,
            muyuMeritTotal: this.muyuMeritTotal,
            lamps: window.lampsManager ? window.lampsManager.getExportData() : [],
            savedAt: new Date().toISOString()
        };
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(state));
        } catch (e) {
            console.error('保存状态失败:', e);
        }
    }

    loadState() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (typeof parsed.merit === 'number') this.merit = parsed.merit;
                if (typeof parsed.muyuHits === 'number') this.muyuHits = parsed.muyuHits;
                if (typeof parsed.muyuMeritTotal === 'number') this.muyuMeritTotal = parsed.muyuMeritTotal;
                if (Array.isArray(parsed.lamps)) this.savedLampsData = parsed.lamps;
            }
        } catch (e) {
            console.error('读取状态失败:', e);
        }
    }

    bindDataIO() {
        const exportBtn = document.getElementById('exportDataBtn');
        const importBtn = document.getElementById('importDataBtn');
        const fileInput = document.getElementById('importFileInput');

        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportProfileJSON());
        }

        if (importBtn && fileInput) {
            importBtn.addEventListener('click', () => fileInput.click());
            fileInput.addEventListener('change', (e) => this.importProfileJSON(e));
        }
    }

    exportProfileJSON() {
        const data = {
            appName: "TakayamaShrine",
            version: "1.0",
            exportTime: new Date().toLocaleString(),
            profile: {
                merit: this.merit,
                muyuHits: this.muyuHits,
                muyuMeritTotal: this.muyuMeritTotal,
                lamps: window.lampsManager ? window.lampsManager.getExportData() : []
            }
        };

        const jsonStr = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `takayama_shrine_profile_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('📤 功德与神社数据已成功导出为 JSON 文件！');
    }

    importProfileJSON(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data && data.profile) {
                    const p = data.profile;
                    if (typeof p.merit === 'number') this.merit = p.merit;
                    if (typeof p.muyuHits === 'number') this.muyuHits = p.muyuHits;
                    if (typeof p.muyuMeritTotal === 'number') this.muyuMeritTotal = p.muyuMeritTotal;
                    
                    if (Array.isArray(p.lamps) && window.lampsManager) {
                        window.lampsManager.init(p.lamps);
                    }

                    this.updateUI();
                    this.saveState();
                    this.showToast('📥 成功从 JSON 文件恢复个人信息与功德数据！');
                } else {
                    this.showToast('⚠️ JSON 格式无效，缺失 profile 节点！');
                }
            } catch (err) {
                console.error(err);
                this.showToast('⚠️ 读取 JSON 文件失败，请确认文件格式！');
            }
        };
        reader.readAsText(file);

        event.target.value = '';
    }

    initAtmosphere() {
        const emberContainer = document.getElementById('emberContainer');
        if (!emberContainer) return;

        for (let i = 0; i < 20; i++) {
            const ember = document.createElement('div');
            ember.style.position = 'absolute';
            ember.style.width = `${Math.random() * 4 + 2}px`;
            ember.style.height = ember.style.width;
            ember.style.background = 'rgba(245, 208, 97, 0.6)';
            ember.style.borderRadius = '50%';
            ember.style.left = `${Math.random() * 100}%`;
            ember.style.top = `${Math.random() * 100}%`;
            ember.style.boxShadow = '0 0 8px rgba(245, 208, 97, 0.8)';
            ember.style.opacity = Math.random().toString();
            ember.style.transition = 'all 5s ease-in-out';

            emberContainer.appendChild(ember);

            setInterval(() => {
                ember.style.top = `${Math.random() * 100}%`;
                ember.style.left = `${Math.random() * 100}%`;
                ember.style.opacity = Math.random().toString();
            }, 3000 + Math.random() * 4000);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.shrineApp = new ShrineApp();
    window.shrineApp.init();
});
