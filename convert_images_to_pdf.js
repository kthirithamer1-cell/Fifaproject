const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Player statistics registry
const PLAYER_STATS_DB = {
    'youssef': {
        name: 'YOUSSEF',
        rating: 98,
        position: 'JAW',
        type: 'LEGEND',
        stats: [
            { code: 'DHK', value: 98 },
            { code: 'JAW', value: 99 },
            { code: 'S7B', value: 96 },
            { code: '9HW', value: 92 },
            { code: 'DBR', value: 90 },
            { code: 'HRB', value: 88 }
        ]
    },
    'kader': {
        name: 'KADER',
        rating: 97,
        position: 'GZR',
        type: 'BOSS',
        stats: [
            { code: 'GZR', value: 97 },
            { code: 'MRG', value: 95 },
            { code: 'DHK', value: 96 },
            { code: 'TKK', value: 91 },
            { code: 'S7B', value: 95 },
            { code: '9HW', value: 93 }
        ]
    },
    'sousou': {
        name: 'SOUSOU',
        rating: 99,
        position: 'DHK',
        type: 'GOAT',
        stats: [
            { code: 'DHK', value: 99 },
            { code: 'JAW', value: 98 },
            { code: 'S7B', value: 97 },
            { code: 'RKD', value: 94 },
            { code: '9HW', value: 96 },
            { code: 'HRB', value: 91 }
        ]
    },
    'issam': {
        name: 'ISSAM',
        rating: 99,
        position: 'GOAT',
        type: 'LEGEND',
        stats: [
            { code: 'DHK', value: 99 },
            { code: 'TKK', value: 90 },
            { code: 'RKD', value: 98 },
            { code: 'HRB', value: 94 },
            { code: '9HW', value: 95 },
            { code: 'S7B', value: 97 }
        ]
    },
    'maher': {
        name: 'MAHER',
        rating: 98,
        position: 'LEGEND',
        type: 'LEGEND',
        stats: [
            { code: 'DHK', value: 99 },
            { code: 'TKK', value: 88 },
            { code: 'RKD', value: 96 },
            { code: 'HRB', value: 95 },
            { code: '9HW', value: 93 },
            { code: 'S7B', value: 93 }
        ]
    },
    'alui': {
        name: 'ALUI',
        rating: 97,
        position: 'LEGEND',
        type: 'LEGEND',
        stats: [
            { code: 'DHK', value: 98 },
            { code: 'TKK', value: 85 },
            { code: 'RKD', value: 95 },
            { code: 'HRB', value: 93 },
            { code: '9HW', value: 90 },
            { code: 'S7B', value: 94 }
        ]
    },
    'delai': {
        name: 'DELAI',
        rating: 96,
        position: 'LEGEND',
        type: 'LEGEND',
        stats: [
            { code: 'DHK', value: 97 },
            { code: 'TKK', value: 85 },
            { code: 'RKD', value: 94 },
            { code: 'HRB', value: 92 },
            { code: '9HW', value: 89 },
            { code: 'S7B', value: 90 }
        ]
    },
    'sankooh': {
        name: 'SANKOOH',
        rating: 94,
        position: 'LEGEND',
        type: 'LEGEND',
        stats: [
            { code: 'DHK', value: 95 },
            { code: 'TKK', value: 81 },
            { code: 'RKD', value: 92 },
            { code: 'HRB', value: 89 },
            { code: '9HW', value: 88 },
            { code: 'S7B', value: 91 }
        ]
    }
};

function getPlayerStatsData(fileName) {
    const cleanName = path.basename(fileName, path.extname(fileName)).toLowerCase().trim();
    for (const key of Object.keys(PLAYER_STATS_DB)) {
        if (cleanName.includes(key)) {
            return PLAYER_STATS_DB[key];
        }
    }
    // Fallback default stats for any unknown image
    const displayName = cleanName.replace(/[^a-zA-Z0-9]/g, ' ').toUpperCase().trim() || 'LEGEND';
    return {
        name: displayName,
        rating: 95,
        position: 'JAW',
        type: 'CUSTOM',
        stats: [
            { code: 'DHK', value: 95 },
            { code: 'JAW', value: 92 },
            { code: 'S7B', value: 90 },
            { code: '9HW', value: 88 },
            { code: 'DBR', value: 86 },
            { code: 'HRB', value: 85 }
        ]
    };
}

