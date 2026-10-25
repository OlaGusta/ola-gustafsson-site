<?php
declare(strict_types=1);

require __DIR__ . '/seo.php';
require_once __DIR__ . '/portfolio_core.php';

// Utställningssidan för Ljusets återkomst, Husby konsthall 3–25 oktober 2026,
// tillsammans med Jenny Övrebö. Utställningstexten är Olas egen och ska stå
// ordagrant på svenska; den engelska är en översättning med verkens engelska
// titlar (ur verklistan). Bilderna byggs av scripts/content/build-husby-images.sh
// till images/ljusets-aterkomst/.

$lang = seo_normalize_lang($_GET['lang'] ?? null);
$en = $lang === 'en';
$text = seo_text($lang);
$canonical = seo_canonical_url('exhibition-husby', $lang);
seo_redirect_explicit_sv_lang_to($canonical);
$baseUrl = seo_base_url();
$robots = seo_is_stage() ? $text['robots_stage'] : $text['robots_live'];
$ogLocale = seo_lang_og_locale($lang);
$ogLocaleAlt = $en ? seo_lang_og_locale('sv') : seo_lang_og_locale('en');
$overridesRev = (int) (@filemtime(__DIR__ . '/overrides.js') ?: 0);
$overridesRevParam = $overridesRev > 0 ? (string) $overridesRev : '0';
$payload = seo_overrides_payload();
$fontStylesheetHref = seo_google_fonts_href($payload);
$poster = seo_poster_config($payload, $lang);

$imageDir = 'images/ljusets-aterkomst';
$manifest = json_decode((string) @file_get_contents(__DIR__ . '/' . $imageDir . '/manifest.json'), true);
if (!is_array($manifest)) {
  $manifest = [];
}

$heading = 'Ljusets återkomst';
$sunTitle = $en ? '100 Days of Sun' : '100 dagar av sol';
$meta = $en ? 'Husby konsthall · 3–25 October 2026 · with Jenny Övrebö' : 'Husby konsthall · 3–25 oktober 2026 · tillsammans med Jenny Övrebö';
$title = $en
  ? 'Ljusets återkomst – exhibition at Husby konsthall 2026 | Ola Gustafsson'
  : 'Ljusets återkomst – utställning i Husby konsthall 2026 | Ola Gustafsson';
$description = $en
  ? 'Ljusets återkomst, an exhibition of watercolors by Ola Gustafsson and Jenny Övrebö at Husby konsthall, 3–25 October 2026: 100 Days of Sun and ten large watercolors of the sun in water.'
  : 'Ljusets återkomst, en utställning med akvareller av Ola Gustafsson och Jenny Övrebö i Husby konsthall 3–25 oktober 2026: 100 dagar av sol och tio stora akvareller med solen i vatten.';
$ogImage = $baseUrl . '/' . $imageDir . '/og.jpg';

