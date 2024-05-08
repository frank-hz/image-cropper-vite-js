import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/800.css';
import './style.css'
import 'cropperjs/dist/cropper.min.css'
import 'cropperjs/dist/cropper.min.js'
import Cropper from 'cropperjs'


document.querySelector('#_preview').innerHTML = `
    <img alt="" id="_image_preview" src="" width="450px">
`
window.addEventListener('DOMContentLoaded', function(){
    let croppable = false
    let button_upload = document.getElementById('_btn_upload')
    let button_cut = document.getElementById('_btn_cut')
    let button_download = document.getElementById('_btn_download')

    
    let section_preview = document.getElementById('_preview')
    let section_result = document.getElementById('_result')



    // creation
    let image_init = document.getElementById('_image_preview')
    let input_file = document.createElement('input')
    input_file.type = 'file'
    
    var cropper = new Cropper(image_init, {
        viewMode: 1,
        aspectRatio: 1,
        ready: function () {
          croppable = true;
        },
        zoom: function (event) {
            if (event.detail.oldRatio === 1) {
              event.preventDefault();
            }
        }
    })

    button_upload.onclick = function(){
        input_file.click()
    }

    input_file.onchange = function(){
        const extensions = ['image/jpeg','image/jpg','image/png',"text/plain"];
        let file = this.files[0];
        
        if (!file || !extensions.includes(file.type)){
            console.log('format not allowed');
            return;
        }
        let fileReader = new FileReader()
        fileReader.addEventListener('load', evt => {
            let fileURL = fileReader.result
            cropper.replace(fileURL)
            button_cut.style.display = 'inherit'
        })
        fileReader.readAsDataURL(file)
    }


    button_cut.onclick = function(){       
        let croppedObject = cropper.getCroppedCanvas();
        let canvas = createCanvas(croppedObject);

        let imageResult = document.createElement('img')
        imageResult.style.width = '500px'
        imageResult.style.height = '500px'
        imageResult.src = canvas.toDataURL()

        section_result.innerHTML = ''
        section_result.appendChild(imageResult)
        button_download.style.display = 'inherit'
        button_download.download = 'image-cut.png'
        button_download.href = canvas.toDataURL('image/png')
        
    }
})


function createCanvas(sourceCanvas) {
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var width = sourceCanvas.width;
    var height = sourceCanvas.height;

    canvas.width = width;
    canvas.height = height;
    context.imageSmoothingEnabled = true;
    context.drawImage(sourceCanvas, 0, 0, width, height);
    context.globalCompositeOperation = 'destination-in';
    context.beginPath();
    context.fill();
    return canvas;
}