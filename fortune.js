/* 高山神社 (Takayama Shrine) 35 灵签大藏与三位大师解签系统 
 * 三位大师自由选择，无强制人群标签：
 * 1. 慧明老法师 👴 -> 禅宗大德，慈悲观照、养生与安康
 * 2. 玄真道长 🧙‍♂️ -> 易理玄机，阴阳消长、事业与决策
 * 3. 赛博达摩 🤖 -> 赛博机锋，AI算力、考研与水逆退散
 */

class FortuneManager {
    constructor() {
        this.drawBtn = null;
        this.tubeElem = null;
        this.droppedStick = null;
        this.droppedStickText = null;
        this.resultBox = null;
        this.mastersContainer = null;

        this.currentFortune = null;
        this.selectedMaster = null;
        this.isLocked = false;

        this.fortunesDatabase = [
            {
                id: 1, rank: "大吉", title: "第一签 · 旭日东升",
                poem: "云开日出正照耀，万里晴空好风光。\n求得此签多顺意，前途无量百业昌。",
                decipher: {
                    huiming: "【禅宗观照】老衲看此签乃是身心康泰之大吉兆！气血顺畅，心无挂碍，您只管吃好睡好，随缘随喜，福寿自然绵长。",
                    xuanzhen: "【易理乾坤】贫道观尊驾正值人生的中流柱石！此签主事业与家运逢阳和之气，稳扎稳打必有斩获。投资理财宜守正道，财气源源不断。",
                    cyber: "【赛博破局】恭喜你！大吉！考研/面试直接一把过！最近水逆彻底退散，想做的事情放心胆大冲！拒绝画饼，薪资向上弹起！"
                }
            },
            {
                id: 2, rank: "上吉", title: "第二签 · 锦绣前程",
                poem: "春风送暖百花开，好运连连自天来。\n莫道途遥行不到，前途自有一道平。",
                decipher: {
                    huiming: "【禅宗观照】福气临门，清闲自在。若有远行或求学之事，大可放宽心，必能传来捷报。多吃素心安，心宽体胖正是大福分。",
                    xuanzhen: "【易理乾坤】步步为营，职场与家庭均有贵人相助。若遇中年转型或项目决策，宜顺水推舟，切忌急功近利，家和自然万事兴。",
                    cyber: "【赛博破局】Offer与好运正在赶来的路上！打工人不用再熬夜加班发疯了，接下这份上吉灵气，脱单脱贫两不误，心态直接拉满！"
                }
            },
            {
                id: 3, rank: "中吉", title: "第三签 · 竹影扫阶",
                poem: "竹影扫阶尘不动，月轮穿海浪无惊。\n随缘守分安安过，自有人间好时光。",
                decipher: {
                    huiming: "【禅宗观照】清心寡欲是长寿之本。不必跟他人攀比，含贻弄孙或独享清闲。心态放平静，高血压心慌自然退散。",
                    xuanzhen: "【易理乾坤】中吉求稳。此时宜守不宜冒进，管理好现金流，照顾好父母与子女的健康，平平淡淡才是真幸福。",
                    cyber: "【赛博破局】稳住别慌！虽然没有爆富，但也绝不踩坑！适合做个快乐的摸鱼艺术家，稳步提升技能，慢慢积蓄能量，等待厚积薄发。"
                }
            },
            {
                id: 4, rank: "中平", title: "第四签 · 寒蝉鸣柳",
                poem: "秋来寒蝉鸣树头，莫将心事上眉梢。\n暂耐一时风雨过，守得云开见月明。",
                decipher: {
                    huiming: "【禅宗观照】天气转凉需多注意保暖防寒，关节与呼吸道需细心呵护。郁结在心无益健康，多与老朋友唠唠嗑便可排解。",
                    xuanzhen: "【易理乾坤】暂时低谷在所难免，上有老下有小，压力偏大。此签劝您忍耐一时之气，职场上多听少说，待瓶颈期过去，自会迎刃而解。",
                    cyber: "【赛博破局】短暂的迷茫期而已！别怀疑自己，谁年轻时没被老板PUA过？保持情绪稳定，多喝水少熬夜，等这段水逆过去直接逆风翻盘！"
                }
            },
            {
                id: 5, rank: "大吉", title: "第五签 · 灵凤朝阳",
                poem: "灵凤翱翔上九天，声闻于野满人间。\n求名求利皆如意，百事亨通大吉昌。",
                decipher: {
                    huiming: "【禅宗观照】大喜！家中近期将有添丁、搬迁或大喜事！子孙孝顺，四世同堂之象，您老就等着享清福、纳大福吧！",
                    xuanzhen: "【易理乾坤】大吉大利！事业上将迎来关键晋升或大单落地，财运大旺！只需注意功成不居，对下属和亲人态度温和，可保运势长盛不衰。",
                    cyber: "【赛博破局】天选之人！这签简直为你量身定做！无论是考研考编、创业上岸还是偶遇天赐良缘，全都直接爆棚！今晚奖励自己一顿好的！"
                }
            },
            {
                id: 6, rank: "中吉", title: "第六签 · 枯木逢春",
                poem: "枯木逢春再吐芽，历经风霜现新花。\n从今摆脱坎坷路，快意人生笑哈哈。",
                decipher: {
                    huiming: "【禅宗观照】若之前有慢性病痛，此签意味着身体将逐渐康复，精神焕发。多出门走走，晒晒太阳，晚年生活多姿多彩。",
                    xuanzhen: "【易理乾坤】否极泰来！如果之前事业或家庭遇到了坎坷，从此刻起将彻底翻篇！旧难题得到解决，新商机开始萌芽，重振旗鼓再出发！",
                    cyber: "【赛博破局】翻盘时刻到了！前阵子被裁员/分手/断舍离的阴霾一扫而空，新出路和真正对的人马上出现，支棱起来！"
                }
            },
            {
                id: 7, rank: "末吉", title: "第七签 · 潜龙在渊",
                poem: "潜龙在渊尚未飞，韬光养晦等待时。\n莫急莫躁循规矩，蓄势待发始惊人。",
                decipher: {
                    huiming: "【禅宗观照】切记不可操心过度，儿孙的事情让他们自己去闯，您只需安享当下。顺应自然规律，早睡早起，身体自然健朗。",
                    xuanzhen: "【易理乾坤】此时不宜盲目扩大投资或频繁跳槽。贵在沉得住气，多花时间陪伴家人、提升自我核心竞争力，等待最佳时机再出击。",
                    cyber: "【赛博破局】别急着一求成名！现在是积累期的低调时刻，多学一门技术、多看两本书，等机会来的时候直接惊艳所有人！"
                }
            },
            {
                id: 8, rank: "大吉", title: "第八签 · 紫气东来",
                poem: "紫气东来万象新，鸿运当头百福臻。\n心想事成全不费，安居乐业庆太平。",
                decipher: {
                    huiming: "【禅宗观照】紫气祥云萦绕！身心安泰，子孙孝顺听话，家中充满欢声笑语，乃上天赐予的大福气，请放开心怀享受天伦之乐。",
                    xuanzhen: "【易理乾坤】鸿运当头！家庭和谐，夫妻恩爱，事业蒸蒸日上。适合做中长期产业规划，基业稳固，后劲十足！",
                    cyber: "【赛博破局】顶级欧皇附体！所求皆所愿，所行皆坦途！水逆全退，锦鲤本鲤就是你！赶紧许愿吧！"
                }
            },
            {
                id: 9, rank: "上吉", title: "第九签 · 松柏长青",
                poem: "霜雪过后见松青，经岁凌寒傲骨生。\n但得心中常清静，何愁前路不光明。",
                decipher: {
                    huiming: "【禅宗观照】松柏长青乃健康长寿之最高祝福！骨骼硬朗，心态豁达，多听佛音或轻音乐，安享晚福无忧无虑。",
                    xuanzhen: "【易理乾坤】立身如青松，顶天立地。职场上有坚韧不拔之志，家庭里是顶梁柱。只要原则明确，小人自然退散，事业如松柏常青。",
                    cyber: "【赛博破局】心态稳如老狗！不管外界怎么卷，你都有自己的节奏。坚持你的方向，时间会给你最好的答案，未来大有可为！"
                }
            },
            {
                id: 10, rank: "大吉", title: "第十签 · 金榜题名",
                poem: "十年寒窗苦作舟，一朝名扬动九州。\n桂花香里登高阁，锦绣华堂笑语声。",
                decipher: {
                    huiming: "【禅宗观照】家中必有大喜！考试、升学或考公将传来喜讯，光宗耀祖。含笑享受家庭的荣誉与温情吧。",
                    xuanzhen: "【易理乾坤】考证、职称评定或行业大奖落定之兆！多年积累沉淀终于获得业界认可，声誉与财源双丰收。",
                    cyber: "【赛博破局】考研/考编/上岸包过的超级欧皇签！试卷上的难题全都会，面试官对你青睐有加，直接拿下心仪单位！"
                }
            },
            {
                id: 11, rank: "中吉", title: "第十一签 · 顺风扬帆",
                poem: "顺水行舟顺风帆，轻车熟路好过关。\n不须费尽千般力，自然稳步跨高山。",
                decipher: {
                    huiming: "【禅宗观照】顺心顺意！近期出行顺遂，去医院体检指标平稳，居家生活省心省力，晚年如顺水行舟般惬意。",
                    xuanzhen: "【易理乾坤】顺风顺水！项目推进阻力全无，合作伙伴信任加倍。只需把控细节，收益自然稳妥进账。",
                    cyber: "【赛博破局】丝滑顺畅！最近做事情就像开挂一样顺，工作任务轻松交差，恋爱约会也是甜蜜指数爆表！"
                }
            },
            {
                id: 12, rank: "中平", title: "第十二签 · 守株待兔",
                poem: "莫将侥幸作必然，勤耕苦耘方见田。\n若想收获丰硕果，步步脚印积福田。",
                decipher: {
                    huiming: "【禅宗观照】切莫听信偏方或虚假理财推销，踏踏实实遵医嘱，饮食清淡，才是真正的养生大智慧。",
                    xuanzhen: "【易理乾坤】拒绝投机取巧。创业或投资要看清合同细节，脚踏实地干实业，现金流比虚幻的高收益更安全。",
                    cyber: "【赛博破局】别等彩票中奖啦！踏实写代码/写方案/复习课本，付出多少汗水就有多少回报，靠自己最靠谱！"
                }
            },
            {
                id: 13, rank: "上吉", title: "第十三签 · 月老红线",
                poem: "花前月下喜相逢，千里因缘一线牵。\n执手相看皆欢喜，琴瑟和鸣百年欢。",
                decipher: {
                    huiming: "【禅宗观照】家庭和睦，夫妻俩相濡以沫，恩爱如初。若单身小辈求亲，近期家里必办喜事，热热闹闹。",
                    xuanzhen: "【易理乾坤】夫妻感情加温！遇到困难多与伴侣沟通沟通，彼此理解支持，家庭温馨是事业最大的后盾。",
                    cyber: "【赛博破局】脱单神签！月老亲自为你牵红线！单身的马上遇到三观超合的灵魂伴侣，有对象的情感急速升温！"
                }
            },
            {
                id: 14, rank: "中吉", title: "第十四签 · 积善余庆",
                poem: "积善之家有余庆，行善积德福自来。\n慈悲喜舍无忧虑，子孙世代显光明。",
                decipher: {
                    huiming: "【禅宗观照】一生行善积德，如今福报延及子孙。身心无病无灾，邻里尊重，乃真德高望重之长者。",
                    xuanzhen: "【易理乾坤】经商做人讲求诚信重义。多做公益，对员工亲善，你的口碑将成为企业最稳固的护城河。",
                    cyber: "【赛博破局】日行一善，功德+1！最近多帮帮身边的人，人缘爆棚，贵人会在意想不到的时候推你一把！"
                }
            },
            {
                id: 15, rank: "大吉", title: "第十五签 · 财源广进",
                poem: "五路财神齐齐到，金银财宝聚宝盆。\n生意兴隆通四海，滚滚财源进家门。",
                decipher: {
                    huiming: "【禅宗观照】积蓄与后辈孝敬的红包满满当当！手头宽裕，无经济负担，乐享清福。",
                    xuanzhen: "【易理乾坤】发财大吉！财运最旺时刻，回款顺畅，理财投资收益翻倍，家庭财富阶跃！",
                    cyber: "【赛博破局】财运暴涨！加薪、奖金、副业全都搞起来！钱包鼓鼓，买喜欢的东西再也不用犹豫！"
                }
            },
            {
                id: 16, rank: "末吉", title: "第十六签 · 雾里看花",
                poem: "雾里看花隔一层，真真假假未分明。\n静心等待清风至，拨开云雾见天真。",
                decipher: {
                    huiming: "【禅宗观照】遇事别急着下结论，多听听身边智者的建议，谨防受骗。保持心情平静即可。",
                    xuanzhen: "【易理乾坤】市场迷雾重重，合同条款宜反复审查，不可盲目跟风投资新项目。观望比冲动更安全。",
                    cyber: "【赛博破局】吃瓜需理性，择业别盲从。不要被表面光鲜的公司吓到，保持清醒头脑，等真相浮出水面再做决定。"
                }
            },
            {
                id: 17, rank: "上吉", title: "第十七签 · 柳暗花明",
                poem: "山重水复疑无路，柳暗花明又一村。\n豁然开朗新天地，顺风顺水好安居。",
                decipher: {
                    huiming: "【禅宗观照】久病逢良医！若有宿疾，将遇到医术高明的大夫，调理有方，重获健康活力。",
                    xuanzhen: "【易理乾坤】僵局破解！困扰已久的项目或资金难题迎刃而解，找到全新盈利模式，绝处逢生！",
                    cyber: "【赛博破局】卡关的难题突然破局！代码Bug秒解决，被拒的方案重新被采纳，峰回路转爽到飞起！"
                }
            },
            {
                id: 18, rank: "中吉", title: "第十八签 · 步步高升",
                poem: "青云有路志当先，稳扎稳打登高峰。\n一步一步阶梯上，光宗耀祖显威风。",
                decipher: {
                    huiming: "【禅宗观照】子孙仕途或学业蒸蒸日上，见证门第兴旺，心情舒畅，延年益寿。",
                    xuanzhen: "【易理乾坤】职场平步青云！从管理层迈向决策层，权力与责任并存，稳中求胜，权威树立。",
                    cyber: "【赛博破局】职场升级打怪！从实习生到核心骨干，能力被领导看在眼里，升职加薪近在眼前！"
                }
            },
            {
                id: 19, rank: "中平", title: "第十九签 · 细水长流",
                poem: "细水长流源不断，涓涓小溪汇成江。\n不求一日千里快，只愿长久永安康。",
                decipher: {
                    huiming: "【禅宗观照】养生贵在坚持。每日坚持散步太极、规律作息，身体素质如细水长流般稳健。",
                    xuanzhen: "【易理乾坤】经营企业与家庭皆需持久战。稳定而健康的现金流比短期爆发力更重要，行稳致远。",
                    cyber: "【赛博破局】拒绝三分钟热度！每天坚持学习/健身一点点，复利效应会在几个月后惊艳所有人！"
                }
            },
            {
                id: 20, rank: "大吉", title: "第二十签 · 天赐良缘",
                poem: "天作之合结连理，凤求凰歌喜洋洋。\n百年好合同心结，满门吉庆福禄长。",
                decipher: {
                    huiming: "【禅宗观照】家中小辈婚姻圆满，将迎娶/嫁入贤良之辈，准备迎接热闹喜庆的全家福吧！",
                    xuanzhen: "【易理乾坤】家庭夫妻关系融洽，互为知己。家和万事兴，彼此扶持走出精彩人生。",
                    cyber: "【赛博破局】脱单绝杀！遇到了真正懂你、爱你、支持你所有奇思妙想的神仙伴侣，锁死祝福！"
                }
            },
            {
                id: 21, rank: "上吉", title: "第二十一签 · 鱼跃龙门",
                poem: "禹门浪暖跃鳞跃，一化为龙破苍穹。\n脱却凡胎显神彩，飞腾万里显神通。",
                decipher: {
                    huiming: "【禅宗观照】子孙跃龙门，考取功名或取得重大成就。名扬乡里，受人尊敬。",
                    xuanzhen: "【易理乾坤】跨越阶层的关键机遇！把握住这次大机遇，企业或个人事业将实现跨越式腾飞！",
                    cyber: "【赛博破局】逆袭成王！高考/考研/出国申请大获全胜，打破偏见，一战成名！"
                }
            },
            {
                id: 22, rank: "中吉", title: "第二十二签 · 桃李满天下",
                poem: "春风化雨润无声，桃李芬芳结满枝。\n功德无量施恩惠，声名远播受赞誉。",
                decipher: {
                    huiming: "【禅宗观照】桃李不言下自成蹊。一生育人或施恩无数，如今受众人爱戴尊敬。",
                    xuanzhen: "【易理乾坤】团队建设大成功！培养出的新人独当一面，行业口碑极佳，桃李满天下。",
                    cyber: "【赛博破局】社交圈大爆发！认识了超多大佬和志同道合的好友，大家都很喜欢你的真诚！"
                }
            },
            {
                id: 23, rank: "中平", title: "第二十三签 · 宁静致远",
                poem: "淡泊明志心宁静，宁静致远路通达。\n不为浮华迷乱眼，胸中自有大乾坤。",
                decipher: {
                    huiming: "【禅宗观照】心静自然凉，远离纷扰。在家看看书、养养花、喝喝茶，这才是真优雅神仙生活。",
                    xuanzhen: "【易理乾坤】面对诱惑保持定力。不贪图不属于自己的偏财，坚守底线，内心的宁静是最大财富。",
                    cyber: "【赛博破局】拒绝焦虑！别人卷他们的，你安安稳稳做自己。保持情绪稳定，专注内部成长。"
                }
            },
            {
                id: 24, rank: "大吉", title: "第二十四签 · 鸿雁传书",
                poem: "鸿雁高飞传佳音，喜气盈门事事新。\n远方亲友捎问候，吉星高照永安宁。",
                decipher: {
                    huiming: "【禅宗观照】远在外地的亲友将归家团聚，或带来安康的好消息，心里美滋滋。",
                    xuanzhen: "【易理乾坤】远方大客户传来合作签约喜讯！跨区域业务扩展大获成功，利润丰厚。",
                    cyber: "【赛博破局】收到梦寐以求的录用通知书/签证批准信！异地恋对象马上来找你，甜度超标！"
                }
            },
            {
                id: 25, rank: "末吉", title: "第二十五签 · 雨过天晴",
                poem: "雨过天晴见彩虹，历尽沧桑始显功。\n苦尽甘来无限好，昂首挺胸迎春风。",
                decipher: {
                    huiming: "【禅宗观照】小病小灾全过去，身体恢复元气。多吃有营养的食物，重获精气神。",
                    xuanzhen: "【易理乾坤】最艰难的资金周转期已过，业务重新重回正轨。风雨过后见彩虹，未来一片光明。",
                    cyber: "【赛博破局】最难熬的阶段结束了！吐完槽发完疯，现在是重振旗鼓的时候，未来全是好日子！"
                }
            },
            {
                id: 26, rank: "上吉", title: "第二十六签 · 独占鳌头",
                poem: "鳌头独占逞英豪，文武双全胜一筹。\n名登紫府人称赞，盖世功名永不休。",
                decipher: {
                    huiming: "【禅宗观照】参加比赛或展览大获第一，名扬一方，老当益壮。",
                    xuanzhen: "【易理乾坤】竞标胜出！在激烈的市场竞争中拔得头筹，拿下核心项目，奠定行业领头羊地位。",
                    cyber: "【赛博破局】竞赛第一名！无论是黑客马拉松、论文发表还是考研第一，你就是最耀眼的那个！"
                }
            },
            {
                id: 27, rank: "中吉", title: "第二十七签 · 广结善缘",
                poem: "出入平安遇贵人，广结善缘福自臻。\n四海之内皆兄弟，和谐融洽万家春。",
                decipher: {
                    huiming: "【禅宗观照】在社区人缘极佳，出门有街坊唠嗑，在家有亲友陪伴，温馨幸福。",
                    xuanzhen: "【易理乾坤】贵人运极强！关键时刻总有老铁、合作伙伴出面相助，度过难关，生意兴隆。",
                    cyber: "【赛博破局】贵人运爆棚！面试官、导师、职场前辈都愿意提携你，给你介绍绝佳资源！"
                }
            },
            {
                id: 28, rank: "中平", title: "第二十八签 · 塞翁失马",
                poem: "塞翁失马焉知福，祸福相依理自明。\n放开心怀看世事，失之东隅收桑榆。",
                decipher: {
                    huiming: "【禅宗观照】遇到不顺心的事别往心里去，坏事往往藏着好事，看开点身体更健康。",
                    xuanzhen: "【易理乾坤】短期的项目失利反而是避开大坑的转机。调整策略，后续收益将翻倍弥补！",
                    cyber: "【赛博破局】被拒绝未必是坏事！错过错的人是为了遇到真正对的人，失之东隅收桑榆！"
                }
            },
            {
                id: 29, rank: "大吉", title: "第二十九签 · 岁岁平安",
                poem: "岁岁平安福寿长，四季康泰喜洋洋。\n门迎百福千祥到，吉祥如意永无疆。",
                decipher: {
                    huiming: "【禅宗观照】平安是最大的福！无病无灾，身心舒畅，活到百岁不是梦！",
                    xuanzhen: "【易理乾坤】全家保平安！事业稳健增值，家庭无后顾之忧，生活幸福指数爆表。",
                    cyber: "【赛博破局】平安顺遂！没有狗血剧情，只有满满的安全感，生活工作一切都恰到好处！"
                }
            },
            {
                id: 30, rank: "上吉", title: "第三十签 · 鹏程万里",
                poem: "大鹏一日同风起，扶摇直上九万里。\n假令风歇时下来，犹能簸却沧溟水。",
                decipher: {
                    huiming: "【禅宗观照】亲友子孙有远大志向并远赴重洋或大城市建功立业，可以为之自豪。",
                    xuanzhen: "【易理乾坤】大鹏展翅！企业或事业迎来全球化扩展大机遇，胸怀宽广，成就非凡！",
                    cyber: "【赛博破局】梦想成真！拿到顶级名校录取或名企Offer，飞往更大的舞台实现人生抱负！"
                }
            },
            {
                id: 31, rank: "中吉", title: "第三十一签 · 喜气盈门",
                poem: "喜鹊登枝喳喳叫，喜气洋洋到我家。\n门庭若市多热闹，欢歌笑语迎朝霞。",
                decipher: {
                    huiming: "【禅宗观照】门庭若市，亲朋好友常来探望，家里热热闹闹，一点都不孤单。",
                    xuanzhen: "【易理乾坤】家中近期有大喜事（买房、迁居、结婚、生子），亲友齐聚祝贺，气氛融洽。",
                    cyber: "【赛博破局】好消息接二连三！朋友圈点赞无数，聚会成为全场焦点，快乐满满！"
                }
            },
            {
                id: 32, rank: "中平", title: "第三十二签 · 勤能补拙",
                poem: "勤能补拙是良训，一分辛苦一分才。\n踏踏实实向前走，水滴石穿展宏图。",
                decipher: {
                    huiming: "【禅宗观照】坚持锻炼，勤做脑力活动（如打麻将、看书），脑力身体保养极佳。",
                    xuanzhen: "【易理乾坤】靠实力说话。不图虚名，靠专业技能和踏实态度赢得客户长期信赖。",
                    cyber: "【赛博破局】天道酬勤！勤奋刷题、勤练技术，你的努力成果终将惊艳所有人！"
                }
            },
            {
                id: 33, rank: "大吉", title: "第三十三签 · 和气生财",
                poem: "和气生财财自旺，买卖公平客自多。\n千客万来生意好，满室生辉喜盈科。",
                decipher: {
                    huiming: "【禅宗观照】和气致祥。与邻里和睦、与后辈和蔼，全家人其乐融融，福气绵绵。",
                    xuanzhen: "【易理乾坤】和气生财！做生意态度亲切、诚信为本，客户源源不断，财源滚滚！",
                    cyber: "【赛博破局】人际关系绝了！性格温和受所有人喜欢，合作沟通效率极高，事半功倍！"
                }
            },
            {
                id: 34, rank: "上吉", title: "第三十四签 · 慈悲护佑",
                poem: "佛光普照施恩泽，菩萨保佑永平安。\n心中有善天地宽，吉星高照福无边。",
                decipher: {
                    huiming: "【禅宗观照】神佛护佑！一生信佛行善，得神灵庇佑，无灾无难，延寿长乐。",
                    xuanzhen: "【易理乾坤】有神灵与祖先庇佑！事业遇难成祥，家庭避开大灾大难，平平安安。",
                    cyber: "【赛博破局】运气爆棚！神仙保佑你逢考必过、水逆退散，遇到困难总能化险为夷！"
                }
            },
            {
                id: 35, rank: "大吉", title: "第三十五签 · 高山仰止",
                poem: "高山仰止景行行，德厚流光日月明。\n高山神社施灵签，千福万祥保平安。",
                decipher: {
                    huiming: "【禅宗观照】高山神社至尊大吉签！功德无量，身体康泰，长寿百岁，儿孙满堂！",
                    xuanzhen: "【易理乾坤】高山神社镇殿大吉！事业达到巅峰，名利双收，德高望重，造福一方！",
                    cyber: "【赛博破局】高山神社终极锦鲤签！天选大吉，万事皆成！祝你前程似锦，快乐无忧！"
                }
            }
        ];
    }

