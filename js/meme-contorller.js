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
    updateCurrMeme(imgId, 0);
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

const renderImg = (imgId) => {
    const currImage = getCurrImgById(imgId);
    const img = new Image();
    img.src = currImage.url;
    img.onload = () => {
        var currMeme = getCurrMeme();
        gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
        currMeme.lines.forEach(line => {
            drawText(line.txt, line.x, line.y, line.size, line.color, line.font, line.align);
        });
    }
}


const handleText = ev => {
    if (ev.keyCode === 13) return ev.target.value = '';
    if (gCurrMeme.selectedLineIdx === -1) gCurrMeme.selectedLineIdx = 0;
    let currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].txt = ev.target.value
    currMeme = getCurrMeme();
    renderImg(currMeme.selectedImgId)
}


const onChangeFontSize = (direction) => {
    let currMeme = getCurrMeme();
    if (direction === 'up') {
        currMeme.lines[currMeme.selectedLineIdx].size += 5;
    } else {
        currMeme.lines[currMeme.selectedLineIdx].size -= 5;
    }
    renderImg(currMeme.selectedImgId)
}

const onChangeAlign = align => {
    let currMeme = getCurrMeme();
    if (align === 'left') currMeme.lines[currMeme.selectedLineIdx].align = 'right';
    else if (align === 'center') currMeme.lines[currMeme.selectedLineIdx].align = 'center';
    else if (align === 'right') currMeme.lines[currMeme.selectedLineIdx].align = 'left';

    renderImg(currMeme.selectedImgId);
}

const onSetFont = font => {
    let currMeme = getCurrMeme();
    if (font === 'impact') {
        currMeme.lines[currMeme.selectedLineIdx].font = font;
    }
    else {
        currMeme.lines[currMeme.selectedLineIdx].font = font;
    }
    renderImg(currMeme.selectedImgId);
}

const onChangeFontColor = fontColor => {
    let currMeme = getCurrMeme();
    currMeme.lines[currMeme.selectedLineIdx].color = fontColor;
    renderImg(currMeme.selectedImgId);
}

const onDeleteLine = () => {
    let currMeme = getCurrMeme();
    deleteSelectedLine(currMeme.selectedLineIdx, currMeme.selectedImgId);
    resetInputs();
    renderImg(currMeme.selectedImgId);
}

const resetInputs = () => {
    const elText = document.querySelector('.text-editor');
    elText.value = '';
    const elFontColor = document.querySelector('.font-color');
    elFontColor.value = '#000000';
}

const onSwitchLine = direction => {
    let currMeme = getCurrMeme();
    if (currMeme.selectedLineIdx > currMeme.lines.length) return;
    switchLine(direction);
}

const onAddLine = () => {
    addLine();
    resetInputs();
} 