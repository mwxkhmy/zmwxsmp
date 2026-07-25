// ═══════════════════════════════════════════════════════════════════════════
// Латунь без всполоха.
//
// Родной рецепт Create варит латунь в смесителе С НАГРЕВОМ
// (heat_requirement: "heated"), а нагрев даёт только пылающая горелка, для
// которой нужен стержень всполоха из Ада. На нулевом этапе Ада нет — значит
// без этой правки латунь недостижима, а вместе с ней и латунные корпуса,
// и Печать Пепла, которой рубеж открывается.
//
// ВАЖНО: рецепт задаём сырым JSON в формате самого Create, один в один как в
// его файле data/create/recipe/mixing/brass_ingot.json, только без строки
// heat_requirement. Хелпер event.recipes.create.mixing(...) здесь не годится:
// Create 6 ждёт ингредиенты как sized_ingredient, хелпер отдаёт свой формат,
// и рецепт получается с пустыми слотами (в JEI видно два пустых квадрата).
// ═══════════════════════════════════════════════════════════════════════════

ServerEvents.recipes(event => {

    event.remove({ id: 'create:mixing/brass_ingot' });

    event.custom({
        type: 'create:mixing',
        ingredients: [
            { tag: 'c:ingots/copper' },
            { tag: 'c:ingots/zinc' }
        ],
        results: [
            { count: 2, id: 'create:brass_ingot' }
        ]
    }).id('mwxkhmycore:mixing/brass_ingot_no_heat');

    console.info('[ZSMP] Латунь: нагрев больше не нужен');
});
