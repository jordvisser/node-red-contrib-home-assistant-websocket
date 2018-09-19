NOTE: I did not write this, I forked from [@AYapejian](https://github.com/AYapejian/node-red-contrib-home-assistant) due to a lack of responsiveness to issues and pull requests.

# Node Red Contrib Home Assistant

Various nodes to assist in setting up automation using [node-red](https://nodered.org/) communicating with [Home Assistant](https://home-assistant.io/).

## Project status

Project is going through active development and as such will probably have a few 'growing pain' bugs as well as node type, input, output and functionality changes.  At this stage backwards compatibility between versions is not a main concern and a new version __may mean you'll have to recreate certain nodes.__

## Getting Started

This assumes you have [node-red](http://nodered.org/) already installed and working, if you need to install node-red see [here](http://nodered.org/docs/getting-started/installation)

#### NOTE: node-red-contrib-home-assistant-websocket requires node.JS > 8.0  If you're running Node-Red in Docker you'll need to pull the -v8 image for this to work.

```shell
$ cd cd ~/.node-red
$ npm install node-red-contrib-home-assistant-websocket
# then restart node-red
```

If you are running Node Red inside Hass.io addon/container you can use Hass.io API Proxy address `http://hassio/homeassistant` as Home Assistant server address (server node Base URL). This way you don't need any real network address.

=======
For flow examples checkout the [flows here](https://raw.githubusercontent.com/zachowj/node-red-contrib-home-assistant-websocket/master/_docker/node-red/root-fs/data/flows.json)

---
## Included Nodes
The installed nodes have more detailed information in the node-red info pane shown when the node is selected. Below is a quick summary

### All Events
Listens for all types of events from home assistant

### State Changed Event
Listens for only `state_changed` events from home assistant

### State Trigger
Much like the `State Changed Ndoe` however provides some advanced functionality around common automation use cases.

### Poll State
Outputs the state of an entity at regular intervals, optionally also at startup and every time the entity changes if desired

### Call Service
Sends a request to home assistant for any domain and service available ( `light/turn_on`, `input_select/select_option`, etc..)

### Get Current State
Fetches the last known state for any entity on input

### Get History
Fetches HomeAssistant history on input

### Get Template
Allows rendering of templates on input

---

[Development](https://github.com/zachowj/node-red-contrib-home-assistant-websocket/wiki/Development)