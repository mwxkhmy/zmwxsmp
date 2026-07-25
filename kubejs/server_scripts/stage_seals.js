// ═══════════════════════════════════════════════════════════════════════════
// Печати этапов: одна на весь сервер. Собирают все вместе, ПКМ — печать уходит
// в небо и лопается, рубеж открыт. Оператор не нужен.
//
// Печать Пепла (этап 0 → 1) НЕ содержит ничего кварцевого: розовый кварц Create
// делается из НЕЗЕРСКОГО кварца, а Незера на нулевом этапе не существует —
// значит и электронных ламп там быть не может. Проверено по рецептам: прочный
// лист (обсидиановая пыль + лава + пресс), точный механизм (золотые пластины +
// шестерни + железо), катушка (андезитовый блок + медь), слоёный магнит
// (перезаряженные золото и железо на энергии New Age), щётки (андезит + уголь +
// вал), латунный корпус (латунь + доски) и резина — всё Верхний мир.
// ═══════════════════════════════════════════════════════════════════════════

ServerEvents.recipes(event => {

    // ── Печать Пепла: 7×7, пять независимых линий ──
    // 12 прочных листов, 8 точных механизмов, 8 катушек, 8 магнитов,
    // 8 резины, 4 щётки, 4 латунных корпуса, алмазный блок в сердце.
    event.recipes.create.mechanical_crafting('mwxkhmycore:seal_of_ash', [
        'SSCMCSS',
        'SPRKRPS',
        'CRMBMRC',
        'MPB*BPM',
        'CRMBMRC',
        'SPRKRPS',
        'SSCMCSS'
    ], {
        S: 'create:sturdy_sheet',
        P: 'create:precision_mechanism',
        C: 'create_new_age:generator_coil',
        M: 'create_new_age:layered_magnet',
        R: 'rubberworks:rubber',
        K: 'create_new_age:carbon_brushes',
        B: 'create:brass_casing',
        '*': 'minecraft:diamond_block'
    });

    // ── Печать Пустоты: 7×7, Незер уже открыт ──
    // 12 древних обломков, 12 электронных ламп, 8 полированного розового кварца,
    // 4 точных механизма, 4 пылающие горелки, 4 магнита, 4 прочных листа
    // и звезда Нижнего мира в сердце.
    event.recipes.create.mechanical_crafting('mwxkhmycore:seal_of_the_void', [
        'NNQEQNN',
        'NPEBEPN',
        'QEMSMEQ',
        'EBS*SBE',
        'QEMSMEQ',
        'NPEBEPN',
        'NNQEQNN'
    ], {
        N: 'minecraft:netherite_scrap',
        Q: 'create:polished_rose_quartz',
        E: 'create:electron_tube',
        P: 'create:precision_mechanism',
        B: 'create:blaze_burner',
        M: 'create_new_age:layered_magnet',
        S: 'create:sturdy_sheet',
        '*': 'minecraft:nether_star'
    });

    console.info('[ZSMP] Печати этапов: рецепты применены');
});