// Bilder: id => [alt sv, alt en, bildtext sv, bildtext en]
$images = [
  '00-utstallningen' => [
    'Besökare bland fristående skärmar med akvareller i Husby konsthall, med solljus över golvet.',
    'Visitors among free-standing panels with watercolors at Husby konsthall, with sunlight across the floor.',
    'Tid i vila II och III till vänster, Jenny Övrebös akvareller till höger.',
    'Time, Suspended II and III on the left, watercolors by Jenny Övrebö on the right.',
  ],
  '01-timmarna-och-solvaggen' => [
    'Besökare framför tre akvareller med segelbåtar i glittrande vatten och en vägg med hundra små solakvareller.',
    'Visitors in front of three watercolors of sailboats on glittering water and a wall of a hundred small sun watercolors.',
    'Timmarna däremellan I–III och 100 dagar av sol.',
    'The Hours Between I–III and 100 Days of Sun.',
  ],
  '02-ola-vid-solvaggen' => [
    'Ola Gustafsson står framför väggen med de hundra solakvarellerna.',
    'Ola Gustafsson standing in front of the wall with the hundred sun watercolors.',
    'Ola Gustafsson vid 100 dagar av sol.',
    'Ola Gustafsson by 100 Days of Sun.',
  ],
  '03-svarta-rummet' => [
    'Ett rum med svarta väggar och tre akvareller av solreflexer i vatten samt två solar.',
    'A room with black walls, three watercolors of sun reflections in water and two suns.',
    'För flera solar sedan I–III och två solar som Fine Art Print.',
    'Several Suns Ago I–III and two suns as Fine Art Prints.',
  ],
  '04-det-langa-nuet' => [
    'En stående akvarell mellan två fönster: en simmare omgiven av ringar och glitter i mörkt vatten.',
    'A vertical watercolor between two windows: a swimmer surrounded by rings and glitter in dark water.',
    'Det långa nuet.',
    'The Long Now.',
  ],
  '05-tid-i-vila' => [
    'En besökare framför tre akvareller av kroppar under vattenytan.',
    'A visitor in front of three watercolors of bodies below the surface of the water.',
    'Tid i vila I–III.',
    'Time, Suspended I–III.',
  ],
  '06-timmarna-daremellan' => [
    'Akvarell av en segelbåt i motljus på glittrande vatten.',
    'Watercolor of a sailboat against the light on glittering water.',
    'Timmarna däremellan II.',
    'The Hours Between II.',
  ],
  '07-jenny-skarmar' => [
    'Besökare bland fristående skärmar med Jenny Övrebös landskapsakvareller i solljus.',
    'Visitors among free-standing panels with Jenny Övrebö’s landscape watercolors in sunlight.',
    'Jenny Övrebös akvareller.',
    'Watercolors by Jenny Övrebö.',
  ],
  '08-jenny-vagg' => [
    'Två besökare framför en vägg med tolv mindre akvareller av Jenny Övrebö.',
    'Two visitors in front of a wall with twelve smaller watercolors by Jenny Övrebö.',
    'Jenny Övrebös mindre akvareller.',
    'Smaller watercolors by Jenny Övrebö.',
  ],
  '09-oppningstal' => [
    'Sven Einarsson läser sitt öppningstal i konsthallen medan besökare lyssnar.',
    'Sven Einarsson reading his opening speech in the gallery while visitors listen.',
    'Sven Einarsson håller öppningstalet.',
    'Sven Einarsson gives the opening speech.',
  ],
  '10-ola-och-jenny' => [
    'Jenny Övrebö och Ola Gustafsson i konsthallen.',
    'Jenny Övrebö and Ola Gustafsson in the gallery.',
    'Jenny Övrebö och Ola Gustafsson på vernissagen.',
    'Jenny Övrebö and Ola Gustafsson at the opening.',
  ],
  '11-blommor' => [
    'Blombuketter på golvet i ett solstrålsljus.',
    'Bouquets of flowers on the floor in a beam of sunlight.',
    'Blommor från vernissagen.',
    'Flowers from the opening.',
  ],
  '12-ola-demo' => [
    'Ola Gustafsson målar vid ett bord med publik omkring sig.',
    'Ola Gustafsson painting at a table with an audience around him.',
    'Demomåleri dagen efter vernissagen.',
    'Painting demo the day after the opening.',
  ],
  '13-jenny-demo' => [
    'Jenny Övrebö visar en målning för publiken.',
    'Jenny Övrebö showing a painting to the audience.',
    'Jenny Övrebö visar sitt arbete.',
    'Jenny Övrebö showing her work.',
  ],
  '14-pensel' => [
    'En hand med pensel målar ett grönt träd på ett akvarellark.',
    'A hand with a brush painting a green tree on a sheet of watercolor paper.',
    'Demomåleri.',
    'Painting demo.',
  ],
  '16-demomalning-sol' => [
    'Akvarell av en solnedgång med mörka moln och silhuetter av träd.',
    'Watercolor of a sunset with dark clouds and silhouetted trees.',
    'Solnedgång, en av mina två demomålningar.',
    'Sunset, one of my two demo paintings.',
  ],
  '17-demomalning-moln' => [
    'Akvarell av mörka moln över silhuetter mot en ljus horisont.',
    'Watercolor of dark clouds over silhouettes against a light horizon.',
    'Moln, den andra demomålningen.',
    'Clouds, the second demo painting.',
  ],
  '15-solvaggen' => [
    'Väggen med alla hundra solakvareller i tio rader.',
    'The wall with all hundred sun watercolors in ten rows.',
    '100 dagar av sol.',
    '100 Days of Sun.',
  ],
];

$h = static fn (string $value): string => htmlspecialchars($value, ENT_QUOTES);

