let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")]; //Pink from BetaMindy
let folded = false;
let speeds = [];
for(let i = -8; i <= 8; i++){
    speeds[i + 8] = Math.pow(2, i);
}

function addTable(table){
    table.table(Tex.pane, t => {
        let s = new Slider(-8, 8, 1, false);
        s.setValue(0);
        let l = t.button("[accent]x1", () => {
            folded = true;
            Log.info("bazinga");
        }).grow().width(10.5 * 8).get();
        l.margin(0);
        l.marginLeft(6);
        l.getLabel().setAlignment(Align.left);
        let lStyle = l.getStyle();
        lStyle.up = Tex.pane;
        lStyle.over = Tex.flatDownBase;
        lStyle.down = Tex.whitePane;
        
        let b = t.button(new TextureRegionDrawable(Icon.refresh), 24, () => s.setValue(0)).padLeft(6).get();
        b.getStyle().imageUpColor = Pal.accent;
        t.add(s).padLeft(6).minWidth(200);
        s.moved(v => {
            let t = Math.pow(2, v);
            Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * t, 3 * t));
            Tmp.c1.lerp(cols, (s.getValue() + 8) / 16);
            
            let text = "[#" + Tmp.c1.toString() + "]";
            if(v >= 0){
                text += "x" + Math.pow(2, v);
            }else{
                text += "x1/" + Math.pow(2, Math.abs(v));
            }
            
            l.setText(text);
        });
    });
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
        if(Vars.mobile) tc.moveBy(0, Scl.scl(46));
    });
}
