// ── STEP 1: Occasion ──
const occasionStep = {
    id: 'occasion',
    name: 'Choose Your Occasion',
    nameCn: '选择您的场合',
    type: 'card-grid',
    description: 'Every piece tells a story. What\'s yours?',
    descriptionCn: '每件作品都有故事。您的故事是什么？',
    options: [
        { id: 'first-paycheck', label: 'First Paycheck', labelCn: '第一份薪水', value: 'first-paycheck', upcharge: 0, emoji: '💰', description: 'Treat yourself. You earned it.', descriptionCn: '犒赏自己，你值得。' },
        { id: 'proposal', label: 'Proposal / Engagement', labelCn: '求婚/订婚', value: 'proposal', upcharge: 0, emoji: '💍', description: 'The beginning of forever.', descriptionCn: '永恒的开始。' },
        { id: 'wedding', label: 'Wedding', labelCn: '婚礼', value: 'wedding', upcharge: 0, emoji: '👰', description: 'For the day everything changes.', descriptionCn: '为了一切改变的那天。' },
        { id: 'birthday', label: 'Birthday', labelCn: '生日', value: 'birthday', upcharge: 0, emoji: '🎂', description: 'Because every year deserves a celebration.', descriptionCn: '因为每一年都值得庆祝。' },
        { id: 'graduation', label: 'Graduation', labelCn: '毕业', value: 'graduation', upcharge: 0, emoji: '🎓', description: 'The next chapter starts here.', descriptionCn: '下一章从这里开始。' },
        { id: 'anniversary', label: 'Anniversary', labelCn: '周年纪念', value: 'anniversary', upcharge: 0, emoji: '🥂', description: 'For the love that keeps growing.', descriptionCn: '为不断成长的爱。' },
        { id: 'new-baby', label: 'New Baby', labelCn: '新生宝宝', value: 'new-baby', upcharge: 0, emoji: '👶', description: 'Welcome to the world, little one.', descriptionCn: '欢迎来到这个世界，小宝贝。' },
        { id: 'new-chapter', label: 'Heartbreak / New Chapter', labelCn: '新篇章', value: 'new-chapter', upcharge: 0, emoji: '🦋', description: 'This one\'s for you.', descriptionCn: '这件是为你而做。' },
        { id: 'self-gift', label: 'Self-Gift', labelCn: '自我奖励', value: 'self-gift', upcharge: 0, emoji: '✨', description: 'No reason needed.', descriptionCn: '无需理由。' },
        { id: 'friendship', label: 'Friendship / Besties', labelCn: '友谊/闺蜜', value: 'friendship', upcharge: 0, emoji: '👯', description: 'Matching pieces, unbreakable bond.', descriptionCn: '配对作品，牢不可破的纽带。' },
        { id: 'just-because', label: 'Just Because', labelCn: '随心而感', value: 'just-because', upcharge: 0, emoji: '🌹', description: 'The best gifts need no occasion.', descriptionCn: '最好的礼物不需要理由。' },
        { id: 'eid', label: 'Eid / Festive Gift', labelCn: '开斋节/节日礼物', value: 'eid', upcharge: 0, emoji: '🌙', description: 'For celebrations that shine.', descriptionCn: '为闪耀的庆典。' },
        { id: 'mothers-day', label: 'Mother\'s Day', labelCn: '母亲节', value: 'mothers-day', upcharge: 0, emoji: '👩', description: 'For the woman who holds everything together.', descriptionCn: '献给将一切凝聚在一起的女人。' },
        { id: 'valentines', label: 'Valentine\'s Day', labelCn: '情人节', value: 'valentines', upcharge: 0, emoji: '💝', description: 'Say it without words.', descriptionCn: '无需言语。' },
        { id: 'work-milestone', label: 'Work Milestone / Promotion', labelCn: '工作里程碑/晋升', value: 'work-milestone', upcharge: 0, emoji: '🏆', description: 'Wear your success.', descriptionCn: '佩戴你的成功。' },
        { id: 'push-present', label: 'Push Present', labelCn: '生产礼物', value: 'push-present', upcharge: 0, emoji: '🤰', description: 'Because bringing life into the world deserves diamonds.', descriptionCn: '因为带来新生命值得钻石。' },
        { id: 'new-home', label: 'New Home', labelCn: '新家', value: 'new-home', upcharge: 0, emoji: '🏠', description: 'A fresh start, beautifully marked.', descriptionCn: '崭新的开始，美丽的印记。' },
        { id: 'farewell', label: 'Farewell / Moving Away', labelCn: '告别/搬离', value: 'farewell', upcharge: 0, emoji: '✈️', description: 'Carry a piece of home, always.', descriptionCn: '永远带着家的一片记忆。' },
    ],
};
// ── STEP 2: Category ──
const categoryStep = {
    id: 'category',
    name: 'Choose Your Jewellery Category',
    nameCn: '选择您的珠宝类别',
    type: 'card-grid',
    description: 'What would you like to create?',
    descriptionCn: '您想创造什么？',
    options: [
        { id: 'ring', label: 'Ring', labelCn: '戒指', value: 'ring', upcharge: 0, emoji: '💍', description: 'Worn every day or saved for the moment.', descriptionCn: '每天佩戴或为特别时刻珍藏。' },
        { id: 'stud-earring', label: 'Stud Earring', labelCn: '耳钉', value: 'stud-earring', upcharge: 0, emoji: '✦', description: 'The quiet classic. Always right.', descriptionCn: '低调经典，永远合适。' },
        { id: 'dangling-earring', label: 'Dangling Earring', labelCn: '耳坠', value: 'dangling-earring', upcharge: 0, emoji: '✧', description: 'Movement, sparkle, drama.', descriptionCn: '灵动、闪耀、戏剧感。' },
        { id: 'pendant', label: 'Pendant', labelCn: '吊坠', value: 'pendant', upcharge: 0, emoji: '◇', description: 'Close to the heart.', descriptionCn: '贴近心脏。' },
        { id: 'necklace', label: 'Necklace', labelCn: '项链', value: 'necklace', upcharge: 0, emoji: '📿', description: 'Layered or solo, it frames everything.', descriptionCn: '叠戴或单戴，框住一切。' },
        { id: 'bracelet', label: 'Bracelet', labelCn: '手链', value: 'bracelet', upcharge: 0, emoji: '⛓', description: 'On the wrist, always in sight.', descriptionCn: '在手腕上，时刻可见。' },
        { id: 'bangle', label: 'Bangle', labelCn: '手镯', value: 'bangle', upcharge: 0, emoji: '⭕', description: 'Stack them, or let it stand alone.', descriptionCn: '叠戴或独自闪耀。' },
        { id: 'brooch', label: 'Brooch', labelCn: '胸针', value: 'brooch', upcharge: 0, emoji: '🌸', description: 'Wear it your way — lapel, scarf, collar.', descriptionCn: '随心佩戴——翻领、围巾、衣领。' },
        { id: 'anklet', label: 'Anklet', labelCn: '脚链', value: 'anklet', upcharge: 0, emoji: '🦶', description: 'Subtle, playful, unexpected.', descriptionCn: '精致、俏皮、出人意料。' },
    ],
};
// ── STEP 3: Interchangeability (WOYKE Signature Feature) ──
const interchangeabilityStep = {
    id: 'interchangeability',
    name: 'Interchangeability',
    nameCn: '可转换设计',
    type: 'card-grid',
    description: 'One piece. More than one life.',
    descriptionCn: '一件珠宝，不止一种生命。',
    options: [
        { id: 'none', label: 'None', labelCn: '无', value: 'none', upcharge: 0, description: 'This piece is exactly what it is.', descriptionCn: '这件作品就是它本身。' },
        { id: 'stud-dangling', label: 'Stud ↔ Dangling Earring', labelCn: '耳钉 ↔ 耳坠', value: 'stud-dangling', upcharge: 0, description: 'Detach the drop for a clean stud; reattach for evening.', descriptionCn: '拆下耳坠变成耳钉；重新安装即可变回耳坠。' },
        { id: 'ring-pendant', label: 'Ring ↔ Pendant', labelCn: '戒指 ↔ 吊坠', value: 'ring-pendant', upcharge: 0, description: 'Slip the stone setting off the band onto a chain.', descriptionCn: '将宝石设置从戒指上取下，挂到链上。' },
        { id: 'ring-brooch', label: 'Ring ↔ Brooch', labelCn: '戒指 ↔ 胸针', value: 'ring-brooch', upcharge: 0, description: 'A statement ring that pins to a jacket lapel or scarf.', descriptionCn: '一枚可以别在翻领或围巾上的戒指。' },
        { id: 'pendant-brooch', label: 'Pendant ↔ Brooch', labelCn: '吊坠 ↔ 胸针', value: 'pendant-brooch', upcharge: 0, description: 'Clips to fabric or hangs on a chain — your choice each morning.', descriptionCn: '夹在衣物上或挂在链上——每天由你选择。' },
        { id: 'bracelet-necklace', label: 'Bracelet ↔ Necklace', labelCn: '手链 ↔ 项链', value: 'bracelet-necklace', upcharge: 0, description: 'A long bracelet that extends and clasps as a choker or delicate necklace.', descriptionCn: '一条长手链，可延伸扣成项圈或精致项链。' },
    ],
};
// ── STEP 4: Main Stone ──
const stoneStep = {
    id: 'stone',
    name: 'Main Stone',
    nameCn: '主石',
    type: 'card-grid',
    description: 'The heart of your piece.',
    descriptionCn: '您作品的核心。',
    options: [
        { id: 'none', label: 'None', labelCn: '无宝石', value: 'none', upcharge: 0, emoji: '⬜', description: 'Metal-only design — sculptural, minimalist.', descriptionCn: '纯金属设计——雕塑感，极简风。' },
        { id: 'diamond', label: 'Diamond', labelCn: '钻石', value: 'diamond', upcharge: 0, emoji: '💎', color: '#F0F0F0', description: 'Classic white. Timeless.', descriptionCn: '经典白色，永恒不朽。' },
        { id: 'blue-diamond', label: 'Blue Diamond', labelCn: '蓝钻', value: 'blue-diamond', upcharge: 0, emoji: '💎', color: '#A8D8EA', description: 'Rare, cool, quietly electric.', descriptionCn: '稀有、冷静、低调电感。' },
        { id: 'pink-diamond', label: 'Pink Diamond', labelCn: '粉钻', value: 'pink-diamond', upcharge: 0, emoji: '💎', color: '#F5C6D0', description: 'Soft romance with serious sparkle.', descriptionCn: '柔美浪漫，闪耀非凡。' },
        { id: 'ruby', label: 'Ruby', labelCn: '红宝石', value: 'ruby', upcharge: 0, emoji: '❤️', color: '#9B111E', description: 'Deep red passion. Bold and ancient.', descriptionCn: '深红热情，大胆古老。' },
        { id: 'blue-sapphire', label: 'Blue Sapphire', labelCn: '蓝宝石', value: 'blue-sapphire', upcharge: 0, emoji: '💙', color: '#0F52BA', description: 'Royal, deep, enduring.', descriptionCn: '皇室、深邃、持久。' },
        { id: 'pink-sapphire', label: 'Pink Sapphire', labelCn: '粉色蓝宝石', value: 'pink-sapphire', upcharge: 0, emoji: '💗', color: '#E8839B', description: 'Playful blush with a modern edge.', descriptionCn: '俏皮腮红，现代感。' },
        { id: 'emerald', label: 'Emerald', labelCn: '祖母绿', value: 'emerald', upcharge: 0, emoji: '💚', color: '#046307', description: 'Rich green. Dramatic and lush.', descriptionCn: '浓郁绿色，戏剧与奢华。' },
    ],
};
// ── STEP 4a: Stone Shape ──
const stoneShapeStep = {
    id: 'stone-shape',
    name: 'Stone Shape',
    nameCn: '宝石形状',
    type: 'card-grid',
    description: 'Choose your cut.',
    descriptionCn: '选择您的切割方式。',
    condition: (selections) => selections['stone'] !== 'none',
    options: [
        { id: 'round', label: 'Round Brilliant', labelCn: '圆形明亮式', value: 'round', upcharge: 0, description: 'Maximum brilliance. The most popular cut.', descriptionCn: '最大亮度，最受欢迎的切割。' },
        { id: 'princess', label: 'Princess', labelCn: '公主方形', value: 'princess', upcharge: 0, description: 'Square, sharp corners. Modern and bold.', descriptionCn: '方形尖角，现代大胆。' },
        { id: 'cushion', label: 'Cushion', labelCn: '垫形', value: 'cushion', upcharge: 0, description: 'Rounded square. Romantic and vintage-inspired.', descriptionCn: '圆角方形，浪漫复古。' },
        { id: 'oval', label: 'Oval', labelCn: '椭圆形', value: 'oval', upcharge: 0, description: 'Elongating, romantic. Currently the most requested shape.', descriptionCn: '修长浪漫，目前最受欢迎的形状。' },
        { id: 'pear', label: 'Pear', labelCn: '梨形', value: 'pear', upcharge: 0, description: 'Teardrop form. Elegant and directional.', descriptionCn: '水滴形，优雅且有方向感。' },
        { id: 'emerald-cut', label: 'Emerald Cut', labelCn: '祖母绿切割', value: 'emerald-cut', upcharge: 0, description: 'Long rectangular facets. Architectural and serene.', descriptionCn: '长方形刻面，建筑感与宁静。' },
        { id: 'asscher', label: 'Asscher', labelCn: '阿斯切', value: 'asscher', upcharge: 0, description: 'Square with cropped corners and step facets. Art Deco.', descriptionCn: '方形切角阶梯面，装饰艺术风格。' },
        { id: 'marquise', label: 'Marquise', labelCn: '马眼形', value: 'marquise', upcharge: 0, description: 'Elongated pointed oval. Vintage drama.', descriptionCn: '尖头椭圆形，复古戏剧感。' },
        { id: 'radiant', label: 'Radiant', labelCn: '雷迪恩', value: 'radiant', upcharge: 0, description: 'Rectangular with brilliant facets. Best of both worlds.', descriptionCn: '长方形明亮刻面，两全其美。' },
        { id: 'heart', label: 'Heart', labelCn: '心形', value: 'heart', upcharge: 0, description: 'Unmistakably romantic. For those who commit fully.', descriptionCn: '无可比拟的浪漫，全心投入。' },
    ],
};
// ── STEP 4b: Stone Size ──
const stoneSizeStep = {
    id: 'stone-size',
    name: 'Stone Size',
    nameCn: '宝石大小',
    type: 'card-grid',
    description: 'Select your stone size.',
    descriptionCn: '选择您的宝石大小。',
    condition: (selections) => selections['stone'] !== 'none',
    options: [
        { id: 'small', label: 'Small', labelCn: '小号', value: 'small', upcharge: 0, description: '~0.25–0.50 ct. Delicate, everyday.', descriptionCn: '~0.25–0.50克拉，精致日常。' },
        { id: 'medium', label: 'Medium', labelCn: '中号', value: 'medium', upcharge: 0, description: '~0.75–1.0 ct. The sweet spot.', descriptionCn: '~0.75–1.0克拉，最佳选择。' },
        { id: 'large', label: 'Large', labelCn: '大号', value: 'large', upcharge: 0, description: '~1.25 ct+. Statement.', descriptionCn: '~1.25克拉以上，夺目宣言。' },
    ],
};
// ── STEP 5: Side Stone 1 ──
const sideStoneStep = {
    id: 'side-stones',
    name: 'Side Stone 1',
    nameCn: '副石 1',
    type: 'card-grid',
    description: 'A little more sparkle never hurts.',
    descriptionCn: '多一点闪耀没什么不好。',
    condition: (selections) => selections['want-side-stones'] === 'yes',
    options: [
        { id: 'diamond', label: 'Diamond', labelCn: '钻石', value: 'diamond', upcharge: 0, emoji: '💎', description: 'Classic white. Timeless.', descriptionCn: '经典白色，永恒不朽。' },
        { id: 'blue-diamond', label: 'Blue Diamond', labelCn: '蓝钻', value: 'blue-diamond', upcharge: 0, emoji: '💎', description: 'Rare, cool, quietly electric.', descriptionCn: '稀有、冷静、低调电感。' },
        { id: 'pink-diamond', label: 'Pink Diamond', labelCn: '粉钻', value: 'pink-diamond', upcharge: 0, emoji: '💎', description: 'Soft romance with serious sparkle.', descriptionCn: '柔美浪漫，闪耀非凡。' },
        { id: 'ruby', label: 'Ruby', labelCn: '红宝石', value: 'ruby', upcharge: 0, emoji: '❤️', description: 'Deep red passion.', descriptionCn: '深红热情。' },
        { id: 'blue-sapphire', label: 'Blue Sapphire', labelCn: '蓝宝石', value: 'blue-sapphire', upcharge: 0, emoji: '💙', description: 'Royal, deep, enduring.', descriptionCn: '皇室、深邃、持久。' },
        { id: 'pink-sapphire', label: 'Pink Sapphire', labelCn: '粉色蓝宝石', value: 'pink-sapphire', upcharge: 0, emoji: '💗', description: 'Playful blush with a modern edge.', descriptionCn: '俏皮腮红，现代感。' },
        { id: 'emerald', label: 'Emerald', labelCn: '祖母绿', value: 'emerald', upcharge: 0, emoji: '💚', description: 'Rich green. Dramatic and lush.', descriptionCn: '浓郁绿色，戏剧与奢华。' },
    ],
};
// ── STEP 5a: Side Stone 1 Shape ──
const sideStoneShapeStep = {
    id: 'side-stone-shape',
    name: 'Side Stone 1 Shape',
    nameCn: '副石 1 形状',
    type: 'card-grid',
    description: 'Narrowed set for accent placement.',
    descriptionCn: '适合点缀位置的精选形状。',
    condition: (selections) => selections['want-side-stones'] === 'yes',
    options: [
        { id: 'round', label: 'Round', labelCn: '圆形', value: 'round', upcharge: 0, description: 'The classic accent cut.', descriptionCn: '经典点缀切割。' },
        { id: 'baguette', label: 'Baguette', labelCn: '长方形', value: 'baguette', upcharge: 0, description: 'Sleek rectangular step-cut.', descriptionCn: '时尚长方形阶梯切割。' },
        { id: 'trillion', label: 'Trillion', labelCn: '三角形', value: 'trillion', upcharge: 0, description: 'Triangular brilliance.', descriptionCn: '三角形光彩。' },
        { id: 'princess', label: 'Princess', labelCn: '公主方形', value: 'princess', upcharge: 0, description: 'Square, modern accent.', descriptionCn: '方形现代点缀。' },
    ],
};
// ── STEP 5 prompt: Add second side stone? ──
const addSecondSideStoneStep = {
    id: 'add-second-side-stone',
    name: 'Second Side Stone?',
    nameCn: '第二颗副石？',
    type: 'card-grid',
    description: 'Add a second side stone?',
    descriptionCn: '要添加第二颗副石吗？',
    condition: (selections) => selections['want-side-stones'] === 'yes',
    options: [
        { id: 'yes', label: 'Yes', labelCn: '是', value: 'yes', upcharge: 0, emoji: '✨', description: 'Mixing is actively encouraged.', descriptionCn: '鼓励混合搭配。' },
        { id: 'no', label: 'No, continue', labelCn: '不，继续', value: 'no', upcharge: 0, emoji: '➡️', description: 'Continue to metal selection.', descriptionCn: '继续选择金属。' },
    ],
};
// ── STEP 5b: Side Stone 2 ──
const sideStone2Step = {
    id: 'side-stone-2',
    name: 'Side Stone 2',
    nameCn: '副石 2',
    type: 'card-grid',
    description: 'Choose your second side stone — mixing is encouraged.',
    descriptionCn: '选择您的第二颗副石——鼓励混合搭配。',
    condition: (selections) => selections['add-second-side-stone'] === 'yes',
    options: [
        { id: 'diamond', label: 'Diamond', labelCn: '钻石', value: 'diamond', upcharge: 0, emoji: '💎' },
        { id: 'blue-diamond', label: 'Blue Diamond', labelCn: '蓝钻', value: 'blue-diamond', upcharge: 0, emoji: '💎' },
        { id: 'pink-diamond', label: 'Pink Diamond', labelCn: '粉钻', value: 'pink-diamond', upcharge: 0, emoji: '💎' },
        { id: 'ruby', label: 'Ruby', labelCn: '红宝石', value: 'ruby', upcharge: 0, emoji: '❤️' },
        { id: 'blue-sapphire', label: 'Blue Sapphire', labelCn: '蓝宝石', value: 'blue-sapphire', upcharge: 0, emoji: '💙' },
        { id: 'pink-sapphire', label: 'Pink Sapphire', labelCn: '粉色蓝宝石', value: 'pink-sapphire', upcharge: 0, emoji: '💗' },
        { id: 'emerald', label: 'Emerald', labelCn: '祖母绿', value: 'emerald', upcharge: 0, emoji: '💚' },
    ],
};
// ── STEP 5b shape: Side Stone 2 Shape ──
const sideStone2ShapeStep = {
    id: 'side-stone-2-shape',
    name: 'Side Stone 2 Shape',
    nameCn: '副石 2 形状',
    type: 'card-grid',
    description: 'Choose the shape for your second side stone.',
    descriptionCn: '选择第二颗副石的形状。',
    condition: (selections) => selections['add-second-side-stone'] === 'yes',
    options: [
        { id: 'round', label: 'Round', labelCn: '圆形', value: 'round', upcharge: 0 },
        { id: 'baguette', label: 'Baguette', labelCn: '长方形', value: 'baguette', upcharge: 0 },
        { id: 'trillion', label: 'Trillion', labelCn: '三角形', value: 'trillion', upcharge: 0 },
        { id: 'princess', label: 'Princess', labelCn: '公主方形', value: 'princess', upcharge: 0 },
    ],
};
// ── STEP 6: Metal Type ──
const metalStep = {
    id: 'metal',
    name: 'Metal Type',
    nameCn: '金属类型',
    type: 'card-grid',
    description: 'The foundation of your piece.',
    descriptionCn: '您作品的基础。',
    options: [
        { id: '18k-gold', label: '18K Gold', labelCn: '18K金', value: '18k-gold', upcharge: 0, emoji: '✨', description: 'The sweet spot of durability and luxury. Warmer, lighter. Recommended for most pieces.', descriptionCn: '耐久与奢华的甜蜜点。更温暖、更轻盈。推荐大多数作品。' },
        { id: 'platinum', label: 'Platinum 950', labelCn: '铂金950', value: 'platinum', upcharge: 0, emoji: '💎', description: 'Rarer, denser, naturally hypoallergenic. The purest choice. Ideal for engagement rings.', descriptionCn: '更稀有、更密实、天然低过敏性。最纯净的选择。非常适合求婚戒指。' },
    ],
};
// ── STEP 7: Metal Colour ──
const colourStep = {
    id: 'colour',
    name: 'Metal Colour',
    nameCn: '金属颜色',
    type: 'swatch',
    description: 'Gold comes in more shades than you think.',
    descriptionCn: '金色有比你想象的更多色调。',
    condition: (selections) => selections['metal'] === '18k-gold',
    options: [
        { id: 'yellow-gold', label: 'Yellow Gold', labelCn: '黄金', value: 'yellow-gold', upcharge: 0, color: '#C9884C', description: 'Classic, warm, timeless.', descriptionCn: '经典、温暖、永恒。' },
        { id: 'white-gold', label: 'White Gold', labelCn: '白金', value: 'white-gold', upcharge: 0, color: '#E8E8EC', description: 'Cool, modern, versatile.', descriptionCn: '冷静、现代、百搭。' },
        { id: 'rose-gold', label: 'Rose Gold', labelCn: '玫瑰金', value: 'rose-gold', upcharge: 0, color: '#D4936A', description: 'Romantic, warm, feminine.', descriptionCn: '浪漫、温暖、女性化。' },
        { id: 'gunmetal', label: 'Gunmetal', labelCn: '枪色', value: 'gunmetal', upcharge: 0, color: '#4A4A52', description: 'Edgy, modern, unexpected. 18K only.', descriptionCn: '前卫、现代、出乎意料。仅限18K。' },
        { id: 'black-gold', label: 'Black Gold', labelCn: '黑金', value: 'black-gold', upcharge: 0, color: '#1A1A1A', description: 'Bold and dramatic. Rhodium black-plated. 18K only.', descriptionCn: '大胆而戏剧化。黑铑镀层。仅限18K。' },
    ],
};
// ══════════════════════════════════════════
// STEP 8: Category-Specific Design Options
// ══════════════════════════════════════════
// ── 8a-0: Ring Sub-type ──
const ringSubTypeStep = {
    id: 'ring-sub-type',
    name: 'Ring Style',
    nameCn: '戒指风格',
    type: 'card-grid',
    description: 'What style of ring are you creating?',
    descriptionCn: '您要创造什么风格的戒指？',
    condition: (selections) => selections['category'] === 'ring',
    options: [
        { id: 'solitaire', label: 'Solitaire', labelCn: '单石', value: 'solitaire', upcharge: 0 },
        { id: 'halo', label: 'Halo', labelCn: '光环', value: 'halo', upcharge: 0 },
        { id: 'three-stone', label: 'Three-Stone', labelCn: '三石', value: 'three-stone', upcharge: 0 },
        { id: 'pave-eternity', label: 'Pavé / Eternity', labelCn: '密镶/永恒', value: 'pave-eternity', upcharge: 0 },
        { id: 'cocktail', label: 'Cocktail / Statement', labelCn: '鸡尾酒/宣言', value: 'cocktail', upcharge: 0 },
        { id: 'stacking', label: 'Stacking Ring', labelCn: '叠戴戒指', value: 'stacking', upcharge: 0 },
        { id: 'signet', label: 'Signet', labelCn: '印章戒指', value: 'signet', upcharge: 0 },
    ],
};
// ── 8a-1: Band Profile / Shape ──
const ringBandProfileStep = {
    id: 'ring-band-profile',
    name: 'Band Profile / Shape',
    nameCn: '戒带轮廓/形状',
    type: 'card-grid',
    description: 'The shape of your band tells a story.',
    descriptionCn: '戒带的形状讲述一个故事。',
    condition: (selections) => selections['category'] === 'ring',
    options: [
        { id: 'tapered', label: 'Tapered', labelCn: '锥形', value: 'tapered', upcharge: 0, description: 'Wider at setting, narrows toward back. Elegant and flattering.', descriptionCn: '镶嵌处宽，向后渐窄。优雅迷人。' },
        { id: 'straight', label: 'Straight / Parallel', labelCn: '直线/平行', value: 'straight', upcharge: 0, description: 'Even width all around. Clean and architectural.', descriptionCn: '全圈等宽。简洁建筑感。' },
        { id: 'wavy', label: 'Wavy', labelCn: '波浪形', value: 'wavy', upcharge: 0, description: 'Gentle S-curve undulation. Organic and fluid.', descriptionCn: '柔和S曲线。有机流动。' },
        { id: 'vine', label: 'Creeper / Vine', labelCn: '藤蔓', value: 'vine', upcharge: 0, description: 'The band climbs and wraps organically, like a tendril.', descriptionCn: '戒带像藤蔓一样有机攀爬缠绕。' },
        { id: 'crisscross', label: 'Crisscross / X-Band', labelCn: '交叉', value: 'crisscross', upcharge: 0, description: 'Two strands cross at the base creating an X silhouette.', descriptionCn: '两条线在底部交叉形成X轮廓。' },
        { id: 'twisted', label: 'Intertwined / Twisted', labelCn: '缠绕/扭转', value: 'twisted', upcharge: 0, description: 'Two or more strands twisted together. Represents togetherness.', descriptionCn: '两条或多条扭转在一起。象征团结。' },
        { id: 'split-shank', label: 'Split Shank', labelCn: '分叉', value: 'split-shank', upcharge: 0, description: 'Band splits into two as it approaches the setting, framing the stone.', descriptionCn: '戒带在接近镶嵌时分为两股，框住宝石。' },
        { id: 'bypass', label: 'Bypass', labelCn: '旁路', value: 'bypass', upcharge: 0, description: 'Two ends sweep past each other without meeting. Sculptural.', descriptionCn: '两端交错而过，不相交。雕塑感。' },
        { id: 'knife-edge', label: 'Knife Edge', labelCn: '刀锋', value: 'knife-edge', upcharge: 0, description: 'Sharp ridge running along top of band. Graphic and modern.', descriptionCn: '沿戒带顶部的锐利脊线。图形感与现代。' },
    ],
};
// ── 8a-2: Band Thickness ──
const ringBandThicknessStep = {
    id: 'ring-band-thickness',
    name: 'Band Thickness',
    nameCn: '戒带厚度',
    type: 'card-grid',
    description: 'How bold do you want it?',
    descriptionCn: '您想要多大胆？',
    condition: (selections) => selections['category'] === 'ring',
    options: [
        { id: 'thickness-3mm', label: '3mm', labelCn: '3毫米', value: '3mm', upcharge: 0, description: 'Delicate. Ideal for stacking.', descriptionCn: '精致。适合叠戴。' },
        { id: 'thickness-4mm', label: '4mm', labelCn: '4毫米', value: '4mm', upcharge: 0, description: 'The everyday sweet spot.', descriptionCn: '日常最佳选择。' },
        { id: 'thickness-5mm', label: '5mm', labelCn: '5毫米', value: '5mm', upcharge: 0, description: 'Bold. Makes a statement.', descriptionCn: '大胆。彰显个性。' },
    ],
};
// ── 8a-3: Band Surface Finish ──
const ringSurfaceFinishStep = {
    id: 'ring-surface-finish',
    name: 'Band Surface Finish',
    nameCn: '戒带表面处理',
    type: 'card-grid',
    description: 'Can mix inner and outer finish.',
    descriptionCn: '可混合内外表面处理。',
    condition: (selections) => selections['category'] === 'ring',
    options: [
        { id: 'high-polish', label: 'High Polish / Shine', labelCn: '高光/亮面', value: 'high-polish', upcharge: 0, description: 'Mirror-bright. Classic and glamorous.', descriptionCn: '镜面明亮。经典迷人。' },
        { id: 'satin', label: 'Satin / Silk', labelCn: '缎面/丝绸', value: 'satin', upcharge: 0, description: 'Soft brushed texture. Modern and understated.', descriptionCn: '柔和拉丝纹理。现代低调。' },
        { id: 'hammered', label: 'Hammered', labelCn: '锤纹', value: 'hammered', upcharge: 0, description: 'Hand-worked irregular dimples. Artisan, organic.', descriptionCn: '手工不规则凹痕。工匠感，有机。' },
        { id: 'lined', label: 'Lined / Engraved Lines', labelCn: '线纹/刻线', value: 'lined', upcharge: 0, description: 'Fine parallel lines etched along the band. Architectural.', descriptionCn: '沿戒带蚀刻的细平行线。建筑感。' },
        { id: 'milgrain', label: 'Milgrain / Beaded', labelCn: '珠边/串珠', value: 'milgrain', upcharge: 0, description: 'Tiny bead-like detailing along edges. Vintage-romantic.', descriptionCn: '沿边缘的微小珠状细节。复古浪漫。' },
        { id: 'bark', label: 'Bark / Wood-grain', labelCn: '树皮/木纹', value: 'bark', upcharge: 0, description: 'Irregular texture mimicking natural wood grain. Earthy.', descriptionCn: '模仿天然木纹的不规则纹理。朴实。' },
        { id: 'florentine', label: 'Florentine', labelCn: '佛罗伦萨', value: 'florentine', upcharge: 0, description: 'Crosshatch engraving for matte patterned texture. Renaissance-inspired.', descriptionCn: '交叉刻纹形成哑光图案纹理。文艺复兴灵感。' },
    ],
};
// ── 8a-4: Main Stone Setting ──
const ringMainSettingStep = {
    id: 'ring-main-setting',
    name: 'Main Stone Setting',
    nameCn: '主石镶嵌',
    type: 'card-grid',
    description: 'How does the stone sit within the band?',
    descriptionCn: '宝石如何嵌入戒带？',
    condition: (selections) => selections['category'] === 'ring' && selections['stone'] !== 'none',
    options: [
        { id: 'round-claw-4', label: 'Round Claw 4-prong', labelCn: '圆爪4爪', value: 'round-claw-4', upcharge: 0, description: 'Four rounded claws. Classic and secure.', descriptionCn: '四个圆爪。经典安全。' },
        { id: 'round-claw-6', label: 'Round Claw 6-prong', labelCn: '圆爪6爪', value: 'round-claw-6', upcharge: 0, description: 'Six claws for extra security. Rounder silhouette.', descriptionCn: '六个爪更安全。更圆轮廓。' },
        { id: 'sharp-claw', label: 'Sharp / Pointed Claw', labelCn: '尖爪', value: 'sharp-claw', upcharge: 0, description: 'Tapered angular claws. More dramatic and modern.', descriptionCn: '锥形角爪。更戏剧化现代。' },
        { id: 'l-prong', label: 'L-shaped / L-prong', labelCn: 'L形爪', value: 'l-prong', upcharge: 0, description: 'Flat-profile prongs. Sleek and contemporary.', descriptionCn: '扁平爪。时尚当代。' },
        { id: 'bezel-full', label: 'Bezel (Full)', labelCn: '全包镶', value: 'bezel-full', upcharge: 0, description: 'Metal rim wraps the stone completely. Smooth, modern, protective.', descriptionCn: '金属边完全包裹宝石。光滑、现代、保护性。' },
        { id: 'half-bezel', label: 'Half Bezel', labelCn: '半包镶', value: 'half-bezel', upcharge: 0, description: 'Metal on two sides. Stone exposed on flanks. Elegant hybrid.', descriptionCn: '两侧金属。宝石侧面外露。优雅混合。' },
        { id: 'tension', label: 'Tension', labelCn: '张力镶', value: 'tension', upcharge: 0, description: 'Stone appears to float, held by compression of the band. Striking.', descriptionCn: '宝石似悬浮，由戒带压力固定。引人注目。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Stone sits within a channel. Clean and flush.', descriptionCn: '宝石嵌入槽中。简洁齐平。' },
        { id: 'flush', label: 'Flush / Burnish', labelCn: '平镶', value: 'flush', upcharge: 0, description: 'Stone level with metal surface. Minimal.', descriptionCn: '宝石与金属表面齐平。极简。' },
        { id: 'cathedral', label: 'Cathedral', labelCn: '大教堂镶', value: 'cathedral', upcharge: 0, description: 'Arching metal supports rise from band to elevate the setting. Grand.', descriptionCn: '拱形金属支撑从戒带升起抬高镶嵌。宏伟。' },
    ],
};
// ── 8a-5: Side Stone Setting ──
const ringSideSettingStep = {
    id: 'ring-side-setting',
    name: 'Side Stone Setting',
    nameCn: '副石镶嵌',
    type: 'card-grid',
    description: 'How are the side stones held?',
    descriptionCn: '副石如何固定？',
    condition: (selections) => selections['category'] === 'ring' && selections['want-side-stones'] === 'yes',
    options: [
        { id: 'pave', label: 'Pavé', labelCn: '密镶', value: 'pave', upcharge: 0, description: 'Tiny stones set close together, secured by small metal beads. Maximum sparkle.', descriptionCn: '小宝石紧密排列，由小金属珠固定。最大闪耀。' },
        { id: 'micro-pave', label: 'Micro-Pavé', labelCn: '微密镶', value: 'micro-pave', upcharge: 0, description: 'Even smaller stones, more precisely set. Diamond-saturated.', descriptionCn: '更小宝石，更精确镶嵌。钻石饱和。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Side stones set flush in a metal channel.', descriptionCn: '副石齐平嵌入金属槽中。' },
        { id: 'individual-claw', label: 'Individual Claw', labelCn: '独立爪镶', value: 'individual-claw', upcharge: 0, description: 'Each side stone held by its own claws.', descriptionCn: '每颗副石由独立爪固定。' },
        { id: 'shared-prong', label: 'Shared Prong / Fishtail', labelCn: '共享爪/鱼尾', value: 'shared-prong', upcharge: 0, description: 'Adjacent stones share a single prong. More stone, less metal.', descriptionCn: '相邻宝石共享一个爪。更多宝石，更少金属。' },
        { id: 'bar-setting', label: 'Bar Setting', labelCn: '条镶', value: 'bar-setting', upcharge: 0, description: 'Thin vertical metal bars between each stone. Graphic and linear.', descriptionCn: '每颗宝石间的细垂直金属条。图形化线性。' },
        { id: 'invisible', label: 'Invisible Setting', labelCn: '隐形镶嵌', value: 'invisible', upcharge: 0, description: 'No visible prongs — stones appear to float in seamless surface.', descriptionCn: '无可见爪——宝石似在无缝表面上漂浮。' },
    ],
};
// ── 8a-6: Ring Size ──
const ringSizeStep = {
    id: 'ring-size',
    name: 'Ring Size',
    nameCn: '戒指尺寸',
    type: 'dropdown',
    description: 'US sizes 3–13. Option to order a free sizer kit.',
    descriptionCn: 'US 3-13号。可订购免费测量套件。',
    condition: (selections) => selections['category'] === 'ring',
    options: [
        { id: 'ring-3', label: 'US 3 (Ø 14.0mm / UK F)', labelCn: '3号 (内径14.0mm)', value: 'ring-3', upcharge: 0 },
        { id: 'ring-4', label: 'US 4 (Ø 14.8mm / UK H)', labelCn: '4号 (内径14.8mm)', value: 'ring-4', upcharge: 0 },
        { id: 'ring-5', label: 'US 5 (Ø 15.7mm / UK J½)', labelCn: '5号 (内径15.7mm)', value: 'ring-5', upcharge: 0 },
        { id: 'ring-6', label: 'US 6 (Ø 16.5mm / UK L½)', labelCn: '6号 (内径16.5mm)', value: 'ring-6', upcharge: 0 },
        { id: 'ring-7', label: 'US 7 (Ø 17.3mm / UK O)', labelCn: '7号 (内径17.3mm)', value: 'ring-7', upcharge: 0 },
        { id: 'ring-8', label: 'US 8 (Ø 18.1mm / UK Q)', labelCn: '8号 (内径18.1mm)', value: 'ring-8', upcharge: 0 },
        { id: 'ring-9', label: 'US 9 (Ø 19.0mm / UK R½)', labelCn: '9号 (内径19.0mm)', value: 'ring-9', upcharge: 0 },
        { id: 'ring-10', label: 'US 10 (Ø 19.8mm / UK T½)', labelCn: '10号 (内径19.8mm)', value: 'ring-10', upcharge: 0 },
        { id: 'ring-11', label: 'US 11 (Ø 20.6mm / UK V½)', labelCn: '11号 (内径20.6mm)', value: 'ring-11', upcharge: 0 },
        { id: 'ring-12', label: 'US 12 (Ø 21.4mm / UK X½)', labelCn: '12号 (内径21.4mm)', value: 'ring-12', upcharge: 0 },
        { id: 'ring-13', label: 'US 13 (Ø 22.2mm / UK Z)', labelCn: '13号 (内径22.2mm)', value: 'ring-13', upcharge: 0 },
    ],
};
// ══════════════════════════════════════════
// 8b: Stud Earring Branch
// ══════════════════════════════════════════
// ── 8b-1: Stone Setting / Front Design ──
const studSettingStep = {
    id: 'stud-setting',
    name: 'Stone Setting / Front Design',
    nameCn: '宝石镶嵌/正面设计',
    type: 'card-grid',
    description: 'The first thing people see.',
    descriptionCn: '人们首先看到的。',
    condition: (selections) => selections['category'] === 'stud-earring' && selections['stone'] !== 'none',
    options: [
        { id: 'round-claw-4', label: 'Round Claw 4-prong', labelCn: '圆爪4爪', value: 'round-claw-4', upcharge: 0, description: 'The everyday classic.', descriptionCn: '日常经典。' },
        { id: 'round-claw-6', label: 'Round Claw 6-prong', labelCn: '圆爪6爪', value: 'round-claw-6', upcharge: 0, description: 'A touch more drama and security.', descriptionCn: '更多戏剧性与安全性。' },
        { id: 'sharp-claw', label: 'Sharp / Pointed Claw', labelCn: '尖爪', value: 'sharp-claw', upcharge: 0, description: 'Edgy and angular.', descriptionCn: '前卫有棱角。' },
        { id: 'l-prong', label: 'L-prong / L-shaped', labelCn: 'L形爪', value: 'l-prong', upcharge: 0, description: 'Flat-profile. Sleek and contemporary.', descriptionCn: '扁平。时尚当代。' },
        { id: 'bezel-full', label: 'Bezel (Full)', labelCn: '全包镶', value: 'bezel-full', upcharge: 0, description: 'Clean modern rim. Protective.', descriptionCn: '简洁现代边框。保护性。' },
        { id: 'half-bezel', label: 'Half Bezel', labelCn: '半包镶', value: 'half-bezel', upcharge: 0, description: 'Open on two sides. Hybrid of protection and sparkle.', descriptionCn: '两侧开放。保护与闪耀的混合。' },
        { id: 'halo-stud', label: 'Halo', labelCn: '光环', value: 'halo-stud', upcharge: 0, description: 'Ring of smaller stones surrounds main stone. Maximum glamour.', descriptionCn: '小宝石环绕主石。最大魅力。' },
        { id: 'wrapped', label: 'Wrapped', labelCn: '缠绕', value: 'wrapped', upcharge: 0, description: 'Metal appears to twist organically around the stone.', descriptionCn: '金属有机地缠绕宝石。' },
        { id: 'milgrain-halo', label: 'Milgrain Halo', labelCn: '珠边光环', value: 'milgrain-halo', upcharge: 0, description: 'Ring of tiny metal beads frames the stone. Vintage-romantic.', descriptionCn: '微小金属珠环绕宝石。复古浪漫。' },
        { id: 'starburst', label: 'Starburst / Sunburst', labelCn: '星芒', value: 'starburst', upcharge: 0, description: 'Metal rays extend from the stone like a star.', descriptionCn: '金属光芒从宝石延伸如星辰。' },
    ],
};
// ── 8b-2: Backing / Clutch Design ──
const studBackingStep = {
    id: 'stud-backing',
    name: 'Backing / Clutch Design',
    nameCn: '耳背/扣环设计',
    type: 'card-grid',
    description: 'The back is visible when hair is worn up — it\'s a design surface, not an afterthought.',
    descriptionCn: '头发扎起时耳背是可见的——它是设计的一部分，不是附属品。',
    condition: (selections) => selections['category'] === 'stud-earring',
    options: [
        { id: 'oriental-scroll', label: 'Oriental / Scroll', labelCn: '东方/卷曲', value: 'oriental-scroll', upcharge: 0, description: 'Classic curved scroll back. Traditional.', descriptionCn: '经典弯曲卷轴背。传统。' },
        { id: 'floral-back', label: 'Floral', labelCn: '花卉', value: 'floral-back', upcharge: 0, description: 'A small decorative flower motif. Pretty detail when hair is up.', descriptionCn: '小装饰花朵图案。头发扎起时的美丽细节。' },
        { id: 'star-back', label: 'Star', labelCn: '星形', value: 'star-back', upcharge: 0, description: 'A five-point star clutch back.', descriptionCn: '五角星扣背。' },
        { id: 'geometric-back', label: 'Geometric / Hexagon', labelCn: '几何/六角', value: 'geometric-back', upcharge: 0, description: 'Flat geometric shape. Modern.', descriptionCn: '扁平几何形状。现代。' },
        { id: 'butterfly', label: 'Butterfly (standard)', labelCn: '蝴蝶扣（标准）', value: 'butterfly', upcharge: 0, description: 'Universal, secure, everyday.', descriptionCn: '通用、安全、日常。' },
        { id: 'screw-back', label: 'Screw-back', labelCn: '螺旋扣', value: 'screw-back', upcharge: 0, description: 'Threaded post for maximum security. For precious stones.', descriptionCn: '螺纹柱最大安全性。适合贵重宝石。' },
        { id: 'locking-push', label: 'Locking / Push-back', labelCn: '锁扣/推入式', value: 'locking-push', upcharge: 0, description: 'Clicks into place. Ideal for active wear.', descriptionCn: '卡入到位。适合运动佩戴。' },
    ],
};
// ── 8b-3: Backing Size ──
const studBackingSizeStep = {
    id: 'stud-backing-size',
    name: 'Backing Size',
    nameCn: '耳背尺寸',
    type: 'card-grid',
    description: 'How much of the back do you want to show?',
    descriptionCn: '您想展示多少耳背？',
    condition: (selections) => selections['category'] === 'stud-earring',
    options: [
        { id: 'backing-s', label: 'S', labelCn: '小号', value: 'backing-s', upcharge: 0, description: 'Barely there. Minimalist.', descriptionCn: '几乎看不见。极简。' },
        { id: 'backing-m', label: 'M', labelCn: '中号', value: 'backing-m', upcharge: 0, description: 'The everyday standard.', descriptionCn: '日常标准。' },
        { id: 'backing-l', label: 'L', labelCn: '大号', value: 'backing-l', upcharge: 0, description: 'More visible. More decorative.', descriptionCn: '更明显。更具装饰性。' },
    ],
};
// ══════════════════════════════════════════
// 8c: Dangling Earring Branch
// ══════════════════════════════════════════
// ── 8c-1: Drop Style / Length ──
const danglingDropStyleStep = {
    id: 'dangling-drop-style',
    name: 'Drop Style',
    nameCn: '耳坠风格',
    type: 'card-grid',
    description: 'How far and how dramatic?',
    descriptionCn: '多长，多戏剧化？',
    condition: (selections) => selections['category'] === 'dangling-earring',
    options: [
        { id: 'drop', label: 'Drop', labelCn: '短垂', value: 'drop', upcharge: 0, description: 'Short elegant downward extension. Subtle movement, close to lobe.', descriptionCn: '优雅短垂，贴近耳垂，微妙晃动。' },
        { id: 'short-dangle', label: 'Short Dangle (2–3cm)', labelCn: '短摇摆 (2-3cm)', value: 'short-dangle', upcharge: 0, description: 'Visible swing without going long. Versatile day to evening.', descriptionCn: '可见摆动但不过长。日夜百搭。' },
        { id: 'long-dangle', label: 'Long Dangle (4cm+)', labelCn: '长摇摆 (4cm+)', value: 'long-dangle', upcharge: 0, description: 'Full movement, maximum drama. Made for evenings.', descriptionCn: '充分摆动，最大戏剧感。为晚间打造。' },
        { id: 'ear-crawler', label: 'Ear Crawler / Climber', labelCn: '耳骨夹', value: 'ear-crawler', upcharge: 0, description: 'Curves upward along the ear. Architectural and modern.', descriptionCn: '沿耳朵向上弯曲。建筑感与现代。' },
        { id: 'chandelier', label: 'Chandelier', labelCn: '枝形吊灯', value: 'chandelier', upcharge: 0, description: 'Multiple tiers of stones cascading downward. Showstopping.', descriptionCn: '多层宝石向下级联。惊艳全场。' },
        { id: 'threader', label: 'Threader', labelCn: '穿线式', value: 'threader', upcharge: 0, description: 'Fine chain threads through the piercing. Ultra-minimal.', descriptionCn: '细链穿过耳洞。极简主义。' },
    ],
};
// ── 8c-2: Main Stone Setting (same as 8a-4) ──
const danglingSettingStep = {
    id: 'dangling-setting',
    name: 'Main Stone Setting',
    nameCn: '主石镶嵌',
    type: 'card-grid',
    description: 'How does the stone sit?',
    descriptionCn: '宝石如何嵌入？',
    condition: (selections) => selections['category'] === 'dangling-earring' && selections['stone'] !== 'none',
    options: [
        { id: 'round-claw-4', label: 'Round Claw 4-prong', labelCn: '圆爪4爪', value: 'round-claw-4', upcharge: 0, description: 'Four rounded claws. Classic and secure.', descriptionCn: '四个圆爪。经典安全。' },
        { id: 'round-claw-6', label: 'Round Claw 6-prong', labelCn: '圆爪6爪', value: 'round-claw-6', upcharge: 0, description: 'Six claws for extra security. Rounder silhouette.', descriptionCn: '六个爪更安全。更圆轮廓。' },
        { id: 'sharp-claw', label: 'Sharp / Pointed Claw', labelCn: '尖爪', value: 'sharp-claw', upcharge: 0, description: 'Tapered angular claws. More dramatic and modern.', descriptionCn: '锥形角爪。更戏剧化现代。' },
        { id: 'l-prong', label: 'L-shaped / L-prong', labelCn: 'L形爪', value: 'l-prong', upcharge: 0, description: 'Flat-profile prongs. Sleek and contemporary.', descriptionCn: '扁平爪。时尚当代。' },
        { id: 'bezel-full', label: 'Bezel (Full)', labelCn: '全包镶', value: 'bezel-full', upcharge: 0, description: 'Metal rim wraps the stone completely. Smooth, modern, protective.', descriptionCn: '金属边完全包裹宝石。光滑、现代、保护性。' },
        { id: 'half-bezel', label: 'Half Bezel', labelCn: '半包镶', value: 'half-bezel', upcharge: 0, description: 'Metal on two sides. Stone exposed on flanks. Elegant hybrid.', descriptionCn: '两侧金属。宝石侧面外露。优雅混合。' },
        { id: 'tension', label: 'Tension', labelCn: '张力镶', value: 'tension', upcharge: 0, description: 'Stone appears to float, held by compression. Striking.', descriptionCn: '宝石似悬浮，由压力固定。引人注目。' },
        { id: 'flush', label: 'Flush / Burnish', labelCn: '平镶', value: 'flush', upcharge: 0, description: 'Stone level with metal surface. Minimal.', descriptionCn: '宝石与金属表面齐平。极简。' },
        { id: 'cathedral', label: 'Cathedral', labelCn: '大教堂镶', value: 'cathedral', upcharge: 0, description: 'Arching metal supports rise to elevate the setting. Grand.', descriptionCn: '拱形金属支撑升起抬高镶嵌。宏伟。' },
    ],
};
// ── 8c-3: Side Stone Setting (same as 8a-5) ──
const danglingSideSettingStep = {
    id: 'dangling-side-setting',
    name: 'Side Stone Setting',
    nameCn: '副石镶嵌',
    type: 'card-grid',
    description: 'How are the side stones held?',
    descriptionCn: '副石如何固定？',
    condition: (selections) => selections['category'] === 'dangling-earring' && selections['want-side-stones'] === 'yes',
    options: [
        { id: 'pave', label: 'Pavé', labelCn: '密镶', value: 'pave', upcharge: 0, description: 'Tiny stones set close together, secured by small metal beads. Maximum sparkle.', descriptionCn: '小宝石紧密排列，由小金属珠固定。最大闪耀。' },
        { id: 'micro-pave', label: 'Micro-Pavé', labelCn: '微密镶', value: 'micro-pave', upcharge: 0, description: 'Even smaller stones, more precisely set. Diamond-saturated.', descriptionCn: '更小宝石，更精确镶嵌。钻石饱和。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Side stones set flush in a metal channel.', descriptionCn: '副石齐平嵌入金属槽中。' },
        { id: 'shared-prong', label: 'Shared Prong / Fishtail', labelCn: '共享爪/鱼尾', value: 'shared-prong', upcharge: 0, description: 'Adjacent stones share a single prong. More stone, less metal.', descriptionCn: '相邻宝石共享一个爪。更多宝石，更少金属。' },
        { id: 'bar-setting', label: 'Bar Setting', labelCn: '条镶', value: 'bar-setting', upcharge: 0, description: 'Thin vertical metal bars between each stone. Graphic and linear.', descriptionCn: '每颗宝石间的细垂直金属条。图形化线性。' },
        { id: 'individual-claw', label: 'Individual Claw', labelCn: '独立爪镶', value: 'individual-claw', upcharge: 0, description: 'Each side stone held by its own claws.', descriptionCn: '每颗副石由独立爪固定。' },
        { id: 'invisible', label: 'Invisible Setting', labelCn: '隐形镶嵌', value: 'invisible', upcharge: 0, description: 'No visible prongs — stones appear to float in seamless surface.', descriptionCn: '无可见爪——宝石似在无缝表面上漂浮。' },
    ],
};
// ── 8c-4: Connection / Link Style ──
const danglingConnectionStep = {
    id: 'dangling-connection',
    name: 'Connection Style',
    nameCn: '连接方式',
    type: 'card-grid',
    description: 'How the earring attaches and hangs.',
    descriptionCn: '耳环如何连接和悬挂。',
    condition: (selections) => selections['category'] === 'dangling-earring',
    options: [
        { id: 'shepherd-hook', label: 'Simple Hook (Shepherd\'s Hook)', labelCn: '牧羊人钩', value: 'shepherd-hook', upcharge: 0, description: 'Plain curved wire. Effortless and classic.', descriptionCn: '简单弯曲线材。轻松经典。' },
        { id: 'leverback', label: 'Leverback', labelCn: '杠杆扣', value: 'leverback', upcharge: 0, description: 'Hinged closure that locks. Secure and refined.', descriptionCn: '铰链式闭合锁定。安全精致。' },
        { id: 'stud-top-drop', label: 'Stud-top with Drop', labelCn: '耳钉顶配垂坠', value: 'stud-top-drop', upcharge: 0, description: 'Set stone at top with chain or drop below. Two pieces in one.', descriptionCn: '顶部耳钉配下方垂坠。两件合一。' },
        { id: 'hoop-drop', label: 'Hoop with Drop', labelCn: '圈环配垂坠', value: 'hoop-drop', upcharge: 0, description: 'Small hoop at top with pendant drop hanging from it.', descriptionCn: '顶部小圈环配悬挂吊坠。' },
        { id: 'chain-link', label: 'Chain Link', labelCn: '链接式', value: 'chain-link', upcharge: 0, description: 'Dangle suspended on a delicate chain link from the post top.', descriptionCn: '从耳钉顶部以精致链节悬挂。' },
    ],
};
// ══════════════════════════════════════════
// 8d: Pendant Branch
// ══════════════════════════════════════════
// ── 8d-1: Pendant Silhouette ──
const pendantStyleStep = {
    id: 'pendant-style',
    name: 'Pendant Silhouette',
    nameCn: '吊坠轮廓',
    type: 'card-grid',
    description: 'Close to the heart.',
    descriptionCn: '贴近心脏。',
    condition: (selections) => selections['category'] === 'pendant',
    options: [
        { id: 'solitaire-pendant', label: 'Solitaire', labelCn: '单石', value: 'solitaire-pendant', upcharge: 0, description: 'A single stone, simply elevated. The stone is the entire story.', descriptionCn: '单颗宝石，简单提升。宝石就是全部故事。' },
        { id: 'halo-pendant', label: 'Halo', labelCn: '光环', value: 'halo-pendant', upcharge: 0, description: 'Centre stone encircled by ring of smaller stones. More sparkle.', descriptionCn: '中心石被小宝石环绕。更多闪耀。' },
        { id: 'drop-teardrop', label: 'Drop / Teardrop', labelCn: '水滴形', value: 'drop-teardrop', upcharge: 0, description: 'Elongated form tapering to a point. Elegant on the neckline.', descriptionCn: '细长锥形。颈线优雅。' },
        { id: 'cluster-pendant', label: 'Cluster', labelCn: '群镶', value: 'cluster-pendant', upcharge: 0, description: 'Multiple stones arranged as one unified shape — a constellation.', descriptionCn: '多颗宝石排列为统一形状——一个星座。' },
        { id: 'geometric-pendant', label: 'Geometric', labelCn: '几何', value: 'geometric-pendant', upcharge: 0, description: 'Circle, hexagon, triangle, bar, or square in clean metal lines.', descriptionCn: '圆、六角、三角、条或方形的简洁金属线条。' },
        { id: 'nature-pendant', label: 'Nature-Inspired', labelCn: '自然灵感', value: 'nature-pendant', upcharge: 0, description: 'Leaf, petal, crescent moon, star, snowflake.', descriptionCn: '叶子、花瓣、新月、星星、雪花。' },
        { id: 'symbolic-pendant', label: 'Symbolic / Meaningful', labelCn: '象征/寓意', value: 'symbolic-pendant', upcharge: 0, description: 'Infinity loop, cross, initial letter, heart, knot.', descriptionCn: '无限环、十字架、首字母、心形、结。' },
        { id: 'locket', label: 'Locket', labelCn: '小盒吊坠', value: 'locket', upcharge: 0, description: 'Hinged pendant that opens to hold a photo or engraved message inside.', descriptionCn: '铰链吊坠，可打开放置照片或刻写信息。' },
    ],
};
// ── 8d-2: Main Stone Setting (same as 8a-4) ──
const pendantSettingStep = {
    id: 'pendant-setting',
    name: 'Main Stone Setting',
    nameCn: '主石镶嵌',
    type: 'card-grid',
    description: 'How does the stone sit?',
    descriptionCn: '宝石如何嵌入？',
    condition: (selections) => selections['category'] === 'pendant' && selections['stone'] !== 'none',
    options: [
        { id: 'round-claw-4', label: 'Round Claw 4-prong', labelCn: '圆爪4爪', value: 'round-claw-4', upcharge: 0, description: 'Four rounded claws. Classic and secure.', descriptionCn: '四个圆爪。经典安全。' },
        { id: 'round-claw-6', label: 'Round Claw 6-prong', labelCn: '圆爪6爪', value: 'round-claw-6', upcharge: 0, description: 'Six claws for extra security.', descriptionCn: '六个爪更安全。' },
        { id: 'sharp-claw', label: 'Sharp / Pointed Claw', labelCn: '尖爪', value: 'sharp-claw', upcharge: 0, description: 'Tapered angular claws. Dramatic and modern.', descriptionCn: '锥形角爪。戏剧化现代。' },
        { id: 'l-prong', label: 'L-shaped / L-prong', labelCn: 'L形爪', value: 'l-prong', upcharge: 0, description: 'Flat-profile prongs. Sleek and contemporary.', descriptionCn: '扁平爪。时尚当代。' },
        { id: 'bezel-full', label: 'Bezel (Full)', labelCn: '全包镶', value: 'bezel-full', upcharge: 0, description: 'Metal rim wraps the stone completely.', descriptionCn: '金属边完全包裹宝石。' },
        { id: 'half-bezel', label: 'Half Bezel', labelCn: '半包镶', value: 'half-bezel', upcharge: 0, description: 'Metal on two sides. Elegant hybrid.', descriptionCn: '两侧金属。优雅混合。' },
        { id: 'tension', label: 'Tension', labelCn: '张力镶', value: 'tension', upcharge: 0, description: 'Stone appears to float. Striking.', descriptionCn: '宝石似悬浮。引人注目。' },
        { id: 'flush', label: 'Flush / Burnish', labelCn: '平镶', value: 'flush', upcharge: 0, description: 'Stone level with metal surface. Minimal.', descriptionCn: '宝石与金属表面齐平。极简。' },
        { id: 'cathedral', label: 'Cathedral', labelCn: '大教堂镶', value: 'cathedral', upcharge: 0, description: 'Arching metal supports elevate the setting. Grand.', descriptionCn: '拱形金属支撑抬高镶嵌。宏伟。' },
    ],
};
// ── 8d-3: Side Stone Setting (same as 8a-5) ──
const pendantSideSettingStep = {
    id: 'pendant-side-setting',
    name: 'Side Stone Setting',
    nameCn: '副石镶嵌',
    type: 'card-grid',
    description: 'How are the side stones held?',
    descriptionCn: '副石如何固定？',
    condition: (selections) => selections['category'] === 'pendant' && selections['want-side-stones'] === 'yes',
    options: [
        { id: 'pave', label: 'Pavé', labelCn: '密镶', value: 'pave', upcharge: 0, description: 'Tiny stones set close together. Maximum sparkle.', descriptionCn: '小宝石紧密排列。最大闪耀。' },
        { id: 'micro-pave', label: 'Micro-Pavé', labelCn: '微密镶', value: 'micro-pave', upcharge: 0, description: 'Even smaller stones, more precisely set.', descriptionCn: '更小宝石，更精确镶嵌。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Side stones set flush in a metal channel.', descriptionCn: '副石齐平嵌入金属槽中。' },
        { id: 'shared-prong', label: 'Shared Prong / Fishtail', labelCn: '共享爪/鱼尾', value: 'shared-prong', upcharge: 0, description: 'Adjacent stones share a single prong.', descriptionCn: '相邻宝石共享一个爪。' },
        { id: 'bar-setting', label: 'Bar Setting', labelCn: '条镶', value: 'bar-setting', upcharge: 0, description: 'Thin vertical metal bars between each stone.', descriptionCn: '每颗宝石间的细垂直金属条。' },
        { id: 'individual-claw', label: 'Individual Claw', labelCn: '独立爪镶', value: 'individual-claw', upcharge: 0, description: 'Each side stone held by its own claws.', descriptionCn: '每颗副石由独立爪固定。' },
        { id: 'invisible', label: 'Invisible Setting', labelCn: '隐形镶嵌', value: 'invisible', upcharge: 0, description: 'No visible prongs — stones appear to float.', descriptionCn: '无可见爪——宝石似漂浮。' },
    ],
};
// ── 8d-4: Bail Style ──
const pendantBailStep = {
    id: 'pendant-bail',
    name: 'Bail Style',
    nameCn: '挂扣风格',
    type: 'card-grid',
    description: 'The loop at the top connecting pendant to chain.',
    descriptionCn: '顶部连接吊坠与链条的环。',
    condition: (selections) => selections['category'] === 'pendant',
    options: [
        { id: 'simple-round', label: 'Simple Round Bail', labelCn: '简单圆环', value: 'simple-round', upcharge: 0, description: 'Plain loop. Clean, classic, unobtrusive.', descriptionCn: '简单环。简洁、经典、低调。' },
        { id: 'decorated-bail', label: 'Decorated Bail', labelCn: '装饰挂扣', value: 'decorated-bail', upcharge: 0, description: 'Set with small stones or engraved. Visible design detail.', descriptionCn: '镶小石或雕刻。可见设计细节。' },
        { id: 'split-bail', label: 'Split / Double Bail', labelCn: '分叉/双环', value: 'split-bail', upcharge: 0, description: 'Two parallel loops — pendant sits flat and stable on the chain.', descriptionCn: '两个平行环——吊坠平稳挂在链上。' },
        { id: 'v-bail', label: 'V-Bail', labelCn: 'V形挂扣', value: 'v-bail', upcharge: 0, description: 'V-shaped pinch bail. Graphic and modern.', descriptionCn: 'V形夹扣。图形感现代。' },
        { id: 'hidden-bail', label: 'Hidden Bail', labelCn: '隐藏挂扣', value: 'hidden-bail', upcharge: 0, description: 'Flush into the pendant — appears to float on the chain.', descriptionCn: '与吊坠齐平——似漂浮在链上。' },
        { id: 'swivel-bail', label: 'Swivel Bail', labelCn: '旋转挂扣', value: 'swivel-bail', upcharge: 0, description: 'Rotates 360° — pendant always faces forward.', descriptionCn: '360°旋转——吊坠始终朝前。' },
        { id: 'figural-bail', label: 'Figural Bail', labelCn: '造型挂扣', value: 'figural-bail', upcharge: 0, description: 'Shaped as part of the design — a petal, branch, or ribbon.', descriptionCn: '作为设计的一部分——花瓣、树枝或丝带。' },
    ],
};
// ── 8d-5: Chain Style ──
const pendantChainStep = {
    id: 'pendant-chain',
    name: 'Chain Style',
    nameCn: '链条风格',
    type: 'card-grid',
    description: 'The chain that carries your pendant.',
    descriptionCn: '承载吊坠的链条。',
    condition: (selections) => selections['category'] === 'pendant',
    options: [
        { id: 'cable', label: 'Cable', labelCn: '十字链', value: 'cable', upcharge: 0, description: 'Simple oval interlocking links. Delicate and timeless.', descriptionCn: '简单椭圆形互锁链节。精致永恒。' },
        { id: 'curb', label: 'Curb', labelCn: '马鞭链', value: 'curb', upcharge: 0, description: 'Flat uniform twisted links. Slightly bolder than cable.', descriptionCn: '扁平均匀扭转链节。比十字链更粗犷。' },
        { id: 'rope', label: 'Rope', labelCn: '绳链', value: 'rope', upcharge: 0, description: 'Tightly twisted strands that spiral and shimmer.', descriptionCn: '紧密扭转螺旋闪烁。' },
        { id: 'box', label: 'Box', labelCn: '盒链', value: 'box', upcharge: 0, description: 'Square links. Sturdy, modern, geometric.', descriptionCn: '方形链节。坚固、现代、几何。' },
        { id: 'singapore', label: 'Singapore / Twisted', labelCn: '新加坡/扭转链', value: 'singapore', upcharge: 0, description: 'Fine links twisted to create a fluid ripple. Catches light beautifully.', descriptionCn: '细链节扭转形成流动波纹。美丽捕光。' },
        { id: 'belcher', label: 'Belcher / Rolo', labelCn: '圆环链', value: 'belcher', upcharge: 0, description: 'Wide D-shaped links. Chunky, gender-neutral.', descriptionCn: '宽D形链节。粗犷、中性。' },
        { id: 'trace', label: 'Trace', labelCn: '细链', value: 'trace', upcharge: 0, description: 'Ultra-fine oval links. Barely-there. Ideal for layering.', descriptionCn: '超细椭圆链节。几乎看不见。适合叠戴。' },
        { id: 'snake', label: 'Snake', labelCn: '蛇链', value: 'snake', upcharge: 0, description: 'Smooth flexible coil. Sleek and architectural.', descriptionCn: '光滑柔韧线圈。时尚建筑感。' },
    ],
};
// ── 8d-6: Chain Length ──
const pendantLengthStep = {
    id: 'pendant-length',
    name: 'Chain Length',
    nameCn: '链条长度',
    type: 'card-grid',
    description: 'Where does it sit on your neckline?',
    descriptionCn: '它在您的颈线上的位置？',
    condition: (selections) => selections['category'] === 'pendant',
    options: [
        { id: 'length-40', label: '40cm (Choker)', labelCn: '40厘米（颈链）', value: 'length-40', upcharge: 0, description: 'Sits snug around the neck.', descriptionCn: '紧贴颈部。' },
        { id: 'length-45', label: '45cm (Collarbone)', labelCn: '45厘米（锁骨）', value: 'length-45', upcharge: 0, description: 'Rests at the collarbone. Most popular.', descriptionCn: '停在锁骨处。最受欢迎。' },
        { id: 'length-50', label: '50cm (Below Collarbone)', labelCn: '50厘米（锁骨下）', value: 'length-50', upcharge: 0, description: 'Just below the collarbone.', descriptionCn: '锁骨下方。' },
        { id: 'length-55', label: '55cm (Mid-Chest)', labelCn: '55厘米（胸中）', value: 'length-55', upcharge: 0, description: 'Mid-chest. Statement length.', descriptionCn: '胸部中间。宣言长度。' },
        { id: 'length-60', label: '60cm (Long Drop)', labelCn: '60厘米（长垂）', value: 'length-60', upcharge: 0, description: 'Long dramatic drop.', descriptionCn: '长戏剧性垂坠。' },
    ],
};
// ── 8d-7: Adjustable Length? ──
const pendantAdjustableStep = {
    id: 'pendant-adjustable',
    name: 'Adjustable Length?',
    nameCn: '可调节长度？',
    type: 'card-grid',
    description: 'Would you like flexibility in length?',
    descriptionCn: '您想要长度灵活性吗？',
    condition: (selections) => selections['category'] === 'pendant',
    options: [
        { id: 'fixed', label: 'Fixed', labelCn: '固定', value: 'fixed', upcharge: 0, description: 'Exactly as chosen.', descriptionCn: '如所选长度。' },
        { id: 'adjustable-5cm', label: 'Adjustable ±5cm', labelCn: '可调±5厘米', value: 'adjustable-5cm', upcharge: 0, description: 'Small sliding adjuster or two ring stops. Versatile for layering.', descriptionCn: '小滑动调节器或两个环扣。适合叠戴。' },
    ],
};
// ══════════════════════════════════════════
// 8e: Necklace Branch
// ══════════════════════════════════════════
// ── 8e-1: Necklace Style / Structure ──
const necklaceStyleStep = {
    id: 'necklace-style',
    name: 'Necklace Style / Structure',
    nameCn: '项链风格/结构',
    type: 'card-grid',
    description: 'A necklace without a pendant — the design is the chain itself.',
    descriptionCn: '没有吊坠的项链——设计就是链条本身。',
    condition: (selections) => selections['category'] === 'necklace',
    options: [
        { id: 'tennis', label: 'Tennis Necklace', labelCn: '网球项链', value: 'tennis', upcharge: 0, description: 'Continuous line of identical stones all the way around. Unbroken glamour.', descriptionCn: '连续一排相同宝石环绕。不间断的魅力。' },
        { id: 'station', label: 'Station Necklace', labelCn: '间隔项链', value: 'station', upcharge: 0, description: 'Individual stones at intervals along a delicate chain. Effortless and modern.', descriptionCn: '沿精致链条间隔分布的单颗宝石。轻松现代。' },
        { id: 'graduated', label: 'Graduated Necklace', labelCn: '渐变项链', value: 'graduated', upcharge: 0, description: 'Stones increase in size toward the centre symmetrically. Formal, timeless.', descriptionCn: '宝石向中心对称递增。正式、永恒。' },
        { id: 'collar-choker', label: 'Collar / Choker', labelCn: '颈圈/短项链', value: 'collar-choker', upcharge: 0, description: 'Sits snugly at base of throat. Can be rigid or flexible.', descriptionCn: '紧贴喉部底端。可刚性或柔性。' },
        { id: 'lariat', label: 'Lariat / Y-Necklace', labelCn: '套索/Y形项链', value: 'lariat', upcharge: 0, description: 'Long chain that drops into a Y-shape at the front. Modern, adjustable.', descriptionCn: '长链在前方呈Y形下垂。现代可调。' },
        { id: 'bib', label: 'Bib Necklace', labelCn: '围嘴项链', value: 'bib', upcharge: 0, description: 'Multiple rows of stones fan across the décolletage. Show-stopping.', descriptionCn: '多排宝石扇形展开于胸前。惊艳全场。' },
        { id: 'layering-chain', label: 'Layering Chain', labelCn: '叠戴链', value: 'layering-chain', upcharge: 0, description: 'Fine standalone chain designed to be worn with other necklaces.', descriptionCn: '精细独立链，设计与其他项链叠戴。' },
        { id: 'opera-long', label: 'Opera / Long Chain', labelCn: '歌剧/长链', value: 'opera-long', upcharge: 0, description: '70–90cm. Worn long, doubled, or knotted. Versatile and dramatic.', descriptionCn: '70-90厘米。长戴、双绕或打结。百变戏剧感。' },
    ],
};
// ── 8e-2: Chain Style (same as 8d-5) ──
const necklaceChainStyleStep = {
    id: 'necklace-chain-style',
    name: 'Chain Style',
    nameCn: '链条风格',
    type: 'card-grid',
    description: 'The chain that forms your necklace.',
    descriptionCn: '构成项链的链条。',
    condition: (selections) => selections['category'] === 'necklace',
    options: [
        { id: 'cable', label: 'Cable', labelCn: '十字链', value: 'cable', upcharge: 0, description: 'Simple oval interlocking links. Delicate and timeless.', descriptionCn: '简单椭圆形互锁链节。精致永恒。' },
        { id: 'curb', label: 'Curb', labelCn: '马鞭链', value: 'curb', upcharge: 0, description: 'Flat uniform twisted links. Slightly bolder than cable.', descriptionCn: '扁平均匀扭转链节。比十字链更粗犷。' },
        { id: 'rope', label: 'Rope', labelCn: '绳链', value: 'rope', upcharge: 0, description: 'Tightly twisted strands that spiral and shimmer.', descriptionCn: '紧密扭转螺旋闪烁。' },
        { id: 'box', label: 'Box', labelCn: '盒链', value: 'box', upcharge: 0, description: 'Square links. Sturdy, modern, geometric.', descriptionCn: '方形链节。坚固、现代、几何。' },
        { id: 'singapore', label: 'Singapore / Twisted', labelCn: '新加坡/扭转链', value: 'singapore', upcharge: 0, description: 'Fine links twisted to create a fluid ripple. Catches light beautifully.', descriptionCn: '细链节扭转形成流动波纹。美丽捕光。' },
        { id: 'belcher', label: 'Belcher / Rolo', labelCn: '圆环链', value: 'belcher', upcharge: 0, description: 'Wide D-shaped links. Chunky, gender-neutral.', descriptionCn: '宽D形链节。粗犷、中性。' },
        { id: 'trace', label: 'Trace', labelCn: '细链', value: 'trace', upcharge: 0, description: 'Ultra-fine oval links. Barely-there. Ideal for layering.', descriptionCn: '超细椭圆链节。几乎看不见。适合叠戴。' },
        { id: 'snake', label: 'Snake', labelCn: '蛇链', value: 'snake', upcharge: 0, description: 'Smooth flexible coil. Sleek and architectural.', descriptionCn: '光滑柔韧线圈。时尚建筑感。' },
    ],
};
// ── 8e-3: Stone Placement Along Chain ──
const necklaceStonePlacementStep = {
    id: 'necklace-stone-placement',
    name: 'Stone Placement Along Chain',
    nameCn: '沿链宝石位置',
    type: 'card-grid',
    description: 'Where do the stones live on the chain?',
    descriptionCn: '宝石在链上的位置？',
    condition: (selections) => selections['category'] === 'necklace' && selections['stone'] !== 'none',
    options: [
        { id: 'evenly-spaced', label: 'Evenly Spaced, Uniform', labelCn: '均匀分布', value: 'evenly-spaced', upcharge: 0, description: 'Clean and consistent.', descriptionCn: '整齐一致。' },
        { id: 'graduated-centre', label: 'Graduated (Larger in Centre)', labelCn: '渐变（中心较大）', value: 'graduated-centre', upcharge: 0, description: 'Draws the eye inward. Formal and flattering.', descriptionCn: '引导视线向内。正式迷人。' },
        { id: 'asymmetric', label: 'Asymmetric Placement', labelCn: '不对称分布', value: 'asymmetric', upcharge: 0, description: 'Stones clustered on one side. Editorial.', descriptionCn: '宝石聚集一侧。编辑风格。' },
        { id: 'front-only', label: 'Front-only (Bottom Third)', labelCn: '仅前方（底部三分之一）', value: 'front-only', upcharge: 0, description: 'Stones on front portion only; back is plain chain.', descriptionCn: '仅前方有宝石；后方为素链。' },
    ],
};
// ── 8e-4: Setting Style Along Chain ──
const necklaceSettingStyleStep = {
    id: 'necklace-setting-style',
    name: 'Setting Style Along Chain',
    nameCn: '沿链镶嵌方式',
    type: 'card-grid',
    description: 'How stones are held along the chain.',
    descriptionCn: '宝石沿链条的固定方式。',
    condition: (selections) => selections['category'] === 'necklace' && selections['stone'] !== 'none',
    options: [
        { id: 'individual-claw', label: 'Individual Claw', labelCn: '独立爪镶', value: 'individual-claw', upcharge: 0, description: 'Each stone held by its own claws along the chain.', descriptionCn: '每颗宝石沿链由独立爪固定。' },
        { id: 'bezel', label: 'Bezel', labelCn: '包镶', value: 'bezel', upcharge: 0, description: 'Metal rim wraps each stone. Smooth and protective.', descriptionCn: '金属边包裹每颗宝石。光滑保护。' },
        { id: 'pave', label: 'Pavé', labelCn: '密镶', value: 'pave', upcharge: 0, description: 'Tiny stones set close together along the chain.', descriptionCn: '小宝石沿链紧密排列。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Stones sit in a continuous metal channel.', descriptionCn: '宝石嵌入连续金属槽中。' },
        { id: 'bar', label: 'Bar', labelCn: '条镶', value: 'bar', upcharge: 0, description: 'Metal bars between each stone. Clean and structured.', descriptionCn: '每颗宝石间的金属条。整洁有结构。' },
    ],
};
// ── 8e-5: Clasp Style ──
const necklaceClaspStep = {
    id: 'necklace-clasp',
    name: 'Clasp Style',
    nameCn: '扣环风格',
    type: 'card-grid',
    description: 'How it closes around your neck.',
    descriptionCn: '如何在颈部闭合。',
    condition: (selections) => selections['category'] === 'necklace',
    options: [
        { id: 'lobster', label: 'Lobster Clasp', labelCn: '龙虾扣', value: 'lobster', upcharge: 0, description: 'Everyday standard. Reliable, unobtrusive.', descriptionCn: '日常标准。可靠、低调。' },
        { id: 'spring-ring', label: 'Spring Ring', labelCn: '弹簧圈', value: 'spring-ring', upcharge: 0, description: 'Compact and delicate. Suits fine chains.', descriptionCn: '紧凑精致。适合细链。' },
        { id: 'box-clasp', label: 'Box Clasp', labelCn: '盒扣', value: 'box-clasp', upcharge: 0, description: 'Clicks shut. Preferred for tennis necklaces. Flat and secure.', descriptionCn: '点击式关闭。网球项链首选。扁平安全。' },
        { id: 'toggle', label: 'Toggle Clasp', labelCn: '棒扣', value: 'toggle', upcharge: 0, description: 'T-bar through a ring. Decorative — the clasp becomes a design feature.', descriptionCn: 'T形棒穿过环。装饰性——扣环成为设计特色。' },
        { id: 'magnetic', label: 'Magnetic Clasp', labelCn: '磁扣', value: 'magnetic', upcharge: 0, description: 'Snaps together. Easy for those who struggle with fine clasps.', descriptionCn: '磁性吸合。方便手不灵活者。' },
        { id: 'infinity-slide', label: 'Infinity / Slide Lock', labelCn: '无限/滑锁', value: 'infinity-slide', upcharge: 0, description: 'Figure-8 loop. Minimal and seamless-looking.', descriptionCn: '8字环。极简无缝外观。' },
        { id: 'lobster-extender', label: 'Lobster with Extender', labelCn: '龙虾扣+延长链', value: 'lobster-extender', upcharge: 0, description: 'Extender chain allows multiple wearing lengths.', descriptionCn: '延长链可多种佩戴长度。' },
    ],
};
// ── 8e-6: Chain Length ──
const necklaceLengthStep = {
    id: 'necklace-length',
    name: 'Chain Length',
    nameCn: '链条长度',
    type: 'card-grid',
    description: 'Choose the perfect length for your neckline.',
    descriptionCn: '选择适合您领口的完美长度。',
    condition: (selections) => selections['category'] === 'necklace',
    options: [
        { id: 'chain-40', label: '40cm', labelCn: '40厘米', value: 'chain-40', upcharge: 0 },
        { id: 'chain-45', label: '45cm', labelCn: '45厘米', value: 'chain-45', upcharge: 0 },
        { id: 'chain-50', label: '50cm', labelCn: '50厘米', value: 'chain-50', upcharge: 0 },
        { id: 'chain-55', label: '55cm', labelCn: '55厘米', value: 'chain-55', upcharge: 0 },
        { id: 'chain-60', label: '60cm', labelCn: '60厘米', value: 'chain-60', upcharge: 0 },
        { id: 'chain-70', label: '70cm', labelCn: '70厘米', value: 'chain-70', upcharge: 0 },
        { id: 'chain-80', label: '80cm', labelCn: '80厘米', value: 'chain-80', upcharge: 0 },
    ],
};
// ══════════════════════════════════════════
// 8f: Bracelet Branch
// ══════════════════════════════════════════
// ── 8f-1: Bracelet Style ──
const braceletStyleStep = {
    id: 'bracelet-style',
    name: 'Bracelet Style',
    nameCn: '手链风格',
    type: 'card-grid',
    description: 'What sits on your wrist?',
    descriptionCn: '腕上佩戴什么？',
    condition: (selections) => selections['category'] === 'bracelet',
    options: [
        { id: 'tennis', label: 'Tennis Bracelet', labelCn: '网球手链', value: 'tennis', upcharge: 0, description: 'Continuous line of identical stones on a flexible band. The classic.', descriptionCn: '连续相同宝石在柔性带上。经典。' },
        { id: 'station', label: 'Station Bracelet', labelCn: '间隔手链', value: 'station', upcharge: 0, description: 'Individual stones along a delicate chain with visible chain between.', descriptionCn: '沿精致链条间隔分布单颗宝石。' },
        { id: 'chain-bracelet', label: 'Chain Bracelet', labelCn: '链式手链', value: 'chain-bracelet', upcharge: 0, description: 'Pure metal chain — the links are the design. Stack anchor.', descriptionCn: '纯金属链——链节就是设计。叠戴基础。' },
        { id: 'charm-bracelet', label: 'Charm Bracelet', labelCn: '挂饰手链', value: 'charm-bracelet', upcharge: 0, description: 'Chain with 3 starter charm positions; additional charms sold separately.', descriptionCn: '链条带3个起始吊饰位；额外吊饰另售。' },
        { id: 'cuff-bracelet', label: 'Cuff Bracelet', labelCn: '手镯', value: 'cuff-bracelet', upcharge: 0, description: 'Rigid open-ended arc. Bold and structural.', descriptionCn: '刚性开口弧形。大胆有结构。' },
        { id: 'link-bracelet', label: 'Link Bracelet', labelCn: '环扣手链', value: 'link-bracelet', upcharge: 0, description: 'Wide flat interlocking plates. More surface area, more statement.', descriptionCn: '宽扁互锁板。更多面积，更多宣言。' },
        { id: 'bar-bracelet', label: 'Bar Bracelet', labelCn: '条形手链', value: 'bar-bracelet', upcharge: 0, description: 'Horizontal ID-style bar on a fine chain. Engraving is the focus.', descriptionCn: '细链上的水平ID样式条。雕刻为焦点。' },
    ],
};
// ── 8f-2: Chain / Link Style ──
const braceletChainStep = {
    id: 'bracelet-chain',
    name: 'Chain / Link Style',
    nameCn: '链条/链节风格',
    type: 'card-grid',
    description: 'The structure of the chain.',
    descriptionCn: '链条的结构。',
    condition: (selections) => selections['category'] === 'bracelet',
    options: [
        { id: 'curb', label: 'Curb / Cuban', labelCn: '马鞭/古巴链', value: 'curb', upcharge: 0, description: 'Flat interlocked twisted links. Bold and structured.', descriptionCn: '扁平互锁扭转链节。大胆有结构。' },
        { id: 'figaro', label: 'Figaro', labelCn: '费加罗链', value: 'figaro', upcharge: 0, description: 'Alternating short and long links. Italian, rhythmic.', descriptionCn: '长短链节交替。意大利风，有节奏。' },
        { id: 'rope', label: 'Rope', labelCn: '绳链', value: 'rope', upcharge: 0, description: 'Twisted spiral links. Textured, sparkles from all angles.', descriptionCn: '扭转螺旋链节。有纹理，各角度闪耀。' },
        { id: 'paperclip', label: 'Paperclip / Rectangle Link', labelCn: '回形针/长方形链', value: 'paperclip', upcharge: 0, description: 'Long flat open rectangular links. Currently fashion-forward.', descriptionCn: '长扁开放长方形链节。当前时尚前沿。' },
        { id: 'snake', label: 'Snake', labelCn: '蛇链', value: 'snake', upcharge: 0, description: 'Smooth coiled fluid metal. Sleek and tactile.', descriptionCn: '光滑柔韧金属线圈。时尚触感。' },
        { id: 'box', label: 'Box', labelCn: '盒链', value: 'box', upcharge: 0, description: 'Square links in a continuous geometric line.', descriptionCn: '方形链节连续几何线。' },
        { id: 'trace-cable', label: 'Trace / Cable', labelCn: '细链/十字链', value: 'trace-cable', upcharge: 0, description: 'Simple round or oval links. Delicate and fine.', descriptionCn: '简单圆形或椭圆链节。精致细腻。' },
    ],
};
// ── 8f-3: Stone Setting Along Band ──
const braceletSettingStep = {
    id: 'bracelet-setting',
    name: 'Stone Setting Along Band',
    nameCn: '沿带镶嵌方式',
    type: 'card-grid',
    description: 'How stones are held along the bracelet.',
    descriptionCn: '宝石沿手链的固定方式。',
    condition: (selections) => selections['category'] === 'bracelet' && selections['stone'] !== 'none',
    options: [
        { id: '4-prong-claw', label: '4-prong Claw', labelCn: '4爪镶', value: '4-prong-claw', upcharge: 0, description: 'Four claws per stone. Classic and secure.', descriptionCn: '每颗宝石四个爪。经典安全。' },
        { id: 'bezel-per-stone', label: 'Bezel per Stone', labelCn: '逐颗包镶', value: 'bezel-per-stone', upcharge: 0, description: 'Metal rim wraps each individual stone.', descriptionCn: '金属边包裹每颗单独宝石。' },
        { id: 'channel-set', label: 'Channel-set Row', labelCn: '槽镶排', value: 'channel-set', upcharge: 0, description: 'Stones sit in a continuous channel.', descriptionCn: '宝石嵌入连续槽中。' },
        { id: 'pave-surface', label: 'Pavé Surface', labelCn: '密镶表面', value: 'pave-surface', upcharge: 0, description: 'Tiny stones cover the surface.', descriptionCn: '小宝石覆盖表面。' },
        { id: 'shared-prong', label: 'Shared Prong (Fishtail)', labelCn: '共享爪（鱼尾）', value: 'shared-prong', upcharge: 0, description: 'Adjacent stones share prongs. More stone, less metal.', descriptionCn: '相邻宝石共享爪。更多宝石，更少金属。' },
    ],
};
// ── 8f-4: Clasp Style ──
const braceletClaspStep = {
    id: 'bracelet-clasp',
    name: 'Clasp Style',
    nameCn: '扣环风格',
    type: 'card-grid',
    description: 'How it closes around your wrist.',
    descriptionCn: '如何在手腕闭合。',
    condition: (selections) => selections['category'] === 'bracelet',
    options: [
        { id: 'lobster', label: 'Lobster', labelCn: '龙虾扣', value: 'lobster', upcharge: 0, description: 'Everyday standard. Reliable.', descriptionCn: '日常标准。可靠。' },
        { id: 'spring-ring', label: 'Spring Ring', labelCn: '弹簧圈', value: 'spring-ring', upcharge: 0, description: 'Compact and delicate.', descriptionCn: '紧凑精致。' },
        { id: 'box-clasp', label: 'Box Clasp', labelCn: '盒扣', value: 'box-clasp', upcharge: 0, description: 'Recommended for tennis bracelets. Flat and secure.', descriptionCn: '网球手链推荐。扁平安全。' },
        { id: 'toggle', label: 'Toggle', labelCn: '棒扣', value: 'toggle', upcharge: 0, description: 'Most decorative option. T-bar through ring.', descriptionCn: '最具装饰性。T棒穿环。' },
        { id: 'magnetic', label: 'Magnetic', labelCn: '磁扣', value: 'magnetic', upcharge: 0, description: 'Snaps together. Easy one-handed use.', descriptionCn: '磁吸。易单手使用。' },
        { id: 'slide-lock', label: 'Slide Lock', labelCn: '滑锁', value: 'slide-lock', upcharge: 0, description: 'Minimal and seamless.', descriptionCn: '极简无缝。' },
    ],
};
// ── 8f-5: Safety Feature ──
const braceletSafetyStep = {
    id: 'bracelet-safety',
    name: 'Safety Feature',
    nameCn: '安全功能',
    type: 'card-grid',
    description: 'Extra security for your bracelet.',
    descriptionCn: '手链的额外安全保障。',
    condition: (selections) => selections['category'] === 'bracelet',
    options: [
        { id: 'none-safety', label: 'None', labelCn: '无', value: 'none-safety', upcharge: 0, description: 'For lighter everyday pieces.', descriptionCn: '适合轻便日常款。' },
        { id: 'safety-chain', label: 'Safety Chain', labelCn: '安全链', value: 'safety-chain', upcharge: 0, description: 'Secondary fine chain catches bracelet if clasp opens accidentally.', descriptionCn: '备用细链在扣环意外打开时接住手链。' },
        { id: 'double-lock', label: 'Safety Catch / Double Lock', labelCn: '安全扣/双锁', value: 'double-lock', upcharge: 0, description: 'Additional fold-over latch on clasp. Standard for fine tennis bracelets.', descriptionCn: '扣环上的折叠锁扣。高级网球手链标配。' },
        { id: 'double-tongue', label: 'Box Clasp with Double Tongue', labelCn: '双舌盒扣', value: 'double-tongue', upcharge: 0, description: 'Two tongues must both be pressed to release. Most secure option.', descriptionCn: '两个舌片同时按下才能打开。最安全选项。' },
    ],
};
// ── 8f-6: Bracelet Length ──
const braceletLengthStep = {
    id: 'bracelet-length',
    name: 'Bracelet Length',
    nameCn: '手链长度',
    type: 'card-grid',
    description: 'Most women wear 16–17cm; add 1cm for a relaxed fit.',
    descriptionCn: '大多数女性佩戴16-17厘米；加1厘米更宽松。',
    condition: (selections) => selections['category'] === 'bracelet',
    options: [
        { id: 'bracelet-14', label: '14cm', labelCn: '14厘米', value: 'bracelet-14', upcharge: 0 },
        { id: 'bracelet-15', label: '15cm', labelCn: '15厘米', value: 'bracelet-15', upcharge: 0 },
        { id: 'bracelet-16', label: '16cm', labelCn: '16厘米', value: 'bracelet-16', upcharge: 0 },
        { id: 'bracelet-17', label: '17cm', labelCn: '17厘米', value: 'bracelet-17', upcharge: 0 },
        { id: 'bracelet-18', label: '18cm', labelCn: '18厘米', value: 'bracelet-18', upcharge: 0 },
        { id: 'bracelet-19', label: '19cm', labelCn: '19厘米', value: 'bracelet-19', upcharge: 0 },
        { id: 'bracelet-20', label: '20cm', labelCn: '20厘米', value: 'bracelet-20', upcharge: 0 },
    ],
};
// ══════════════════════════════════════════
// 8g: Bangle Branch
// ══════════════════════════════════════════
// ── 8g-1: Bangle Structure / Opening ──
const bangleStructureStep = {
    id: 'bangle-structure',
    name: 'Bangle Structure / Opening',
    nameCn: '手镯结构/开口',
    type: 'card-grid',
    description: 'A bangle is rigid — it slides over the hand onto the wrist.',
    descriptionCn: '手镯是刚性的——从手滑入手腕。',
    condition: (selections) => selections['category'] === 'bangle',
    options: [
        { id: 'full-round', label: 'Full Round / Slip-on', labelCn: '全圆/套入式', value: 'full-round', upcharge: 0, description: 'Complete unbroken circle. Slides over the hand. Most traditional.', descriptionCn: '完整不断的圆。从手滑入。最传统。' },
        { id: 'hinged', label: 'Hinged', labelCn: '铰链式', value: 'hinged', upcharge: 0, description: 'Opens with a hinge and snap clasp. Easier to put on.', descriptionCn: '铰链和按扣打开。更易佩戴。' },
        { id: 'hinged-safety', label: 'Hinged with Safety Lock', labelCn: '铰链+安全锁', value: 'hinged-safety', upcharge: 0, description: 'As above, with additional fold-over safety clasp.', descriptionCn: '同上，附加折叠安全扣。' },
        { id: 'c-shaped', label: 'C-shaped / Open Cuff', labelCn: 'C形/开口手镯', value: 'c-shaped', upcharge: 0, description: 'Rigid arc without full closure. Pressed onto wrist. Adjustable.', descriptionCn: '无完全闭合的刚性弧。压入手腕。可调。' },
        { id: 'spiral-coil', label: 'Spiral / Coil', labelCn: '螺旋', value: 'spiral-coil', upcharge: 0, description: 'Metal spiral wrapping the wrist 1.5–3 coils. Sculptural.', descriptionCn: '金属螺旋环绕手腕1.5-3圈。雕塑感。' },
        { id: 'stacking-set', label: 'Stacking Set (2 or 3)', labelCn: '叠戴套装 (2或3)', value: 'stacking-set', upcharge: 0, description: 'Designed together — each slightly different. Sold as a curated stack.', descriptionCn: '一起设计——每个略有不同。作为精选叠戴套装出售。' },
    ],
};
// ── 8g-2: Bangle Profile / Cross-section ──
const bangleProfileStep = {
    id: 'bangle-profile',
    name: 'Bangle Profile / Cross-section',
    nameCn: '手镯轮廓/截面',
    type: 'card-grid',
    description: 'The cross-section shape of your bangle.',
    descriptionCn: '手镯的截面形状。',
    condition: (selections) => selections['category'] === 'bangle',
    options: [
        { id: 'round-profile', label: 'Round', labelCn: '圆形', value: 'round-profile', upcharge: 0, description: 'Simple wire or tube. Light and comfortable.', descriptionCn: '简单线材或管状。轻便舒适。' },
        { id: 'd-shaped', label: 'D-shaped / Flat Inside', labelCn: 'D形/内平', value: 'd-shaped', upcharge: 0, description: 'Flat against wrist, rounded outside. Comfortable for all-day wear.', descriptionCn: '平贴手腕，外侧圆弧。全天佩戴舒适。' },
        { id: 'knife-edge', label: 'Knife Edge', labelCn: '刀锋', value: 'knife-edge', upcharge: 0, description: 'Sharp ridge on outer edge. Graphic and modern.', descriptionCn: '外缘锐脊。图形感现代。' },
        { id: 'square-profile', label: 'Square', labelCn: '方形', value: 'square-profile', upcharge: 0, description: 'Squared-off profile. Architectural and angular.', descriptionCn: '方形轮廓。建筑感有棱角。' },
        { id: 'flat-ribbon', label: 'Flat / Ribbon', labelCn: '扁平/丝带', value: 'flat-ribbon', upcharge: 0, description: 'Wide thin flat band. More surface area for detail.', descriptionCn: '宽薄扁带。更多细节面积。' },
    ],
};
// ── 8g-3: Width ──
const bangleWidthStep = {
    id: 'bangle-width',
    name: 'Width',
    nameCn: '宽度',
    type: 'card-grid',
    description: 'How bold do you want it?',
    descriptionCn: '您想要多大胆？',
    condition: (selections) => selections['category'] === 'bangle',
    options: [
        { id: 'width-2mm', label: '2mm', labelCn: '2毫米', value: '2mm', upcharge: 0, description: 'Thread-fine. Delicate. Meant to stack.', descriptionCn: '线般细。精致。适合叠戴。' },
        { id: 'width-4mm', label: '4mm', labelCn: '4毫米', value: '4mm', upcharge: 0, description: 'Slim. Everyday sweet spot.', descriptionCn: '纤细。日常最佳。' },
        { id: 'width-6mm', label: '6mm', labelCn: '6毫米', value: '6mm', upcharge: 0, description: 'Medium. Works alone or as stack anchor.', descriptionCn: '中等。单戴或叠戴基础。' },
        { id: 'width-8mm', label: '8mm', labelCn: '8毫米', value: '8mm', upcharge: 0, description: 'Bold. Enough surface for detail.', descriptionCn: '大胆。足够细节面积。' },
        { id: 'width-10mm', label: '10mm+', labelCn: '10毫米+', value: '10mm', upcharge: 0, description: 'Cuff-width. Architectural.', descriptionCn: '手镯宽度。建筑感。' },
    ],
};
// ── 8g-4: Surface Design / Finish ──
const bangleFinishStep = {
    id: 'bangle-finish',
    name: 'Surface Design / Finish',
    nameCn: '表面设计/处理',
    type: 'card-grid',
    description: 'How the surface looks and feels.',
    descriptionCn: '表面的外观与触感。',
    condition: (selections) => selections['category'] === 'bangle',
    options: [
        { id: 'high-polish', label: 'Plain / High Polish', labelCn: '素面/高光', value: 'high-polish', upcharge: 0, description: 'Mirror-bright. Timeless.', descriptionCn: '镜面明亮。永恒。' },
        { id: 'brushed-satin', label: 'Brushed / Satin', labelCn: '拉丝/缎面', value: 'brushed-satin', upcharge: 0, description: 'Directional texture, soft luminosity.', descriptionCn: '方向性纹理，柔和光泽。' },
        { id: 'hammered', label: 'Hammered', labelCn: '锤纹', value: 'hammered', upcharge: 0, description: 'Hand-worked irregular dimples. Artisan.', descriptionCn: '手工不规则凹痕。工匠感。' },
        { id: 'engraved-pattern', label: 'Engraved Pattern', labelCn: '雕刻图案', value: 'engraved-pattern', upcharge: 0, description: 'Repeated motif: chevron, botanical, geometric, wave, or custom.', descriptionCn: '重复图案：人字纹、植物、几何、波浪或定制。' },
        { id: 'milgrain-edge', label: 'Milgrain / Beaded Edge', labelCn: '珠边', value: 'milgrain-edge', upcharge: 0, description: 'Tiny bead trim along both edges.', descriptionCn: '两侧边缘微小珠状装饰。' },
        { id: 'full-pave', label: 'Fully Pavé-Set', labelCn: '全密镶', value: 'full-pave', upcharge: 0, description: 'Entire outer surface encrusted with diamonds or coloured stones.', descriptionCn: '整个外表面镶满钻石或彩色宝石。' },
        { id: 'partial-stone', label: 'Partial Stone Band', labelCn: '部分宝石带', value: 'partial-stone', upcharge: 0, description: 'Top quarter or half set with stones; rest is plain metal.', descriptionCn: '上方四分之一或一半镶石；其余素金属。' },
    ],
};
// ── 8g-5: Stone Setting ──
const bangleSettingStep = {
    id: 'bangle-setting',
    name: 'Stone Setting',
    nameCn: '宝石镶嵌',
    type: 'card-grid',
    description: 'How stones are held. Choose placement: full, top half, or front only.',
    descriptionCn: '宝石的固定方式。选择位置：全圈、上半或仅前方。',
    condition: (selections) => selections['category'] === 'bangle' && selections['stone'] !== 'none',
    options: [
        { id: 'pave', label: 'Pavé', labelCn: '密镶', value: 'pave', upcharge: 0, description: 'Tiny stones set close together.', descriptionCn: '小宝石紧密排列。' },
        { id: 'micro-pave', label: 'Micro-Pavé', labelCn: '微密镶', value: 'micro-pave', upcharge: 0, description: 'Even smaller, more precisely set.', descriptionCn: '更小更精确镶嵌。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Stones in a continuous channel.', descriptionCn: '宝石嵌入连续槽中。' },
        { id: 'individual-claw', label: 'Individual Claw', labelCn: '独立爪镶', value: 'individual-claw', upcharge: 0, description: 'Each stone held by its own claws.', descriptionCn: '每颗宝石由独立爪固定。' },
        { id: 'bezel', label: 'Bezel', labelCn: '包镶', value: 'bezel', upcharge: 0, description: 'Metal rim wraps each stone.', descriptionCn: '金属边包裹每颗宝石。' },
        { id: 'bar', label: 'Bar', labelCn: '条镶', value: 'bar', upcharge: 0, description: 'Metal bars between stones.', descriptionCn: '宝石间金属条。' },
    ],
};
// ══════════════════════════════════════════
// 8h: Brooch Branch
// ══════════════════════════════════════════
// ── 8h-1: Brooch Silhouette / Form ──
const broochStyleStep = {
    id: 'brooch-style',
    name: 'Brooch Silhouette / Form',
    nameCn: '胸针轮廓/形态',
    type: 'card-grid',
    description: 'Wearable sculpture — the most creative category.',
    descriptionCn: '可佩戴的雕塑——最具创意的类别。',
    condition: (selections) => selections['category'] === 'brooch',
    options: [
        { id: 'floral-corsage', label: 'Floral / Corsage', labelCn: '花卉/胸花', value: 'floral-corsage', upcharge: 0, description: 'Single flower or spray. Petals, stems, leaves. Naturalistic or stylised.', descriptionCn: '单花或花束。花瓣、茎、叶。自然主义或风格化。' },
        { id: 'starburst', label: 'Starburst / Sunburst', labelCn: '星芒/日芒', value: 'starburst', upcharge: 0, description: 'Radiating rays from a central stone. Bold and graphic.', descriptionCn: '从中心石放射的光芒。大胆图形感。' },
        { id: 'bar-brooch', label: 'Bar Brooch', labelCn: '条形胸针', value: 'bar-brooch', upcharge: 0, description: 'Horizontal elongated bar with central motif. Clean, easy to wear on a lapel.', descriptionCn: '水平长条带中心图案。简洁，易戴于翻领。' },
        { id: 'crescent', label: 'Crescent Moon', labelCn: '新月', value: 'crescent', upcharge: 0, description: 'Curved arc set with stones. Celestial, romantic.', descriptionCn: '弧形镶石。天体般浪漫。' },
        { id: 'bow-ribbon', label: 'Bow / Ribbon', labelCn: '蝴蝶结/丝带', value: 'bow-ribbon', upcharge: 0, description: 'Looped bow silhouette. Feminine and classic; can be pavé-encrusted.', descriptionCn: '环形蝴蝶结轮廓。女性化经典；可密镶。' },
        { id: 'geometric-abstract', label: 'Geometric / Abstract', labelCn: '几何/抽象', value: 'geometric-abstract', upcharge: 0, description: 'Triangle, circle, arc, interlocking rings, or free-form sculptural shape.', descriptionCn: '三角、圆、弧、互锁环或自由形雕塑形状。' },
        { id: 'animal-figural', label: 'Animal / Figural', labelCn: '动物/具象', value: 'animal-figural', upcharge: 0, description: 'Bird, butterfly, dragonfly, or other nature-inspired motif.', descriptionCn: '鸟、蝴蝶、蜻蜓或其他自然灵感图案。' },
        { id: 'cluster-bouquet', label: 'Cluster / Bouquet', labelCn: '群镶/花束', value: 'cluster-bouquet', upcharge: 0, description: 'Multiple stones densely arranged — pure light, no visible form.', descriptionCn: '多颗宝石密集排列——纯光，无可见形态。' },
        { id: 'circular-disc', label: 'Circular / Disc', labelCn: '圆形/圆盘', value: 'circular-disc', upcharge: 0, description: 'Flat or domed circular form. Like a coin of diamonds and gold.', descriptionCn: '平面或穹顶圆形。如钻石与黄金的硬币。' },
        { id: 'letter-initial', label: 'Letter / Initial', labelCn: '字母/首字母', value: 'letter-initial', upcharge: 0, description: 'Customer\'s initial in pavé or plain gold. Highly personal.', descriptionCn: '客户首字母密镶或素金。高度个性化。' },
    ],
};
// ── 8h-2: Stone Setting ──
const broochSettingStep = {
    id: 'brooch-setting',
    name: 'Stone Setting',
    nameCn: '宝石镶嵌',
    type: 'card-grid',
    description: 'The brooch surface can be fully or partially stone-set.',
    descriptionCn: '胸针表面可全部或部分镶石。',
    condition: (selections) => selections['category'] === 'brooch' && selections['stone'] !== 'none',
    options: [
        { id: 'individual-claw', label: 'Individual Claw', labelCn: '独立爪镶', value: 'individual-claw', upcharge: 0, description: 'Each stone held by its own claws.', descriptionCn: '每颗宝石由独立爪固定。' },
        { id: 'bezel', label: 'Bezel', labelCn: '包镶', value: 'bezel', upcharge: 0, description: 'Metal rim wraps each stone.', descriptionCn: '金属边包裹每颗宝石。' },
        { id: 'pave', label: 'Pavé', labelCn: '密镶', value: 'pave', upcharge: 0, description: 'Tiny stones set close together.', descriptionCn: '小宝石紧密排列。' },
        { id: 'micro-pave', label: 'Micro-Pavé', labelCn: '微密镶', value: 'micro-pave', upcharge: 0, description: 'Even smaller, more precisely set.', descriptionCn: '更小更精确镶嵌。' },
        { id: 'channel', label: 'Channel', labelCn: '槽镶', value: 'channel', upcharge: 0, description: 'Stones in a continuous channel.', descriptionCn: '宝石嵌入连续槽中。' },
        { id: 'invisible', label: 'Invisible Setting', labelCn: '隐形镶嵌', value: 'invisible', upcharge: 0, description: 'No visible prongs — stones appear to float.', descriptionCn: '无可见爪——宝石似漂浮。' },
    ],
};
// ── 8h-3: Dimensionality ──
const broochDimensionalityStep = {
    id: 'brooch-dimensionality',
    name: 'Dimensionality',
    nameCn: '立体感',
    type: 'card-grid',
    description: 'How sculptural is the piece?',
    descriptionCn: '作品的雕塑感如何？',
    condition: (selections) => selections['category'] === 'brooch',
    options: [
        { id: 'flat-2d', label: 'Flat / Two-dimensional', labelCn: '平面/二维', value: 'flat-2d', upcharge: 0, description: 'Lies flush against fabric. Graphic, minimal.', descriptionCn: '平贴布料。图形化、极简。' },
        { id: 'low-relief', label: 'Low-relief', labelCn: '浅浮雕', value: 'low-relief', upcharge: 0, description: 'Slight depth and dimension. More interesting in person.', descriptionCn: '略有深度和立体感。实物更有趣。' },
        { id: 'high-relief', label: 'High-relief / Three-dimensional', labelCn: '高浮雕/三维', value: 'high-relief', upcharge: 0, description: 'Fully sculpted — petals that truly look like petals.', descriptionCn: '完全雕塑——花瓣真的像花瓣。' },
        { id: 'en-tremblant', label: 'Articulated / Moving Parts', labelCn: '活动式/颤动', value: 'en-tremblant', upcharge: 0, description: 'Elements that tremble and move (en tremblant). Precious and theatrical.', descriptionCn: '颤动和移动的元素。珍贵而戏剧性。' },
    ],
};
// ── 8h-4: Pin Backing Style ──
const broochPinStep = {
    id: 'brooch-pin',
    name: 'Pin Backing Style',
    nameCn: '针扣风格',
    type: 'card-grid',
    description: 'How does the brooch attach to fabric?',
    descriptionCn: '胸针如何固定在布料上？',
    condition: (selections) => selections['category'] === 'brooch',
    options: [
        { id: 'standard-pin', label: 'Standard Pin + Catch', labelCn: '标准针+扣', value: 'standard-pin', upcharge: 0, description: 'Classic single pin with roll-over safety catch. Universal.', descriptionCn: '经典单针带翻转安全扣。通用。' },
        { id: 'double-pin', label: 'Double Pin', labelCn: '双针', value: 'double-pin', upcharge: 0, description: 'Two pins side by side — keeps brooch from rotating on fabric.', descriptionCn: '两根针并排——防止胸针在布料上旋转。' },
        { id: 'locking-c', label: 'Locking C-catch', labelCn: '锁定C扣', value: 'locking-c', upcharge: 0, description: 'Pin folds into locking clasp. More secure than roll catch.', descriptionCn: '针折入锁定扣。比翻转扣更安全。' },
        { id: 'trombone-box', label: 'Trombone / Box Pin', labelCn: '长号/盒针', value: 'trombone-box', upcharge: 0, description: 'Pin slides into box catch and locks. Most secure — for heavy pieces.', descriptionCn: '针滑入盒扣并锁定。最安全——适合重件。' },
        { id: 'clip-back', label: 'Clip-back (No Pin)', labelCn: '夹扣（无针）', value: 'clip-back', upcharge: 0, description: 'Hinged clip grips fabric without piercing. For thick fabrics, hats.', descriptionCn: '铰链夹夹住布料不穿刺。适合厚布料、帽子。' },
        { id: 'dual-pin-clip', label: 'Dual: Pin + Clip', labelCn: '双用：针+夹', value: 'dual-pin-clip', upcharge: 0, description: 'Can be worn as pin OR clip depending on fabric. Maximum versatility.', descriptionCn: '可作为针或夹佩戴。最大灵活性。' },
    ],
};
// ── 8h-5: Convertibility ──
const broochConvertibilityStep = {
    id: 'brooch-convertibility',
    name: 'Convertibility',
    nameCn: '可转换性',
    type: 'card-grid',
    description: 'Can it be worn another way?',
    descriptionCn: '可以换种方式佩戴吗？',
    condition: (selections) => selections['category'] === 'brooch',
    options: [
        { id: 'brooch-only', label: 'Brooch Only', labelCn: '仅胸针', value: 'brooch-only', upcharge: 0, description: 'A dedicated brooch.', descriptionCn: '专用胸针。' },
        { id: 'add-bail', label: 'Add a Bail Loop', labelCn: '添加挂扣环', value: 'add-bail', upcharge: 0, description: 'Discreet loop soldered to back — hang on a chain as pendant when not pinned.', descriptionCn: '背面焊接隐蔽环——不别时可挂链作吊坠。' },
        { id: 'add-chain-connectors', label: 'Add Chain Connectors', labelCn: '添加链连接器', value: 'add-chain-connectors', upcharge: 0, description: 'Loops at both sides — two brooches connected by chain across the chest.', descriptionCn: '两侧环扣——两枚胸针由链条连接横跨胸前。' },
    ],
};
// ── 8h-6: Brooch Size ──
const broochSizeStep = {
    id: 'brooch-size',
    name: 'Brooch Size',
    nameCn: '胸针尺寸',
    type: 'card-grid',
    description: 'How much presence do you want?',
    descriptionCn: '您想要多大的存在感？',
    condition: (selections) => selections['category'] === 'brooch',
    options: [
        { id: 'brooch-small', label: 'Small (2–3cm)', labelCn: '小号 (2-3cm)', value: 'brooch-small', upcharge: 0, description: 'Subtle. Ideal for collar or shirt lapel.', descriptionCn: '低调。适合衣领或衬衫翻领。' },
        { id: 'brooch-medium', label: 'Medium (3–5cm)', labelCn: '中号 (3-5cm)', value: 'brooch-medium', upcharge: 0, description: 'Versatile everyday. Works on jackets, blazers, scarves.', descriptionCn: '日常百搭。适合外套、西装、围巾。' },
        { id: 'brooch-large', label: 'Large (5–8cm)', labelCn: '大号 (5-8cm)', value: 'brooch-large', upcharge: 0, description: 'A statement. Focal point of an outfit on a coat or evening dress.', descriptionCn: '宣言。外套或晚礼服上的焦点。' },
    ],
};
// ══════════════════════════════════════════
// 8i: Anklet Branch
// ══════════════════════════════════════════
// ── 8i-1: Anklet Style ──
const ankletStyleStep = {
    id: 'anklet-style',
    name: 'Anklet Style',
    nameCn: '脚链风格',
    type: 'card-grid',
    description: 'Delicate and intimate — seen only when the wearer chooses.',
    descriptionCn: '精致而私密——只在佩戴者选择时才被看见。',
    condition: (selections) => selections['category'] === 'anklet',
    options: [
        { id: 'delicate-chain', label: 'Delicate Chain Anklet', labelCn: '精致链式脚链', value: 'delicate-chain', upcharge: 0, description: 'A fine chain that sits at the ankle. Barely there, permanently beautiful.', descriptionCn: '细链落于脚踝。几乎隐形，永恒美丽。' },
        { id: 'station-anklet', label: 'Station Anklet', labelCn: '间隔脚链', value: 'station-anklet', upcharge: 0, description: 'Individual stones along a fine chain. Subtle sparkle with every step.', descriptionCn: '沿细链间隔分布单颗宝石。每步微妙闪耀。' },
        { id: 'tennis-anklet', label: 'Tennis Anklet', labelCn: '网球脚链', value: 'tennis-anklet', upcharge: 0, description: 'Continuous line of stones all around the ankle.', descriptionCn: '连续宝石环绕脚踝。' },
        { id: 'charm-anklet', label: 'Charm Anklet', labelCn: '挂饰脚链', value: 'charm-anklet', upcharge: 0, description: 'Fine chain with 1–3 small charms at intervals. Playful and personal.', descriptionCn: '细链间隔1-3个小吊饰。俏皮个性。' },
        { id: 'layered-anklet', label: 'Layered / Multi-strand', labelCn: '分层/多股', value: 'layered-anklet', upcharge: 0, description: 'Two or three parallel chains connected at the clasp as one piece.', descriptionCn: '两三条平行链在扣环处连为一体。' },
        { id: 'cuff-anklet', label: 'Cuff Anklet', labelCn: '硬圈脚链', value: 'cuff-anklet', upcharge: 0, description: 'Rigid or semi-rigid arc around the ankle bone. Architectural.', descriptionCn: '刚性或半刚性弧形环绕踝骨。建筑感。' },
        { id: 'body-chain-anklet', label: 'Body Chain Anklet', labelCn: '身体链脚链', value: 'body-chain-anklet', upcharge: 0, description: 'Anklet with extension chain running up the foot to a toe ring.', descriptionCn: '脚链带延伸链延伸到趾环。' },
    ],
};
// ── 8i-2: Chain Style ──
const ankletChainStep = {
    id: 'anklet-chain',
    name: 'Chain Style',
    nameCn: '链条风格',
    type: 'card-grid',
    description: 'Trace and cable recommended — most complementary to the ankle\'s delicacy.',
    descriptionCn: '推荐细链和十字链——最衬托脚踝的精致。',
    condition: (selections) => selections['category'] === 'anklet',
    options: [
        { id: 'cable', label: 'Cable', labelCn: '十字链', value: 'cable', upcharge: 0, description: 'Simple oval interlocking links. Delicate and timeless.', descriptionCn: '简单椭圆形互锁链节。精致永恒。' },
        { id: 'trace', label: 'Trace', labelCn: '细链', value: 'trace', upcharge: 0, description: 'Ultra-fine oval links. Barely-there. Ideal for anklets.', descriptionCn: '超细椭圆链节。几乎看不见。脚链理想之选。' },
        { id: 'curb', label: 'Curb', labelCn: '马鞭链', value: 'curb', upcharge: 0, description: 'Flat uniform twisted links.', descriptionCn: '扁平均匀扭转链节。' },
        { id: 'rope', label: 'Rope', labelCn: '绳链', value: 'rope', upcharge: 0, description: 'Tightly twisted strands that shimmer.', descriptionCn: '紧密扭转螺旋闪烁。' },
        { id: 'box', label: 'Box', labelCn: '盒链', value: 'box', upcharge: 0, description: 'Square links. Geometric.', descriptionCn: '方形链节。几何感。' },
        { id: 'singapore', label: 'Singapore / Twisted', labelCn: '新加坡/扭转链', value: 'singapore', upcharge: 0, description: 'Fine links twisted. Catches light beautifully.', descriptionCn: '细链节扭转。美丽捕光。' },
        { id: 'snake', label: 'Snake', labelCn: '蛇链', value: 'snake', upcharge: 0, description: 'Smooth flexible coil. Sleek and architectural.', descriptionCn: '光滑柔韧线圈。时尚建筑感。' },
    ],
};
// ── 8i-3: Charm Options (if Charm Anklet) ──
const ankletCharmStep = {
    id: 'anklet-charms',
    name: 'Charm Options',
    nameCn: '吊饰选项',
    type: 'card-grid',
    description: 'Choose up to 3 charms.',
    descriptionCn: '最多选择3个吊饰。',
    condition: (selections) => selections['category'] === 'anklet' && selections['anklet-style'] === 'charm-anklet',
    options: [
        { id: 'charm-star', label: 'Star', labelCn: '星星', value: 'charm-star', upcharge: 0 },
        { id: 'charm-moon', label: 'Crescent Moon', labelCn: '新月', value: 'charm-moon', upcharge: 0 },
        { id: 'charm-heart', label: 'Heart', labelCn: '心形', value: 'charm-heart', upcharge: 0 },
        { id: 'charm-key', label: 'Key', labelCn: '钥匙', value: 'charm-key', upcharge: 0 },
        { id: 'charm-infinity', label: 'Infinity', labelCn: '无限', value: 'charm-infinity', upcharge: 0 },
        { id: 'charm-wave', label: 'Wave', labelCn: '波浪', value: 'charm-wave', upcharge: 0 },
        { id: 'charm-flower', label: 'Flower', labelCn: '花朵', value: 'charm-flower', upcharge: 0 },
        { id: 'charm-butterfly', label: 'Butterfly', labelCn: '蝴蝶', value: 'charm-butterfly', upcharge: 0 },
        { id: 'charm-clover', label: 'Four-leaf Clover', labelCn: '四叶草', value: 'charm-clover', upcharge: 0 },
        { id: 'charm-diamond-drop', label: 'Diamond Solitaire Drop', labelCn: '钻石单颗垂坠', value: 'charm-diamond-drop', upcharge: 0 },
        { id: 'charm-initial', label: 'Initial Letter', labelCn: '首字母', value: 'charm-initial', upcharge: 0 },
        { id: 'charm-coordinates', label: 'Coordinates (Custom)', labelCn: '坐标（定制）', value: 'charm-coordinates', upcharge: 0, description: 'Custom lat/long engraved.', descriptionCn: '自定义经纬度刻字。' },
    ],
};
// ── 8i-4: Clasp Style ──
const ankletClaspStep = {
    id: 'anklet-clasp',
    name: 'Clasp Style',
    nameCn: '扣环风格',
    type: 'card-grid',
    description: 'How it closes around your ankle.',
    descriptionCn: '如何在脚踝闭合。',
    condition: (selections) => selections['category'] === 'anklet',
    options: [
        { id: 'lobster-extender', label: 'Lobster with Extender', labelCn: '龙虾扣+延长链', value: 'lobster-extender', upcharge: 0, description: 'Standard choice. 3–5cm extender for sizing flexibility.', descriptionCn: '标准选择。3-5厘米延长链提供尺寸灵活性。' },
        { id: 'spring-ring', label: 'Spring Ring', labelCn: '弹簧圈', value: 'spring-ring', upcharge: 0, description: 'Compact and delicate. For very fine chains.', descriptionCn: '紧凑精致。适合极细链。' },
        { id: 'toggle', label: 'Toggle Clasp', labelCn: '棒扣', value: 'toggle', upcharge: 0, description: 'Decorative T-bar. The clasp is a visible design detail at the ankle.', descriptionCn: '装饰性T棒。扣环是脚踝处可见的设计细节。' },
        { id: 'magnetic', label: 'Magnetic Clasp', labelCn: '磁扣', value: 'magnetic', upcharge: 0, description: 'Easy to fasten — useful for ankle position which is hard to reach.', descriptionCn: '易于系扣——脚踝位置难以触及时很有用。' },
    ],
};
// ── 8i-5: Ankle Size ──
const ankletLengthStep = {
    id: 'anklet-length',
    name: 'Ankle Size',
    nameCn: '脚踝尺寸',
    type: 'card-grid',
    description: 'Most women wear 23–25cm; add 1–2cm for a relaxed drape.',
    descriptionCn: '大多数女性佩戴23-25厘米；加1-2厘米更宽松下垂。',
    condition: (selections) => selections['category'] === 'anklet',
    options: [
        { id: 'anklet-22', label: '22cm', labelCn: '22厘米', value: 'anklet-22', upcharge: 0 },
        { id: 'anklet-23', label: '23cm', labelCn: '23厘米', value: 'anklet-23', upcharge: 0 },
        { id: 'anklet-24', label: '24cm', labelCn: '24厘米', value: 'anklet-24', upcharge: 0 },
        { id: 'anklet-25', label: '25cm', labelCn: '25厘米', value: 'anklet-25', upcharge: 0 },
        { id: 'anklet-26', label: '26cm', labelCn: '26厘米', value: 'anklet-26', upcharge: 0 },
        { id: 'anklet-27', label: '27cm', labelCn: '27厘米', value: 'anklet-27', upcharge: 0 },
    ],
};
// ── 8i-6: Toe Ring Add-on ──
const ankletToeRingStep = {
    id: 'anklet-toe-ring',
    name: 'Toe Ring Add-on',
    nameCn: '趾环附加',
    type: 'card-grid',
    description: 'Simple matching open band in same metal, adjustable to fit any toe.',
    descriptionCn: '同款金属简单开口圆环，可调节适合任何脚趾。',
    condition: (selections) => selections['category'] === 'anklet',
    options: [
        { id: 'no-toe-ring', label: 'No', labelCn: '不需要', value: 'no-toe-ring', upcharge: 0, description: 'Anklet only.', descriptionCn: '仅脚链。' },
        { id: 'add-toe-ring', label: 'Yes — Add Toe Ring', labelCn: '是——添加趾环', value: 'add-toe-ring', upcharge: 0, description: 'Matching adjustable open band in same metal.', descriptionCn: '同款金属可调节开口圆环。' },
    ],
};
// ── STEP 9: Engraving ──
const engravingStep = {
    id: 'engraving',
    name: 'Personal Engraving',
    nameCn: '个人刻字',
    type: 'text',
    description: 'Make it say something only you would say.',
    descriptionCn: '让它说只有你才会说的话。',
    options: [
        { id: 'engraving-text', label: 'Custom Text', labelCn: '自定义文字', value: '', upcharge: 0, description: 'Max 30 characters. Live preview renders your chosen font.', descriptionCn: '最多30个字符。实时预览渲染您选择的字体。' },
    ],
};
// ── STEP 10: Sizing (Inputs + Guides) ──
// 10-ring: Ring Sizing
const ringSizingStep10 = {
    id: 'ring-sizing-10',
    name: 'Ring Sizing',
    nameCn: '戒指尺寸',
    type: 'card-grid',
    description: 'Input your exact size, or request a free sizing kit if you are unsure.',
    descriptionCn: '请输入您的确切尺寸，如果不确定，请索取免费的尺寸套件。',
    condition: (selections) => selections['category'] === 'ring',
    guide: {
        images: ['/guides/ring-guide.jpg'],
        text: 'Use our printable ring sizer or compare with an existing ring. US Size 3–13 available.',
        textCn: '使用我们的可打印戒指尺寸器或与现有戒指进行比较。提供美国尺寸 3-13。'
    },
    options: [
        { id: 'ring-sz-kit', label: 'Not Sure? Send Free Sizer Kit', labelCn: '不确定？寄送免费尺寸器', value: 'free-kit', upcharge: 0, description: 'We will post a kit to you to confirm your size.', descriptionCn: '我们将邮寄套件给您以确认尺寸。' },
        { id: 'ring-sz-3', label: 'US 3', labelCn: '美码 3', value: '3', upcharge: 0 },
        { id: 'ring-sz-4', label: 'US 4', labelCn: '美码 4', value: '4', upcharge: 0 },
        { id: 'ring-sz-5', label: 'US 5', labelCn: '美码 5', value: '5', upcharge: 0 },
        { id: 'ring-sz-6', label: 'US 6', labelCn: '美码 6', value: '6', upcharge: 0 },
        { id: 'ring-sz-7', label: 'US 7', labelCn: '美码 7', value: '7', upcharge: 0 },
        { id: 'ring-sz-8', label: 'US 8', labelCn: '美码 8', value: '8', upcharge: 0 },
        { id: 'ring-sz-9', label: 'US 9', labelCn: '美码 9', value: '9', upcharge: 0 },
        { id: 'ring-sz-10', label: 'US 10', labelCn: '美码 10', value: '10', upcharge: 0 },
        { id: 'ring-sz-11', label: 'US 11', labelCn: '美码 11', value: '11', upcharge: 0 },
        { id: 'ring-sz-12', label: 'US 12', labelCn: '美码 12', value: '12', upcharge: 0 },
        { id: 'ring-sz-13', label: 'US 13', labelCn: '美码 13', value: '13', upcharge: 0 },
    ],
};
// 10-bracelet: Bracelet Sizing
const braceletSizingStep10 = {
    id: 'bracelet-sizing-10',
    name: 'Bracelet Size',
    nameCn: '手链尺寸',
    type: 'card-grid',
    description: 'Select your exact bracelet length.',
    descriptionCn: '选择您的确切手链长度。',
    condition: (selections) => selections['category'] === 'bracelet',
    guide: {
        images: ['/guides/bracelet-guide.jpg'],
        text: 'Measure your wrist with a strip of paper or string. Add +1 cm for a slightly loose, comfortable fit.',
        textCn: '用纸条或绳子测量手腕。增加+1厘米以获得略微宽松、舒适的贴合感。'
    },
    options: [
        { id: 'br-14', label: '14 cm', labelCn: '14 厘米', value: '14cm', upcharge: 0 },
        { id: 'br-15', label: '15 cm', labelCn: '15 厘米', value: '15cm', upcharge: 0 },
        { id: 'br-16', label: '16 cm', labelCn: '16 厘米', value: '16cm', upcharge: 0 },
        { id: 'br-17', label: '17 cm', labelCn: '17 厘米', value: '17cm', upcharge: 0 },
        { id: 'br-18', label: '18 cm', labelCn: '18 厘米', value: '18cm', upcharge: 0 },
        { id: 'br-19', label: '19 cm', labelCn: '19 厘米', value: '19cm', upcharge: 0 },
        { id: 'br-20', label: '20 cm', labelCn: '20 厘米', value: '20cm', upcharge: 0 },
    ],
};
// 10-bangle: Bangle Sizing
const bangleSizingStep10 = {
    id: 'bangle-sizing-10',
    name: 'Bangle Size',
    nameCn: '手镯尺寸',
    type: 'card-grid',
    description: 'Internal diameter for the perfect bangle fit.',
    descriptionCn: '完美的内径以适合手镯。',
    condition: (selections) => selections['category'] === 'bangle',
    guide: {
        images: ['/guides/bangle-guide.png'],
        text: 'Measure the widest part of your hand (across the knuckles) when fingers are pressed together tightly.',
        textCn: '手指紧贴在一起时，测量手掌最宽处（过指关节）。'
    },
    options: [
        { id: 'bg-58', label: '58 mm', labelCn: '58 毫米', value: '58mm', upcharge: 0 },
        { id: 'bg-60', label: '60 mm', labelCn: '60 毫米', value: '60mm', upcharge: 0 },
        { id: 'bg-62', label: '62 mm', labelCn: '62 毫米', value: '62mm', upcharge: 0 },
        { id: 'bg-64', label: '64 mm', labelCn: '64 毫米', value: '64mm', upcharge: 0 },
        { id: 'bg-66', label: '66 mm', labelCn: '66 毫米', value: '66mm', upcharge: 0 },
        { id: 'bg-68', label: '68 mm', labelCn: '68 毫米', value: '68mm', upcharge: 0 },
    ],
};
// 10-necklace/pendant: Necklace Sizing
const necklaceSizingStep10 = {
    id: 'necklace-sizing-10',
    name: 'Chain Length',
    nameCn: '链条长度',
    type: 'card-grid',
    description: 'Choose the drop length of your piece.',
    descriptionCn: '选择首饰的垂坠长度。',
    condition: (selections) => ['necklace', 'pendant'].includes(selections['category'] || ''),
    guide: {
        images: ['/guides/necklace-guide.jpg'],
        text: 'See our visual chart to understand where each length drops on the collarbone or chest.',
        textCn: '查看我们的视觉图表，了解每个长度落在锁骨或胸部的位置。'
    },
    options: [
        { id: 'nl-40', label: '40 cm', labelCn: '40 厘米', value: '40cm', upcharge: 0 },
        { id: 'nl-45', label: '45 cm', labelCn: '45 厘米', value: '45cm', upcharge: 0 },
        { id: 'nl-50', label: '50 cm', labelCn: '50 厘米', value: '50cm', upcharge: 0 },
        { id: 'nl-55', label: '55 cm', labelCn: '55 厘米', value: '55cm', upcharge: 0 },
        { id: 'nl-60', label: '60 cm', labelCn: '60 厘米', value: '60cm', upcharge: 0 },
        { id: 'nl-70', label: '70 cm', labelCn: '70 厘米', value: '70cm', upcharge: 0 },
        { id: 'nl-80', label: '80 cm', labelCn: '80 厘米', value: '80cm', upcharge: 0 },
    ],
};
// 10-anklet: Anklet Sizing
const ankletSizingStep10 = {
    id: 'anklet-sizing-10',
    name: 'Anklet Size',
    nameCn: '脚链尺寸',
    type: 'card-grid',
    description: 'Select your ankle measurement.',
    descriptionCn: '选择您的脚踝尺寸。',
    condition: (selections) => selections['category'] === 'anklet',
    guide: {
        images: ['/guides/anklet-guide.png'],
        text: 'Measure around your ankle bone. Add 1-2 cm extra for a relaxed drape.',
        textCn: '测量脚踝骨周围。额外增加 1-2 厘米可带来轻松的立裁效果。'
    },
    options: [
        { id: 'ak-19', label: '19 cm', labelCn: '19 厘米', value: '19cm', upcharge: 0, description: 'Snug – Standard', descriptionCn: '紧贴 – 标准' },
        { id: 'ak-20', label: '20 cm', labelCn: '20 厘米', value: '20cm', upcharge: 0, description: 'Snug – Standard', descriptionCn: '紧贴 – 标准' },
        { id: 'ak-21', label: '21 cm', labelCn: '21 厘米', value: '21cm', upcharge: 0, description: 'Snug – Standard', descriptionCn: '紧贴 – 标准' },
        { id: 'ak-22', label: '22 cm', labelCn: '22 厘米', value: '22cm', upcharge: 0, description: 'Standard – Loose', descriptionCn: '标准 – 宽松' },
        { id: 'ak-23', label: '23 cm', labelCn: '23 厘米', value: '23cm', upcharge: 0, description: 'Standard – Loose', descriptionCn: '标准 – 宽松' },
        { id: 'ak-24', label: '24 cm', labelCn: '24 厘米', value: '24cm', upcharge: 0, description: 'Standard – Loose', descriptionCn: '标准 – 宽松' },
        { id: 'ak-25', label: '25 cm', labelCn: '25 厘米', value: '25cm', upcharge: 0, description: 'Standard – Loose', descriptionCn: '标准 – 宽松' },
        { id: 'ak-26', label: '26 cm', labelCn: '26 厘米', value: '26cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
        { id: 'ak-27', label: '27 cm', labelCn: '27 厘米', value: '27cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
        { id: 'ak-28', label: '28 cm', labelCn: '28 厘米', value: '28cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
        { id: 'ak-29', label: '29 cm', labelCn: '29 厘米', value: '29cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
        { id: 'ak-30', label: '30 cm', labelCn: '30 厘米', value: '30cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
        { id: 'ak-31', label: '31 cm', labelCn: '31 厘米', value: '31cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
        { id: 'ak-32', label: '32 cm', labelCn: '32 厘米', value: '32cm', upcharge: 0, description: 'Loose', descriptionCn: '宽松' },
    ],
};
// 10-earring/brooch: No numerical sizing 
const noSizingStep10 = {
    id: 'no-sizing-10',
    name: 'Size Confirmation',
    nameCn: '尺寸确认',
    type: 'card-grid',
    description: 'Acknowledge sizing details for this item.',
    descriptionCn: '确认此物品的尺寸详情。',
    condition: (selections) => ['stud-earring', 'dangling-earring', 'brooch'].includes(selections['category'] || ''),
    options: [
        { id: 'size-ack', label: 'Acknowledge', labelCn: '我知道了', value: 'acknowledge', upcharge: 0, description: 'No numerical sizing needed. Fastenings/backing fits will be confirmed by us within 6-8 hours post-checkout.', descriptionCn: '无需数字尺寸。扣件/底座配合将在退房后6-8小时内由我们确认。' },
    ],
};
// ── STEP 11: Gift Options ──
const giftStep = {
    id: 'gift',
    name: 'Gift Options',
    nameCn: '礼物选项',
    type: 'image-swatch',
    description: 'Add finishing touches for gift-giving',
    descriptionCn: '添加送礼的最后润色',
    options: [
        { id: 'standard', label: 'Standard Packaging', labelCn: '标准包装', value: 'standard', upcharge: 0 },
        { id: 'gift-box', label: 'Luxury Gift Box', labelCn: '奢华礼盒', value: 'gift-box', upcharge: 0 },
        { id: 'message-card', label: 'Gift Box + Message Card', labelCn: '礼盒+贺卡', value: 'message-card', upcharge: 0 },
        { id: 'surprise-wrap', label: 'Surprise Wrapping', labelCn: '惊喜包装', value: 'surprise-wrap', upcharge: 0 },
    ],
};
export const configSteps = [
    { ...occasionStep, displayStep: 1 },
    { ...categoryStep, displayStep: 2 },
    { ...interchangeabilityStep, displayStep: 3 },
    { ...stoneStep, displayStep: 4 },
    { ...stoneShapeStep, displayStep: 4 },
    { ...stoneSizeStep, displayStep: 4 },
    { ...sideStoneStep, displayStep: 5 },
    { ...sideStoneShapeStep, displayStep: 5 },
    { ...addSecondSideStoneStep, displayStep: 5 },
    { ...sideStone2Step, displayStep: 5 },
    { ...sideStone2ShapeStep, displayStep: 5 },
    { ...metalStep, displayStep: 6 },
    { ...colourStep, displayStep: 7 },
    // ── Step 8: Ring branch (8a-0 to 8a-6) ──
    { ...ringSubTypeStep, displayStep: 8 },
    { ...ringBandProfileStep, displayStep: 8 },
    { ...ringBandThicknessStep, displayStep: 8 },
    { ...ringSurfaceFinishStep, displayStep: 8 },
    { ...ringMainSettingStep, displayStep: 8 },
    { ...ringSideSettingStep, displayStep: 8 },
    { ...ringSizeStep, displayStep: 8 },
    // ── Step 8: Stud Earring branch (8b-1 to 8b-3) ──
    { ...studSettingStep, displayStep: 8 },
    { ...studBackingStep, displayStep: 8 },
    { ...studBackingSizeStep, displayStep: 8 },
    // ── Step 8: Dangling Earring branch (8c-1 to 8c-4) ──
    { ...danglingDropStyleStep, displayStep: 8 },
    { ...danglingSettingStep, displayStep: 8 },
    { ...danglingSideSettingStep, displayStep: 8 },
    { ...danglingConnectionStep, displayStep: 8 },
    // ── Step 8: Pendant branch (8d-1 to 8d-7) ──
    { ...pendantStyleStep, displayStep: 8 },
    { ...pendantSettingStep, displayStep: 8 },
    { ...pendantSideSettingStep, displayStep: 8 },
    { ...pendantBailStep, displayStep: 8 },
    { ...pendantChainStep, displayStep: 8 },
    { ...pendantLengthStep, displayStep: 8 },
    { ...pendantAdjustableStep, displayStep: 8 },
    // ── Step 8: Necklace branch (8e-1 to 8e-6) ──
    { ...necklaceStyleStep, displayStep: 8 },
    { ...necklaceChainStyleStep, displayStep: 8 },
    { ...necklaceStonePlacementStep, displayStep: 8 },
    { ...necklaceSettingStyleStep, displayStep: 8 },
    { ...necklaceClaspStep, displayStep: 8 },
    { ...necklaceLengthStep, displayStep: 8 },
    // ── Step 8: Bracelet branch (8f-1 to 8f-6) ──
    { ...braceletStyleStep, displayStep: 8 },
    { ...braceletChainStep, displayStep: 8 },
    { ...braceletSettingStep, displayStep: 8 },
    { ...braceletClaspStep, displayStep: 8 },
    { ...braceletSafetyStep, displayStep: 8 },
    { ...braceletLengthStep, displayStep: 8 },
    // ── Step 8: Bangle branch (8g-1 to 8g-5) ──
    { ...bangleStructureStep, displayStep: 8 },
    { ...bangleProfileStep, displayStep: 8 },
    { ...bangleWidthStep, displayStep: 8 },
    { ...bangleFinishStep, displayStep: 8 },
    { ...bangleSettingStep, displayStep: 8 },
    // ── Step 8: Brooch branch (8h-1 to 8h-6) ──
    { ...broochStyleStep, displayStep: 8 },
    { ...broochSettingStep, displayStep: 8 },
    { ...broochDimensionalityStep, displayStep: 8 },
    { ...broochPinStep, displayStep: 8 },
    { ...broochConvertibilityStep, displayStep: 8 },
    { ...broochSizeStep, displayStep: 8 },
    // ── Step 8: Anklet branch (8i-1 to 8i-6) ──
    { ...ankletStyleStep, displayStep: 8 },
    { ...ankletChainStep, displayStep: 8 },
    { ...ankletCharmStep, displayStep: 8 },
    { ...ankletClaspStep, displayStep: 8 },
    { ...ankletLengthStep, displayStep: 8 },
    { ...ankletToeRingStep, displayStep: 8 },
    { ...engravingStep, displayStep: 9 },
    // ── Step 10: Sizing Guides ──
    { ...ringSizingStep10, displayStep: 10 },
    { ...braceletSizingStep10, displayStep: 10 },
    { ...bangleSizingStep10, displayStep: 10 },
    { ...necklaceSizingStep10, displayStep: 10 },
    { ...ankletSizingStep10, displayStep: 10 },
    { ...noSizingStep10, displayStep: 10 },
    { ...giftStep, displayStep: 11 },
];
export function getActiveSteps(selections) {
    return configSteps.filter(step => {
        if (!step.condition)
            return true;
        return step.condition(selections);
    });
}
export function getStepById(id) {
    return configSteps.find((s) => s.id === id);
}
export function getSizingOptions(categoryValue) {
    const sizeStepMap = {
        ring: 'ring-size',
        necklace: 'necklace-length',
        bracelet: 'bracelet-length',
        bangle: 'bangle-size',
        anklet: 'anklet-length',
    };
    const stepId = sizeStepMap[categoryValue];
    if (stepId) {
        const step = configSteps.find((s) => s.id === stepId);
        return step ? step.options : [];
    }
    return [];
}