// $sizes följer layouten i styles.css: hel containerbredd, textspalten (44rem) eller ett par.
$figureSizes = [
  'wide' => '(max-width: 1220px) 100vw, 1160px',
  'prose' => '(max-width: 760px) 100vw, 704px',
  'pair' => '(max-width: 760px) 100vw, 570px',
  'portrait' => '(max-width: 600px) 100vw, 512px',
];
// Ett bildpar beskärs till samma proportion (den smalaste i paret) så att bilderna
// blir lika höga.
$pairRatio = static function (array $ids) use ($manifest): ?float {
  $ratios = [];
  foreach ($ids as $id) {
    if (isset($manifest[$id]) && is_array($manifest[$id]) && (int) $manifest[$id][1] > 0) {
      $ratios[] = (int) $manifest[$id][0] / (int) $manifest[$id][1];
    }
  }
  return count($ratios) > 1 ? min($ratios) : null;
};
$figure = static function (string $id, string $layout = 'prose', bool $eager = false, ?float $ratio = null) use ($images, $manifest, $imageDir, $en, $h, $figureSizes): string {
  if (!isset($images[$id])) {
    return '';
  }
  [$altSv, $altEn, $capSv, $capEn] = $images[$id];
  $size = isset($manifest[$id]) && is_array($manifest[$id]) ? $manifest[$id] : [1600, 1067];
  $width = (int) $size[0];
  $height = (int) $size[1];
  $thumbWidth = (int) round($width * min(1, 800 / max($width, $height)));
  $src = $imageDir . '/' . $id . '.jpg';
  $thumb = $imageDir . '/thumb/' . $id . '.jpg';
  $loading = $eager ? ' loading="eager" fetchpriority="high"' : ' loading="lazy"';
  // Stående bilder i textspalten får en smalare bredd (annars över en skärmhöjd).
  $portrait = $layout === 'prose' && $height > $width;
  if ($portrait) {
    $layout = 'portrait';
  }
  $style = $ratio !== null ? ' style="aspect-ratio: ' . number_format($ratio, 4, '.', '') . '; object-fit: cover;"' : '';
  return '<figure class="exhibition-figure' . ($portrait ? ' exhibition-figure--portrait' : '') . '">'
    . '<img src="' . $h($src) . '" srcset="' . $h($thumb) . ' ' . $thumbWidth . 'w, ' . $h($src) . ' ' . $width . 'w"' . $style
    . ' sizes="' . $h($figureSizes[$layout] ?? $figureSizes['prose']) . '" width="' . $width . '" height="' . $height . '"'
    . ' alt="' . $h($en ? $altEn : $altSv) . '"' . $loading . ' decoding="async" />'
    . '<figcaption>' . $h($en ? $capEn : $capSv) . '</figcaption>'
    . '</figure>';
};