    init() {
        this.drawBtn = document.getElementById('drawFortuneBtn');
        this.tubeElem = document.getElementById('fortuneTube');
        this.droppedStick = document.getElementById('droppedStick');
        this.droppedStickText = document.getElementById('droppedStickText');
        this.resultBox = document.getElementById('fortuneResultBox');
        this.mastersContainer = document.getElementById('mastersSelector');

        if (this.drawBtn) {
            this.drawBtn.addEventListener('click', () => this.drawFortune());
        }

        if (this.mastersContainer) {
            this.mastersContainer.querySelectorAll('.master-card').forEach(card => {
                card.addEventListener('click', () => {
                    const masterKey = card.dataset.master;
                    this.selectMaster(masterKey);
                });
            });
        }
    }

    drawFortune() {
        if (window.shrineApp && !window.shrineApp.deductMerit(500)) {
            return;
        }

        this.selectedMaster = null;
        this.isLocked = false;
        this.resetMasterCards();

        if (this.tubeElem) this.tubeElem.classList.add('shaking');
        if (this.droppedStick) this.droppedStick.classList.remove('active');
        if (this.droppedStickText) this.droppedStickText.innerText = "摇签中...";

        if (window.shrineAudio) {
            window.shrineAudio.playShakeSound();
        }

        setTimeout(() => {
            if (this.tubeElem) this.tubeElem.classList.remove('shaking');

            const randomIndex = Math.floor(Math.random() * this.fortunesDatabase.length);
            this.currentFortune = this.fortunesDatabase[randomIndex];

            if (this.droppedStickText) this.droppedStickText.innerText = `${this.currentFortune.title} (${this.currentFortune.rank})`;
            if (this.droppedStick) this.droppedStick.classList.add('active');

            this.renderPoemOnly();

            if (window.shrineApp) {
                window.shrineApp.showToast(`🎋 恭喜求得：【${this.currentFortune.title}】！请选择大师解签。`);
            }
        }, 1200);
    }

