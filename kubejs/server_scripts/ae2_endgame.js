// ═══════════════════════════════════════════════════════════════════════════
// AE2 — жесточайший эндгейм. Сеть МЭ = выпускной экзамен по всей сборке.
// Ярусы: Т1 кремний/схемы (латунный век) → Т2 энергия (New Age) →
// Т3 первая сеть (резина Rubberworks + прочные листы) → Т4 автокрафт →
// Т5 контроллер (звезда Нижнего мира) → Т6 квант.
// Ребаланс «гораздо сложнее»: 2026-07-22 по решению владельца.
// ═══════════════════════════════════════════════════════════════════════════

ServerEvents.recipes(event => {

    const SA = event.recipes.create.sequenced_assembly;
    const press = (x) => event.recipes.create.pressing(x, x);
    const deploy = (x, item) => event.recipes.create.deploying(x, [x, item]);
    const deployKeep = (x, item) => event.recipes.create.deploying(x, [x, item]).keepHeldItem();

    // ── Т1. Inscriber выпилен: схемы и кремний — только через Create ──

    event.remove({ output: 'ae2:inscriber' });
    event.remove({ type: 'ae2:inscriber' });
    event.remove({ output: 'ae2:silicon' });

    event.recipes.create.crushing(['ae2:certus_quartz_dust'], 'ae2:certus_quartz_crystal');
    event.recipes.create.crushing(['ae2:fluix_dust'], 'ae2:fluix_crystal');

    // Кремний: 8 пыли → 1, ТОЛЬКО супернагрев
    event.recipes.create.mixing('ae2:silicon', [
        'ae2:certus_quartz_dust', 'ae2:certus_quartz_dust', 'ae2:certus_quartz_dust', 'ae2:certus_quartz_dust',
        'ae2:certus_quartz_dust', 'ae2:certus_quartz_dust', 'ae2:certus_quartz_dust', 'ae2:certus_quartz_dust'
    ]).superheated();

    // Печатный кремний: 3 круга линии, пресс-форма из метеорита не расходуется
    event.remove({ output: 'ae2:printed_silicon' });
    SA(['ae2:printed_silicon'], 'ae2:silicon', [
        deployKeep('ae2:silicon', 'ae2:silicon_press'),
        deploy('ae2:silicon', 'ae2:certus_quartz_dust'),
        press('ae2:silicon')
    ]).transitionalItem('ae2:silicon').loops(3);

    // Печатные схемы: основа + форма (не расходуется) + пыль + полированный розовый кварц
    event.remove({ output: 'ae2:printed_logic_processor' });
    SA(['ae2:printed_logic_processor'], 'create:golden_sheet', [
        deployKeep('create:golden_sheet', 'ae2:logic_processor_press'),
        deploy('create:golden_sheet', 'ae2:certus_quartz_dust'),
        deploy('create:golden_sheet', 'create:polished_rose_quartz'),
        press('create:golden_sheet')
    ]).transitionalItem('create:golden_sheet').loops(3);

    event.remove({ output: 'ae2:printed_calculation_processor' });
    SA(['ae2:printed_calculation_processor'], 'ae2:certus_quartz_crystal', [
        deployKeep('ae2:certus_quartz_crystal', 'ae2:calculation_processor_press'),
        deploy('ae2:certus_quartz_crystal', 'ae2:certus_quartz_dust'),
        deploy('ae2:certus_quartz_crystal', 'create:polished_rose_quartz'),
        press('ae2:certus_quartz_crystal')
    ]).transitionalItem('ae2:certus_quartz_crystal').loops(3);

    event.remove({ output: 'ae2:printed_engineering_processor' });
    SA(['ae2:printed_engineering_processor'], 'minecraft:diamond', [
        deployKeep('minecraft:diamond', 'ae2:engineering_processor_press'),
        deploy('minecraft:diamond', 'ae2:certus_quartz_dust'),
        deploy('minecraft:diamond', 'create:polished_rose_quartz'),
        press('minecraft:diamond')
    ]).transitionalItem('minecraft:diamond').loops(3);

    // Процессоры: 2 круга линии; каждый ярус ест компоненты Create
    event.remove({ output: 'ae2:logic_processor' });
    SA(['ae2:logic_processor'], 'ae2:printed_silicon', [
        deploy('ae2:printed_silicon', 'minecraft:redstone'),
        deploy('ae2:printed_silicon', 'create:brass_sheet'),
        deploy('ae2:printed_silicon', 'ae2:printed_logic_processor'),
        press('ae2:printed_silicon')
    ]).transitionalItem('ae2:printed_silicon').loops(2);

    event.remove({ output: 'ae2:calculation_processor' });
    SA(['ae2:calculation_processor'], 'ae2:printed_silicon', [
        deploy('ae2:printed_silicon', 'minecraft:redstone'),
        deploy('ae2:printed_silicon', 'create:electron_tube'),
        deploy('ae2:printed_silicon', 'ae2:printed_calculation_processor'),
        press('ae2:printed_silicon')
    ]).transitionalItem('ae2:printed_silicon').loops(2);

    // Инженерный: точный механизм + электронная лампа на КАЖДЫЙ круг (х2)
    event.remove({ output: 'ae2:engineering_processor' });
    SA(['ae2:engineering_processor'], 'ae2:printed_silicon', [
        deploy('ae2:printed_silicon', 'minecraft:redstone'),
        deploy('ae2:printed_silicon', 'create:precision_mechanism'),
        deploy('ae2:printed_silicon', 'create:electron_tube'),
        deploy('ae2:printed_silicon', 'ae2:printed_engineering_processor'),
        press('ae2:printed_silicon')
    ]).transitionalItem('ae2:printed_silicon').loops(2);

    // ── Т2. Энергия — New Age + точные механизмы ──

    event.remove({ output: 'ae2:charger' });
    event.recipes.create.mechanical_crafting('ae2:charger', [
        'SES',
        'CBC',
        'PMP'
    ], {
        S: 'create:sturdy_sheet',
        E: 'create:electron_tube',
        C: 'create_new_age:generator_coil',
        B: 'create:brass_casing',
        M: 'create_new_age:layered_magnet',
        P: 'create:precision_mechanism'
    });

    // Кабельную (парт) версию не трогаем: конверсия блок↔парт 1:1, дыры не даёт
    event.remove({ output: 'ae2:energy_acceptor' });
    event.recipes.create.mechanical_crafting('ae2:energy_acceptor', [
        'SKS',
        'FBF',
        'EPE'
    ], {
        S: 'create:sturdy_sheet',
        K: 'create_new_age:carbon_brushes',
        F: 'create_new_age:fluxuated_magnetite',
        B: 'create:brass_casing',
        E: 'create:electron_tube',
        P: 'create:precision_mechanism'
    });

    event.remove({ output: 'ae2:vibration_chamber' });
    event.recipes.create.mechanical_crafting('ae2:vibration_chamber', [
        'SSS',
        'CBT',
        'SPS'
    ], {
        S: 'create:sturdy_sheet',
        C: 'create_new_age:generator_coil',
        B: 'create:blaze_burner',
        T: 'create:electron_tube',
        P: 'create:precision_mechanism'
    });

    // Kinetic Energy Acceptor (Applied Create) — обход New Age, поэтому дороже всех
    event.remove({ output: 'appliedcreate:kinetic_energy_acceptor' });
    event.recipes.create.mechanical_crafting('appliedcreate:kinetic_energy_acceptor', [
        'SPS',
        'CBC',
        'EPE'
    ], {
        S: 'create:sturdy_sheet',
        P: 'create:precision_mechanism',
        C: 'create_new_age:generator_coil',
        B: 'create:brass_casing',
        E: 'ae2:engineering_processor'
    });

    // ── Т3. Первая сеть: резина + прочные листы ──

    // Точечно по id: сносим только крафт, «отмывку» цветного кабеля водой оставляем
    event.remove({ id: 'ae2:network/cables/glass_fluix' });
    event.shaped(Item.of('ae2:fluix_glass_cable', 2), [
        'RFR',
        'FXF',
        'RFR'
    ], {
        R: 'rubberworks:rubber',
        F: 'ae2:quartz_fiber',
        X: 'ae2:fluix_crystal'
    });

    event.remove({ output: 'ae2:item_cell_housing' });
    event.shaped('ae2:item_cell_housing', [
        'SGS',
        'R R',
        'SLS'
    ], {
        S: 'create:sturdy_sheet',
        G: '#c:glass_blocks',
        R: 'rubberworks:rubber',
        L: 'ae2:calculation_processor'
    });
    event.remove({ output: 'ae2:fluid_cell_housing' });
    event.shaped('ae2:fluid_cell_housing', [
        'SGS',
        'R R',
        'SLS'
    ], {
        S: 'create:copper_sheet',
        G: '#c:glass_blocks',
        R: 'rubberworks:rubber',
        L: 'ae2:calculation_processor'
    });

    // У AE2 на каждую ячейку ДВА рецепта: «корпус + компонент» и прямой шейпед
    // (кварцевое стекло + редстоун + железо/медь) — прямой обходит наши дорогие
    // корпуса, поэтому сносим его по id на всех ярусах. Разборку и апгрейды
    // ярусов не трогаем: корпус там уже оплачен.
    ['1k', '4k', '16k', '64k', '256k'].forEach(tier => {
        event.remove({ id: 'ae2:network/cells/item_storage_cell_' + tier });
        event.remove({ id: 'ae2:network/cells/fluid_storage_cell_' + tier });
    });

    // Компонент 1k: 3 круга линии на заряженном кварце + флюисовая пыль
    event.remove({ output: 'ae2:cell_component_1k' });
    SA(['ae2:cell_component_1k'], 'ae2:charged_certus_quartz_crystal', [
        deploy('ae2:charged_certus_quartz_crystal', 'minecraft:redstone'),
        deploy('ae2:charged_certus_quartz_crystal', 'ae2:fluix_dust'),
        deploy('ae2:charged_certus_quartz_crystal', 'ae2:logic_processor'),
        press('ae2:charged_certus_quartz_crystal')
    ]).transitionalItem('ae2:charged_certus_quartz_crystal').loops(3);

    // Ядра формирования/аннигиляции: 2 круга — дорожают все терминалы и шины
    event.remove({ output: 'ae2:annihilation_core' });
    SA(['ae2:annihilation_core'], 'ae2:fluix_crystal', [
        deploy('ae2:fluix_crystal', 'ae2:certus_quartz_dust'),
        deploy('ae2:fluix_crystal', 'create:electron_tube'),
        press('ae2:fluix_crystal')
    ]).transitionalItem('ae2:fluix_crystal').loops(2);
    event.remove({ output: 'ae2:formation_core' });
    SA(['ae2:formation_core'], 'ae2:fluix_crystal', [
        deploy('ae2:fluix_crystal', 'ae2:silicon'),
        deploy('ae2:fluix_crystal', 'create:electron_tube'),
        press('ae2:fluix_crystal')
    ]).transitionalItem('ae2:fluix_crystal').loops(2);

    // ── Т4. Автокрафт: инженерные процессоры вместо расчётных ──

    event.remove({ output: 'ae2:molecular_assembler' });
    event.recipes.create.mechanical_crafting('ae2:molecular_assembler', [
        'SESES',
        'EPCPE',
        'SCACS',
        'EPCPE',
        'SESES'
    ], {
        S: 'create:sturdy_sheet',
        E: 'create:electron_tube',
        P: 'create:precision_mechanism',
        C: 'ae2:engineering_processor',
        A: 'ae2:annihilation_core'
    });

    // Кабельную (парт) версию не трогаем — см. energy_acceptor
    event.remove({ output: 'ae2:pattern_provider' });
    event.recipes.create.mechanical_crafting('ae2:pattern_provider', [
        'SES',
        'PBP',
        'SCS'
    ], {
        S: 'create:sturdy_sheet',
        E: 'ae2:engineering_processor',
        P: 'create:precision_mechanism',
        B: 'create:brass_casing',
        C: 'ae2:calculation_processor'
    });

    // ── Т5. Контроллер — финальный босс со звездой Нижнего мира в сердце ──

    event.remove({ output: 'ae2:controller' });
    event.recipes.create.mechanical_crafting('ae2:controller', [
        'SQSQS',
        'PEGEP',
        'SGNGS',
        'PEGEP',
        'SQSQS'
    ], {
        S: 'create:sturdy_sheet',
        Q: 'ae2:charged_certus_quartz_crystal',
        P: 'create:precision_mechanism',
        E: 'ae2:engineering_processor',
        G: 'create_new_age:generator_coil',
        N: 'minecraft:nether_star'
    });

    // ── Т6. Квант: звезда на каждый линк (кольцо требует линк в центре) ──

    event.remove({ output: 'ae2:quantum_ring' });
    event.shaped('ae2:quantum_ring', [
        'EPE',
        'PNP',
        'EPE'
    ], {
        E: 'ae2:engineering_processor',
        P: 'create:precision_mechanism',
        N: 'ae2:quantum_link'
    });
    event.remove({ output: 'ae2:quantum_link' });
    event.shaped('ae2:quantum_link', [
        'FSF',
        'S*S',
        'FSF'
    ], {
        F: 'ae2:fluix_crystal',
        S: 'create:sturdy_sheet',
        '*': 'minecraft:nether_star'
    });

    // ── Applied Create: stress-платы и процессоры без ExtendedAE/Inscriber ──
    // Их родные рецепты жили в Inscriber (выпилен) и станках ExtendedAE (выпилен целиком),
    // поэтому даём Create-пути с теми же ингредиентами, что в оригинале.
    // Вход — ЛИСТ латуни, не слиток: слиток под прессом уже занят родным
    // рецептом Create (латунный лист), два рецепта на один вход конфликтуют
    event.recipes.create.pressing('appliedcreate:stress_circuit_board', 'create:andesite_alloy');
    event.recipes.create.pressing('appliedcreate:advanced_stress_circuit_board', 'create:brass_sheet');

    SA(['appliedcreate:stress_processor'], 'ae2:printed_silicon', [
        deploy('ae2:printed_silicon', 'create:cinder_flour'),
        deploy('ae2:printed_silicon', 'appliedcreate:stress_circuit_board'),
        press('ae2:printed_silicon')
    ]).transitionalItem('ae2:printed_silicon').loops(1);

    SA(['appliedcreate:advanced_stress_processor'], 'ae2:printed_silicon', [
        deploy('ae2:printed_silicon', 'create:cinder_flour'),
        deploy('ae2:printed_silicon', 'appliedcreate:advanced_stress_circuit_board'),
        press('ae2:printed_silicon')
    ]).transitionalItem('ae2:printed_silicon').loops(1);

    console.info('[ZSMP] AE2 endgame: рецепты применены (ребаланс v2, без ExtendedAE)');
});
