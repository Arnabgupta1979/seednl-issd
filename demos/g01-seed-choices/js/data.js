/* G01 "Where will the seed come from?" scenario data.
 * EDIT THIS FILE to change farmers, routes, wording or ratings. No other file holds content.
 *
 * Provenance: every farmer, place and rating below is FICTIONAL and SYNTHETIC. They were written
 * for teaching and do not describe a real person, village, cooperative, shop or programme.
 * Ratings are qualitative judgements by the pilot author, not measured data and not probabilities.
 * They must be reviewed by a seed-systems expert before any release (see docs/Source_register.md).
 *
 * Rating codes used in `assess`:  g = meets the need   p = partly meets   w = does not meet well   u = not known
 * Stress codes:  holds | strained | exposed | depends
 */
window.G01_DATA = {
  meta: {
    title: 'Where will the seed come from?',
    subtitle: 'A farmer seed-choice activity',
    version: '0.1 pilot for review',
    status: 'Proposed pilot. Not approved course content. All farmers and places are fictional.',
    module: 'Proposed Module 1: Why an integrated approach matters (V2.0 concept note)'
  },

  /* The eight sector functions, in V2.0 concept note order. */
  functions: [
    { id: 'production', name: 'Production', note: 'Who makes the seed' },
    { id: 'distribution', name: 'Value addition and distribution', note: 'How seed is processed, packed and reaches farmers' },
    { id: 'service', name: 'Service provision', note: 'Advice, testing, inspection, information' },
    { id: 'utilisation', name: 'Utilisation', note: 'How farmers choose, store and sow seed' },
    { id: 'organisation', name: 'Stakeholder organisation', note: 'Groups, associations, networks' },
    { id: 'regulation', name: 'Regulation', note: 'Rules on quality, labelling and trade' },
    { id: 'coordination', name: 'Coordination', note: 'How actors align their work' },
    { id: 'financing', name: 'Financing', note: 'Who can pay, and when' }
  ],

  /* Five needs a farmer weighs when choosing a route. */
  dimensions: [
    { id: 'timing', label: 'Timing', q: 'Can seed be in hand for the planting window?' },
    { id: 'cost', label: 'Cash and cost', q: 'Can she pay when payment is due?' },
    { id: 'fit', label: 'Fit to crop and wishes', q: 'Does the variety suit her land, rain risk, market and taste?' },
    { id: 'quality', label: 'Quality information', q: 'Does she know the seed is true to type and will germinate?' },
    { id: 'reach', label: 'Reach and quantity', q: 'Can she reach it with her time and travel, and get enough?' }
  ],

  levels: {
    g: { label: 'Meets the need', sym: '●', css: 'g' },
    p: { label: 'Partly meets', sym: '◐', css: 'p' },
    w: { label: 'Does not meet well', sym: '○', css: 'w' },
    u: { label: 'Not known', sym: '?', css: 'u' }
  },
  importanceLabel: { high: 'Matters most', medium: 'Matters', low: 'Matters less' },

  stressLevels: {
    holds: { label: 'Holds up', sym: '●' },
    strained: { label: 'Under strain', sym: '◐' },
    exposed: { label: 'Exposed', sym: '○' },
    depends: { label: 'Depends: ask', sym: '?' }
  },

  /* Five routes. `functions` lists the sector functions the route leans on (simplified; to verify). */
  sources: [
    { id: 'saved', name: 'Saved seed', tagline: 'Seed kept from your own last harvest.',
      can: 'Close at hand, little or no cash, and the variety is known to you.',
      watch: 'Quality may be unknown. Hybrids do not repeat their performance. Stored seed can lose vigour or carry pests and disease.',
      check: 'How was it stored? Is there enough? Is the crop a hybrid?',
      functions: ['utilisation', 'production'],
      functionNote: 'The farmer is producer and user. Utilisation (selection and storage) carries the weight. Service provision may be missing.' },
    { id: 'neighbours', name: 'Neighbours and kin', tagline: 'Seed shared, swapped or lent by other farmers and relatives.',
      can: 'Trusted, locally tested varieties, often without cash. A way to try something new.',
      watch: 'Quality is not checked. It depends on relationships and on others having a surplus when you need it.',
      check: 'Where did they get it? How did it do in a bad season?',
      functions: ['utilisation', 'organisation', 'production'],
      functionNote: 'Social networks and informal organisation do the work. Few formal services are involved.' },
    { id: 'market', name: 'Local market', tagline: 'Seed or grain bought from stalls, traders or local markets.',
      can: 'Available when you are ready, in small amounts, even late.',
      watch: 'Often unlabelled. It may be grain rather than seed. Origin and variety may be unclear. Cash and transport are needed.',
      check: 'Can the seller say where it came from? Can you test a handful first?',
      functions: ['distribution', 'financing'],
      functionNote: 'Traders and stall holders do the distribution. Cash sales set the terms. Quality rules may be weak or not applied.' },
    { id: 'coop', name: 'Cooperative or community seed', tagline: 'Seed multiplied, checked and shared by a cooperative, farmer group or community seed bank.',
      can: 'Information and checks that members know. Varieties suited to the area. Sometimes seed loans or later payment.',
      watch: 'May not stock every crop or variety. Pre-order dates and deposits. Quality checks vary between groups.',
      check: 'What checks are done? When do orders close? Can you pay later or in kind?',
      functions: ['production', 'organisation', 'service', 'coordination', 'financing'],
      functionNote: 'Members produce and organise. The group provides checks and information, coordinates orders and sometimes lends seed.' },
    { id: 'company', name: 'Seed company', tagline: 'Packaged seed sold by a seed company or its agro-dealer.',
      can: 'Labelled, tested seed with variety information. Wide choice for some crops.',
      watch: 'Cash up front and travel to the dealer. Possible old or fake stock. Fit to local conditions may be uncertain.',
      check: 'Is the seal intact? Check the label and date. What does the variety need (rain, inputs)?',
      functions: ['production', 'distribution', 'service', 'regulation', 'financing'],
      functionNote: 'Companies produce and distribute. Labelling and registration rules apply. Advice depends on the dealer. Cash timing matters.' }
  ],

  /* Generic stress-test results per route. Farmers add their own note below. */
  disruptions: [
    { id: 'rainLate', label: 'Rains start late', text: 'The rains arrive later than expected and the planting window shifts.' },
    { id: 'cashShort', label: 'Cash runs short', text: 'Cash is short on the day seed must be paid for.' },
    { id: 'badBatch', label: 'Poor seed batch', text: 'The seed germinates poorly or turns out not to be the variety expected.' },
    { id: 'noVariety', label: 'Variety not available', text: 'The variety she wanted is not available this season.' }
  ],
  stress: {
    rainLate: {
      saved: ['holds', 'Seed is already in hand, so she can wait for the rains. Old seed may have lost vigour.'],
      neighbours: ['strained', 'Neighbours plant when she does, so spare seed may run short if the first planting fails.'],
      market: ['holds', 'Stalls keep selling, so replanting is possible at the going price.'],
      coop: ['depends', 'Orders may be fixed in advance. Ask whether late or extra seed is held.'],
      company: ['holds', 'Stock is on the shelf when she is ready, but a second purchase costs cash again.']
    },
    cashShort: {
      saved: ['holds', 'No cash is needed.'],
      neighbours: ['holds', 'Swaps and favours often work without cash, if she has something to give back.'],
      market: ['exposed', 'Needs cash on the day, plus transport.'],
      coop: ['depends', 'Some groups accept payment in kind or after harvest. Others need a deposit.'],
      company: ['exposed', 'Usually cash up front.']
    },
    badBatch: {
      saved: ['exposed', 'There is no second source of the same seed unless she turns to another route.'],
      neighbours: ['strained', 'She can ask again, but the same neighbours may share the same problem.'],
      market: ['strained', 'She can buy again, with the same doubts about origin.'],
      coop: ['depends', 'Records may let the group trace and replace a bad lot. Ask what is promised.'],
      company: ['depends', 'A sealed, dated lot can be traced. What the dealer does about a failed lot varies.']
    },
    noVariety: {
      saved: ['strained', 'She can only plant what she kept. Nothing new.'],
      neighbours: ['strained', 'She is limited to what neighbours have, though they may share something new.'],
      market: ['strained', 'Whatever is on the stall, and the variety may be unknown.'],
      coop: ['depends', 'The group may offer a different variety, or none.'],
      company: ['strained', 'Other varieties are on the shelf but may need different rain, inputs or care.']
    }
  },

  farmers: [
    /* ------------------------------------------------------------------ AMINA */
    { id: 'amina', name: 'Amina', crop: 'Maize', cropNote: 'Rain-fed, small plot, family food first',
      intro: 'Amina farms a small plot with her family. Maize is the main food crop. A small surplus is sold after harvest.',
      wants: [
        'A variety that still matures if the rains stop early',
        'Seed in hand when the first rains come',
        'Grain that stores well and tastes right for the family',
        'No new borrowing'
      ],
      resources: [
        ['Cash', 'Very little until after harvest sales. Lowest just before planting.'],
        ['Labour', 'Family labour. Planting and weeding are the busiest weeks.'],
        ['Travel', 'The market town is half a day away by shared transport.'],
        ['Storage', 'A sack store in the roof. Pests are a worry.'],
        ['Information', 'Radio, neighbours, an occasional visit from a cooperative officer.']
      ],
      importance: { timing: 'high', cost: 'high', fit: 'high', quality: 'medium', reach: 'medium' },
      stages: ['After harvest', 'Dry months', 'Seed decision window', 'Land preparation', 'Planting window', 'Weeding', 'Flowering and grain fill'],
      calendar: {
        Cash: ['Some from sales', 'Falling', 'Tight', 'Tight', 'Tight', 'Tight', 'Tight'],
        Labour: ['Busy', 'Quiet', 'Quiet', 'Busy', 'Peak', 'Busy', 'Moderate'],
        'Rain risk': ['None', 'None', 'Forecast unsure', 'None', 'Onset uncertain', 'Dry spells possible', 'Most sensitive'],
        'Seed on offer': ['Own store filled', 'Cooperative pre-orders open', 'Stalls and shop restock', 'Pre-order deadline passes', 'Market and shop open', 'Nothing new', 'Nothing new']
      },
      decisionStage: 2,
      assess: {
        saved: { timing: ['g', 'In her store now.'], cost: ['g', 'No cash needed.'], fit: ['p', 'A variety she knows, but not early maturing.'], quality: ['u', 'Germination not tested. Pests in the store?'], reach: ['p', 'At home, but is there enough for the plot?'] },
        neighbours: { timing: ['g', 'She can ask now, before they plant.'], cost: ['g', 'A favour or a small swap.'], fit: ['g', 'An early-maturing variety that came through a short season.'], quality: ['u', 'Trust, not testing.'], reach: ['p', 'Walking distance, but enough for part of the plot only.'] },
        market: { timing: ['g', 'Open when she is ready. She can replant.'], cost: ['p', 'Cash now, plus transport.'], fit: ['u', 'Mixed maize. Variety unknown.'], quality: ['w', 'Cannot check origin. It may be grain, not seed.'], reach: ['p', 'Half a day each way. Any amount.'] },
        coop: { timing: ['p', 'Pre-orders close during the lean months.'], cost: ['p', 'Deposit or cash up front. Terms not known.'], fit: ['g', 'Offers an early-maturing variety suited to the area.'], quality: ['g', 'Members check the seed. She can ask how.'], reach: ['g', 'In her sub-county. An amount can be reserved.'] },
        company: { timing: ['g', 'Stocked before planting.'], cost: ['w', 'The most cash up front, when her cash is lowest.'], fit: ['p', 'High-potential hybrids that may need better rain and fertiliser to pay back. Fresh seed each year.'], quality: ['g', 'Labelled and tested.'], reach: ['p', 'Half a day to town. Any amount.'] }
      },
      story: {
        saved: ['Amina kept maize from last season in a sack in the roof store. It has been there for months. It is the variety she has always grown.', 'Is there enough, and does a handful of seeds sprout in damp cloth?'],
        neighbours: ['A neighbour planted an early-maturing maize variety last season and still harvested when the rains stopped early. She has seed to spare for part of Amina’s plot.', 'Where did the neighbour get the variety, and how did it do in a normal year?'],
        market: ['Stalls in the market town sell maize by the cup. Some is clearly seed, some is grain. The seller is unsure of the variety. It takes half a day to get there and back.', 'Can the seller say where it came from? Can she test a handful first?'],
        coop: ['A cooperative in her sub-county grows and checks an early-maturing maize variety with its members. Orders close before land preparation and need a deposit.', 'What checks are done, and can the deposit be paid in kind or after harvest?'],
        company: ['The agro-dealer in town sells sealed packets of hybrid maize seed with the variety and date on the label. It costs the most cash up front, and her cash is at its lowest now.', 'What rainfall and inputs does this hybrid need to pay off, and could she afford it every year?']
      },
      stressNote: {
        rainLate: 'A late start squeezes the season, and flowering is the most rain-sensitive stage. Earlier maturity matters more than seed price.',
        cashShort: 'She is already near her limit. Deposits and travel add to the cash she needs.',
        badBatch: 'Poor germination means replanting after weeks are lost. A quick, low-cost second source matters.',
        noVariety: 'If the early variety is not available, she must choose between her old variety and one she does not know.'
      },
      wholeNote: 'No route meets all of Amina’s needs. Mixing routes, for example a neighbour’s early variety with a back-up from the cooperative, covers more than any single route.'
    },

    /* ----------------------------------------------------------------- JOSEPH */
    { id: 'joseph', name: 'Joseph', crop: 'Tomato', cropNote: 'Small irrigated plot, sold fresh to traders',
      intro: 'Joseph grows tomatoes on a small irrigated plot near a road. He raises seedlings in a nursery, transplants them, and sells fresh fruit to traders and the local market.',
      wants: [
        'Uniform, firm fruit that travels well',
        'Tolerance to the diseases that cost him a crop before',
        'Seed that germinates well in the nursery',
        'Seed in hand on nursery sowing day'
      ],
      resources: [
        ['Cash', 'Some from last sales, but not much to spare. A failed nursery would hurt.'],
        ['Labour', 'He and one helper. Nursery and transplanting are the busy weeks.'],
        ['Travel', 'A town with an agro-dealer is an hour away by road.'],
        ['Storage', 'None for the crop. Tomatoes are sold fresh.'],
        ['Information', 'A smartphone and a messaging group with other growers.']
      ],
      importance: { timing: 'medium', cost: 'medium', fit: 'high', quality: 'high', reach: 'low' },
      stages: ['Plan the crop', 'Seed decision window', 'Nursery', 'Transplanting', 'Growing and spraying', 'Harvest and selling'],
      calendar: {
        Cash: ['Some in hand', 'Some in hand', 'Tight', 'Tight', 'Tight', 'Sales come in'],
        Labour: ['Quiet', 'Quiet', 'Busy', 'Peak', 'Busy', 'Peak'],
        'Water and weather risk': ['Check water supply', 'Check water supply', 'Heat and disease risk', 'Heat and disease risk', 'Disease pressure', 'Price dips when many sell'],
        'Seed on offer': ['Group order opens', 'Shop restocks. Group order closes', 'Nothing new', 'Seedlings only', 'Nothing new', 'Own fruit, if any seed is saved']
      },
      decisionStage: 1,
      assess: {
        saved: { timing: ['g', 'In his box now.'], cost: ['g', 'No cash needed.'], fit: ['w', 'His variety is a hybrid. Saved seed will not repeat it.'], quality: ['w', 'Seed-borne disease can carry over.'], reach: ['p', 'Only what the last crop gave.'] },
        neighbours: { timing: ['g', 'Another grower will share.'], cost: ['g', 'A swap or small gift.'], fit: ['u', 'A different variety, untested for his market.'], quality: ['u', 'Not tested.'], reach: ['g', 'A small amount is enough for a nursery.'] },
        market: { timing: ['g', 'On his weekly trip.'], cost: ['p', 'A small cash outlay.'], fit: ['u', 'Loose seed. Variety unclear.'], quality: ['w', 'Unlabelled. Germination unknown.'], reach: ['g', 'Right there at the market.'] },
        coop: { timing: ['p', 'The group order closes before nursery sowing.'], cost: ['g', 'A joint order may lower the price per packet.'], fit: ['p', 'A limited range chosen by the group.'], quality: ['g', 'The group checks seals and lot labels.'], reach: ['g', 'A collection point in the district.'] },
        company: { timing: ['g', 'The dealer restocks before nursery sowing.'], cost: ['p', 'Cash is needed, and he has some from last sales.'], fit: ['g', 'Several varieties, with disease tolerances listed.'], quality: ['g', 'Labelled, sealed and dated.'], reach: ['p', 'An hour’s trip. Any amount.'] }
      },
      story: {
        saved: ['Joseph kept seed from last season’s tomatoes, which were a hybrid. The plants will not match their parent, and seed-borne disease can pass on.', 'Was the variety a hybrid? Did the plants show disease last season?'],
        neighbours: ['Another grower in his messaging group offers seed of a variety she likes. It has not been grown on his soil or sold to his traders.', 'How did the fruit look after transport, and what disease problems did she have?'],
        market: ['A stall at the weekly market sells loose tomato seed in small paper twists. It is cheap and available today, with no label and no germination date.', 'Is there any way to check germination before he sows the whole nursery?'],
        coop: ['His district growers’ group places one joint order each season and shares what each variety did. The order closes a few weeks before he usually sows the nursery.', 'When does the order close, and what happens if a lot fails?'],
        company: ['The agro-dealer an hour away stocks several sealed tomato hybrids with disease tolerances and germination dates on the label. Joseph has some cash from last sales.', 'Is the seal intact, is the lot number recorded, and what does the dealer do if germination is poor?']
      },
      stressNote: {
        rainLate: 'He irrigates, so late rains matter less. Water supply and nursery timing matter more.',
        cashShort: 'A poor price at the last sale leaves little cash. A joint order or smaller packets can help.',
        badBatch: 'A failed nursery costs weeks and money. He needs a lot record and a way to be put right.',
        noVariety: 'If a preferred hybrid sells out, he must pick another and test it on a small bed first.'
      },
      wholeNote: 'For Joseph a company or a growers’ group may fit well, because quality information and fit matter most. That does not make them the answer for Amina or Neema.'
    },

    /* ------------------------------------------------------------------ NEEMA */
    { id: 'neema', name: 'Neema', crop: 'Beans', cropNote: 'Several local varieties, mixed with other crops, food and small local sales',
      intro: 'Neema grows several local bean varieties for the family’s food and a little local selling. She is part of a women’s farmers’ group. A community seed bank is within walking distance.',
      wants: [
        'Keep the bean varieties that taste right and cook fast',
        'Seed without paying cash',
        'Try one variety that does better in dry spells',
        'Enough seed for the whole plot'
      ],
      resources: [
        ['Cash', 'Almost none outside harvest time. She saves a little with her group.'],
        ['Labour', 'Herself and her daughter. Planting is by hand.'],
        ['Travel', 'The seed bank is half an hour’s walk. The shop in town is a day’s round trip.'],
        ['Storage', 'Clay pots with ash. Weevils are a risk.'],
        ['Information', 'Her women’s group and the seed bank’s records.']
      ],
      importance: { timing: 'medium', cost: 'high', fit: 'high', quality: 'medium', reach: 'medium' },
      stages: ['After harvest', 'Dry months', 'Seed decision window', 'Planting window', 'Weeding', 'Pod fill and harvest'],
      calendar: {
        Cash: ['A little', 'Falling', 'Almost none', 'Almost none', 'Almost none', 'Almost none'],
        Labour: ['Busy', 'Quiet', 'Quiet', 'Peak', 'Busy', 'Busy'],
        'Rain risk': ['None', 'None', 'Forecast unsure', 'Onset uncertain', 'Dry spells possible', 'Sensitive'],
        'Seed on offer': ['Own pots filled', 'Seed bank lists varieties', 'Group swaps. Seed bank opens', 'Seed bank open on set days', 'Nothing new', 'Nothing new']
      },
      decisionStage: 2,
      assess: {
        saved: { timing: ['g', 'In her pots.'], cost: ['g', 'No cash needed.'], fit: ['g', 'Her own varieties, with the taste and cooking time she likes.'], quality: ['p', 'Weevils are a risk. She checks by eye.'], reach: ['p', 'Last season’s harvest was small.'] },
        neighbours: { timing: ['g', 'Swaps with women in her group.'], cost: ['g', 'Seed for seed.'], fit: ['g', 'A chance to try a variety that did better in dry spells.'], quality: ['p', 'She has seen it growing in the field.'], reach: ['g', 'Nearby. Small amounts.'] },
        market: { timing: ['g', 'Open when she is ready.'], cost: ['p', 'Needs cash she does not have.'], fit: ['u', 'Sold as food. Variety unknown.'], quality: ['w', 'May be old or may not sprout.'], reach: ['g', 'Close, in any amount.'] },
        coop: { timing: ['p', 'Open on set days before planting.'], cost: ['g', 'A seed loan. She returns seed after harvest.'], fit: ['g', 'Holds several local bean varieties.'], quality: ['p', 'Community records. Checks vary.'], reach: ['p', 'Half an hour’s walk. Share limited per member.'] },
        company: { timing: ['p', 'Only in town.'], cost: ['w', 'Cash she does not have.'], fit: ['p', 'A few improved bean varieties, not her local taste varieties.'], quality: ['g', 'Labelled and tested.'], reach: ['w', 'A day’s trip for a small packet.'] }
      },
      story: {
        saved: ['Neema keeps her bean seed in a clay pot with ash. Her varieties cook fast and taste right. Last season’s harvest was small.', 'Has she checked for weevil damage, and is there enough for the whole plot?'],
        neighbours: ['Women in her farmers’ group swap beans before planting. One variety did better in dry spells last year.', 'What did that variety need, and does it taste right?'],
        market: ['Beans in the market are sold for eating. Some may sprout, some will not, and the variety is unknown.', 'Does a handful sprout, and is it worth cash she does not have?'],
        coop: ['The community seed bank lends bean seed from several local varieties on set days. Borrowers return seed after harvest. The share per member is limited.', 'Which varieties are listed, and what are the repayment terms if the harvest fails?'],
        company: ['A shop in the market town sells packets of improved bush beans. It is a day’s round trip and the cash price is out of reach this month.', 'Would this variety taste and cook like hers?']
      },
      stressNote: {
        rainLate: 'Beans can be a shorter-cycle crop, so a later start may still be workable. The seed in her pots can wait for the rains.',
        cashShort: 'She has almost no cash. Seed-for-seed swaps and a seed loan keep her planting.',
        badBatch: 'Weevil-damaged seed may fail. Swapping again or borrowing from the seed bank gives a second chance.',
        noVariety: 'Several local varieties are in circulation, so losing one is less serious than it would be with a single variety.'
      },
      wholeNote: 'For Neema, routes based on seed sharing and community seed fit more of her needs than a shop does. A shop route is not wrong, but it asks for cash and a long trip.'
    }
  ],

  /* Reflection prompts shown in the debrief. */
  prompts: [
    'Which need drove your first choice? Did a different farmer change your answer?',
    'Which route did you rank last? Under what circumstances might it be the best one?',
    'Which sector functions did your plan depend on? Which were weak or hard to see?',
    'Whose voice is missing from this story (for example women who keep seed, young farmers, seed sellers, extension staff)? What would they tell you?',
    'If you were a programme manager, would you strengthen a route, connect two routes, or leave a route alone? Why?'
  ],

  /* Facilitator note shown in the app (short). Long version: docs/Facilitator_note.md */
  facilitator: {
    purpose: 'Help participants see that farmers use several seed routes, that each route meets some needs and misses others, and that the right answer changes with the farmer, the crop and the season.',
    time: 'About 15 to 20 minutes per farmer. Two farmers in 40 minutes with a short debrief works well.',
    flow: [
      'Ask participants to guess the best route before they open the game. Keep their guesses visible.',
      'Run one farmer individually or in pairs. Ask them to say aloud what matters most to the farmer before choosing.',
      'Run a second farmer. Compare plans across farmers in the debrief table.',
      'Use the eight sector functions to ask which parts of the sector the plan depends on.'
    ],
    watchFor: [
      'Participants naming a single “winner” for all three farmers. Ask what changes if the crop or the cash changes.',
      'Treating certified or company seed as automatically correct, or saved seed as automatically inferior.',
      'Treating the symbols as a score. They are a conversation aid, not a rating.',
      'Using these fictional cases as if they were evidence about a real country.'
    ]
  }
};