    renderPoemOnly() {
        if (!this.resultBox || !this.currentFortune) return;

        this.resultBox.innerHTML = `
            <div class="fortune-result-detail">
                <div class="fortune-header-bar">
                    <span class="fortune-title">${this.currentFortune.title}</span>
                    <span class="fortune-rank">${this.currentFortune.rank}</span>
                </div>
                <div class="fortune-poem">
                    ${this.currentFortune.poem.replace(/\n/g, '<br>')}
                </div>
                <div class="master-prompt-box">
                    👈 请在上方选择您心仪的大师为您指点迷津：<br>
                    <strong>慧明法师</strong> (禅宗大德) · <strong>玄真道长</strong> (易理玄机) · <strong>赛博达摩</strong> (赛博机锋)
                </div>
            </div>
        `;
    }

    selectMaster(masterKey) {
        if (!this.currentFortune) {
            if (window.shrineApp) window.shrineApp.showToast('请先消耗500功德摇取灵签！');
            return;
        }

        if (this.isLocked) {
            if (window.shrineApp) window.shrineApp.showToast('单次求签仅限选择一位大师指点！如需其他大师解签请重新求签。');
            return;
        }

        this.selectedMaster = masterKey;
        this.isLocked = true;

        this.mastersContainer.querySelectorAll('.master-card').forEach(card => {
            if (card.dataset.master === masterKey) {
                card.classList.add('selected');
                card.classList.remove('locked');
            } else {
                card.classList.remove('selected');
                card.classList.add('locked');
            }
        });

        this.renderFullDecipher();
    }

