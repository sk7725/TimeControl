let cols = [Pal.lancerLaser, Pal.accent, Color.valueOf("cc6eaf")]; //Pink from BetaMindy
let folded = false;
let curSpeed = 0;
let longPress = 30;
let unfoldTimer = 0;

let timeSlider = null;
let foldedButton = null;

function sliderTable(table){
    table.table(Tex.buttonEdge3, t => {
        timeSlider = new Slider(-8, 8, 1, false);
        timeSlider.setValue(0);
        
        let l = t.button("[accent]x1", () => {
            curSpeed = Mathf.clamp(curSpeed, -2, 2) - 1;
            foldedButton.fireClick();
            folded = true;
        }).grow().width(10.5 * 8).get();
        l.margin(0);
        l.marginLeft(6);
        l.getLabel().setAlignment(Align.left);
        let lStyle = l.getStyle();
        lStyle.up = Tex.pane;
        lStyle.over = Tex.flatDownBase;
        lStyle.down = Tex.whitePane;
        
        let b = t.button(new TextureRegionDrawable(Icon.refresh), 24, () => timeSlider.setValue(0)).padLeft(6).get();
        b.getStyle().imageUpColor = Pal.accent;
        t.add(timeSlider).padLeft(6).minWidth(200);
        timeSlider.moved(v => {
            curSpeed = v;
            let speed = Math.pow(2, v);
            Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speed, 3 * speed));
            
            Tmp.c1.lerp(cols, (timeSlider.getValue() + 8) / 16);
            
            l.setText(speedText(v));
        });
    });
    table.visibility = () => !folded && visibility();
}

function foldedButtonTable(table){
    table.table(Tex.buttonEdge3, t => {
        foldedButton = t.button("[accent]x1", () => {
            curSpeed++;
            if(curSpeed > 2) curSpeed = -2;
            
            let speed = Math.pow(2, curSpeed);
            Time.setDeltaProvider(() => Math.min(Core.graphics.getDeltaTime() * 60 * speed, 3 * speed));
            
            foldedButton.setText(speedText(curSpeed));
            timeSlider.setValue(curSpeed);
        }).grow().width(10.5 * 8).get();
        foldedButton.margin(0);
        foldedButton.marginLeft(6);
        foldedButton.getLabel().setAlignment(Align.left);
        
        foldedButton.update(() => {
            if(foldedButton.isPressed()){
                unfoldTimer += Core.graphics.getDeltaTime() * 60;
                if(unfoldTimer > longPress && folded){
                    folded = false;
                    unfoldTimer = 0;
                }
            }else{
                unfoldTimer = 0;
            }
        });
    }).height(72);
    table.visibility = () => folded && visibility();
}

function speedText(speed){
    Tmp.c1.lerp(cols, (speed + 8) / 16);
    let text = "[#" + Tmp.c1.toString() + "]";
    if(speed >= 0){
        text += "x" + Math.pow(2, speed);
    }else{
        text += "x1/" + Math.pow(2, Math.abs(speed));
    }
    return text;
}

function visibility(){
    if(!Vars.ui.hudfrag.shown || Vars.ui.minimapfrag.shown()) return false;
    if(!Vars.mobile) return true;
    
    let input = Vars.control.input;
    return input.lastSchematic == null || input.selectPlans.isEmpty();
}    

if(!Vars.headless){
    Events.on(ClientLoadEvent, () => {
        let ft = new Table();
        ft.bottom().left();
        foldedButtonTable(ft);
        Vars.ui.hudGroup.addChild(ft);
        
        let st = new Table();
        st.bottom().left();
        sliderTable(st);
        Vars.ui.hudGroup.addChild(st);
        
        if(Vars.mobile){
            st.moveBy(0, Scl.scl(46));
            ft.moveBy(0, Scl.scl(46));
        }
    });
}
