# Tram Light
```
      ,',                               
      ', ,'                             
   ,----'--------------------------.    
  ('''|```|```|```|```|```|```|``|` |   
  |---'---'---'---'---'---'---'--'--|   
 __,_    ______           ______     |_ 
   '---'(O)(O)'---------'(O)(O)'---'    
   * * * *  Tram Lights * * * *         
   * * * * * * * * * *  * * * *         
```
> -- ASCII Art from: <cite>http://tram.ascii.uk/ --

A NodeJS application for monitoring a Yarra Trams stop. Using the [tramTRACKER PIDS Web Service](http://ws.tramtracker.com.au/pidsservice/pids.asmx),
API, it updates the brightness of a LIFX Globe (using the [LIFX Lan Protocol](https://lan.developer.lifx.com/)) as a tram approaches.

## Config
Configured via the `/config/default.json` file. Common config.
* Set tramstop to monitor via `yarra-trams.stopNo` value. Use [this](http://yarratrams.com.au/on-your-computer/) to find the 4 digit stop ID.
* Set the LIFX label, via `lifx.label`. This is the LIFX globe that the application will update.

## Docker
Docker container is designed to run on a Raspberry PI, using an ARM base image.
