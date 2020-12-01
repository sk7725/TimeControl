var current = 1;

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

function addTable(table){
table.table(Styles.black5, cons(t => {
t.background(Tex.buttonEdge3);
if(Vars.mobile){
addSpeedAlt(t, 0.5, 0.25).width(60);
}
else{
addSpeed(t, 0.25).width(65);
addSpeed(t, 0.5);
}
addSpeed(t, 1);
addSpeedAlt(t, 2, 8);
addSpeedAlt(t, 4, 16);
}));
table.fillParent = true;
table.visibility = () => Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
}


if(!Vars.headless){
var ut = new Table();

Events.on(ClientLoadEvent, () => {
ut.bottom().left();
addTable(ut);
Vars.ui.hudGroup.addChild(ut);
});
}
