'use strict'

let gElCanvas;
let gCtx;

const init = () => {
    renderGallery();
    renderCanvas();
}

const onImgClicked = imgId => {
    openEditor();
    renderImg(imgId);
    updateCurrMeme(imgId, 0, null);
}

const openEditor = () => {
    const elMainContent = document.querySelector('.main-content');
    const elEditor = document.querySelector('.meme-editor-container');
    elMainContent.style.display = 'none';
    elEditor.style.display = 'grid';
}

const openGallery = () => {
    const elMainContent = document.querySelector('.main-content');
    const elEditor = document.querySelector('.meme-editor-container');
    elEditor.style.display = 'none';
    elMainContent.style.display = 'grid';
}

const renderGallery = () => {
    const imgs = getImgs();
    const strHTMLs = imgs.map(img => {
        return `<img src="img/${img.id}.jpg" onclick="onImgClicked(${img.id})">`
    }).join(' ');
    const elGallery = document.querySelector('.gallery-container');
    elGallery.innerHTML = strHTMLs;
}

const renderCanvas = () => {
    gElCanvas = document.getElementById('my-canvas')
    gCtx = gElCanvas.getContext('2d');
}

const renderImg = (imgId, txt = '') => {
    const currImage = getCurrImgById(imgId);
    const img = new Image();
    img.src = currImage.url;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        drawText(txt)
    }
}


const handleText = ev => {
    let currMeme = getCurrMeme();
    updateCurrMeme(currMeme.selectedImgId, 0, ev.target.value);
    currMeme = getCurrMeme();
    renderImg(currMeme.selectedImgId, currMeme.lines[0].txt)
}
