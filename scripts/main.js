//Pink from BetaMindy
let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")];

function addTable(table){
    table.table(Styles.black5, cons(t => {
        t.background(Tex.buttonEdge3);
        let s = new Slider(-8, 8, 1, false);
        s.setValue(0);
        let l = t.label(() => {
            let v = s.getValue();
            if(v >= 0){
                return "x" + Math.pow(2, v);
            }else{
                return "x1/" + Math.pow(2, Math.abs(v));
            }
        }).growX().width(8.5 * 8).color(Pal.accent);
        let b = t.button(new TextureRegionDrawable(Icon.refresh), 24, () => s.setValue(0)).padLeft(6).get();
        b.getStyle().imageUpColor = Pal.accent;
        t.add(s).padLeft(6);
        s.moved(v => {
            let t = Math.pow(2, v);
            Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * t, 3 * t));
            l.color(Tmp.c1.lerp(cols, (s.getValue() + 8) / 16));
        });
    }));
    table.visibility = () => {
        if(!Vars.ui.hudfrag.shown || Vars.ui.minimapfrag.shown()) return false;
        if(!Vars.mobile) return true;
        
        let input = Vars.control.input;
        return input.lastSchematic == null || input.selectPlans.isEmpty();
    };
}

if(!Vars.headless){
    var tc = new Table();

    Events.on(ClientLoadEvent, () => {
        tc.bottom().left();
        addTable(tc);
        Vars.ui.hudGroup.addChild(tc);
        tc.moveBy(0, Vars.mobile ? Scl.scl(48) : 0);
    });
}