// Utställningstexten. Svenska = Olas text ordagrant. Titlar i <em>.
$essay = $en ? [
  'One sun, a hundred moments. Sometimes visible as a clear disc, sometimes dissolved in light or hidden behind clouds. The same star, but every encounter with it is different.',
  'My watercolors revolve around the lasting and the transient — permanence and impermanence. The starting point is our relationship with the sun: a star at an unimaginable distance, whose presence is at the same time part of our most everyday experience. We feel its warmth, follow the changes in its light and count our days and years. The sun marks our place in the universe and provides the conditions for life here. It also holds a force that can consume.',
  'The sun is there whatever clouds obscure it. Measured against our lives, it seems permanent. Yet our experience of it is constantly changing. The light shifts with the weather, the time of day and the place where we are. What returns never meets us in quite the same way.',
  'In the exhibition <em>Ljusets återkomst</em> at Husby konsthall, two parts of my work met: a hundred small sun paintings and ten large watercolors in which the sun is present through water. Together they explore how something so distant can become close and concrete, and how a returning light can hold moments that never come back.',
  '<em>100 Days of Sun</em> consists of a hundred watercolors. Each image is a brief visit, an encounter with the sun for a limited time. The repetition holds the series together, while the differences between the images are given room. The sun appears, disappears and returns. A clear shape can be almost dissolved in the next image.',
  'The title also holds the time the work is made of. A hundred days is a sequence of single moments, each with its own presence. Seen together, the images become a way of looking at both what lasts and what changes. The same sun is in all of them, but the days are different.',
  ['02-ola-vid-solvaggen'],
  'In the large watercolors I meet the sun through water. The light is reflected in the surface, refracted on its way through the water and changed by the movement of the waves. A single sun can be split into thousands of fleeting suns. The glitter is familiar, but it can also bring a starry sky to mind. The concrete and the cosmic are close to each other.',
  'The three paintings <em>Several Suns Ago I, II and III</em> revolve around these reflections. The title lets the sun become a measure of time gone by. The surface of the water carries the light for a moment, before the movement changes it. The next reflection appears almost in the same place, but is already a different one.',
  ['03-svarta-rummet'],
  'In <em>The Long Now</em> a swimmer is surrounded by water, rings and glitter. Here the limited time of a human being meets the feeling of something that reaches far beyond her. A swim is a simple, bodily experience. At the same time such a moment can feel strangely vast, as if the present has been given more room.',
  ['04-det-langa-nuet'],
  '<em>Time, Suspended I, II and III</em> take the eye below the surface. The bodies are in a state where movement, weight and light are experienced differently. The title approaches the feeling of stepping out of the ordinary flow of time for a while. Time goes on, but the experience of it changes. The pause is temporary; we will return to the surface.',
  ['05-tid-i-vila'],
  'In <em>The Hours Between I, II and III</em> there are the birds, the boats and the open water. The motifs belong to a recognizable world, with moments that perhaps do not stand out through any particular event. Yet it is exactly such hours that can stay with us: the light over the water, a place, the feeling of being there.',
  ['06-timmarna-daremellan'],
  'The large formats give me room to linger over the fleeting. The motifs can feel slow, even though a reflection or the movement of a body changes in an instant. Here lies a connection between the small sun paintings and the large water paintings. Both are about time, but give it different room.',
  'Water is also in the painting itself. It carries the pigment across the paper, lets shapes emerge and edges dissolve. I work with it and try to leave room for what I cannot fully control. The changeability of the material is part of the work on the images.',
  'When I think about what we have and what we lose, it is about the moments and what they hold. A meeting, a feeling, someone’s presence. Something that matters while it lasts, but that we can only partly carry with us as memory.',
  'The light can return without the moment coming back. I want to linger in the joy of being here, knowing that the moment changes even as we experience it.',
  '<em>Ljusets återkomst</em> was shown at Husby konsthall from 3 to 25 October 2026, together with Jenny Övrebö.',
] : [
  'En sol, hundra ögonblick. Ibland synlig som en tydlig skiva, ibland upplöst i ljus eller dold bakom moln. Samma stjärna, men varje möte med den är annorlunda.',
  'Mina akvareller kretsar kring det beständiga och det förgängliga — permanens och impermanens. Utgångspunkten är vår relation till solen: en stjärna på ett ofattbart avstånd, vars närvaro samtidigt är en del av vår mest vardagliga erfarenhet. Vi känner dess värme, följer ljusets förändringar och räknar våra dagar och år. Solen anger vår plats i universum och ger förutsättningarna för livet här. Den rymmer också en kraft som kan förtära.',
  'Solen finns där oavsett vilka moln som skymmer den. I förhållande till våra liv framstår den som bestående. Ändå är vår erfarenhet av den ständigt föränderlig. Ljuset skiftar med vädret, tiden på dagen och platsen där vi befinner oss. Det som återkommer möter oss aldrig riktigt på samma sätt.',
  'I utställningen <em>Ljusets återkomst</em> på Husby konsthall möttes två delar av mitt arbete: hundra små solbilder och tio stora akvareller där solen är närvarande genom vatten. Tillsammans undersöker de hur något så avlägset kan bli nära och konkret, och hur ett återkommande ljus kan rymma ögonblick som aldrig kommer tillbaka.',
  '<em>100 dagar av sol</em> består av hundra akvareller. Varje bild är ett kort nedslag, ett möte med solen under en begränsad stund. Upprepningen håller samman serien, samtidigt som skillnaderna mellan bilderna får ta plats. Solen framträder, försvinner och återkommer. En tydlig form kan i nästa bild vara nästan upplöst.',
  'Titeln rymmer också tiden som arbetet består av. Hundra dagar är en följd av enskilda stunder, var och en med sin egen närvaro. Sedda tillsammans blir bilderna ett sätt att betrakta både det som består och det som förändras. Samma sol finns i dem alla, men dagarna är olika.',
  ['02-ola-vid-solvaggen'],
  'I de stora akvarellerna möter jag solen genom vatten. Ljuset återspeglas i ytan, bryts på sin väg genom vattnet och förändras med vågornas rörelser. En enda sol kan delas i tusentals tillfälliga solar. Glittret är välbekant, men kan också föra tanken till en stjärnhimmel. Det konkreta och det kosmiska finns nära varandra.',
  'De tre målningarna <em>För flera solar sedan I, II och III</em> kretsar kring dessa reflektioner. Titeln låter solen bli ett mått på förfluten tid. Vattenytan bär ljuset för ett ögonblick, innan rörelsen förändrar det. Nästa reflex uppstår nästan på samma plats, men är redan en annan.',
  ['03-svarta-rummet'],
  'I <em>Det långa nuet</em> omges en simmare av vatten, ringar och glitter. Här möts människans begränsade tid och känslan av något som sträcker sig långt bortom henne. Ett bad är en enkel, kroppslig erfarenhet. Samtidigt kan en sådan stund kännas märkligt vidsträckt, som om nuet har fått mer rum.',
  ['04-det-langa-nuet'],
  '<em>Tid i vila I, II och III</em> för blicken under vattenytan. Kropparna befinner sig i ett tillstånd där rörelse, tyngd och ljus upplevs annorlunda. Titeln närmar sig känslan av att för en stund kliva ur den vanliga tidens gång. Tiden fortsätter, men upplevelsen av den förändras. Vilan är tillfällig; vi kommer att återvända till ytan.',
  ['05-tid-i-vila'],
  'I <em>Timmarna däremellan I, II och III</em> finns fåglarna, båtarna och det öppna vattnet. Motiven hör till en igenkännbar värld, med stunder som kanske inte utmärker sig genom någon särskild händelse. Ändå kan just sådana timmar stanna kvar hos oss: ljuset över vattnet, en plats, känslan av att vara där.',
  ['06-timmarna-daremellan'],
  'De stora formaten ger mig utrymme att dröja vid det flyktiga. Motiven kan upplevas som långsamma, trots att en reflex eller en kropps rörelse förändras på ett ögonblick. Där finns en förbindelse mellan de små solbilderna och de stora vattenbilderna. Båda handlar om tid, men ger den olika utrymme.',
  'Vattnet finns också i själva måleriet. Det för pigmentet över papperet, låter former uppstå och gränser lösas upp. Jag arbetar med det och försöker lämna plats för sådant jag inte helt kan styra. Materialets föränderlighet är en del av arbetet med bilderna.',
  'När jag tänker på vad vi har och vad vi förlorar handlar det om ögonblicken och det som ryms i dem. Ett möte, en känsla, någons närvaro. Något som är betydelsefullt medan det pågår, men som vi bara delvis kan bära med oss som minne.',
  'Ljuset kan återkomma utan att stunden återvänder. Jag vill dröja i glädjen över att vara här, med vetskapen om att stunden förändras också medan vi upplever den.',
  '<em>Ljusets återkomst</em> visades på Husby konsthall den 3–25 oktober 2026, tillsammans med Jenny Övrebö.',
];

