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

    generateTopicAdvice(topic, dayWx, seed = 0) {
        const getVariantIndex = (max = 3) => {
            return Math.abs(seed) % max;
        };

        const idx = getVariantIndex(3);

        // ===== 1. 学业 / 考试 =====
        if (topic.includes("考研") || topic.includes("考试") || topic.includes("学业") || topic.includes("录取") || topic.includes("上岸") || topic.includes("高考") || topic.includes("中考") || topic.includes("公考") || topic.includes("司法") || topic.includes("注册") || topic.includes("资格证") || topic.includes("证书")) {
            const list = [
                `针对您祈测的【${topic}】：命中文昌星当令，主利文事与学习！日主【${dayWx}】此刻心神安定、记忆力极佳，正是苦攻难关的黄金时期。建议以"晨读暮练"为节奏，寅时（03:00-05:00）前后精神最为敏锐，可重点攻克弱项科目。临考前三日务必保证睡眠，切勿开夜车消耗精气。神明庇佑，逢考必过，定能一举上岸，马到成功！`,
                `针对您祈测的【${topic}】：官印相生，文思泉涌！日主【${dayWx}】近期悟性大开，理解力显著提升。复习时宜抓主干框架，切忌拘泥于琐碎偏题。逢考试临场沉着冷静，先易后难，必能超常发挥。神明护持，名题金榜，前程似锦！`,
                `针对您祈测的【${topic}】：魁星高照，功名有望！日主【${dayWx}】有贵人潜移默化之助，遇疑难问题多向师长同学请教，往往点石成金。保持心态平稳，将压力转化为动力。神明保佑，所学皆有所用，一战成名！`
            ];
            return list[idx];
        }
        // ===== 2. 留学 / 移民 =====
        if (topic.includes("留学") || topic.includes("出国") || topic.includes("移民") || topic.includes("签证") || topic.includes("海外") || topic.includes("申请") || topic.includes("offer")) {
            const list = [
                `针对您祈测的【${topic}】：驿马星动，远行有利！日主【${dayWx}】今年与西方金气相合，海外之路顺畅。签证申请宜选黄道吉日提交，材料务必准备充分，切勿仓促。若有心仪院校或目的地，秋季申请季最为有利，贵人可能来自异国他乡。放眼天地，鲲鹏展翅，前途不可限量！`,
                `针对您祈测的【${topic}】：华盖逢空，游学四海！日主【${dayWx}】命带异乡求学之缘，出门在外将开阔眼界、博采众长。跨国申请宜早做准备，语言关放宽心态、多加练习。遇阻勿慌，多求助海外校友或专业机构，必能化险为夷，顺遂通达！`,
                `针对您祈测的【${topic}】：岁运逢冲，变动见吉！日主【${dayWx}】适宜向外拓展发展空间。异国生活虽有短期文化适应期，但能激发您潜藏的适应力与独立能力。神明引路，前途一片光明，喜结良缘于远方！`
            ];
            return list[idx];
        }
        // ===== 3. 升职 / 职场 =====
        if (topic.includes("升职") || topic.includes("晋升") || topic.includes("职场") || topic.includes("领导") || topic.includes("提拔") || topic.includes("评职称") || topic.includes("岗位")) {
            const list = [
                `针对您祈测的【${topic}】：官印格局显现，仕途将有贵人在背后暗中推助！日主【${dayWx}】近期处事沉稳、口碑渐佳，正是厚积薄发之时。切记：升职机会不会主动找上门，宜在会议和重要节点主动展现才干，让上级看见你的价值。农历三月与八月前后运势最旺，把握时机主动出击，必有突破晋升！`,
                `针对您祈测的【${topic}】：将星临门，掌控力提升！日主【${dayWx}】在团队中威望渐高，领导层正默默考察您的统筹与担当能力。面对难题敢于挺身而出，做实事讲效率，喜讯近期可至。神明加持，仕途步步高升！`,
                `针对您祈测的【${topic}】：青云直上，职场开泰！日主【${dayWx}】近期有接手核心项目或重任之象。虽工作量有所增加，但这正是晋升考核的前奏。稳扎稳打，善用团队力量，成果斐然，升职加薪指日可待！`
            ];
            return list[idx];
        }
        // ===== 4. 跳槽 / 换工作 =====
        if (topic.includes("跳槽") || topic.includes("换工作") || topic.includes("辞职") || topic.includes("求职") || topic.includes("找工作") || topic.includes("面试")) {
            const list = [
                `针对您祈测的【${topic}】：命格中驿马与官星同宫，变动之中反藏机遇！日主【${dayWx}】此阶段适合主动求变，打破固有舒适圈。建议在换工作前充分调研行业趋势，发挥自身核心优势，切勿因一时冲动而裸辞。面试前可向神明默念祈愿，贵人将在意想不到的场合出现，引领您进入更宽广的职业天地！`,
                `针对您祈测的【${topic}】：岁月逢革，吐故纳新！日主【${dayWx}】当前岗位潜力已趋饱和，换个赛道反而能激活新能量。更新简历、多与猎头或行业同行交流，新机会将展现更高薪酬与更大平台。神明指引，顺利过渡，新程大吉！`,
                `针对您祈测的【${topic}】：财官双美，转机临门！日主【${dayWx}】换工作的时机渐趋成熟，特别是来自旧同事或亲友介绍的机会含金量极高。保持自信，面试中展现扎实业务力，定能拿下心仪Offer！`
            ];
            return list[idx];
        }
        // ===== 5. 感情 / 恋爱 / 结婚 =====
        if (topic.includes("感情") || topic.includes("恋爱") || topic.includes("结婚") || topic.includes("婚姻") || topic.includes("姻缘") || topic.includes("桃花") || topic.includes("脱单") || topic.includes("追求") || topic.includes("表白") || topic.includes("相亲")) {
            const list = [
                `针对您祈测的【${topic}】：红鸾星入命，桃花运势正旺！日主【${dayWx}】近期散发出独特的亲和气场，令异性对您产生天然好感。若已有意中人，春季与秋季是表白与确定关系的最佳时机，真诚大方、不遮掩情感最能打动人心。若尚未遇见有缘人，多参与户外活动、朋友聚会，缘分往往在放松之时悄然降临。神明祝福，有情人终成眷属！`,
                `针对您祈测的【${topic}】：天喜星动，喜结良缘！日主【${dayWx}】感情世界即将迎来温暖曙光。已有伴侣者感情升温，宜携手规划长远未来；单身者易在工作中或兴趣圈遇到心意相通之对象。神明庇佑，相知相守，幸福美满！`,
                `针对您祈测的【${topic}】：琴瑟和鸣，佳偶天成！日主【${dayWx}】近期情感气场极其和谐。多一些包容与理解，少一些患得患失，彼此间的默契将大幅增长。勇敢表达爱意，定能收获真挚长久的幸福！`
            ];
            return list[idx];
        }
        // ===== 6. 分手 / 挽回 / 复合 =====
        if (topic.includes("分手") || topic.includes("挽回") || topic.includes("复合") || topic.includes("离婚") || topic.includes("出轨") || topic.includes("矛盾") || topic.includes("冷战")) {
            const list = [
                `针对您祈测的【${topic}】：情关煞星暂扰，但并非无解之局。日主【${dayWx}】情感细腻，易将委屈藏于内心。此刻最需要的不是追问与对峙，而是给彼此一段平静的空间。若缘分未尽，距离与时间会让对方重新看见你的珍贵；若强求只会适得其反。神明指引：放下执念，先修养自身，命中有缘之人自会回头，强求之缘不如放手寻真缘。`,
                `针对您祈测的【${topic}】：破镜重圆须看缘，沉淀自省是关键！日主【${dayWx}】切莫在情绪激动时做出决定。给感情留白，提升自我吸引力，若二人宿缘尚深，未来数月内必有破冰契机。顺其自然，神明保佑您心灵平和！`,
                `针对您祈测的【${topic}】：斩断旧执，迎新化煞！日主【${dayWx}】在情感过往中已付出良多。若对方迟迟无正面回应，强留不如潇洒转身。把爱留给懂你珍惜你的人，正缘正在前方等待。神明指引，拨云见日！`
            ];
            return list[idx];
        }
        // ===== 7. 财运 / 偏财 / 彩票 =====
        if (topic.includes("财运") || topic.includes("发财") || topic.includes("彩票") || topic.includes("偏财") || topic.includes("横财") || topic.includes("赌") || topic.includes("股票") || topic.includes("基金") || topic.includes("理财")) {
            const list = [
                `针对您祈测的【${topic}】：财星入库，正财稳健、偏财微动！日主【${dayWx}】近年财气渐旺，但须以"稳"字当头。正财（工薪、主业）是基石，切勿大量押注偏财之路（彩票、短线股票），否则得不偿失。若有投资计划，宜选择稳健型产品，分散布局，切忌重仓单一资产。今年下半年有一次较明显的财运窗口期，届时把握正道财机，必有斩获！`,
                `针对您祈测的【${topic}】：金玉满堂，财源广进！日主【${dayWx}】财运稳步爬升，主业收入有增无减，亦有小额副业收益进账。理财宜守不宜冒进，积少成多，方为长久聚财之道。神明保佑，金杯常满！`,
                `针对您祈测的【${topic}】：财帛宫逢吉星，进财顺畅！日主【${dayWx}】近期眼光独到，商业敏感度提升。处理账目与投资时保持冷静谨慎，防范小人借财。勤俭立业，财气蒸蒸日上！`
            ];
            return list[idx];
        }
        // ===== 8. 创业 / 开店 =====
        if (topic.includes("创业") || topic.includes("开店") || topic.includes("开公司") || topic.includes("做生意") || topic.includes("经营") || topic.includes("合伙") || topic.includes("融资")) {
            const list = [
                `针对您祈测的【${topic}】：命局中食神生财，颇具创业之相！日主【${dayWx}】具备将创意转化为实际收益的禀赋，但切记万事开头需谨慎。创业初期应控制成本，验证商业模式后再大规模投入。合伙事宜需白纸黑字约定清楚，以防日后产生纷争。若事业方向与民生、饮食、教育相关，受众广、口碑好，更易起步。神明庇佑，步步为营，必成一方基业！`,
                `针对您祈测的【${topic}】：龙跃于渊，商机涌现！日主【${dayWx}】创业气场强大，领导力与号召力凸显。初期宜聚焦核心竞争力，精简团队，提高资金使用效率。贵人相助，客源滚滚，生意兴隆通四海！`,
                `针对您祈测的【${topic}】：积厚成势，大展宏图！日主【${dayWx}】开店经营宜注重口碑与客户服务。遇到短期波动保持定力，优化产品与体验。神明保佑，日进斗金，事业长青！`
            ];
            return list[idx];
        }
        // ===== 9. 涨薪 / 薪资 =====
        if (topic.includes("涨薪") || topic.includes("加薪") || topic.includes("薪资") || topic.includes("薪水") || topic.includes("工资") || topic.includes("奖金") || topic.includes("绩效")) {
            const list = [
                `针对您祈测的【${topic}】：财星透干，劳有所得之兆！日主【${dayWx}】近期工作成效显著，已在上级心中留下良好印象。谈薪加薪最好选在年中绩效考核前后，提前整理个人贡献数据，用事实与数字说话。切忌贸然开口，等待合适时机、做好充分准备，此番谈薪胜算极大，喜讯可期！`,
                `针对您祈测的【${topic}】：勤劳致富，薪酬看涨！日主【${dayWx}】付出的汗水与努力即将转化为实在的金钱回报。主动承担重任或提升技能资质，将成为您谈薪的最佳筹码。神明加持，财富增值！`,
                `针对您祈测的【${topic}】：实至名归，收益翻番！日主【${dayWx}】在岗位上的不可替代性增加。公司奖励或绩效分红近期有望超预期。保持谦逊务实，好运连连！`
            ];
            return list[idx];
        }
        // ===== 10. 健康 / 疾病 =====
        if (topic.includes("健康") || topic.includes("生病") || topic.includes("疾病") || topic.includes("手术") || topic.includes("身体") || topic.includes("就医") || topic.includes("病情") || topic.includes("康复") || topic.includes("减肥")) {
            const list = [
                `针对您祈测的【${topic}】：命局疾厄宫需多加关注，但神明庇佑，无大碍之忧！日主【${dayWx}】近期宜注重作息规律，避免过度劳累与情绪压抑，这两者最易引发身体不适。若有旧疾，切勿讳疾医，遵医嘱按时复查为要。饮食上以温和清淡为主，减少辛辣刺激。多亲近自然、适量运动，调养气血，身体自然渐入佳境，神清气爽！`,
                `针对您祈测的【${topic}】：天医星临，身心康泰！日主【${dayWx}】身体免疫力回升。若此前有小恙缠身，近期遇良医良药，病情大有转机。坚持日常锻炼，心态乐观豁达，病气自然散去！`,
                `针对您祈测的【${topic}】：阴阳调和，元气充沛！日主【${dayWx}】注意劳逸结合，尤需调理脾胃与睡眠。早睡早起，少刷手机少熬夜，元气满满，体健神足！`
            ];
            return list[idx];
        }
        // ===== 11. 怀孕 / 生育 / 子嗣 =====
        if (topic.includes("怀孕") || topic.includes("备孕") || topic.includes("生孩子") || topic.includes("子嗣") || topic.includes("生育") || topic.includes("孕") || topic.includes("宝宝") || topic.includes("孩子")) {
            const list = [
                `针对您祈测的【${topic}】：子息星入命，喜得麟儿之兆渐显！日主【${dayWx}】此阶段身体元气充沛，是孕育新生命的良好时机。建议保持规律的作息，减少压力与焦虑——紧张情绪是阻碍孕育的无形屏障。夫妻双方同心合意，放宽心态，春暖花开之际尤为有利。神明在上，愿您早得贵子，家庭圆满，母子/母女均安！`,
                `针对您祈测的【${topic}】：麒麟送子，福佑华堂！日主【${dayWx}】备孕宜顺应自然，调养好母体与父体之气血。多摄入营养食物，放松心情。神明保佑，新生命将如期而至！`,
                `针对您祈测的【${topic}】：弄璋弄瓦，喜气盈门！日主【${dayWx}】家庭子嗣运势昌盛。准父母心态平和，定期做好产检。喜讯指日可待，全家共享天伦之乐！`
            ];
            return list[idx];
        }
        // ===== 12. 房产 / 买房 / 搬家 =====
        if (topic.includes("买房") || topic.includes("房子") || topic.includes("房产") || topic.includes("搬家") || topic.includes("租房") || topic.includes("装修") || topic.includes("置业") || topic.includes("购房")) {
            const list = [
                `针对您祈测的【${topic}】：田宅宫星象稳健，置业安居之机已至！日主【${dayWx}】近期对家宅之事有强烈的安定渴望，是做出置业决策的好时机。买房需重点考察地段与楼层风水，东南方位的房产对您尤为有利。搬家入宅宜选农历逢六、逢八的日子，喜气倍增。切忌因价格小幅波动而反复犹豫，错失良机，下定决心，吉宅自然归属有缘之人！`,
                `针对您祈测的【${topic}】：安居乐业，宅运亨通！日主【${dayWx}】看房置业机缘巧合，易遇到性价比极高的称心好房。购房合同细致核对，搬迁新居百无禁忌。神明庇佑，家宅平安顺遂！`,
                `针对您祈测的【${topic}】：焕然一新，旺财旺人！日主【${dayWx}】家居装修或搬家宜注重采光与通风。新环境中气场更新，带动整体财运与事业运齐飞！`
            ];
            return list[idx];
        }
        // ===== 13. 出行 / 旅游 / 平安 =====
        if (topic.includes("出行") || topic.includes("旅游") || topic.includes("旅行") || topic.includes("平安") || topic.includes("交通") || topic.includes("出差") || topic.includes("驾车") || topic.includes("安全")) {
            const list = [
                `针对您祈测的【${topic}】：天乙贵人护航，出行平安顺遂！日主【${dayWx}】今年驿马星动，行程颇多，所幸吉星护体，远行无忧。出发前检查好行李与证件，行驶途中保持专注、遵守交规，不开疲劳驾驶。若前往陌生之地，提前规划路线，远离偏僻危险区域。神明庇佑，一路顺风，事成功圆，平安归来！`,
                `针对您祈测的【${topic}】：游历名山，福气满满！日主【${dayWx}】旅途中易结识志同道合的好友，领略大自然风光的同时大开心胸。保持警惕防范财物遗失，一路欢歌笑语！`,
                `针对您祈测的【${topic}】：顺风顺水，吉星高照！日主【${dayWx}】出差或外出办事效率极高，所求之事顺利达成。归途平安，满载而归！`
            ];
            return list[idx];
        }
        // ===== 14. 官司 / 法律 / 纠纷 =====
        if (topic.includes("官司") || topic.includes("法律") || topic.includes("纠纷") || topic.includes("诉讼") || topic.includes("仲裁") || topic.includes("合同") || topic.includes("维权") || topic.includes("债务")) {
            const list = [
                `针对您祈测的【${topic}】：命局官杀之气宜疏不宜堵，应对得法则逢凶化吉！日主【${dayWx}】在是非纷扰面前需保持头脑冷静，切忌冲动行事激化矛盾。若涉及法律事务，务必寻求专业律师的帮助，以证据和程序说话，胜诉机会比您想象的要大。调解优先，诉讼次之，私下和解更省时省力。相信正道自在人心，神明佑护，是非自明，公道终有还您之时！`,
                `针对您祈测的【${topic}】：正气存内，邪不可干！日主【${dayWx}】保留完整证据链条，依法维权有理有据。理性沟通，避免无谓内耗，法律将维护您的合法权益！`,
                `针对您祈测的【${topic}】：化干戈为玉帛，吉人自有天相！日主【${dayWx}】遭遇纠纷宜退一步海阔天空。寻求权威第三方调解，双方妥协让步，事情圆满化解！`
            ];
            return list[idx];
        }
        // ===== 15. 家庭 / 亲子 / 家人 =====
        if (topic.includes("家庭") || topic.includes("家人") || topic.includes("父母") || topic.includes("亲子") || topic.includes("孝顺") || topic.includes("兄弟") || topic.includes("姐妹") || topic.includes("婆媳") || topic.includes("家和")) {
            const list = [
                `针对您祈测的【${topic}】：六亲宫星象趋吉，家和万事兴之兆！日主【${dayWx}】本性重情重义，对家人牵挂深重。若近期家庭关系有小摩擦，关键在于"倾听"二字——很多矛盾源于沟通不足而非真正的隔阂。建议多抽时间陪伴家人，共聚饭桌胜于千言万语。对于长辈，孝心常在，健康体检是最好的礼物。家庭温暖是您最大的福气，珍惜眼前人！`,
                `针对您祈测的【${topic}】：慈孝相亲，和气生财！日主【${dayWx}】与家人关系日益融洽。多一些体谅少一些责备，家庭氛围温馨和谐，给您带来无尽后盾力量！`,
                `针对您祈测的【${topic}】：福禄齐至，阖家欢愉！日主【${dayWx}】家中有喜事临门（如长辈寿辰、后辈佳绩）。全家同心协力，日子红红火火！`
            ];
            return list[idx];
        }
        // ===== 16. 名气 / 人气 / 网红 =====
        if (topic.includes("名气") || topic.includes("出名") || topic.includes("人气") || topic.includes("网红") || topic.includes("粉丝") || topic.includes("直播") || topic.includes("博主") || topic.includes("流量") || topic.includes("涨粉")) {
            const list = [
                `针对您祈测的【${topic}】：食神伤官旺盛，创作表达运势极佳！日主【${dayWx}】天生具备吸引眼球的独特气质，只要敢于展现真实的自我，必能引发共鸣、聚拢人气。初期不必追求爆款，持续输出真诚优质的内容，口碑与粉丝自然滚雪球般增长。与其模仿他人风格，不如深耕自己最擅长的垂直领域，差异化才是破局之道。神明庇佑，时机成熟，一炮而红不是梦！`,
                `针对您祈测的【${topic}】：声名远播，星光熠熠！日主【${dayWx}】近期个人魅力指数爆表，在社交平台或行业圈内圈粉无数。保持初心，抵制诱惑，未来可期！`,
                `针对您祈测的【${topic}】：厚积薄发，名利双收！日主【${dayWx}】的作品或观点获得广泛认可。善用粉丝影响力传递正能量，名声大噪！`
            ];
            return list[idx];
        }
        // ===== 17. 搬迁 / 异地 / 城市选择 =====
        if (topic.includes("搬迁") || topic.includes("异地") || topic.includes("换城市") || topic.includes("去哪") || topic.includes("定居") || topic.includes("落户") || topic.includes("迁移")) {
            const list = [
                `针对您祈测的【${topic}】：命中驿马逢贵，异动迁徙乃吉兆而非凶兆！日主【${dayWx}】此阶段守旧不如开拓，新环境将带来新机遇。若考虑换城市，偏南方或沿海地区的气场与您八字相合，发展较为顺遂。落户定居需考察当地的就业机会与生活成本，切忌冲动决定。只要心中有方向、脚下有行动，落地生根、开枝散叶，新天地大有可为！`,
                `针对您祈测的【${topic}】：海阔凭鱼跃，天高任鸟飞！日主【${dayWx}】异地发展天地宽广。勇敢迈出第一步，新城市的资源与机遇将超乎预期！`,
                `针对您祈测的【${topic}】：择木而栖，扎根兴业！日主【${dayWx}】在新城市迅速融入，结识新贵人与新朋友。生活蒸蒸日上！`
            ];
            return list[idx];
        }
        // ===== 18. 通用兜底 =====
        const list = [
            `针对您祈测的【${topic}】：阴阳消长，天地轮转，吉星正悄然向您靠拢！日主【${dayWx}】禀赋深厚，近期气场稳定向上，只要心志坚定、行动踏实，所求之事皆在神明护佑之列。建议：凡事提前谋划，遇阻不慌乱，得势不骄傲，保持一颗赤诚平和之心，是引来好运的根本之道。高山神社神明庇佑您，万事顺遂，心想事成，岁岁平安！`,
            `针对您祈测的【${topic}】：天道酬勤，岁月静好！日主【${dayWx}】近期运势平和顺达。保持积极乐观心态，脚踏实地前行，所愿皆能如期实现！`,
            `针对您祈测的【${topic}】：福星高照，万事大吉！日主【${dayWx}】得天地万物灵气加持，困难迎刃而解。心向阳光，美好不期而遇！`
        ];
        return list[idx];
    }

    renderBaziReport(data) {
        if (!this.resultDisplay) return;

        const dayWx = this.wuxingMap[data.dayGan];
        const seed = data.year * 10000 + data.month * 100 + data.day + data.hour;
        const topicAdvice = this.generateTopicAdvice(data.topic, dayWx, seed); / 子嗣 =====
        if (topic.includes("怀孕") || topic.includes("备孕") || topic.includes("生孩子") || topic.includes("子嗣") || topic.includes("生育") || topic.includes("孕") || topic.includes("宝宝") || topic.includes("孩子")) {
            return `针对您祈测的【${topic}】：子息星入命，喜得麟儿之兆渐显！日主【${dayWx}】此阶段身体元气充沛，是孕育新生命的良好时机。建议保持规律的作息，减少压力与焦虑——紧张情绪是阻碍孕育的无形屏障。夫妻双方同心合意，放宽心态，春暖花开之际尤为有利。神明在上，愿您早得贵子，家庭圆满，母子/母女均安！`;
        }
        // ===== 12. 房产 / 买房 / 搬家 =====
        if (topic.includes("买房") || topic.includes("房子") || topic.includes("房产") || topic.includes("搬家") || topic.includes("租房") || topic.includes("装修") || topic.includes("置业") || topic.includes("购房")) {
            return `针对您祈测的【${topic}】：田宅宫星象稳健，置业安居之机已至！日主【${dayWx}】近期对家宅之事有强烈的安定渴望，是做出置业决策的好时机。买房需重点考察地段与楼层风水，东南方位的房产对您尤为有利。搬家入宅宜选农历逢六、逢八的日子，喜气倍增。切忌因价格小幅波动而反复犹豫，错失良机，下定决心，吉宅自然归属有缘之人！`;
        }
        // ===== 13. 出行 / 旅游 / 平安 =====
        if (topic.includes("出行") || topic.includes("旅游") || topic.includes("旅行") || topic.includes("平安") || topic.includes("交通") || topic.includes("出差") || topic.includes("驾车") || topic.includes("安全")) {
            return `针对您祈测的【${topic}】：天乙贵人护航，出行平安顺遂！日主【${dayWx}】今年驿马星动，行程颇多，所幸吉星护体，远行无忧。出发前检查好行李与证件，行驶途中保持专注、遵守交规，不开疲劳驾驶。若前往陌生之地，提前规划路线，远离偏僻危险区域。神明庇佑，一路顺风，事成功圆，平安归来！`;
        }
        // ===== 14. 官司 / 法律 / 纠纷 =====
        if (topic.includes("官司") || topic.includes("法律") || topic.includes("纠纷") || topic.includes("诉讼") || topic.includes("仲裁") || topic.includes("合同") || topic.includes("维权") || topic.includes("债务")) {
            return `针对您祈测的【${topic}】：命局官杀之气宜疏不宜堵，应对得法则逢凶化吉！日主【${dayWx}】在是非纷扰面前需保持头脑冷静，切忌冲动行事激化矛盾。若涉及法律事务，务必寻求专业律师的帮助，以证据和程序说话，胜诉机会比您想象的要大。调解优先，诉讼次之，私下和解更省时省力。相信正道自在人心，神明佑护，是非自明，公道终有还您之时！`;
        }
        // ===== 15. 家庭 / 亲子 / 家人 =====
        if (topic.includes("家庭") || topic.includes("家人") || topic.includes("父母") || topic.includes("亲子") || topic.includes("孝顺") || topic.includes("兄弟") || topic.includes("姐妹") || topic.includes("婆媳") || topic.includes("家和")) {
            return `针对您祈测的【${topic}】：六亲宫星象趋吉，家和万事兴之兆！日主【${dayWx}】本性重情重义，对家人牵挂深重。若近期家庭关系有小摩擦，关键在于"倾听"二字——很多矛盾源于沟通不足而非真正的隔阂。建议多抽时间陪伴家人，共聚饭桌胜于千言万语。对于长辈，孝心常在，健康体检是最好的礼物。家庭温暖是您最大的福气，珍惜眼前人！`;
        }
        // ===== 16. 名气 / 人气 / 网红 =====
        if (topic.includes("名气") || topic.includes("出名") || topic.includes("人气") || topic.includes("网红") || topic.includes("粉丝") || topic.includes("直播") || topic.includes("博主") || topic.includes("流量") || topic.includes("涨粉")) {
            return `针对您祈测的【${topic}】：食神伤官旺盛，创作表达运势极佳！日主【${dayWx}】天生具备吸引眼球的独特气质，只要敢于展现真实的自我，必能引发共鸣、聚拢人气。初期不必追求爆款，持续输出真诚优质的内容，口碑与粉丝自然滚雪球般增长。与其模仿他人风格，不如深耕自己最擅长的垂直领域，差异化才是破局之道。神明庇佑，时机成熟，一炮而红不是梦！`;
        }
        // ===== 17. 搬迁 / 异地 / 城市选择 =====
        if (topic.includes("搬迁") || topic.includes("异地") || topic.includes("换城市") || topic.includes("去哪") || topic.includes("定居") || topic.includes("落户") || topic.includes("迁移")) {
            return `针对您祈测的【${topic}】：命中驿马逢贵，异动迁徙乃吉兆而非凶兆！日主【${dayWx}】此阶段守旧不如开拓，新环境将带来新机遇。若考虑换城市，偏南方或沿海地区的气场与您八字相合，发展较为顺遂。落户定居需考察当地的就业机会与生活成本，切忌冲动决定。只要心中有方向、脚下有行动，落地生根、开枝散叶，新天地大有可为！`;
        }
        // ===== 18. 通用兜底 =====
        return `针对您祈测的【${topic}】：阴阳消长，天地轮转，吉星正悄然向您靠拢！日主【${dayWx}】禀赋深厚，近期气场稳定向上，只要心志坚定、行动踏实，所求之事皆在神明护佑之列。建议：凡事提前谋划，遇阻不慌乱，得势不骄傲，保持一颗赤诚平和之心，是引来好运的根本之道。高山神社神明庇佑您，万事顺遂，心想事成，岁岁平安！`;
    }

    renderBaziReport(data) {
        if (!this.resultDisplay) return;

        const seed = (data.year || 1998) * 10000 + (data.month || 6) * 100 + (data.day || 15) + (data.hour || 12);
        const topicAdvice = this.generateTopicAdvice(data.topic, dayWx, seed);

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
