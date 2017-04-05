[![Build Status](https://travis-ci.org/PhyberApex/homeassistant-config.svg?branch=master)](https://travis-ci.org/PhyberApex/homeassistant-config)
___
# My HA setup:

This is my current Home Automation setup.  Starting small and gradually growing as funds allow...

## Apartment:

5 room apartment including kitchen and bathroom

## Hardware:

 - Gigabyte BRIX GB-BACE 3150 (as server with HA and all other server-services running)
 - Amazon Fire TV (with Kodi)
 - 1 Raspberry Pi 2 with Max2Play / MPD (Multiroom audio setup in kitchen)
 - 1 Raspberry Pi with Max2Play / MPD (Multiroom audio setup in guestroom)
 - Xiaomi Gateway
   - 2 Xiaomi smart wireless switch
   - 1 Xiaomi human body sensor
   - 2 Xiaomi window door sensor
 - Limitless LED Bridge
   - 5 Limitless LED bulbs all in one ceiling lamp in the living room
 - 1 Edimax wireless switch (for light in the living room shelf)
 - Nexus 7 (2012) tablet to control
 - Usual home theatre stuff - TV/AV Receiver

## Software:

 - Home Assistant
 - Emby
 - Kodi
 - Music Player Daemon
 - Telegram for API.AI and Notifications
 - gpslogger
 - find

## What it does:

 - Controllable from my phone over the internet (password), or via local network.
 - Controls living room lights.
 - Tracks our phones using gpslogger and find and therefore knows whether or not anybody is at home.
 - Notifies us of key events via telegram.
 - Voice control with Tasker and API.AI			

## Quick-Access-Dashboard (QAD)
As I have a fairly old tablet & my UI of HomeAssistant got rather complex it was time to introduce my own dashboard for the tabet which allows access to certain things in a fast way. There is already something like this in place with the HADashboard but it includes using AppDaemon which I try to avoid for now too keep it simple. Also as I am fairly familiar with HTML, CSS / JS I thought this would give me the most flexibility.
This is what I came up with:
___
![Alt text](/../images/qad-1.png?raw=true "Screenshot 1")
___

As You can see there are a few buttons on the left side. The buttons with the "?" on them are vacant at the moment. The tall, thin blue button used to switch the buttons out. I use the shown "button page" for on/off switches and toggles. The second "button page" is used for activating scenes.
On the right side is some information about me and my wife and where we are currently at. If we are at in a "zone" it get's displayed here. If we are "not_home" the distance gets shown (in meters / kilometers). Then there is also some weather information and the current time. I choose to stick with minutes as seconds were to much for my crappy old tablet and the animation below (if any) would get choppy after a few hours.
Below the time is a addditional information field with a scroll button below much like for the button page. I do not currently have a second page implemented here but the first shows what new movies/tvshows are available on my media server (emby).