// Del 2: utställningen. Varje avsnitt: rubrik, stycken (HTML), bilder (en eller ett par).
$jarvaLink = '<a href="https://www.nyhetsbyranjarva.se/imponerande-med-akvarellmalning-live/" rel="noopener">'
  . ($en ? 'Imponerande med akvarellmålning live</a> (in Swedish)' : 'Imponerande med akvarellmålning live</a>');
$sections = $en ? [
  ['With Jenny Övrebö', [
    'Jenny Övrebö showed forests, fields and lakes, and I showed the sun and water. We share watercolor as a medium but come to the theme from different directions, and on the walls the paintings belonged together.',
  ], ['07-jenny-skarmar', '08-jenny-vagg']],
  ['The opening', [
    'The opening drew a large crowd, many of them our friends. Sven Einarsson opened the exhibition with a speech on the importance of light and of art. I was tense beforehand and left the gallery happy and grateful for all the kind words, flowers and gifts.',
  ], ['09-oppningstal'], ['10-ola-och-jenny', '11-blommor']],
  ['Painting in front of an audience', [
    'The day after the opening, Jenny and I painted live in the gallery. The audience was enthusiastic and stayed all day, through both Jenny’s demo and mine. Nyhetsbyrån Järva was there and wrote the report ' . $jarvaLink . '.',
  ], ['12-ola-demo'], ['16-demomalning-sol', '17-demomalning-moln'], ['13-jenny-demo', '14-pensel']],
  ['Afterwards', [
    'The preparations were far more extensive than I had expected. Then came the hanging, the opening, three weeks of the exhibition and finally taking it down. It has been a really fun and valuable experience.',
  ]],
] : [
  ['Med Jenny Övrebö', [
    'Jenny Övrebö visade skog, fält och sjöar, jag solen och vattnet. Vi har akvarellen gemensamt men går in i temat från olika håll, och på väggarna hörde bilderna ihop.',
  ], ['07-jenny-skarmar', '08-jenny-vagg']],
  ['Vernissagen', [
    'Vernissagen samlade många besökare, bland dem många av våra vänner. Sven Einarsson öppnade utställningen med ett tal om ljusets och konstens betydelse. Jag var spänd inför öppningen och lämnade konsthallen glad och tacksam för alla vänliga ord, blommor och presenter.',
  ], ['09-oppningstal'], ['10-ola-och-jenny', '11-blommor']],
  ['Måla inför publik', [
    'Dagen efter vernissagen målade Jenny och jag live i konsthallen. Publiken var entusiastisk och stannade hela dagen, både under Jennys och min demo. Nyhetsbyrån Järva var där och skrev reportaget ' . $jarvaLink . '.',
  ], ['12-ola-demo'], ['16-demomalning-sol', '17-demomalning-moln'], ['13-jenny-demo', '14-pensel']],
  ['Efteråt', [
    'Förberedelserna var mycket mer omfattande än jag trodde. Sedan kom hängningen, vernissagen, tre veckor med utställningen och till sist nedplockningen. Det har varit en väldigt rolig och nyttig upplevelse.',
  ]],
];

