MAPS.md

## Different map providers

ARDUPILOT Configurator 2.1 allows to choose between OpenStreetMap, Bing Maps, and MapProxy map providers. 
ARDUPILOT Configurator is shipped **WITHOUT** API key for Bing Maps. That means: every user who wants to use Bing Maps has to create own account, agree to all _Terms and Conditions_ required by Bing Maps and configure ARDUPILOT Configuerator by himself. 

### How to choose Map provider

1. Click **Settings** icon in the top-right corner of ARDUPILOT Configurator
1. Choose provider: OpenStreetMap, Bing, or MapProxy
1. In the case of Bing Maps, you have to provide your own, personal, generated by you, Bing Maps API key
1. For MapProxy, you need to provide a server URL and layer name to be used

### How to get Bing Maps API key

1. Go to the Bing Maps Dev Center at [https://www.bingmapsportal.com/](https://www.bingmapsportal.com/). 
    * If you have a Bing Maps account, sign in with the Microsoft account that you used to create the account or create a new one. For new accounts, follow the instructions in [Creating a Bing Maps Account](https://msdn.microsoft.com/library/gg650598.aspx).
1. Select **My keys** under **My Account**.
1. Select the option to create a new key.
1. Provide the following information to create a key:
    1. Application name: Required. The name of the application.
    1. Application URL: The URL of the application. This is an optional field which is useful in helping you remember the purpose of that key in the future.
    1. Key type: Required. Select the key type that you want to create. You can find descriptions of key and application types here. 
    1. Application type: Required. Select the application type that best represents the application that will use this key. You can find descriptions of key and application types [here](https://www.microsoft.com/maps/create-a-bing-maps-key.aspx). 
1. Click the **Create** button. The new key displays in the list of available keys. Use this key to authenticate your Bing Maps application as described in the documentation for the Bing Maps API you are using.

### How to setup a MapProxy server for offline caching and mission planning
1. Follow process described in [MAPPROXY.md](MAPPROXY.md)
1. Test your MapProxy server in web browser, eg: http://192.168.145.20/ARDUPILOTmapproxy/
1. Once you have a working MapProxy server choose MapProxy as your map provider
	1. Enter MapProxy service URL, eg: http://192.168.145.20/ARDUPILOTmapproxy/service?
	1. Enter MapProxy service layer (ARDUPILOT_layer if configured from MAPPROXY.md)
1. Once completed, you can zoom in on area you will be flying in while connected to the internet in either GPS or Mission Control tab to save the cache for offline use