const Fastify = require('fastify');
const Canvas = require('canvas');
const App = Fastify({ logger: false});

// Localhost port
const ApiPort = 8080;

// API Main Page
App.get('/home', async (DataRequested, DataResponse) => {
    DataResponse.status(200).send('You have reached the CatchCord Image API!')
})

// API Image Handling
App.post('/main/:dex/:type', async (DataRequested, DataResponse) => {
        
    // Check if values are assigned correctly
    const { dex } = DataRequested.params;
    const { type } = DataRequested.params;

    if (!dex) {
        DataResponse.status(400)
        DataResponse.send('Error: Pokemon dex number needed!')
    }

    if (!type) {
        DataResponse.status(400)
        DataResponse.send('Error: Pokemon type needed!')
    }

    if ((dex > 899) || (dex < 1)) {
        DataResponse.status(400)
        DataResponse.send('Error: Pokemon dex number cannot exceed 898 or be lower than 1!')
    }


    // Random number generator function
    function RandomNumberGenerator(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    // Image maker
    async function ImageMaker(dex, type) {

        var day = new Date().getHours();

        if ((day >= 0 && day < 6) || (day > 12 && day < 18)) {
            var settings = {
                'bug': ['https://media.discordapp.net/attachments/878121517949550625/883140656938237992/pokemon_swsh___route_7__sunset__by_phoenixoflight92_de4kxg0-350t.png', true],
                'water': ['https://media.discordapp.net/attachments/878030078511050845/878059326449799208/1200px-Deepsea_Current_RTDX.png?width=875&height=492', true],
                'rock': ['https://media.discordapp.net/attachments/878121517949550625/882609968887529522/image0.jpg', false],
                'flying': ['https://media.discordapp.net/attachments/878030078511050845/878060215159898223/1761715.png?width=683&height=390', false],
                'grass': ['https://media.discordapp.net/attachments/878121517949550625/882606099801473085/image0.jpg?width=759&height=427', true],
                'normal': ['https://media.discordapp.net/attachments/878121517949550625/883140656938237992/pokemon_swsh___route_7__sunset__by_phoenixoflight92_de4kxg0-350t.png', false],
                'steel': ['https://media.discordapp.net/attachments/878121517949550625/882609968887529522/image0.jpg', false],
                'ice': ['https://media.discordapp.net/attachments/878030078511050845/878059020102017054/Oadneyung.png', false],
                'electric': ['https://media.discordapp.net/attachments/878121517949550625/912579855311339540/ClV5e1F.png?width=589&height=390', false],
                'ground': ['https://media.discordapp.net/attachments/878121517949550625/912579855311339540/ClV5e1F.png?width=589&height=390', false],
                'fairy': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', true],
                'ghost': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390',true],
                'fire': ['https://media.discordapp.net/attachments/878121517949550625/882606099801473085/image0.jpg?width=759&height=427', true],
                'psychic': ['https://media.discordapp.net/attachments/878121517949550625/883141077262024714/unknown.png', true],
                'fighting': ['https://media.discordapp.net/attachments/878030078511050845/878066913702449162/120.png', true],
                'dark': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', true],
                'dragon': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', true],
                'poison': ['https://media.discordapp.net/attachments/878121517949550625/883141077262024714/unknown.png', false]
            }
        }

        // Night settings
        else {
            var settings = {
                'bug': ['https://media.discordapp.net/attachments/878121517949550625/912551175214211122/092abcf9a6e24aacceab8dad9a7ede9c.png', false],
                'water': ['https://media.discordapp.net/attachments/878121517949550625/912550073357971556/de60fnd-03c6d104-a93c-4f21-935c-7a84bed8f8a2.png', false],
                'rock': ['https://media.discordapp.net/attachments/878121517949550625/882609968887529522/image0.jpg', false],
                'flying': ['https://media.discordapp.net/attachments/878121517949550625/912550765053222932/images.png', false],
                'grass': ['https://media.discordapp.net/attachments/878121517949550625/912551175214211122/092abcf9a6e24aacceab8dad9a7ede9c.png', false],
                'normal': ['https://media.discordapp.net/attachments/878121517949550625/912578345126989884/de2soon-f223cb2a-080c-474c-935d-9722f5523503.png?width=693&height=390', false],
                'steel': ['https://media.discordapp.net/attachments/878121517949550625/882609968887529522/image0.jpg', false],
                'ice': ['https://media.discordapp.net/attachments/878121517949550625/912578409455026186/snowcave.png', false],
                'electric': ['https://media.discordapp.net/attachments/878121517949550625/912579855311339540/ClV5e1F.png?width=589&height=390', false],
                'ground': ['https://media.discordapp.net/attachments/878121517949550625/912579855311339540/ClV5e1F.png?width=589&height=390', false],
                'fairy': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', false],
                'ghost': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', false],
                'fire': ['https://media.discordapp.net/attachments/878121517949550625/912578803912560670/de33uyt-aab270ae-87c5-4511-89a9-05f39dcb1de8.png?width=693&height=390', false],
                'psychic': ['https://media.discordapp.net/attachments/878121517949550625/912551675569516585/100453.png?width=671&height=427', false],
                'fighting': ['https://media.discordapp.net/attachments/878121517949550625/912579974496661515/5vwG9iB.png?width=683&height=384', false],
                'dark': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', false],
                'dragon': ['https://media.discordapp.net/attachments/878030078511050845/878066118697312286/EGCfymnXkAE92lx.png?width=689&height=390', false],
                'poison': ['https://media.discordapp.net/attachments/878121517949550625/912551675569516585/100453.png?width=671&height=427', false]
            }
        }

        const varx = RandomNumberGenerator(70, 650)
        const vary = RandomNumberGenerator(200, 320)
        const varw = RandomNumberGenerator(350, 520);
        const varh = varw;

        const canvas = Canvas.createCanvas(1200, 800);
        const context = canvas.getContext('2d');

        // Load background
        const background = await Canvas.loadImage(settings[type][0]);
        context.drawImage(background, 0, 0, canvas.width, canvas.height)

        // Shadow handling
        let shadow = (settings[type][1]);
        if (shadow) {
            let shadow_image = "https://cdn.discordapp.com/attachments/844789985424703569/844986800015540234/iuqEeA-shadow-png-pic-controlled-drugs-cabinets-from-pharmacy.png"
            const shadow = await Canvas.loadImage(shadow_image);
            context.drawImage(shadow, varx, vary, varw + 10, varh + 10);
        }

        // Flipped pokemon image decider
        var flipper = (Math.floor(Math.random() * 2) == 0);
        
        if (flipper) {
            const pokemon = await Canvas.loadImage(`https://raw.githubusercontent.com/Project-PokeBots/Pokemon-Image-Resources/main/Sprites/Regular/normal/${dex}.png`);
            context.drawImage(pokemon, varx, vary, varw, varh);
        } else {
            const pokemon = await Canvas.loadImage(`https://raw.githubusercontent.com/Project-PokeBots/Pokemon-Image-Resources/main/Sprites/Regular/normal/${dex}.png`);
            context.drawImage(pokemon, varx, vary, varw, varh);
        }

        // Add filters
        context.globalCompositeOperation = 'source-atop';
        context.globalCompositeOperation = 'saturation';
        context.fillStyle = "red";
        context.globalAlpha = 1;
        context.fillStyle = "blue";
        context.globalAlpha = 1;
        context.fillRect(0, 0, canvas.width, canvas.height);
        return canvas.toBuffer()
    }

    // Post image
    ImageMaker(dex, type).then((ImageBuffer) => {
        DataResponse.type('image/png');
        DataResponse.send(ImageBuffer);
    })
})

// Run API
const start = async () => {
    try {
        await App.listen(ApiPort);
        console.log(`CatchCord Image API Available on http://localhost:${ApiPort}`);
    } catch(ErrorMessage) {
        App.log.error(ErrorMessage);
    }
}

start();