// Verken ur verklistan (akvarell på papper, höjd × bredd). Länkar läggs till när
// verken finns i galleriet.
$works = $en ? [
  ['The Long Now', '76 × 56 cm'],
  ['Time, Suspended I–III', '56 × 76 cm'],
  ['Several Suns Ago I–III', 'I and III 76 × 56 cm, II 56 × 76 cm'],
  ['The Hours Between I–III', '56 × 76 cm'],
  ['100 Days of Sun', '100 watercolors, 26 × 18 cm each, sold as one collected work'],
] : [
  ['Det långa nuet', '76 × 56 cm'],
  ['Tid i vila I–III', '56 × 76 cm'],
  ['För flera solar sedan I–III', 'I och III 76 × 56 cm, II 56 × 76 cm'],
  ['Timmarna däremellan I–III', '56 × 76 cm'],
  ['100 dagar av sol', '100 akvareller, 26 × 18 cm per ark, säljs som samlat verk'],
];

$personId = $baseUrl . '/#ola-gustafsson';
$workTitles = ['Det långa nuet', 'Tid i vila I', 'Tid i vila II', 'Tid i vila III', 'För flera solar sedan I', 'För flera solar sedan II', 'För flera solar sedan III', 'Timmarna däremellan I', 'Timmarna däremellan II', 'Timmarna däremellan III', '100 dagar av sol'];
$workTitlesEn = ['The Long Now', 'Time, Suspended I', 'Time, Suspended II', 'Time, Suspended III', 'Several Suns Ago I', 'Several Suns Ago II', 'Several Suns Ago III', 'The Hours Between I', 'The Hours Between II', 'The Hours Between III', '100 Days of Sun'];
$structuredData = [
  [
    '@context' => 'https://schema.org',
    '@type' => 'WebPage',
    '@id' => $canonical . '#webpage',
    'url' => $canonical,
    'name' => $heading,
    'description' => $description,
    'inLanguage' => seo_lang_locale($lang),
    'isPartOf' => ['@id' => $baseUrl . '/#website'],
    'about' => ['@id' => $canonical . '#exhibition'],
    'primaryImageOfPage' => $ogImage,
  ],
  [
    '@context' => 'https://schema.org',
    '@type' => 'ExhibitionEvent',
    '@id' => $canonical . '#exhibition',
    'name' => $heading,
    'description' => $description,
    'startDate' => '2026-10-03',
    'endDate' => '2026-10-25',
    'eventAttendanceMode' => 'https://schema.org/OfflineEventAttendanceMode',
    'eventStatus' => 'https://schema.org/EventScheduled',
    'image' => $ogImage,
    'url' => $canonical,
    'location' => [
      '@type' => 'Place',
      'name' => 'Husby konsthall',
      'address' => ['@type' => 'PostalAddress', 'addressLocality' => 'Stockholm', 'addressCountry' => 'SE'],
    ],
    'performer' => [
      ['@type' => 'Person', '@id' => $personId, 'name' => 'Ola Gustafsson'],
      ['@type' => 'Person', 'name' => 'Jenny Övrebö'],
    ],
    'workFeatured' => array_map(
      static fn (string $name): array => ['@type' => 'VisualArtwork', 'name' => $name, 'artform' => 'Watercolor', 'creator' => ['@id' => $personId]],
      $en ? $workTitlesEn : $workTitles
    ),
  ],
  [
    '@context' => 'https://schema.org',
    '@type' => 'BreadcrumbList',
    'itemListElement' => [
      ['@type' => 'ListItem', 'position' => 1, 'name' => $en ? 'Home' : 'Hem', 'item' => seo_canonical_url('home', $lang)],
      ['@type' => 'ListItem', 'position' => 2, 'name' => $heading, 'item' => $canonical],
    ],
  ],
];
$structuredJson = json_encode($structuredData, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) ?: '[]';
$sunUrl = seo_canonical_url('sun', $lang);
?>
<!DOCTYPE html>
<html lang="<?= $h($lang) ?>">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <base href="/" />
    <title><?= $h($title) ?></title>
    <meta name="description" content="<?= $h($description) ?>" />
    <meta name="robots" content="<?= $h($robots) ?>" />
    <link rel="canonical" href="<?= $h($canonical) ?>" />
    <link rel="alternate" hreflang="sv" href="<?= $h(seo_canonical_url('exhibition-husby', 'sv')) ?>" />
    <link rel="alternate" hreflang="en" href="<?= $h(seo_canonical_url('exhibition-husby', 'en')) ?>" />
    <link rel="alternate" hreflang="x-default" href="<?= $h(seo_canonical_url('exhibition-husby', 'sv')) ?>" />

    <meta property="og:title" content="<?= $h($title) ?>" />
    <meta property="og:description" content="<?= $h($description) ?>" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="<?= $h($canonical) ?>" />
    <meta property="og:site_name" content="<?= $h($text['site_name']) ?>" />
    <meta property="og:locale" content="<?= $h($ogLocale) ?>" />
    <meta property="og:locale:alternate" content="<?= $h($ogLocaleAlt) ?>" />
    <meta property="og:image" content="<?= $h($ogImage) ?>" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:image" content="<?= $h($ogImage) ?>" />

    <meta name="theme-color" content="#f3efe6" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-light-32x32.png?v=20260317-14" media="(prefers-color-scheme: light)" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-dark-32x32.png?v=20260317-14" media="(prefers-color-scheme: dark)" />
    <link id="favicon-ico" rel="icon" href="/favicon-light.ico?v=20260317-14" sizes="any" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png?v=20260317-14" />
    <link rel="manifest" href="/site.webmanifest?v=20260317-14" />

    <script type="application/ld+json"><?= $structuredJson ?></script>

    <?php if ($fontStylesheetHref !== ''): ?>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" media="print" data-deferred-stylesheet="fonts" />
      <noscript><link href="<?= $h($fontStylesheetHref) ?>" rel="stylesheet" /></noscript>
    <?php endif; ?>
    <link rel="stylesheet" href="styles.css?v=20261025-04" />
    <script src="overrides.js?v=<?= $h($overridesRevParam) ?>"></script>
    <script src="content.js?v=20260928-01" defer></script>
    <script src="script.js?v=20261025-02" defer></script>
    <script src="shop.js?v=20261013-06" defer></script>
  </head>
  <body id="page-top" data-page="exhibition">
    <header class="site-header" id="top">
      <div class="container header-inner">
        <a class="brand" href="index.html#top" data-lang-link>
          <span class="brand-logo" aria-hidden="true"></span>
          <span class="brand-text">
            <span data-bind="site.brandName">Ola Gustafsson</span>
            <span data-bind="site.brandTag">Akvarell</span>
          </span>
        </a>
        <nav id="main-nav" class="main-nav" aria-label="Huvudmeny" data-bind-aria="ui.navAriaLabel">
          <a href="index.html#hem" data-bind="ui.navHome" data-lang-link>Hem</a>
          <a href="gallery.html" data-bind="ui.navGallery" data-lang-link>Galleri</a>
          <a href="index.html#om" data-bind="ui.navAbout" data-lang-link>Om</a>
          <a href="index.html#kontakt" data-bind="ui.navContact" data-lang-link>Kontakt</a>
        </nav>
        <div class="lang-switch" role="group" aria-label="Välj språk" data-bind-aria="ui.languageSwitcherAria">
          <button type="button" class="lang-switch-btn" data-lang-option="sv" aria-label="Svenska">SV</button>
          <button type="button" class="lang-switch-btn" data-lang-option="en" aria-label="English">EN</button>
        </div>
        <div class="theme-switch" role="group" aria-label="Välj färgläge" data-bind-aria="ui.themeSwitcherAria">
          <button type="button" class="theme-switch-btn" data-theme-option="light" aria-label="Ljus" data-bind="ui.themeOptionLight">Ljus</button>
          <button type="button" class="theme-switch-btn" data-theme-option="dark" aria-label="Mörk" data-bind="ui.themeOptionDark">Mörk</button>
          <button type="button" class="theme-switch-btn" data-theme-option="contrast" aria-label="Hög kontrast">Kontrast</button>
        </div>
        <button class="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Öppna meny" data-bind="ui.menuButton" data-bind-aria="ui.menuAriaLabel">Meny</button>
      </div>
    </header>

    <main>
      <article class="section exhibition-page">
        <div class="container">
          <header class="exhibition-head">
            <p class="eyebrow"><?= $h($en ? 'Exhibition · October 2026' : 'Utställning · Oktober 2026') ?></p>
            <h1><?= $h($heading) ?></h1>
            <p class="exhibition-meta"><?= $h($meta) ?></p>
          </header>

          <div class="exhibition-wide"><?= $figure('00-utstallningen', 'wide', true) ?></div>

          <div class="exhibition-prose">
            <?php foreach ($essay as $block): ?>
              <?php if (is_array($block)): ?>
                <?= $figure($block[0]) ?>
              <?php else: ?>
                <p><?= $block ?></p>
              <?php endif; ?>
            <?php endforeach; ?>
          </div>

          <?php foreach ($sections as $section):
            [$sectionHeading, $paragraphs] = $section;
            $groups = array_slice($section, 2);
          ?>
            <section class="exhibition-section">
              <div class="exhibition-prose">
                <h2><?= $h($sectionHeading) ?></h2>
                <?php foreach ($paragraphs as $paragraph): ?>
                  <p><?= $paragraph ?></p>
                <?php endforeach; ?>
              </div>
              <?php foreach ($groups as $group): ?>
                <div class="exhibition-figures<?= count($group) > 1 ? ' exhibition-figures--pair' : '' ?>">
                  <?php $groupRatio = $pairRatio($group); ?>
                  <?php foreach ($group as $imageId): ?>
                    <?= $figure($imageId, count($group) > 1 ? 'pair' : 'prose', false, $groupRatio) ?>
                  <?php endforeach; ?>
                </div>
              <?php endforeach; ?>
            </section>
          <?php endforeach; ?>

          <section class="exhibition-section">
            <div class="exhibition-prose">
              <h2><?= $h($en ? 'The works' : 'Verken') ?></h2>
              <p class="exhibition-works-note"><?= $h($en ? 'Watercolor on paper, height × width.' : 'Akvarell på papper, höjd × bredd.') ?></p>
              <ul class="exhibition-works">
                <?php foreach ($works as [$workTitle, $workSize]): ?>
                  <li><em><?= $h($workTitle) ?></em><span><?= $h($workSize) ?></span></li>
                <?php endforeach; ?>
              </ul>
              <p><?= $en
                ? 'Questions about the works? <a href="index.html#kontakt" data-lang-link>Write to me</a>.'
                : 'Frågor om verken? <a href="index.html#kontakt" data-lang-link>Skriv till mig</a>.' ?></p>
            </div>
          </section>

          <section class="exhibition-cta surface-soft" aria-labelledby="exhibition-cta-heading">
            <?= $figure('15-solvaggen', 'pair') ?>
            <div class="exhibition-cta-body">
              <p class="eyebrow">Fine Art Print</p>
              <h2 id="exhibition-cta-heading"><?= $h($en ? 'The suns are still here' : 'Solarna finns kvar') ?></h2>
              <p><?= $h($en
                ? 'All hundred suns from ' . $sunTitle . ' are available as signed Fine Art Prints.'
                : 'Alla hundra solar från ' . $sunTitle . ' finns som signerad Fine Art Print.') ?>
                <?php if ($poster['enabled']): ?><?= $h($en ? 'The whole series is also collected on a poster.' : 'Hela serien finns också samlad på en poster.') ?><?php endif; ?></p>
              <div class="exhibition-cta-actions">
                <a class="btn btn-primary" href="<?= $h($sunUrl) ?>"><?= $h($en ? 'See all 100 suns' : 'Se alla 100 solar') ?></a>
                <?php if ($poster['enabled']): ?>
                  <a class="btn btn-ghost" href="<?= $h($sunUrl) ?>#poster"><?= $h($en ? 'The poster' : 'Postern') ?></a>
                <?php endif; ?>
              </div>
            </div>
          </section>

          <div class="gallery-cta-row">
            <a class="btn btn-ghost" href="index.html#hem" data-lang-link><?= $h($en ? 'Back to the home page' : 'Tillbaka till startsidan') ?></a>
            <a class="btn btn-ghost" href="gallery.html" data-lang-link><?= $h($en ? 'All paintings' : 'Alla målningar') ?></a>
          </div>
        </div>
      </article>
    </main>

    <footer class="site-footer">
      <div class="container footer-inner">
        <div class="footer-brand">
          <span class="footer-logo" aria-hidden="true"></span>
          <p data-bind="site.footerText">© 2026 Ola Gustafsson Akvarell</p>
        </div>
        <div class="footer-tools">
          <a id="studio-footer-link" class="footer-auth-btn" href="/studio.html">Studio</a>
          <button type="button" class="footer-contrast-toggle" data-contrast-toggle aria-pressed="false">Hög kontrast</button>
          <a href="#page-top" data-scroll-top data-bind="ui.scrollTop">Till toppen</a>
        </div>
      </div>
    </footer>
  </body>
</html>
