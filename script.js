var source = null; 
var secret = null; 
var containerImage = null; 
var shiftImage = null; 
var firstCanvas; 
var secondCanvas;
var endSymbol = '|';

function loadSource () {
  var fileinput = document.getElementById("sourceInput"); 
  source = new SimpleImage(fileinput); 
  containerImage = new SimpleImage(fileinput); 
  
  firstCanvas = document.getElementById("firstCanvas"); 
  source.drawTo(firstCanvas); 
}

function loadSecret () {
  var fileinput = document.getElementById("secretInput"); 
  secret = new SimpleImage(fileinput); 
  shiftImage = new SimpleImage(fileinput); 
  
  secondCanvas = document.getElementById("secondCanvas"); 
  secret.drawTo(secondCanvas); 
}

function text2Binary(string) {
  // var input = unescape(encodeURIComponent(string+'|'));
  var input = string+endSymbol;
  var arr = [];
  var arr2 = [];
  for (var i = 0; i < input.length; i++) {
    arr.push(input.charCodeAt(i).toString(2).padStart(8,'0'));
  }
  console.log(arr);
  return arr;
}

function encrypt() {
  //TODO:
  // - Vérifier les tailles d'image :
  //      - si la source est plus petite, dire qu'il va y avoir des problemes
  //      - si les deux fichiers sont de taille différente, dire que ça va foutre la merde
  
  for (var containerImagePixel of containerImage.values()) {
    var x = containerImagePixel.getX(); 
    var y = containerImagePixel.getY(); 
    var hiddenShift = shiftImage.getPixel(x, y); 
    
    var existingRed = Math.floor(containerImagePixel.getRed()/16) * 16; 
    var existingGreen = Math.floor(containerImagePixel.getGreen()/16) * 16; 
    var existingBlue = Math.floor(containerImagePixel.getBlue()/16) * 16; 
    
    var newRed = Math.floor(hiddenShift.getRed()/16); 
    var newGreen = Math.floor(hiddenShift.getGreen()/16); 
    var newBlue = Math.floor(hiddenShift.getBlue()/16); 
    
    containerImagePixel.setRed(existingRed + newRed); 
    containerImagePixel.setGreen(existingGreen + newGreen); 
    containerImagePixel.setBlue(existingBlue + newBlue); 
  }
  containerImage.drawTo(secondCanvas); 
}

function encrypt_t(){
  var textToHide = document.getElementById('textToHide');
  var binaryData = text2Binary(textToHide.value);
  var count = 0;
  for(var containerImagePixel of containerImage.values()){  
    if(count == binaryData.length){
      break;
    }

    var x = containerImagePixel.getX(); 
    var y = containerImagePixel.getY(); 
    
    var existingRed = Math.floor(containerImagePixel.getRed()/16) * 16; 
    var existingGreen = Math.floor(containerImagePixel.getGreen()/16) * 16; 
    
    var newRed = parseInt(binaryData[count].substring(0,4),2);
    var newGreen = parseInt(binaryData[count].substring(4,8),2);
    
    containerImagePixel.setRed(existingRed + newRed);
    containerImagePixel.setGreen(existingGreen + newGreen);
    
    count++;
  }
  containerImage.drawTo(firstCanvas);
}

function extract() {
  shiftImage = new SimpleImage(containerImage); 
  for (var containerImagePixel of containerImage.values()) {
    var x = containerImagePixel.getX(); 
    var y = containerImagePixel.getY(); 
    var hiddenShift = shiftImage.getPixel(x, y); 
    
    var Red = Math.floor(containerImagePixel.getRed() % 16) * 16; 
    var Green = Math.floor(containerImagePixel.getGreen() % 16) * 16; 
    var Blue = Math.floor(containerImagePixel.getBlue() % 16) * 16; 
    
    hiddenShift.setRed(Red); 
    hiddenShift.setGreen(Green); 
    hiddenShift.setBlue(Blue); 
  }
  shiftImage.drawTo(firstCanvas); 
}

function extract_t(){
  shiftImage = new SimpleImage(containerImage);
  var dest = document.getElementById('dest');
  dest.innerHTML = '';
  for(var containerImagePixel of containerImage.values()){
    var letter1 = containerImagePixel.getRed()%16;
    var letter2 = containerImagePixel.getGreen()%16;

    var newLetter = String.fromCharCode(parseInt(letter1.toString(2).padStart(4,'0')+letter2.toString(2).padStart(4,'0'),2));
    console.log(newLetter);
    if(newLetter == endSymbol){
      break;
    }
    
    dest.innerHTML += newLetter;
  }
}

function test(){
  var isModeEncryption = document.getElementById('mode').checked;
  if(!isModeEncryption){
    document.getElementById('secondCanvas').css('display','none');
  }
}
