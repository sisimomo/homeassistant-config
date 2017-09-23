[![Build Status](https://travis-ci.org/PhyberApex/homeassistant-config.svg?branch=master)](https://travis-ci.org/PhyberApex/homeassistant-config)
___
# My HA setup:

This is my current Home Automation setup.  Starting small and gradually growing as funds allow...

## Apartment:

5 room apartment including kitchen and bathroom

## Hardware:

 - HP ProLiant ML10 Gen9 Server Intel Xeon E3-1225 v5 (as server/NAS with HA and all other server-services running)
 - Multiroom audio
   - 1x Raspberry Pi 2 (kitchen)
   - 1x Raspberry Pi Zero W (guest room)
   - 1x Raspberry Pi (bedroom)
   - 1x MPD on HP server (multiroom)
   - more details about that setup ![here](multiroom_audio.md)
 - Xiaomi Gateway
   - 2x Xiaomi smart wireless switch
   - 2x Xiaomi human body sensor
   - 2x Xiaomi window door sensor
 - Limitless LED Bridge
   - 5 Limitless LED bulbs all in one ceiling lamp in the living room
 - 1x Broadlink RM pro (for IR and RF)
 - 3x RF power sockets
 - Amazon Fire 7 5th gen tablet mounted on the wall
 - Home Theater
   - 1x Not so smart TV
   - 1x Onkyo TX-NR414
   - 1x Amazon Fire TV (1st gen) with Kodi

## Software:

 - Home Assistant with floorplan
 - Emby (media server)
 - Kodi
 - Music Player Daemon (MPD)
 - Telegram for API.AI and Notifications
 - gpslogger (on mobile phones)
 - find (server running but not used right now)
 - Lots of services (eg. sonarr/radarr)

# What it does:

 - Automatic alerts for / if:
  - Batteries running low in xiaomi sensors.
  - Free disk space on the NAS (<5%) or on the backup disk (<20%) is running low.
  - Devices / Services going offline
 - Automation for automatic downloads (initially off)

## Xiaomi button in kitchen
This button is used to control the MPD in the kitchen.

| Push   | Action                                                      |
| ------ | ----------------------------------------------------------- |
| Single | Pause / Play current item in playlist                       |
| Double | Next track in playlist if nothing is playing do nothing     |
| Long   | Previous track in playlist if nothing is playing do nothing |

## Light control in living room
The lights are turned off / on manually. Dimming is done automatically. To prevent dimming of the lights I have a input_boolean called 'dinner mode' which prevents the dimming if turned on. If 'dinner mode' is not enabled the lights dim automatically after kodi / emby starts playing something in the living room.

### Xiaomi button in living room
This button is used to control the ceiling light in the living room and the tv.

| Push   | Action                  |
| ------ | ----------------------- |
| Single | Toggle dinner mode      |
| Double | Toggle TV & AV-Receiver |
| Long   | Toggle ceiling lights   |

There are three more light sources in the living room. Which are all operated manually and are connected to RF power sockets. One LED strip, one blue light tube and some LEDs inside the shelf.

### Party mode
If party mode gets enabled the lights start to change color. This is done in two scripts which call each other recursively and only gets cancelled by disabling party mode.

### Scenes
| Name               | Entity                                                          | State                                  |
| ------------------ | --------------------------------------------------------------- | -------------------------------------- |
| Living room dim    | Ceiling light                                                   | brightness 35                          |
| Living room normal | Ceiling light                                                   | brightness 255                         |
| Living room off    | Ceiling light                                                   | off                                    |
| Living room media  | Ceiling light<br />Shelf light<br />LED Strip<br />Blue tube on | brightness 255<br />on<br />on<br />on |

## Motion detection
In the living room with no automations.
In the entrance hallway with no automations.

## Alarm
The alarm panel gets triggered by both door sensors if it is armed home additionally it gets triggered by motion inside if the alarm is armed away. After triggering the alarm the lights in the living room (ceiling and xiaomi gateway) change to orange. If the alarm does not get disarmed within 20 seconds it will change to triggered and the lights will flash red and notifications will go out to me via telegram.

## News
Five text_input components (input_text.news[1-5]) are used to display news on the frontend (like newly available episodes / movies). This gets filled with a python script (add_news.py) to make switching them around easier.

## Proximity
For now the proximity is not used in any automations but it is available for both.

## Transmission
'Slow mode' slows down the download speed of transmission. If it is enabled a timer starts which disables 'slow mode' after 2 hours.

## Bot integration
I have a discord and a telegram bot running. Both communicate with HA via the API.ai interface.

## Webhook receivers
There are multiple scripts which get called via Emby webhooks.
 - Play / Pause / Stop / Resume event for dimming of the lights.
 - Added media event to notify me via telegram that something new is available.

## Floorplan
Earlier I had a self made dashboard to be displayed on my wall mounted tablet. This has now been replaced by the floorplan. This gives a much better overview of the current state of the smart home and allows me to have enough flexibility to customize it to my needs. As the fire tablet is somewhat old already I disabled all the fancy animations from my floorplan on there. But they can be seen in action in a few screenshot gifs below.
This is what I came up with:

TODO SCREENSHOT GIFS

## Services
I used the floorplan component to do another 'floorplan' to represent the services I have running on my server and their state.
TODO SCREENSHOT GIF

## Timetable

| Time          | Automation                                                              |
| ------------- | ----------------------------------------------------------------------- |
| After sunrise | Switch theme to 'default' (light)                                       |
| 8:00 am       | If there is over 30% probability add news that it might snow/rain today |
| After sundown | Switch theme to 'darkorange'                                            |

TODO
