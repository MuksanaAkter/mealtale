# Original MealTale artwork

## Hero environment

Created with the built-in image generation tool and saved to `apps/web/public/backgrounds/enchanted-kitchen.png`. The source image is retained separately in the tool's generated-images library.

Prompt: “Create an original premium cinematic fantasy environment painting for a sophisticated medieval kitchen management website. Landscape 16:9 composition: a mossy arched stone window opening onto a majestic distant castle and mountains at dusk, inside an enchanted royal kitchen with carved oak cabinets on the right, glowing amber lanterns, hanging dried herbs, ceramic jars, fresh vegetables, ancient open cookbook in bottom right foreground. Deep enchanted forest greens #172B23, antique gold #C6A66A, warm candlelight, hazy forest, realistic painterly oil texture, rich intricate medieval environment concept art, moody but welcoming and elegant. Keep left third somewhat dark and calm for overlaid headline; center castle visible through arch. No people, no text, no logos, no watermark. Wide high resolution artwork, not a website screenshot.”

## Branding and food artwork

Original vector artwork lives in `apps/web/public/branding/crest.svg` and `apps/web/public/illustrations/`. The crest combines a medieval shield, cooking pot, and growing herb. The recipe and ingredient drawings use the same parchment, moss, timber, and antique gold palette. There are no remote image dependencies.

Headings use Cormorant Garamond; working text uses Geist, both through Next.js font optimization. Initial builds need access to Google Fonts. Reduced-motion preferences disable decorative particles and smooth animations.

## Cinematic homepage, second edition

The new environment was generated with the built-in image generation tool and saved as `apps/web/public/backgrounds/forest-kingdom-v2.png`. The existing kitchen painting remains in use for the story scene and the 3D book's inset illustration.

Prompt: “Create a cinematic premium fantasy environment painting for the background of a sophisticated medieval kitchen website. Very wide landscape, lush enchanted ancient pine forest with moss-covered stone arch ruins framing a distant slender fairytale castle on a mountain ridge, a softly glowing winding river, tiny warm amber kitchen windows in the distant castle, mist, atmospheric rays of early morning light and a few golden fireflies. Mature sophisticated realistic painterly cinematic concept art, tactile fine details, deep dark evergreen and teal palette #102a24, antique gold #c6a66a, soft turquoise fog, mysterious welcoming atmosphere. Keep left 55% very dark and calm as negative space behind a white headline; right side has the castle and mountain landscape but no close objects. No people, no text, no logos, no letters, no watermark. A beautiful environment, not a website mockup. 16:9 wide composition.”

The interactive cookbook uses CSS 3D surfaces for the front cover, spine, page block, back cover, and bookmark. Motion springs respond to mouse position; touch interaction is reserved for scrolling and chapter buttons. The page also includes scroll-linked scenery, a progress line, section reveals, an illustrative feature explorer, an interactive sample shopping list, mobile navigation, and an FAQ accordion. No WebGL library or additional dependency was added. Reduced-motion preferences disable decorative animation and pointer-driven tilt.

Homepage styling is isolated in `src/components/landing/landing.module.css`. The Tailwind loader excludes `.module.css` files so native Next.js CSS module class mapping remains intact.

## Food-first imagery, third edition

Both new images were created with the built-in image generation tool. They make recognizable food, pantry ingredients, and meal preparation the primary subject while retaining the established fantasy kitchen atmosphere. These assets now replace the forest-only imagery on the homepage.

- `apps/web/public/backgrounds/enchanted-meal-kitchen-v3.png`: hero, story arch, and closing scene. The right foreground prominently shows soup, bread, fresh vegetables, a cookbook, and pantry storage; the left remains calm for readable text.
- `apps/web/public/images/kingdom/keepers-table-v3.png`: the 3D cookbook inset, floating recipe thumbnail, and food-care section. Soup, fresh ingredients, bread, and an illustrated recipe book communicate MealTale’s purpose.

### Kitchen environment prompt

“Create a premium cinematic hero background for MealTale, a fantasy kitchen and meal-planning app. It must immediately and unmistakably communicate FOOD, COOKING and a WELL-KEPT PANTRY. Wide landscape 16:9, camera inside a sophisticated enchanted medieval kitchen. In the right foreground an abundant large oak preparation table with a clearly visible steaming cast-iron pot of vegetable soup, ripe red tomatoes, carrots with green tops, mushrooms, leafy spinach, herbs, a golden crusty sourdough loaf, ceramic ingredient jars, a wooden spoon and an open recipe book showing botanical food drawings (no readable writing). Food should be large and appetizing, a dominant visual subject. Behind the table, carved pantry shelves with organized jars, hanging bunches of herbs, copper pans, warm lanterns. A small distant arched window hints at a misty woodland castle, but fantasy scenery is secondary to the kitchen and food. Left 45% is dark calm forest-green kitchen wall and subtle pantry silhouettes, intentionally quiet for cream headline text. Realistic painterly cinematic illustration, sophisticated mature fantasy, highly detailed delicious food, warm golden food lighting against deep enchanted forest green #102a24 and antique gold #c6a66a. No people, no typography, no logo, no watermark, not a website screenshot.”

### Keeper’s table prompt

“An original refined cinematic still life for MealTale, the enchanted kitchen and meal planner. Close-up three-quarter view of a rustic oak kitchen table beautifully arranged with an appetizing steaming bowl of vegetable and mushroom soup as the main focal point, a golden sourdough loaf, ripe tomatoes, carrots, fresh spinach and basil, mushrooms, a small glass olive oil bottle and wooden spoon. An open antique cookbook with botanical food illustrations lies behind the bowl, with neat pantry jars in the softly blurred background. Emphasize recognizable fresh ingredients and a delicious home cooked meal, evoke thoughtful pantry care and cooking with what you already have. Sophisticated medieval fantasy kitchen, realistic painterly cinematic food photography quality, luxurious warm window light and candle glow, deep forest greens, warm cream ceramics, aged gold details and dark wood. Food and ingredients fill most of image, balanced central composition that crops well to both a portrait arch and landscape card. No people, no text, no watermark, no logos. Landscape 4:3 image.”
