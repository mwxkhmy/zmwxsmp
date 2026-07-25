// ═══════════════════════════════════════════════════════════════════════════
// Кофе без всполоха.
//
// Родной рецепт Create Cafe варит кофе в смесителе С НАГРЕВОМ, а нагрев даёт
// только пылающая горелка (костёр греет лишь паровой котёл). До открытия Ада
// горелки нет, значит нет и кофе.
//
// Правим ровно один рецепт: те же ингредиенты и тот же выход, без нагрева.
// JSON пишем в формате самого Create — хелпер KubeJS отдаёт другой формат
// ингредиентов, и рецепт получается с пустыми слотами.
// ═══════════════════════════════════════════════════════════════════════════

ServerEvents.recipes(event => {

    event.remove({ id: 'createcafe:mixing/coffee/coffee_mixing' });

    event.custom({
        type: 'create:mixing',
        ingredients: [
            { item: 'createcafe:coffee_grounds' },
            { type: 'neoforge:single', amount: 500, fluid: 'minecraft:water' }
        ],
        results: [
            { amount: 500, id: 'createcafe:coffee' }
        ]
    }).id('mwxkhmycore:mixing/coffee_no_heat');

    console.info('[ZSMP] Кофе: нагрев больше не нужен');
});
