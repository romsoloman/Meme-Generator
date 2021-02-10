'use strict'


const init = () => {
    renderGallery();
}

const onImgClicked = elImg => {
    openEditor();
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
        return `<img src="img/${img.id}.jpg" onclick="onImgClicked(this)">`
    }).join(' ');
    const elGallery = document.querySelector('.gallery-container');
    elGallery.innerHTML = strHTMLs;
}