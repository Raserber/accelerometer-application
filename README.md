![# accelerometer application](images/title.png)

![npm version](https://img.shields.io/badge/npm-v6.14.14-blue)
![node version](https://img.shields.io/badge/node-v14.17.5-blue)

![GitHub Release Date](https://img.shields.io/github/release-date/Raserber/accelerometer-application) ![GitHub last commit](https://img.shields.io/github/last-commit/Raserber/accelerometer-application)

---
> An Application to experiment accelerations firstly for an educational purpose.

<div style="display: flex;">
  <image style="width: 33%; max-width: 250px" src="https://cdn.discordapp.com/attachments/607260372390641689/1003784828300312687/x.gif"></image>
  <image style="width: 33%; max-width: 250px" src="https://cdn.discordapp.com/attachments/607260372390641689/1003784828719747123/xy.gif"></image>
  <image style="width: 33%; max-width: 250px" src="https://cdn.discordapp.com/attachments/607260372390641689/1003784829126590594/xyz.gif"></image>
</div>

[Accelerometer](https://github.com/Raserber/accelerometer-application) is a mobile application build with [Ionic](https://ionicframework.com/), [Capacitor](https://capacitorjs.com/)
and [Vue](https://vuejs.org) as frameworks to use the phone's motion sensors to capture linear and angular accelerations and display them.

## Contents

- [feel free to comment or give your opinion](#feel-free-to-comment-or-give-your-opinion)
- [Origin of the creation](#origin-of-the-creation)
- [Beginning Of The Development](#beginning-of-the-development)


## Feel Free to Comment or Give Your Opinion

I am open to any criticism on the design or functionality or even the relevance of the project


## Origin Of The Creation

It is to realize a TP in school with the problematic: *"Measuring the speed and acceleration of the
[Zumo robot](https://cdn.discordapp.com/attachments/972230493871427735/972230636964315216/unknown.png)
with a smartphone embedded and programmed via [MIT App Inventor](https://appinventor.mit.edu/)."*

So I thought it's to easy, and also a bit ugly.  
I chose to redo it by improving it in a language that I mastered.  
As I didn't master Java enough to pretend to do mobile development with it.  
I decided to use Javascript,
and more precisely [Ionic](https://ionicframework.com/) and [Capacitor](https://capacitorjs.com/), that I had already used before.


## Beginning Of The Development

I decided to improve the basic concept of displaying one
or several linear or angular accelerations with notably :

- a graph of one or more accelerations as a function of time
- Be able to export these data in CSV, PNG or JPG formats
- Be able to display speed as a function of time of the device

Solutions :

- I choose [Highcharts](https://www.highcharts.com/) to display graphs
  - This solution allows to export in their formats the graphs
- Display the speed by making a primitive of the acceleration

## Contributing

Contributions welcome! Please reach first.