// Generate full FIFA Card HTML with stats breakdown
function buildCardHTMLWithStats(base64Img, playerData) {
    const s = playerData.stats;
    const col1 = s.slice(0, 3);
    const col2 = s.slice(3, 6);

    return `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { width: 700px; height: 1050px; overflow: hidden; background: #0a0a0c; font-family: 'Montserrat', sans-serif; }
        
        .card-wrapper {
            width: 700px;
            height: 1050px;
            padding: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at center, #1e1b12 0%, #080705 100%);
        }

        .fifa-card {
            position: relative;
            width: 640px;
            height: 980px;
            background: linear-gradient(135deg, #fce074 0%, #dfa727 40%, #b8820c 70%, #f9e285 100%);
            border-radius: 40px 40px 200px 200px;
            padding: 12px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.4);
        }

        .inner-card {
            position: relative;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 30%, #2a2416 0%, #120e07 80%);
            border-radius: 32px 32px 190px 190px;
            border: 3px solid #fce074;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Top Left Rating & Position */
        .rating-box {
            position: absolute;
            top: 40px;
            left: 45px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fce074;
            text-shadow: 0 4px 10px rgba(0,0,0,0.9);
            z-index: 10;
        }
        .rating-num {
            font-size: 72px;
            font-weight: 900;
            line-height: 0.9;
            letter-spacing: -2px;
        }
        .position-code {
            font-size: 28px;
            font-weight: 800;
            margin-top: 4px;
            color: #fff;
            letter-spacing: 1px;
        }
        .flag {
            width: 42px;
            height: 28px;
            margin-top: 10px;
            background: #e70013;
            border-radius: 4px;
            position: relative;
            box-shadow: 0 2px 6px rgba(0,0,0,0.5);
        }
        .flag::after {
            content: '🇹🇳';
            position: absolute;
            font-size: 20px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        /* Player Image */
        .player-img-container {
            width: 480px;
            height: 520px;
            margin-top: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 5;
        }
        .player-img-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 15px 25px rgba(0,0,0,0.7));
        }

        /* Player Name Header */
        .name-banner {
            width: 90%;
            text-align: center;
            padding: 10px 0;
            border-top: 2px solid rgba(252, 224, 116, 0.4);
            border-bottom: 2px solid rgba(252, 224, 116, 0.4);
            margin-top: -10px;
            z-index: 10;
        }
        .player-name {
            font-size: 42px;
            font-weight: 900;
            color: #fce074;
            text-transform: uppercase;
            letter-spacing: 3px;
            text-shadow: 0 4px 12px rgba(0,0,0,0.8);
        }

        /* Stats Grid */
        .stats-grid {
            width: 82%;
            display: flex;
            justify-content: space-between;
            margin-top: 25px;
            z-index: 10;
        }
        .stat-col {
            display: flex;
            flex-direction: column;
            gap: 12px;
            width: 46%;
        }
        .stat-item {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 26px;
            font-weight: 800;
            color: #fff;
        }
        .stat-val {
            color: #fce074;
            font-size: 30px;
            font-weight: 900;
            min-width: 45px;
        }
        .stat-lbl {
            color: #e2d3a3;
            letter-spacing: 1px;
        }
    </style>
</head>
<body>
    <div class="card-wrapper">
        <div class="fifa-card">
            <div class="inner-card">
                <div class="rating-box">
                    <div class="rating-num">${playerData.rating}</div>
                    <div class="position-code">${playerData.position}</div>
                    <div class="flag"></div>
                </div>

                <div class="player-img-container">
                    <img src="${base64Img}" alt="${playerData.name}" />
                </div>

                <div class="name-banner">
                    <div class="player-name">${playerData.name}</div>
                </div>

                <!-- Stats grid commented out for now - will be added later for all cards -->
                <!--
                <div class="stats-grid">
                    <div class="stat-col">
                        ${col1.map(item => `
                            <div class="stat-item">
                                <span class="stat-val">${item.value}</span>
                                <span class="stat-lbl">${item.code}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="stat-col">
                        ${col2.map(item => `
                            <div class="stat-item">
                                <span class="stat-val">${item.value}</span>
                                <span class="stat-lbl">${item.code}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                -->
            </div>
        </div>
    </div>
</body>
</html>`;
}

async function convertImagesToPdf() {
    const imagesDir = path.join(__dirname, 'public', 'images');
    
    if (!fs.existsSync(imagesDir)) {
        console.error(`Directory not found: ${imagesDir}`);
        process.exit(1);
    }

    const files = fs.readdirSync(imagesDir);
    let imageFiles = files.filter(f => 
        /\.(png|jpg|jpeg|webp)$/i.test(f) && 
        !f.startsWith('.') &&
        !f.includes('logo') &&
        !f.includes('save') &&
        !f.includes('converted_page')
    );

    // Prioritize Youssef, Kader, and Sousou at the VERY FIRST positions
    const priorityList = ['youssef', 'kader', 'sousou'];

    imageFiles.sort((a, b) => {
        const aLower = a.toLowerCase();
        const bLower = b.toLowerCase();
        const aIndex = priorityList.findIndex(p => aLower.includes(p));
        const bIndex = priorityList.findIndex(p => bLower.includes(p));

        if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
        if (aIndex !== -1) return -1;
        if (bIndex !== -1) return 1;
        return aLower.localeCompare(bLower);
    });

    console.log(`🚀 Found ${imageFiles.length} images. Priority items first:`);
    imageFiles.forEach((f, idx) => console.log(`   ${idx + 1}. ${f}`));

    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    // 1. Convert each image to a high-quality PDF with analyzed stats
    for (const file of imageFiles) {
        const filePath = path.join(imagesDir, file);
        const fileExt = path.extname(file);
        const fileNameWithoutExt = path.basename(file, fileExt);
        const pdfFileName = `${fileNameWithoutExt}_card.pdf`;
        const pdfFilePath = path.join(imagesDir, pdfFileName);

        const imgBuffer = fs.readFileSync(filePath);
        const mimeType = fileExt.toLowerCase() === '.webp' ? 'image/webp' : 
                        (fileExt.toLowerCase() === '.jpg' || fileExt.toLowerCase() === '.jpeg' ? 'image/jpeg' : 'image/png');
        const base64Img = `data:${mimeType};base64,${imgBuffer.toString('base64')}`;

        // Get analyzed player stats
        const playerData = getPlayerStatsData(file);

        // Build HTML card with stats
        const html = buildCardHTMLWithStats(base64Img, playerData);

        const page = await browser.newPage();
        await page.setViewport({ width: 700, height: 1050, deviceScaleFactor: 3 });
        await page.setContent(html, { waitUntil: 'load', timeout: 30000 });
        await new Promise(r => setTimeout(r, 200));

        const pdfBuffer = await page.pdf({
            width: '700px',
            height: '1050px',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            preferCSSPageSize: true
        });

        fs.writeFileSync(pdfFilePath, pdfBuffer);
        console.log(`✅ Converted ${file} -> ${pdfFileName} [Stats: ${playerData.name} | ${playerData.rating} OVR] (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
        await page.close();
    }

    // 2. Multi-page combined PDF containing ALL cards in order (Youssef, Kader, Sousou first)
    if (imageFiles.length > 0) {
        console.log('\nCreating multi-page combined PDF containing all analyzed card images in priority order...');
        
        const pageHtmls = [];
        for (const file of imageFiles) {
            const filePath = path.join(imagesDir, file);
            const fileExt = path.extname(file);
            const imgBuffer = fs.readFileSync(filePath);
            const mimeType = fileExt.toLowerCase() === '.webp' ? 'image/webp' : 
                            (fileExt.toLowerCase() === '.jpg' || fileExt.toLowerCase() === '.jpeg' ? 'image/jpeg' : 'image/png');
            const base64Img = `data:${mimeType};base64,${imgBuffer.toString('base64')}`;

            const playerData = getPlayerStatsData(file);
            const s = playerData.stats;
            const col1 = s.slice(0, 3);
            const col2 = s.slice(3, 6);

            pageHtmls.push(`
    <div class="page">
        <div class="fifa-card">
            <div class="inner-card">
                <div class="rating-box">
                    <div class="rating-num">${playerData.rating}</div>
                    <div class="position-code">${playerData.position}</div>
                    <div class="flag"></div>
                </div>
                <div class="player-img-container">
                    <img src="${base64Img}" alt="${playerData.name}" />
                </div>
                <div class="name-banner">
                    <div class="player-name">${playerData.name}</div>
                </div>
                <!-- Stats grid commented out for now - will be added later for all cards -->
                <!--
                <div class="stats-grid">
                    <div class="stat-col">
                        ${col1.map(item => `
                            <div class="stat-item">
                                <span class="stat-val">${item.value}</span>
                                <span class="stat-lbl">${item.code}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="stat-col">
                        ${col2.map(item => `
                            <div class="stat-item">
                                <span class="stat-val">${item.value}</span>
                                <span class="stat-lbl">${item.code}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                -->
            </div>
        </div>
    </div>`);
        }

        const combinedHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: 700px 1050px; margin: 0; }
        body { background: #0a0a0c; font-family: 'Montserrat', sans-serif; }
        
        .page {
            width: 700px;
            height: 1050px;
            padding: 30px;
            page-break-after: always;
            display: flex;
            align-items: center;
            justify-content: center;
            background: radial-gradient(circle at center, #1e1b12 0%, #080705 100%);
        }
        .page:last-child { page-break-after: avoid; }

        .fifa-card {
            position: relative;
            width: 640px;
            height: 980px;
            background: linear-gradient(135deg, #fce074 0%, #dfa727 40%, #b8820c 70%, #f9e285 100%);
            border-radius: 40px 40px 200px 200px;
            padding: 12px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.8), inset 0 0 15px rgba(255,255,255,0.4);
        }

        .inner-card {
            position: relative;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at 50% 30%, #2a2416 0%, #120e07 80%);
            border-radius: 32px 32px 190px 190px;
            border: 3px solid #fce074;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .rating-box {
            position: absolute;
            top: 40px;
            left: 45px;
            display: flex;
            flex-direction: column;
            align-items: center;
            color: #fce074;
            text-shadow: 0 4px 10px rgba(0,0,0,0.9);
            z-index: 10;
        }
        .rating-num { font-size: 72px; font-weight: 900; line-height: 0.9; letter-spacing: -2px; }
        .position-code { font-size: 28px; font-weight: 800; margin-top: 4px; color: #fff; letter-spacing: 1px; }
        .flag {
            width: 42px; height: 28px; margin-top: 10px; background: #e70013; border-radius: 4px; position: relative;
        }
        .flag::after {
            content: '🇹🇳'; position: absolute; font-size: 20px; top: 50%; left: 50%; transform: translate(-50%, -50%);
        }

        .player-img-container {
            width: 480px; height: 520px; margin-top: 20px; display: flex; align-items: center; justify-content: center; z-index: 5;
        }
        .player-img-container img { max-width: 100%; max-height: 100%; object-fit: contain; }

        .name-banner {
            width: 90%; text-align: center; padding: 10px 0; border-top: 2px solid rgba(252, 224, 116, 0.4); border-bottom: 2px solid rgba(252, 224, 116, 0.4); margin-top: -10px; z-index: 10;
        }
        .player-name { font-size: 42px; font-weight: 900; color: #fce074; text-transform: uppercase; letter-spacing: 3px; }

        .stats-grid { width: 82%; display: flex; justify-content: space-between; margin-top: 25px; z-index: 10; }
        .stat-col { display: flex; flex-direction: column; gap: 12px; width: 46%; }
        .stat-item { display: flex; align-items: center; gap: 10px; font-size: 26px; font-weight: 800; color: #fff; }
        .stat-val { color: #fce074; font-size: 30px; font-weight: 900; min-width: 45px; }
        .stat-lbl { color: #e2d3a3; letter-spacing: 1px; }
    </style>
</head>
<body>
    ${pageHtmls.join('')}
</body>
</html>`;

        const combinedPage = await browser.newPage();
        await combinedPage.setViewport({ width: 700, height: 1050, deviceScaleFactor: 3 });
        await combinedPage.setContent(combinedHTML, { waitUntil: 'load', timeout: 60000 });
        await new Promise(r => setTimeout(r, 500));

        const combinedPdfBuffer = await combinedPage.pdf({
            width: '700px',
            height: '1050px',
            printBackground: true,
            margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
            preferCSSPageSize: true
        });

        const combinedPdfPath = path.join(imagesDir, 'all_images_combined.pdf');
        fs.writeFileSync(combinedPdfPath, combinedPdfBuffer);
        console.log(`\n🎉 Created multi-page PDF: all_images_combined.pdf (${(combinedPdfBuffer.length / 1024).toFixed(1)} KB)`);
        await combinedPage.close();
    }

    await browser.close();
    console.log('\n✨ All image to PDF conversions completed!');
}

convertImagesToPdf().catch(err => {
    console.error('Error during image to PDF conversion:', err);
    process.exit(1);
});
