'use strict'
const STORAGE_KEY = 'SavedMemes';
const gImgs = [
    { id: 1, url: 'img/1.jpg', keywords: ['trump', 'president', 'angry'] },
    { id: 2, url: 'img/2.jpg', keywords: ['pets', 'love'] },
    { id: 3, url: 'img/3.jpg', keywords: ['sleepy', 'pets', 'baby'] },
    { id: 4, url: 'img/4.jpg', keywords: ['sleepy', 'pets'] },
    { id: 5, url: 'img/5.jpg', keywords: ['funny', 'baby'] },
    { id: 6, url: 'img/6.jpg', keywords: ['funny'] },
    { id: 7, url: 'img/7.jpg', keywords: ['shock', 'baby'] },
    { id: 8, url: 'img/8.jpg', keywords: ['listen'] },
    { id: 9, url: 'img/9.jpg', keywords: ['funny'] },
    { id: 10, url: 'img/10.jpg', keywords: ['funny', 'president'] },
    { id: 11, url: 'img/11.jpg', keywords: ['kiss'] },
    { id: 12, url: 'img/12.jpg', keywords: ['famous'] },
    { id: 13, url: 'img/13.jpg', keywords: ['actor', 'funny'] },
    { id: 14, url: 'img/14.jpg', keywords: ['actor'] },
    { id: 15, url: 'img/15.jpg', keywords: ['actor'] },
    { id: 16, url: 'img/16.jpg', keywords: ['actor', 'funny'] },
    { id: 17, url: 'img/17.jpg', keywords: ['putin', 'president'] },
    { id: 18, url: 'img/18.jpg', keywords: ['movie'] },
];
var gFilteredImgs;
var gCurrMeme;
var gKeywords = ['all', 'funny', 'actor', 'movie', 'president', 'sleepy', 'pets', 'baby', 'listen', 'kiss', 'shock', 'putin', 'obama', 'trump'];
var gSavedMemes = [];

const getKeywords = () => {
    return gKeywords;
}

const getSavedMemes = () => {
    return gSavedMemes;
}

const getCurrMeme = () => {
    return gCurrMeme;
}

const getImgs = (bool) => {
    return bool ? gFilteredImgs : gImgs;
}

const getCurrImgById = imgId => {
    return gImgs.find(img => {
        return img.id === imgId;
    })
}

const updateCurrMeme = (imgId, lineIdx = 1, txt, size = 36, font = 'Impact', align = 'center', color = 'white') => {
    gCurrMeme = {
        selectedImgId: imgId, selectedLineIdx: lineIdx, lines: [{ txt, size, font, align, color, x: 200, y: 50 }, { txt, size, font, align, color, x: 200, y: 400 }]
    }
}


const deleteSelectedLine = (selectedLineIdx, imgId) => {
    gCurrMeme.lines.splice(selectedLineIdx, 1);
    gCurrMeme.selectedLineIdx--;
    if (gCurrMeme.selectedLineIdx === -1 && !gCurrMeme.lines.length) {
        updateCurrMeme(imgId)
        gCurrMeme.selectedLineIdx = 0;
    }
}


const switchLine = direction => {
    if (direction === 'up') {
        if (gCurrMeme.selectedLineIdx === 0) return;
        gCurrMeme.selectedLineIdx--;
    }
    else {
        gCurrMeme.selectedLineIdx++
        if (gCurrMeme.selectedLineIdx === gCurrMeme.lines.length) gCurrMeme.selectedLineIdx = gCurrMeme.lines.length - 1;
    }
}

const addLine = (txt, size = 36, font = 'Impact', align = 'center', color = 'white') => {

    gCurrMeme.lines.splice(gCurrMeme.selectedLineIdx + 1, 0, { txt, size, font, align, color, x: 200, y: 50 * gCurrMeme.lines.length + 10 })
    gCurrMeme.selectedLineIdx++;
}

const filterImgs = value => {
    const result = gImgs.filter(img => {
        const keyword = img.keywords.filter(keyword => {
            return keyword.includes(value);
        })
        if (keyword.length > 0) return keyword;
    });
    return result;
}

const saveMeme = elCanvasData => {
    gSavedMemes.push({ imgUrl: elCanvasData })
    _saveMemesToStorage({ imgUrl: elCanvasData });
}

const _saveMemesToStorage = () => {
    saveToStorage(STORAGE_KEY, gSavedMemes);
}