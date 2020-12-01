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

function addTable(table){
table.table(Styles.black5, cons(t => {
t.background(Tex.buttonEdge4);
addSpeed(t, 0.25).width(65);
addSpeed(t, 0.5);
addSpeed(t, 1);
addSpeed(t, 2);
addSpeed(t, 4);
})).width(Core.scene.find("waves").getWidth()-36);
table.fillParent = true;
table.visibility = () => Vars.ui.hudfrag.shown && !Vars.ui.minimapfrag.shown();
}


if(!Vars.headless){
var ut = new Table();

Events.on(ClientLoadEvent, () => {
ut.top().left();
addTable(ut);
  var status = Core.scene.find("status");
  ut.update(() => {
    ut.marginTop(status.getHeight());
  });
Vars.ui.hudGroup.addChild(ut);
});
