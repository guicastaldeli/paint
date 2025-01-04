//Canvas
    const canvas = document.getElementById('canvas-paint');
    const ctx = canvas.getContext('2d');

    //Width and Height
        canvas.width = 1280;
        canvas.height = 720;
    //
//

let pnt = false;
let ie = false;

let bsz;

let color = '#000000';

//Bg Color
    let bgColor = '#FFF';

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
//

function sp(e) {
    pnt = true;

    draw(e);
}

function stp() {
    pnt = false;

    ctx.beginPath();
}

function draw(e) {
    if(!pnt) {
        return;
    }

    ctx.lineCap = 'round';
    ctx.lineWidth = bsz;

    ctx.strokeStyle = color;

    //Erase
        if(ie) {
            ctx.strokeStyle = bgColor;
        }
    //

    ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);

    ctx.stroke();
    ctx.beginPath();

    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
}

//Save
    const svBtn = document.getElementById('sv-btn');
    
    svBtn.addEventListener('click', () => {
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'image.png';

            link.click();

            URL.revokeObjectURL(url);
        }, 'image/png');
    })
//

//Tools
    const brush = document.getElementById('t-brush');
    const pencil = document.getElementById('t-pencil');
    const bucket = document.getElementById('t-bucket');

    const eraser = document.getElementById('t-eraser');
    
    const colorPicker = document.getElementById('t-color-picker');

    const sliderCnt = document.querySelector('.slider');

    //Tool Specs...
        //Tool Size
            const ts = {
                brush: 15,
                pencil: 3,
                eraser: 15
            };
        //

        //Tool Value
            const tv = {
                brushmin: 10,
                brushmax: 50,

                pencilmin: 1,
                pencilmax: 10,

                erasermin: 1,
                erasermax: 250,
            }
        //
    //

    function slider(tool) {
        const es = document.querySelector('#slider-el');

        if(es) {
            es.remove();
        }

        let sliderEl = `
            <div id="slider-el">
                <input type="range" class="t-slider" id="t-slider-${tool}" min="${tv[tool + 'min']}" max="${tv[tool + 'max']}" value="${ts[tool]}" />
                <div id="s-value"></div>
            </div>
        `;

        sliderCnt.innerHTML += sliderEl;

        //Listeners
            const slider = document.getElementById(`t-slider-${tool}`);
            const sValue = document.getElementById('s-value');

            sValue.style.display = 'none';

            slider.addEventListener('input', (e) => {
                bsz = e.target.value;
                ts[tool] = e.target.value;

                sValue.textContent = `${e.target.value}px`;
            });
            
            //Show and Hide
                slider.addEventListener('mousedown', () => {
                    sValue.style.display = 'block';
                });

                slider.addEventListener('mouseup', () => {
                    setTimeout(() => {
                        sValue.style.display = 'none';
                    }, 200);
                });

                slider.addEventListener('mousemove', (e) => {
                    if(sValue.style.display === 'block') {
                        const mouseY = e.clientY;
                        const adj = mouseY - 285;
    
                        sValue.style.top = `${adj}px`;
    
                        sValue.textContent = `${e.target.value}px`;
                    }
                });
            //
        //
    }

    //Update Color Picker
        function updColorPicker() {
            if(!ie) {
                colorPicker.value = color;
            } else {
                colorPicker.value = bgColor;
            }
        }

        updColorPicker();
    //

    //Listeners
        brush.addEventListener('click', () => {
            if(ie) {
                ie = false;
            }

            bsz = ts.brush;

            canvas.style.cursor = 'url("../assets/cursors/cursor-crosshair.png") 25 25, auto';

            slider('brush');
            toggleBtn(brush);
        });

        pencil.addEventListener('click', () => {
            if(ie) {
                ie = false;
            }

            bsz = ts.pencil;

            canvas.style.cursor = 'url("../assets/cursors/cursor-pencil.png") -5 25, auto';

            slider('pencil');
            toggleBtn(pencil);
        });

        eraser.addEventListener('click', () => {
            ie = true;
            bsz = ts.eraser;

            canvas.style.cursor = 'url("../assets/cursors/cursor-crosshair.png") 25 25, auto';

            slider('eraser');
            toggleBtn(eraser);
        });

        colorPicker.addEventListener('input', (e) => {
            color = e.target.value;
        });

        //Load
            window.addEventListener('load', () => {
                brush.click();
            })
        //
    //

    //Selected Button
        const tools = document.querySelectorAll('.tool');
        
        function toggleBtn(selected) {
            tools.forEach(t => {
                t.classList.remove('selected');
            });

            selected.classList.add('selected');
        }
    //

    //Palette
        const palette = document.querySelector('.palette-container');

        palette.addEventListener('click', (e) => {
            if(e.target.classList.contains('c-box')) {
                color = e.target.getAttribute('data-color');

                updColorPicker();
            }
        })
    //

    //Cursor Indicator
        //Brush and Pencil
            const cursorInd = document.getElementById('cursor-ind');

            canvas.addEventListener('mousemove', (e) => {
                if(!ie) {
                    cursorInd.style.display = 'block';
        
                    cursorInd.style.left = `${e.clientX}px`;
                    cursorInd.style.top = `${e.clientY}px`;
        
                    cursorInd.style.width = `${bsz}px`;
                    cursorInd.style.height = `${bsz}px`;
        
                    cursorInd.style.backgroundColor = ie ? bgColor : color;
                }
            });

            canvas.addEventListener('mouseleave', () => {
                cursorInd.style.display = 'none';
            });
        //

        //Eraser
            const eraserInd = document.getElementById('eraser-ind');

            canvas.addEventListener('mousemove', (e) => {

                if(ie) {
                    eraserInd.style.display = 'block';

                    eraserInd.style.left = `${e.clientX}px`;
                    eraserInd.style.top = `${e.clientY}px`;

                    eraserInd.style.width = `${bsz}px`;
                    eraserInd.style.height = `${bsz}px`;

                    eraserInd.style.backgroundColor = '#FFF';
                } else {
                    eraserInd.style.display = 'none';
                }
            });

            canvas.addEventListener('mouseleave', () => {
                eraserInd.style.display = 'none';
            });
        //
    //
//

//Listeners
    canvas.addEventListener('mousedown', sp);
    canvas.addEventListener('mouseup', stp);
    canvas.addEventListener('mousemove', draw);
//
