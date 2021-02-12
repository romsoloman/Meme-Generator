'use strict'

let gElCanvas;
let gCtx;
var gKeywordClickedCount = 12;

const init = () => {
    renderGallery(false);
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
    document.body.classList.remove('menu-open');
    document.body.classList.remove('dark');
    const elMemesGallery = document.querySelector('.saved-memes-gallery');
    elMainContent.style.display = 'none';
    elMemesGallery.style.display = 'none';
    elEditor.style.display = 'grid';
}

const openGallery = () => {
    const elMainContent = document.querySelector('.main-content');
    const elEditor = document.querySelector('.meme-editor-container');
    document.body.classList.remove('menu-open')
    document.body.classList.remove('dark');
    elEditor.style.display = 'none';
    elMainContent.style.display = 'grid';
}

const renderGallery = bool => {
    const imgs = getImgs(bool);
    const strHTMLs = imgs.map(img => {
        return `<img src="img/${img.id}.jpg" onclick="onImgClicked(${img.id})">`
    }).join(' ');
    const elGallery = document.querySelector('.gallery-container');
    elGallery.innerHTML = strHTMLs;
    renderKeywords();
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

const onSaveMeme = () => {
    saveMeme(gElCanvas.toDataURL());
}

const onFilterImgs = (ev) => {
    gFilteredImgs = filterImgs(ev.target.value)
    renderGallery(true)
}

const toggleMenu = () => {
    document.body.classList.toggle('menu-open');
    document.body.classList.toggle('dark');
}

// function onImgInput(ev) {
//     loadImageFromInput(ev, renderImg)
// }

// function loadImageFromInput(ev, onImageReady) {
//     document.querySelector('.share-container').innerHTML = ''
//     var reader = new FileReader()

//     reader.onload = function (event) {
//         var img = new Image()
//         img.onload = onImageReady.bind(null, img)
//         img.src = event.target.result
//         gImg = img
//     }
//     reader.readAsDataURL(ev.target.files[0])
// }

function uploadImg(elForm, ev) {
    ev.preventDefault();
    document.getElementById('imgData').value = gElCanvas.toDataURL("image/jpeg");

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
        uploadedImgUrl = encodeURIComponent(uploadedImgUrl)
        console.log('uploadedImgUrl:', uploadedImgUrl)
        document.querySelector('.share-container').innerHTML = `
        <a class="btn" href="https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}" title="Share on Facebook" target="_blank" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${uploadedImgUrl}&t=${uploadedImgUrl}'); return false;">
           Share on Facebook
        </a>`
    }

    doUploadImg(elForm, onSuccess);
}


const renderKeywords = () => {
    let keywords = getKeywords();
    const strHTMLs = keywords.map(keyword => {
        return `<span onclick="onKeywordClick(this)">${keyword}</span>`
    }).join(' ');
    const elKeywords = document.querySelector('.search-keywords');
    elKeywords.innerHTML = strHTMLs;
}

const onKeywordClick = elKeyword => {
    gKeywordClickedCount += 5;
    elKeyword.style.fontSize = `${gKeywordClickedCount}px`;
    gFilteredImgs = filterImgs(elKeyword.innerText);
    setTimeout(renderGallery, 1000, true)

}
// const openSavedMemes = () => {
//     const elMainContent = document.querySelector('.main-content');
//     const elMemesGallery = document.querySelector('.saved-memes-gallery');
//     const elEditor = document.querySelector('.meme-editor-container');
//     elMemesGallery.style.display = 'grid';
//     elMainContent.style.display = 'none'
//     elEditor.style.display = 'none';
//     // renderMeme();
// }