    resetMasterCards() {
        if (!this.mastersContainer) return;
        this.mastersContainer.querySelectorAll('.master-card').forEach(card => {
            card.classList.remove('selected', 'locked');
        });
    }

    renderFullDecipher() {
        if (!this.resultBox || !this.currentFortune || !this.selectedMaster) return;

        const masterInfos = {
            huiming: { name: "慧明老法师 (禅宗大德)", avatar: "👴" },
            xuanzhen: { name: "玄真道长 (易理玄机)", avatar: "🧙‍♂️" },
            cyber: { name: "赛博达摩 (赛博机锋)", avatar: "🤖" }
        };

        const currentMaster = masterInfos[this.selectedMaster];
        const decipherText = this.currentFortune.decipher[this.selectedMaster];

        this.resultBox.innerHTML = `
            <div class="fortune-result-detail">
                <div class="fortune-header-bar">
                    <span class="fortune-title">${this.currentFortune.title}</span>
                    <span class="fortune-rank">${this.currentFortune.rank}</span>
                </div>
                <div class="fortune-poem">
                    ${this.currentFortune.poem.replace(/\n/g, '<br>')}
                </div>
                <div class="master-commentary-box">
                    <div class="commentary-avatar">${currentMaster.avatar}</div>
                    <div class="commentary-body">
                        <span class="commentary-author">${currentMaster.name} 破译签机：</span>
                        <p class="commentary-text">${decipherText}</p>
                    </div>
                </div>
            </div>
        `;
    }
}

window.fortuneManager = new FortuneManager();
