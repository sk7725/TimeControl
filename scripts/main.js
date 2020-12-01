var current = 1;
const longPress = 90;
const speedArr = [0.25, 0.5, 1, 2, 4];
var folded = false;

function addSpeed(t, speed){
var b = new Button(Styles.logict);
b.label(prov(() => (current == speed ? "[#a9d8ff]" : "[white]") + "x" + speed + "[]"));
b.clicked(() => {
Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speed, 3 * speed));
current = speed;
});
return t.add(b).size(50, 40).color(Pal.lancerLaser).pad(1);
}


function addSpeedAlt(t, speed, speed2){
var b = new Button(Styles.logict);
b.label(prov(() => (current == speed ? "[#a9d8ff]" : (current == speed2 ? "[accent]" : "[white]")) + "x" + (current == speed2 ? speed2 : speed) + "[]"));
b.clicked(() => {
if(current == speed){
Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speed2, 3 * speed2));
current = speed2;
b.setColor(Pal.accent);
}
else{
Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speed, 3 * speed));
current = speed;
b.setColor(Pal.lancerLaser);
}
});
b.update(() => {
b.setColor(current == speed2 ? Pal.accent : Pal.lancerLaser);
});
return t.add(b).size(50, 40).color(Pal.lancerLaser).pad(1);
}

function addOne(t, speed){
var b = new Button(Styles.logict);
var h = 0;
b.label(prov(() => (current == speed ? "[#a9d8ff]" : "[white]") + "x" + speed + "[]"));
b.clicked(() => {
if(h>longPress) return;
Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speed, 3 * speed));
current = speed;
});
b.update(() => {
if(b.isPressed()){
h += Core.graphics.getDeltaTime() * 60;
if(h>longPress){
folded = true;
mode = speedArr.indexOf(current);
if(mode < 0) mode = speedArr.length();
}
}
else{
h = 0;
}
});
return t.add(b).size(50, 40).color(Pal.lancerLaser).pad(1);
}

var mode = 2;

function addMini(t, speedlist, showlist){
var b = new Button(Styles.logict);
var h2 = 0;
b.label(prov(() => (current == 1 ? "[#a9d8ff]" : (current > 1.9 ? "[accent]" : "[orange]")) + showlist[mode] + "[]"));
b.clicked(() => {
if(h2>longPress) return;
mode++;
if(mode >= speedlist.length) mode = 0;
Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speedlist[mode], 3 * speedlist[mode]));
current = speedlist[mode];
});
b.update(() => {
if(b.isPressed()){
h2 += Core.graphics.getDeltaTime() * 60;
if(h2>longPress) folded = false;
}
else{
h2 = 0;
}
b.setColor(current == 1 ? Pal.lancerLaser : (current > 1.9 ? Pal.accent : Color.orange));
});
return t.add(b).size(40, 40).color(Pal.lancerLaser).pad(1).padLeft(0).padRight(0);
}

function addTable(table){
table.table(Styles.black5, cons(t => {
t.background(Tex.buttonEdge3);
if(Vars.mobile){
addSpeedAlt(t, 0.5, 0.25).width(60);
addOne(t, 1).width(45);
addSpeedAlt(t, 2, 8).width(45);
addSpeedAlt(t, 4, 16).width(45);
}
else{
addSpeed(t, 0.25).width(65);
addSpeed(t, 0.5);
addOne(t, 1);
addSpeedAlt(t, 2, 8);
addSpeedAlt(t, 4, 16);
}

//t.visibility = () => !folded;
}));
table.fillParent = true;
table.visibility = () => !folded && Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
}

function addMiniT(table){
table.table(Styles.black5, cons(t => {
t.background(Tex.buttonEdge3);
if(Vars.mobile) addMini(t, speedArr, [".25", ".5", "x1", "x2", "x4", "×?"]);
else addMini(t, speedArr, ["x.25", "x0.5", "x1", "x2", "x4", "x8+"]).width(60);
}));
table.fillParent = true;
table.visibility = () => folded && Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
}


if(!Vars.headless){
var ut = new Table();
var ft = new Table();


Events.on(ClientLoadEvent, () => {
ut.bottom().left();
ft.bottom().left();
addTable(ut);
addMiniT(ft);
Vars.ui.hudGroup.addChild(ut);
Vars.ui.hudGroup.addChild(ft);
});
}
