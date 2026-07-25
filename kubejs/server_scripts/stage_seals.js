// ═══════════════════════════════════════════════════════════════════════════
// Печати этапов: пропуск мира на следующий рубеж.
// Каждый участник крафтит СВОЮ печать — рецепты рассчитаны так, чтобы в одно
// лицо их не собрать: нужны разные производственные линии одновременно.
//
// Печать Пепла (этап 0 → 1) НЕ должна требовать ничего из Незера — его ещё нет.
// Проверено по рецептам: прочный лист (обсидиановая пыль + лава + пресс),
// точный механизм, электронная лампа, катушка New Age и резина Rubberworks
// делаются полностью в Верхнем мире.
// ═══════════════════════════════════════════════════════════════════════════

ServerEvents.recipes(event => {

    // ── Печать Пепла: 8 точных механизмов, 4 катушки, 4 лампы, 4 резины ──
    // Линии: обсидиан+лава (листы), латунь+золото (механизмы), розовый кварц
    // (лампы), андезит+медь (катушки), смола/цветы (резина).
    event.recipes.create.mechanical_crafting('mwxkhmycore:seal_of_ash', [
        'SPRPS',
        'PCECP',
        'RE*ER',
        'PCECP',
        'SPRPS'
    ], {
        S: 'create:sturdy_sheet',
        P: 'create:precision_mechanism',
        R: 'rubberworks:rubber',
        C: 'create_new_age:generator_coil',
        E: 'create:electron_tube',
        '*': 'minecraft:obsidian'
    });

    // ── Печать Пустоты: Незер уже открыт, поэтому берём его материалы ──
    // Линии: незерит (древние обломки + плавка), слоёные магниты (перезаряженные
    // металлы New Age), пылающие горелки (споры Незера), точные механизмы.
    event.recipes.create.mechanical_crafting('mwxkhmycore:seal_of_the_void', [
        'SNMNS',
        'NPBPN',
        'MB*BM',
        'NPBPN',
        'SNMNS'
    ], {
        S: 'create:sturdy_sheet',
        N: 'minecraft:netherite_scrap',
        M: 'create_new_age:layered_magnet',
        P: 'create:precision_mechanism',
        B: 'create:blaze_burner',
        '*': 'minecraft:nether_star'
    });

    console.info('[ZSMP] Печати этапов: рецепты применены');
});
