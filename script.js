
  var source = null; 
  var secret = null; 
  var containerImage = null; 
  var shiftImage = null; 
  var firstCanvas; 
  var secondCanvas; 
  
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

  function encrypt() {
    for (var containerImagePixel of containerImage.values()) {
      var x = containerImagePixel.getX(); 
      var y = containerImagePixel.getY(); 
      var hiddenShift = shiftImage.getPixel(x, y); 

      var c2hRed = Math.floor(containerImagePixel.getRed()/16) * 16; 
      var c2hGreen = Math.floor(containerImagePixel.getGreen()/16) * 16; 
      var c2hBlue = Math.floor(containerImagePixel.getBlue()/16) * 16; 
      
      var shiftRed = Math.floor(hiddenShift.getRed()/16); 
      var shiftGreen = Math.floor(hiddenShift.getGreen()/16); 
      var shiftBlue = Math.floor(hiddenShift.getBlue()/16); 
      
      containerImagePixel.setRed(c2hRed + shiftRed); 
      containerImagePixel.setGreen(c2hGreen + shiftGreen); 
      containerImagePixel.setBlue(c2hBlue + shiftBlue); 
    }
    containerImage.drawTo(secondCanvas); 
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

  function test(){
    var isModeEncryption = document.getElementById('mode').checked;
    if(!isModeEncryption){
      document.getElementById('secondCanvas').css('display','none');
    }
  }
