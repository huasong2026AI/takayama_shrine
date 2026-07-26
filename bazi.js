/* 高山神社 (Takayama Shrine) 第三殿：生辰八字算命、祈测事项解惑与电子灵符生成器 */


class BaziCalculator {
    constructor() {
        this.form = null;
        this.resultDisplay = null;

        this.tianGan = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
        this.diZhi = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];
        this.shengXiao = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

        this.wuxingMap = {
            "甲": "木", "乙": "木", "丙": "火", "丁": "火", "戊": "土",
            "己": "土", "庚": "金", "辛": "金", "壬": "水", "癸": "水",
            "子": "水", "丑": "土", "寅": "木", "卯": "木", "辰": "土",
            "巳": "火", "午": "火", "未": "土", "申": "金", "酉": "金",
            "戌": "土", "亥": "水"
        };
    }

    init() {
        this.form = document.getElementById('baziForm');
        this.resultDisplay = document.getElementById('baziResultDisplay');

        this.populateDateSelects();

        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.calculateBazi();
            });
        }
    }

    populateDateSelects() {
        const monthSelect = document.getElementById('baziMonth');
        const daySelect = document.getElementById('baziDay');

        if (monthSelect) {
            monthSelect.innerHTML = '';
            for (let i = 1; i <= 12; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.innerText = `${i} 月`;
                monthSelect.appendChild(opt);
            }
            monthSelect.value = 6;
        }

        if (daySelect) {
            daySelect.innerHTML = '';
            for (let i = 1; i <= 31; i++) {
                const opt = document.createElement('option');
                opt.value = i;
                opt.innerText = `${i} 日`;
                daySelect.appendChild(opt);
            }
            daySelect.value = 15;
        }
    }

    calculateBazi() {
        // 校验 1000 功德
        if (window.shrineApp && window.shrineApp.merit < 1000) {
            window.shrineApp.showToast('功德不足 1000！算命需诚心积累 1000 功德。');
            return;
        }

        // 扣除 1000 功德
        if (!window.shrineApp.deductMerit(1000)) return;

        const name = document.getElementById('baziName').value.trim() || '高山信徒';
        const topic = document.getElementById('baziTopic').value.trim() || '综合运势与大吉避凶';
        const gender = document.getElementById('baziGender').value;
        const year = parseInt(document.getElementById('baziYear').value) || 1998;
        const month = parseInt(document.getElementById('baziMonth').value) || 6;
        const day = parseInt(document.getElementById('baziDay').value) || 15;
        const hour = parseInt(document.getElementById('baziHour').value) || 12;

        // 计算天干地支
        const yearGanIndex = (year - 4) % 10;
        const yearZhiIndex = (year - 4) % 12;
        const yearGan = this.tianGan[(yearGanIndex + 10) % 10];
        const yearZhi = this.diZhi[(yearZhiIndex + 12) % 12];
        const zodiac = this.shengXiao[(yearZhiIndex + 12) % 12];

        const monthZhiIndex = (month + 1) % 12;
        const monthGanIndex = (yearGanIndex * 2 + month) % 10;
        const monthGan = this.tianGan[monthGanIndex];
        const monthZhi = this.diZhi[monthZhiIndex];

        const dayBase = Math.floor(year * 5.5 + month * 2.5 + day);
        const dayGanIndex = dayBase % 10;
        const dayZhiIndex = dayBase % 12;
        const dayGan = this.tianGan[dayGanIndex];
        const dayZhi = this.diZhi[dayZhiIndex];

        const hourZhiIndex = Math.floor((hour + 1) / 2) % 12;
        const hourGanIndex = (dayGanIndex * 2 + hourZhiIndex) % 10;
        const hourGan = this.tianGan[hourGanIndex];
        const hourZhi = this.diZhi[hourZhiIndex];

        const allChars = [yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi];
        const wuxingCounts = { "金": 0, "木": 0, "水": 0, "火": 0, "土": 0 };

        allChars.forEach(c => {
            const wx = this.wuxingMap[c];
            if (wx) wuxingCounts[wx]++;
        });

        if (window.shrineAudio) {
            window.shrineAudio.playChimeSound();
        }

        window.shrineApp.showToast(`☯️ 成功推算【${name}】的生辰八字与祈测【${topic}】！`);

        this.renderBaziReport({
            name, topic, gender, year, month, day, hour,
            zodiac,
            pillars: {
                year: `${yearGan}${yearZhi}`,
                month: `${monthGan}${monthZhi}`,
                day: `${dayGan}${dayZhi}`,
                hour: `${hourGan}${hourZhi}`
            },
            wuxing: wuxingCounts,
            dayGan: dayGan
        });
    }

    generateTopicAdvice(topic, dayWx) {
        // 根据关键词匹配智能破局方案
        if (topic.includes("考研") || topic.includes("考试") || topic.includes("学业") || topic.includes("录取") || topic.includes("上岸")) {
            return `针对您祈测的【${topic}】：八字文昌星显现！日主【${dayWx}】近期学习专注力增强。建议制定阶段复习规划，多在清晨静心记忆。逢考必过，定能一举上岸！`;
        }
        if (topic.includes("跳槽") || topic.includes("升职") || topic.includes("事业") || topic.includes("工作") || topic.includes("岗位")) {
            return `针对您祈测的【${topic}】：官印相生，事业将逢贵人引荐。若考虑跳槽或晋升，宜在农历三月与八月主动出击，展现核心能力，必有突破！`;
        }
        if (topic.includes("结婚") || topic.includes("感情") || topic.includes("桃花") || topic.includes("姻缘") || topic.includes("脱单")) {
            return `针对您祈测的【${topic}】：红鸾星照耀，感情运势渐趋明朗。多参与线下社交活动或朋友聚会，真诚相待即可收获圆满正缘。`;
        }
        if (topic.includes("财") || topic.includes("钱") || topic.includes("创业") || topic.includes("投资") || topic.includes("涨薪")) {
            return `针对您祈测的【${topic}】：财库充沛，财气渐聚。求财宜稳中求进，主业稳健的同时可开拓副业。切忌投机冒进，稳扎稳打必有厚报。`;
        }
        return `针对您祈测的【${topic}】：阴阳消长，吉星高照。日主【${dayWx}】得天地地气庇佑，保持平稳心态，按部就班推进，所求之事定能顺心如意！`;
    }

    renderBaziReport(data) {
        if (!this.resultDisplay) return;

        const dayWx = this.wuxingMap[data.dayGan];
        const topicAdvice = this.generateTopicAdvice(data.topic, dayWx);

        const luckyColors = { "金": "金色 / 白色", "木": "青色 / 绿色", "水": "黑色 / 蓝色", "火": "红色 / 紫色", "土": "黄色 / 棕色" };
        const luckyNums = { "金": "4, 9", "木": "3, 8", "水": "1, 6", "火": "2, 7", "土": "5, 0" };

        this.resultDisplay.innerHTML = `
            <div class="bazi-report">
                <div class="bazi-profile-header">
                    <span class="bazi-name-title">☯️ ${data.name} · ${data.gender}</span>
                    <span>生肖：【${data.zodiac}】 | 日主五行：【${dayWx}】</span>
                </div>

                <!-- 祈测事项专属答疑高亮框 -->
                <div class="bazi-section-block topic-highlight">
                    <div class="bazi-section-title">🎯 祈测事项【${data.topic}】· 神明指引解惑</div>
                    <div class="bazi-section-text">${topicAdvice}</div>
                </div>

                <div class="bazi-pillars-grid">
                    <div class="pillar-card">
                        <div class="pillar-label">年柱 (根基)</div>
                        <div class="pillar-value">${data.pillars.year}</div>
                    </div>
                    <div class="pillar-card">
                        <div class="pillar-label">月柱 (事业)</div>
                        <div class="pillar-value">${data.pillars.month}</div>
                    </div>
                    <div class="pillar-card">
                        <div class="pillar-label">日柱 (本命)</div>
                        <div class="pillar-value">${data.pillars.day}</div>
                    </div>
                    <div class="pillar-card">
                        <div class="pillar-label">时柱 (归宿)</div>
                        <div class="pillar-value">${data.pillars.hour}</div>
                    </div>
                </div>

                <div class="wuxing-bar-container">
                    <div class="wuxing-title">五行能量分布 (金/木/水/火/土)</div>
                    <div class="wuxing-items">
                        ${Object.keys(data.wuxing).map(wx => {
                            const cnt = data.wuxing[wx];
                            const pct = Math.min(100, Math.max(10, cnt * 25));
                            const clsMap = { "金": "jin", "木": "mu", "水": "shui", "火": "huo", "土": "tu" };
                            return `
                                <div class="wuxing-item">
                                    <span class="wuxing-name">${wx} (${cnt})</span>
                                    <div class="wuxing-score-bar">
                                        <div class="wuxing-fill wuxing-${clsMap[wx]}" style="width: ${pct}%"></div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <div class="bazi-section-block">
                    <div class="bazi-section-title">💰 财运与吉利方位指南</div>
                    <div class="bazi-section-text">
                        🎯 <strong>幸运开运色彩</strong>：${luckyColors[dayWx]} | 🔢 <strong>幸运吉利数字</strong>：${luckyNums[dayWx]}
                    </div>
                </div>

                <!-- 电子灵符 -->
                <div class="talisman-card">
                    <div class="talisman-header">高山神社 · 秘传灵符</div>
                    <div class="talisman-body">避凶趋吉·百无禁忌</div>
                    <div style="font-size: 0.8rem; color: #f5d061;">敕令 · 庇佑 ${data.name}【${data.topic}】顺遂成功</div>
                </div>
            </div>
        `;
    }
}

window.baziCalculator = new BaziCalculator();
